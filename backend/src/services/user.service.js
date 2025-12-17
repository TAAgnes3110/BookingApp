const httpStatus = require('http-status');
const { ApiError } = require('../utils/index');
const { getConnection } = require('../config/database');
const { hashPassword, toCamelCase } = require('../utils/index');

/**
 * Loại bỏ các trường hệ thống không được phép cập nhật
 */
const filterSystemFields = (data) => {
  const filterd = { ...data};
  const systemFields = ['id', 'createdAt', 'updatedAt', 'deletedAt', 'customId'];
  systemFields.forEach(field => {
    delete filterd[field];
  })
  return filterd;
}

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
    const user = await getConnection().models.User.findByPk(id);

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

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 * @throws {ApiError}
 */
const getUserByEmail = async (email) => {
  if (!email)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required');
  try {
    const user = await getConnection().models.User.findOne({ where: { email }});

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
};

/**
 * Get user by phone number
 * @param {string} phoneNumber
 * @returns {Promise<User>}
 * @throws {ApiError}
 */
const getUserByPhone = async (phoneNumber) => {
  if (!phoneNumber)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number is required');
  try {
    const user = await getConnection().models.User.findOne({
      where: { phoneNumber }
    });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    }

    if (user.status !== 'active') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User account is not active');
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get user information: ${error.message}`);
  }
}


/**
 * Get user by Username
 * @param {string} username
 * @returns {Promise<User>}
 * @throws {ApiError}
 */
const getUserByUsername = async (username) => {
  if (!username)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username is required');
  try {
    const user = await getConnection().models.User.findOne({
      where: { username}
    });

    if (!user)
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');

    if(user.status !== ' active')
      throw new ApiError(httpStatus.BAD_REQUEST, 'User account is not active');

    return user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get user information: ${error.message}`);
  }
}

/**
 * create user
 * @param {Object} data
 * @returns {Promise<User>}
 * @throws {ApiError}
 */
const createUser = async (data) => {
  if (!data)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User data is required');

  try {
    const filteredData = toCamelCase(filterSystemFields(data));
    const { firstName, lastName, username, email, phoneNumber, password, roleId: inputRoleId } = filteredData;


    if (!firstName || !lastName || !username || !email || !phoneNumber || !password)
      throw new ApiError(httpStatus.BAD_REQUEST, 'User data is required');

    if (await getConnection().models.User.findOne({ where: { email } })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    if (username && await getConnection().models.User.findOne({ where: { username } })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }

    if (phoneNumber && await getConnection().models.User.findOne({ where: { phoneNumber } })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already taken');
    }

    if (password) {
      filteredData.passwordHash = await hashPassword(password);
      delete filteredData.password;
    }

    if (password) {
      filteredData.passwordHash = await hashPassword(password);
      delete filteredData.password;
    }

    filteredData.roleId = inputRoleId || 5;

    const user = await getConnection().models.User.create(filteredData);

    return user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to create user: ${error.message}`);
  }
};

module.exports = {
  filterSystemFields,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  getUserByUsername,
  createUser,
};
