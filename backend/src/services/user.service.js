const httpStatus = require('http-status');
const { User } = require('../models');
const { getConnection } = require('../config/database');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

/**
 * Create a user
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  // Nếu là OAuth user, không cần password
  if (userBody.provider && userBody.provider !== 'local' && !userBody.password) {
    userBody.password = null;
  }
  const user = await User.create(userBody);
  return user;
};

/**
 * Query for users
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 */
const getUserById = async (id) => {
  const user = await User.findByPk(id);
  return user;
};

/**
 * Get user by id with password (for auth)
 */
const getUserByIdWithPassword = async (id) => {
  const user = await User.scope('withPassword').findByPk(id);
  return user;
};

/**
 * Get user by email (case-insensitive for PostgreSQL)
 */
const getUserByEmail = async (email) => {
  const sequelize = getConnection();
  if (!sequelize) {
    throw new Error('Database connection not initialized');
  }
  const { Op } = sequelize.Sequelize;
  const user = await User.scope('withPassword').findOne({
    where: {
      email: { [Op.iLike]: email } // Case-insensitive cho PostgreSQL
    }
  });
  return user;
};

/**
 * Update user by id
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.destroy();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByIdWithPassword,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};

