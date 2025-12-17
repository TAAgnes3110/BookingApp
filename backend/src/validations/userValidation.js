const Joi = require('joi');
const { password } = require('./custom');

/**
 * Validation cho tạo user (admin)
 * @param {Object} body - The request body
 * @param {string} body.firstName - The first name of the user
 * @param {string} body.lastName - The last name of the user
 * @param {string} body.username - The username of the user
 * @param {string} body.email - The email of the user
 * @param {string} body.password - The password of the user
 * @param {string} body.phoneNumber - The phone number of the user
 * @param {string} body.avatar_url - The avatar URL of the user
 * @param {number} body.role_id - The role ID of the user
 * @param {boolean} body.is_email_verified - The email verification status of the user
 * @param {boolean} body.is_phone_verified - The phone verification status of the user
 * @param {string} body.status - The status of the user
 * @param {string} body.bio - The bio of the user
 * @param {string} body.address_line1 - The address line 1 of the user
 * @param {string} body.address_line2 - The address line 2 of the user
 * @param {string} body.city - The city of the user
 * @param {string} body.country - The country of the user
 * @param {string} body.zip_code - The zip code of the user
 * @param {string} body.provider - The provider of the user
 * @param {string} body.provider_id - The provider ID of the user
 * @param {Date} body.last_login_at - The last login time of the user
 * @param {Date} body.created_at - The creation time of the user
 * @param {Date} body.updated_at - The update time of the user
 */
const createUser = {
  body: Joi.object({
    firstName: Joi.string().required().messages({
      'any.required': 'First name is required',
      'string.empty': 'First name cannot be empty'
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Last name is required',
      'string.empty': 'Last name cannot be empty'
    }),
    username: Joi.string().required().messages({
      'any.required': 'Username is required',
      'string.empty': 'Username cannot be empty'
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().custom(password).required().messages({
      'string.password': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
    phoneNumber: Joi.string()
      .required()
      .pattern(/^[0-9]{10,11}$/)
      .messages({
        'string.pattern.base': 'Phone number must be 10-11 digits',
        'any.required': 'Phone number is required'
      }),
    avatar_url: Joi.string().allow(null, '').optional(),
    role_id: Joi.number().integer().positive().default(5),
    is_email_verified: Joi.boolean().optional().default(false),
    is_phone_verified: Joi.boolean().optional().default(false),
    status: Joi.string()
      .valid('active', 'inactive')
      .optional()
      .default('active')
      .messages({
        'any.only': 'Status must be either "active" or "inactive"'
      }),
    bio: Joi.string().allow(null, '').optional(),
    address_line1: Joi.string().allow(null, '').optional(),
    address_line2: Joi.string().allow(null, '').optional(),
    city: Joi.string().allow(null, '').optional(),
    country: Joi.string().allow(null, '').optional(),
    zip_code: Joi.string().allow(null, '').optional(),
    provider: Joi.string().allow(null, '').optional(),
    provider_id: Joi.string().allow(null, '').optional(),
    last_login_at: Joi.date().allow(null).optional(),
    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional()
  })
};

/**
 * Get user by id
 * @param {string} id - The id of the user
 * @returns {Promise<User>}
 */
const getUserById = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required'
    })
  })
};

/**
 * Get user by email
 * @param {string} email - The email of the user
 * @returns {Promise<User>}
 */
const getUserByEmail = {
  params: Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Email must be a valid email address'
    })
  })
};

/**
 * Get user by phone
 * @param {string} phoneNumber - The phone number of the user
 * @returns {Promise<User>}
 */
const getUserByPhone = {
  params: Joi.object({
    phoneNumber: Joi.string()
      .required()
      .pattern(/^[0-9]{10,11}$/)
      .messages({
        'string.pattern.base': 'Phone number must be 10-11 digits',
        'any.required': 'Phone number is required'
      })
  })
};

/**
 * Get user by username
 * @param {string} username - The username of the user
 * @returns {Promise<User>}
 */
const getUserByUsername = {
  params: Joi.object({
    username: Joi.string().required().messages({
      'any.required': 'Username is required'
    })
  })
};

/**
 * Update user by id
 * @param {string} id - The id of the user
 * @param {Object} body - The body of the request
 * @returns {Promise<User>}
 */
const updateUser = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required'
    })
  }),
  body: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional().custom(password),
    phoneNumber: Joi.string()
      .optional()
      .pattern(/^[0-9]{10,11}$/),
    avatar_url: Joi.string().allow(null, '').optional(),
    role_id: Joi.number().integer().positive().optional(),
    is_email_verified: Joi.boolean().optional(),
    is_phone_verified: Joi.boolean().optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    bio: Joi.string().allow(null, '').optional(),
    address_line1: Joi.string().allow(null, '').optional(),
    address_line2: Joi.string().allow(null, '').optional(),
    city: Joi.string().allow(null, '').optional(),
    country: Joi.string().allow(null, '').optional(),
    zip_code: Joi.string().allow(null, '').optional(),
    provider: Joi.string().allow(null, '').optional(),
    provider_id: Joi.string().allow(null, '').optional(),
    last_login_at: Joi.date().allow(null).optional(),
    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional()
  })
};

/**
 * Delete user by id
 * @param {string} id - The id of the user
 * @returns {Promise<User>}
 */
const deleteUser = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required'
    })
  })
};

/**
 * Hard delete user by id
 * @param {string} id - The id of the user
 * @returns {Promise<User>}
 */
const hardDeleteUser = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required'
    })
  })
};

/**
 * Restore user by id
 * @param {string} id - The id of the user
 * @returns {Promise<User>}
 */
const restoreUser = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required'
    })
  })
};

/**
 * Get deleted users
 * @param {Object} query - The query parameters
 * @returns {Promise<User>}
 */
const getDeletedUsers = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must be at most 100'
    }),
    sortBy: Joi.string()
      .valid('createdAt', 'updatedAt', 'deletedAt', 'firstName', 'lastName', 'email')
      .default('deletedAt')
      .messages({
        'any.only': 'Sort by must be createdAt, updatedAt, deletedAt, firstName, lastName, or email'
      }),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
      'any.only': 'Sort order must be asc or desc'
    }),
    role: Joi.string().valid('user', 'admin').messages({
      'any.only': 'Role must be user or admin'
    })
  })
};

/**
 * Get user stats
 * @param {Object} query - The query parameters
 * @returns {Promise<User>}
 */
const getUserStats = {
  query: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'year', 'all').default('all').messages({
      'any.only': 'Period must be day, week, month, year, or all'
    })
  })
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  getUserByUsername,
  updateUser,
  deleteUser,
  hardDeleteUser,
  restoreUser,
  getDeletedUsers,
  getUserStats
};
