const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { getUserById } = require('../services/user.service');
const roles = require('../config/roles');

/**
 * Verify token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const payload = jwt.verify(token, config.jwt.secret);
    if (payload.type !== tokenTypes.ACCESS) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
    }

    const user = await getUserById(payload.sub);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }
    // Convert to plain object for consistency
    if (user.toJSON) {
      req.user = user.toJSON();
    } else {
      req.user = user;
    }
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
  }
};

/**
 * Check if user has required permissions
 */
const authorize = (...requiredRights) => {
  return async (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
    }

    const userRole = req.user.role || 'user';
    const userRights = roles[userRole] || [];

    const hasRequiredRights = requiredRights.every((right) => userRights.includes(right));

    if (!hasRequiredRights && req.user.role !== 'admin') {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
    }

    next();
  };
};

/**
 * Extract token from Authorization header
 */
const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

module.exports = {
  authenticate,
  authorize,
};

