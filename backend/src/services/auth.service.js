const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');
const logger = require('../config/logger');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const { ApiError, comparePassword } = require('../utils/index');
const userService = require('./user.service');

/**
 * Fetch social user profile
 * @param {string} token - Access token
 * @param {string} provider - Provider name
 * @returns {Promise<Object>}
 */
const fetchSocialUserProfile = async (token, provider) => {
  let response;
  try {
    if (provider === 'google') {
      response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else if (provider === 'facebook') {
      response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
    } else if (provider === 'github') {
      response = await fetch(`https://api.github.com/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      throw new Error('Unsupported provider');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();

    if (provider === 'google') {
      return {
        id: data.sub,
        emails: [{ value: data.email }],
        name: { givenName: data.given_name, familyName: data.family_name },
        displayName: data.name,
        photos: [{ value: data.picture }],
        username: undefined
      };
    }

    if (provider === 'facebook') {
      return {
        id: data.id,
        emails: data.email ? [{ value: data.email }] : [],
        displayName: data.name,
        photos: data.picture && data.picture.data ? [{ value: data.picture.data.url }] : [],
        name: { givenName: data.name.split(' ')[0], familyName: data.name.split(' ').slice(1).join(' ') }
      };
    }

    if (provider === 'github') {
       return {
        id: String(data.id),
        emails: data.email ? [{ value: data.email }] : [],
        displayName: data.name,
        username: data.login,
        photos: [{ value: data.avatar_url }],
        name: { givenName: data.name }
      };
    }

    return data;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Failed to authenticate with ${provider}: ${error.message}`);
  }
};

/**
 * Find or create user from OAuth profile (Google, Facebook, GitHub, etc.)
 * @param {Object} profile - Passport profile object
 * @param {string} provider - 'google', 'facebook', 'github', etc.
 * @returns {Promise<User>}
 */
const loginWithSocial = async (profile, provider) => {
  const transaction = await getConnection().transaction();
  try {
    const { id, emails, name, photos, displayName, username: profileUsername } = profile;

    const email = emails && emails[0] ? emails[0].value : null;
    const avatarUrl = photos && photos[0] ? photos[0].value : null;

    const firstName = name && name.givenName ? name.givenName : (displayName || profileUsername);
    const lastName = name && name.familyName ? name.familyName : '';

    if (!email) {
      throw new Error(`${provider} account does not have an email address accessible. Please check your privacy settings.`);
    }

    let user = await getConnection().models.User.findOne({
      where: {
        provider,
        providerId: id
      },
      transaction
    });

    if (user) {
      await transaction.commit();
      return user;
    }

    user = await getConnection().models.User.findOne({ where: { email }, transaction });

    if (user) {
      if (user.provider === 'local' || !user.provider) {
        user.provider = provider;
        user.providerId = id;
        if (!user.avatarUrl) user.avatarUrl = avatarUrl;
        await user.save({ transaction });
      }
      await transaction.commit();
      return user;
    }


    let newUsername = profileUsername || email.split('@')[0];

    const usernameExists = await getConnection().models.User.findOne({ where: { username: newUsername }, transaction });

    if (usernameExists) {
      let isUnique = false;
      while (!isUnique) {
        const tempUsername = `${newUsername}${Math.floor(Math.random() * 10000)}`;
        const check = await getConnection().models.User.findOne({ where: { username: tempUsername }, transaction }); // eslint-disable-line no-await-in-loop
        if (!check) {
          newUsername = tempUsername;
          isUnique = true;
        }
      }
    }

    const newUser = await getConnection().models.User.create({
      email,
      firstName,
      lastName,
      username: newUsername,
      provider,
      providerId: id,
      avatarUrl,
      isEmailVerified: true,
      roleId: 5,
      status: 'active'
    }, { transaction });

    await transaction.commit();
    return newUser;

  } catch (error) {
    await transaction.rollback();
    logger.error(`Error in loginWithSocial (${provider}):`, error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userBody - User data
 * @returns {Promise<User>}
 */
const registerUser = async (userBody) => {
  try {
    const user = await userService.createUser(userBody);
    return user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to register user: ${error.message}`);
  }
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Generate token
 * @param {string} userId
 * @param {Date} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expires.getTime() / 1000),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = new Date(Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000);
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = new Date(Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000);
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

module.exports = {
  fetchSocialUserProfile,
  loginWithSocial,
  registerUser,
  loginUserWithEmailAndPassword,
  generateAuthTokens
};
