const httpStatus = require('http-status');
const { ApiError } = require('../utils/index');
const { sequelize } = require('../config/database');

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 * @throws {ApiError}
 */
const getUserById = async (id) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User ID is required');
  }

  try {
    const user = await sequelize.models.User.findByPk(id);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.status !== 'active') {
        throw new ApiError(httpStatus.FORBIDDEN, 'User account is not active');
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get user information: ${error.message}`);
  }
};

const getUserByEmail = async (email) => {
  if (!email)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required');
  try {
    const user = await sequelize.models.User.findOne({ where: { email }});

    if (!user)
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');

    if (user.status !== 'active') {
      throw new ApiError(httpStatus.FORBIDDEN, 'User account is not active');
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get user information: ${error.message}`);
  }
}

module.exports = {
  getUserById,
  getUserByEmail
};
