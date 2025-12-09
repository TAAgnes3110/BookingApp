const httpStatus = require('http-status');

/**
 * Standard API response format
 */
const successResponse = (res, statusCode, message, data = null, meta = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(response);
};

/**
 * Error response format
 */
const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};

