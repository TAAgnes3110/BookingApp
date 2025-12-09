const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateAuthTokens } = require('../utils/token');

/**
 * Login with username and password
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const config = require('../config/config');
  const { getUserByEmail } = require('./user.service');
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 */
const logout = async (refreshToken) => {
  // In a real app, you would store refresh tokens in a database
  // and invalidate them here
  return true;
};

/**
 * Refresh auth tokens
 */
const refreshAuth = async (refreshToken) => {
  try {
    const jwt = require('jsonwebtoken');
    const config = require('../config/config');
    const { tokenTypes } = require('../config/tokens');
    const { getUserById } = require('./user.service');
    const payload = jwt.verify(refreshToken, config.jwt.secret);
    if (payload.type !== tokenTypes.REFRESH) {
      throw new Error('Invalid token type');
    }
    const user = await getUserById(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }
    return generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Register user
 */
const register = async (userBody) => {
  const { createUser } = require('./user.service');
  const user = await createUser(userBody);
  const tokens = await generateAuthTokens(user);
  return { user, tokens };
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  register,
};

