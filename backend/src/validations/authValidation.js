const Joi = require('joi');
const { password, confirmPassword } = require('./custom');

/**
 * Validation schema cho đăng ký người dùng
 * @param {Object} body - Request body
 * @param {string} body.firstName - First name (required)
 * @param {string} body.lastName - Last name (required)
 * @param {string} body.userName - Username (required)
 * @param {string} body.email - Email address (valid email format)
 * @param {string} body.password - Password (custom validation)
 * @param {string} body.confirmPassword - Password confirmation (must match password)
 * @param {string} body.phoneNumber - Phone number (10-11 digits)
 * @param {string} [body.role='user'] - User role ('user' or 'admin')
 * @param {number} [body._id] - User ID (positive integer)
 * @param {number} [body.userId] - User ID (positive integer)
 * @returns {Object} Joi validation schema
 */
const register = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required().message({
    'any.required': 'Username is required'
  }),
  email: Joi.string().email().required().message({
    'string.email': 'Email cannot be empty',
    'any.required': 'Email is required'
  }),
  password: Joi.string().custom(password).required().message({
    'string.password': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string()
    .required()
    .message({
      'any.required': 'Confirm password is required'
    })
    .custom(confirmPassword)
    .message({
      'any.only': 'Confirm password must match password'
    }),
  phoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9]{10,11}$/)
    .message({
      'string.pattern.base': 'Phone number must be 10-11 digits',
      'any.required': 'Phone number is required'
    })
});

/**
 * Validation schema cho đăng nhập người dùng
 * @param {Object} body - Request body
 * @param {string} body.usernameOrEmail - Username or email (required)
 * @param {string} body.password - Password (required)
 * @returns {Object} Joi validation schema
 */
const login = Joi.object({
  usernameOrEmail: Joi.string().required().message({
    'any.required': 'Username or email is required'
  }),
  password: Joi.string().required().message({
    'any.required': 'Password is required'
  })
});

/**
 * Validation schema cho đăng nhập người dùng thông qua OAuth
 * @param {Object} body - Request body
 * @param {string} body.access_token - Access token (required)
 * @param {string} body.provider - Provider (required)
 * @returns {Object} Joi validation schema
 */
const socialLogin = Joi.object({
  access_token: Joi.string().required().message({
    'any.required': 'Access token is required'
  }),
  provider: Joi.string().valid('google', 'facebook').required().message({
    'any.only': 'Provider must be google or facebook',
    'any.required': 'Provider is required'
  })
});

/**
 * Validation schema cho quên mật khẩu
 * @param {Object} body - Request body
 * @param {string} body.email - Email address (valid email format)
 * @returns {Object} Joi validation schema
 */
const forgotPassword = Joi.object({
  email: Joi.string().email().required().message({
    'string.email': 'Email is invalid',
    'any.required': 'Email is required'
  })
});

/**
 * Validation schema reset mật khẩu
 * @param {Object} body - Request body
 * @param {string} body.email - Email address (valid email format)
 * @param {string} body.password - Password (required)
 * @param {string} body.confirmPassword - Password confirmation (must match password)
 * @returns {Object} Joi validation schema
 */
const resetPassword = Joi.object({
  email: Joi.string().email().required().message({
    'string.email': 'Email is invalid',
    'any.required': 'Email is required'
  }),
  password: Joi.string().custom(password).required().message({
    'string.password': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string()
    .required()
    .message({
      'any.required': 'Confirm password is required'
    })
    .custom(confirmPassword)
    .message({
      'any.only': 'Confirm password must match password'
    })
});

/**
 * Validation schema thay đổi mật khẩu
 * @param {Object} body - Request body
 * @param {string} body.oldPassword - Old password (required)
 * @param {string} body.newPassword - New password (required)
 * @param {string} body.confirmNewPassword - Confirm new password (must match new password)
 * @returns {Object} Joi validation schema
 */
const changePassword = Joi.object({
  oldPassword: Joi.string().required().message({
    'any.required': 'Old password is required'
  }),
  newPassword: Joi.string().custom(password).required().message({
    'string.password': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
  }),
  confirmNewPassword: Joi.string()
    .required()
    .message({
      'any.required': 'Confirm password is required'
    })
    .custom(confirmPassword)
    .message({
      'any.only': 'Confirm password must match password'
    })
});

/**
 * Validation schema verify OTP
 * @param {Object} body - Request body
 * @param {string} body.email - Email address (valid email format)
 * @param {string} body.otp - OTP code (required)
 * @returns {Object} Joi validation schema
 */
const verifyOTP = Joi.object({
  email: Joi.string().email().required().message({
    'string.email': 'Email is invalid',
    'any.required': 'Email is required'
  }),
  otp: Joi.string().required().message({
    'any.required': 'OTP is required'
  })
});

/**
 * Validation schema resend OTP
 * @param {Object} body - Request body
 * @param {string} body.email - Email address (valid email format)
 * @returns {Object} Joi validation schema
 */
const resendOTP = Joi.object({
  email: Joi.string().email().required().message({
    'string.email': 'Email is invalid',
    'any.required': 'Email is required'
  })
});

module.exports = {
  register,
  login,
  socialLogin,
  forgotPassword,
  changePassword,
  resetPassword,
  verifyOTP,
  resendOTP
};
