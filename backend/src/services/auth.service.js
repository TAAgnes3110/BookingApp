const httpStatus = require('http-status');
const { getConnection } = require('../config/database');
const logger = require('../config/logger');
const { ApiError, comparePassword } = require('../utils/index');
const userService = require('./user.service');

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => getConnection().models.User.findByPk(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => getConnection().models.User.findOne({ where: { email } });

/**
 * Find or create user from OAuth profile (Google, Facebook)
 * @param {Object} profile - Passport profile object
 * @param {string} provider - 'google', 'facebook', etc.
 * @returns {Promise<User>}
 */
const findOrCreateSocialUser = async (profile, provider) => {
  const transaction = await getConnection().transaction();
  try {
    const { id, emails, name, photos, displayName } = profile;
    const email = emails && emails[0] ? emails[0].value : null;
    const avatarUrl = photos && photos[0] ? photos[0].value : null;
    const firstName = name && name.givenName ? name.givenName : displayName;
    const lastName = name && name.familyName ? name.familyName : '';

    if (!email) {
      throw new Error(`${provider} account does not have an email address.`);
    }

    let user = await getConnection().models.User.findOne({
      where: {
        provider,
        provider_id: id
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

    const newUser = await getConnection().models.User.create({
      email,
      firstName,
      lastName,
      username: email.split('@')[0] + Math.floor(Math.random() * 1000),
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
    logger.error(`Error in findOrCreateSocialUser (${provider}):`, error);
    throw error;
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

module.exports = {
  getUserById,
  getUserByEmail,
  findOrCreateSocialUser,
  loginUserWithEmailAndPassword
};
