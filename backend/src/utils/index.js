module.exports.ApiError = require('./ApiError');
module.exports.catchAsync = require('./catchAsync');
module.exports.emailUtils = require('./emailUtils');
module.exports.password = require('./password');
module.exports.pick = require('./pick');

const { hashPassword, comparePassword } = require('./password');

module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;
module.exports.toCamelCase = require('./toCamelCase');
