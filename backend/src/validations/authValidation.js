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
const register = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required().messages({
      'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),
    password: Joi.string().custom(password).required().messages({
      'string.password': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
    confirmPassword: Joi.string()
      .required()
      .custom(confirmPassword)
      .messages({
        'any.required': 'Confirm password is required',
        'any.only': 'Confirm password must match password'
      }),
    phoneNumber: Joi.string()
      .required()
      .pattern(/^[0-9]{10,11}$/)
      .messages({
        'string.pattern.base': 'Phone number must be 10-11 digits',
        'any.required': 'Phone number is required'
      })
  })
};

const login = {
  body: Joi.object({
    usernameOrEmail: Joi.string().required().messages({
      'any.required': 'Username or email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  })
};

const socialLogin = {
  body: Joi.object({
    access_token: Joi.string().required().messages({
      'any.required': 'Access token is required'
    }),
    provider: Joi.string().valid('google', 'facebook').required().messages({
      'any.only': 'Provider must be google or facebook',
      'any.required': 'Provider is required'
    })
  })
};

const forgotPassword = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email is invalid',
      'any.required': 'Email is required'
    })
  })
};

const resetPassword = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email is invalid',
      'any.required': 'Email is required'
    }),
    password: Joi.string().custom(password).required().messages({
      'string.password': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
    confirmPassword: Joi.string()
      .required()
      .custom(confirmPassword)
      .messages({
        'any.required': 'Confirm password is required',
        'any.only': 'Confirm password must match password'
      })
  })
};

const changePassword = {
  body: Joi.object({
    oldPassword: Joi.string().required().messages({
      'any.required': 'Old password is required'
    }),
    newPassword: Joi.string().custom(password).required().messages({
      'string.password': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
    confirmNewPassword: Joi.string()
      .required()
      .custom(confirmPassword)
      .messages({
        'any.required': 'Confirm password is required',
        'any.only': 'Confirm password must match password'
      })
  })
};

const verifyOTP = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email is invalid',
      'any.required': 'Email is required'
    }),
    otp: Joi.string().required().messages({
      'any.required': 'OTP is required'
    })
  })
};

const resendOTP = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email is invalid',
      'any.required': 'Email is required'
    })
  })
};

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
