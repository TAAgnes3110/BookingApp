const authenticate = require('./authenticate');
const authorize = require('./authorize');
const validate = require('./validate');

const uploadCloud = require('./uploadCloud');

module.exports = {
  authenticate,
  authorize,
  validate,
  uploadCloud,
};
