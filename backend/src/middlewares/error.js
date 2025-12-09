const httpStatus = require('http-status');
const { Sequelize } = require('sequelize');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

/**
 * Convert error to ApiError
 */
const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      error.status ||
      (error instanceof Sequelize.ValidationError
        ? httpStatus.BAD_REQUEST
        : error instanceof Sequelize.DatabaseError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR);

    const message =
      error.message ||
      (error instanceof Sequelize.ValidationError
        ? 'Validation Error'
        : httpStatus[statusCode]);

    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

/**
 * Handle error
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    message,
    ...(req.id && { requestId: req.id }),
    ...(config.env === 'development' && { stack: err.stack }),
  };

  logger.error(
    {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      error: {
        statusCode,
        message: err.message,
        stack: config.env === 'development' ? err.stack : undefined,
      },
    },
    'Error occurred'
  );

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};

