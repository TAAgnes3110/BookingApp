const httpStatus = require('http-status');
const { ApiError } = require('../utils/index');
const { getConnection } = require('../config/database');

/**
 * Update user avatar
 * @param {string} userId
 * @param {string} avatarUrl
 * @returns {Promise<User>}
 * @throws {ApiError}
 */
const updateUserAvatar = async (userId, avatarUrl) => {
  const { User } = getConnection().models;
  const user = await User.findByPk(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.avatarUrl = avatarUrl;
  await user.save();

  return user;
};

module.exports = {
  updateUserAvatar,
};
