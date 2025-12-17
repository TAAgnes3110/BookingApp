const _ = require('lodash');

/**
 * Convert object keys to camelCase
 * @param {Object} obj
 * @returns {Object}
 */
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [_.camelCase(key)]: toCamelCase(obj[key])
      }),
      {}
    );
  }
  return obj;
};

module.exports = toCamelCase;
