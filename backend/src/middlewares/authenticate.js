const passport = require('passport');
const httpStatus = require('http-status');
const { ApiError } = require('../utils/index');



const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  return resolve();
};

const authenticate = (req, res, next) => new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));

module.exports = authenticate;
