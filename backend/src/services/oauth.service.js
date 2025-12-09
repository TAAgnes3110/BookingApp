const httpStatus = require('http-status');
const { generateAuthTokens } = require('../utils/token');

/**
 * Handle OAuth callback - tạo tokens cho user đã authenticate qua OAuth
 */
const handleOAuthCallback = async (user) => {
  if (!user) {
    throw new Error('OAuth authentication failed');
  }

  const tokens = await generateAuthTokens(user);
  return {
    user,
    tokens,
  };
};

module.exports = {
  handleOAuthCallback,
};

