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
const createUser = Joi.object({
  firstName: Joi.string().required().message({
    'any.required': 'First name is required',
    'string.empty': 'First name cannot be empty'
  }),
  lastName: Joi.string().required().message({
    'any.required': 'Last name is required',
    'string.empty': 'Last name cannot be empty'
  }),
  username: Joi.string().required().message({
    'any.required': 'Username is required',
    'string.empty': 'Username cannot be empty'
  }),
  email: Joi.string().email().required().message({
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address'
  }),
  password: Joi.string().custom(password).required().message({
    'string.password': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
  }),
  phoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9]{10,11}$/)
    .message({
      'string.pattern.base': 'Phone number must be 10-11 digits',
      'any.required': 'Phone number is required'
    }),
  avatar_url: Joi.string().optional(),
  role_id: Joi.number().integer().positive().optional(),
  is_email_verified: Joi.boolean().optional().default(false),
  is_phone_verified: Joi.boolean().optional().default(false),
  status: Joi.string()
    .valid('active', 'inactive')
    .optional()
    .default('active')
    .unknown(false)
    .message({
      'object.unknown': 'Status must be either "active" or "inactive"'
    }),
  bio: Joi.string().optional(),
  address_line1: Joi.string().optional(),
  address_line2: Joi.string().optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional(),
  zip_code: Joi.string().optional(),
  provider: Joi.string().optional(),
  provider_id: Joi.string().optional(),
  last_login_at: Joi.date()
    .optional()
    .default(() => new Date()),
  created_at: Joi.date()
    .optional()
    .default(() => new Date()),
  updated_at: Joi.date()
    .optional()
    .default(() => new Date())
});

/**
 * Validation cho lấy thông tin user theo ID (admin)
 * @param {Object} params - The request parameters
 * @param {string} params.id - The ID of the user
 * @returns {Object} The validation result
 */
const getUserById = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required().message({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required'
    })
  })
});

/**
 * Validation cho lấy thông tin user theo email (admin)
 * @param {Object} params - The request parameters
 * @param {string} params.email - The email of the user
 * @returns {Object} The validation result
 */
const getUserByEmail = Joi.object({
  params: Joi.object({
    email: Joi.string().email().required().message({
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Email must be a valid email address'
    })
  })
});

/**
 * Validation cho lấy thông tin user theo số điện thoại (admin)
 * @param {Object} params - The request parameters
 * @param {string} params.phoneNumber - The phone number of the user
 * @returns {Object} The validation result
 */
const getUserByPhone = Joi.object({
  params: Joi.object({
    phoneNumber: Joi.string()
      .required()
      .pattern(/^[0-9]{10,11}$/)
      .message({
        'string.pattern.base': 'Phone number must be 10-11 digits',
        'any.required': 'Phone number is required'
      })
  })
});

/**
 * Validation cho cập nhật thông tin user (admin)
 * @param {Object} params - The request parameters
 * @param {string} params.id - The ID of the user
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
 * @returns {Object} The validation result
 */
const updateUser = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required().message({
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
    avatar_url: Joi.string().optional(),
    role_id: Joi.number().integer().positive().optional(),
    is_email_verified: Joi.boolean().optional().default(false),
    is_phone_verified: Joi.boolean().optional().default(false),
    status: Joi.string().valid('active', 'inactive').optional().default('active'),
    bio: Joi.string().optional(),
    address_line1: Joi.string().optional(),
    address_line2: Joi.string().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    zip_code: Joi.string().optional(),
    provider: Joi.string().optional(),
    provider_id: Joi.string().optional(),
    last_login_at: Joi.date().optional(),
    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional()
  })
});

/**
 * Validation cho xóa mềm user (admin)
 * @param {Object} params - The request parameters
 * @param {string} params.id - The ID of the user
 * @returns {Object} The validation result
 */
const deleteUser = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required().message({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required'
    })
  })
});

/**
 * Validation cho xóa vĩnh viễn user (admin)
 * @param {Object} params - The request parameters
 * @param {string} params.id - The ID of the user
 * @returns {Object} The validation result
 */
const hardDeleteUser = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required().message({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required'
    })
  })
});

/**
 * Validation cho khôi phục user (admin)
 * @param {Object} params - The request parameters
 * @param {string} params.id - The ID of the user
 * @returns {Object} The validation result
 */
const restoreUser = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required().message({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required'
    })
  })
});

/**
 * Validation cho lấy danh sách users đã xóa (admin)
 * @param {Object} query - The request query
 * @param {number} query.page - The page number
 * @param {number} query.limit - The number of items per page
 * @returns {Object} The validation result
 */
const getDeletedUsers = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1).message({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).message({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must be at most 100'
    }),
    sortBy: Joi.string()
      .valid('createdAt', 'updatedAt', 'deletedAt', 'firstName', 'lastName', 'email')
      .default('deletedAt')
      .message({
        'any.only': 'Sort by must be createdAt, updatedAt, deletedAt, firstName, lastName, or email'
      }),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc').message({
      'any.only': 'Sort order must be asc or desc'
    }),
    role: Joi.string().valid('user', 'admin').message({
      'any.only': 'Role must be user or admin'
    })
  })
});

/**
 * Validation cho lấy thống kê users (admin)
 * @param {Object} query - The request query
 * @param {string} query.period - The period to get stats for
 * @returns {Object} The validation result
 */
const getUserStats = Joi.object({
  query: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'year', 'all').default('all').message({
      'any.only': 'Period must be day, week, month, year, or all'
    })
  })
});

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUser,
  deleteUser,
  hardDeleteUser,
  restoreUser,
  getDeletedUsers,
  getUserStats
};
