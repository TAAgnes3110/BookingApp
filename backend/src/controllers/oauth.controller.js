const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { successResponse } = require('../utils/response');
const { handleOAuthCallback } = require('../services/oauth.service');

/**
 * OAuth callback handler
 * Sau khi OAuth provider xác thực thành công, redirect về đây
 */
const oauthCallback = catchAsync(async (req, res) => {
  const { user } = req;
  const result = await handleOAuthCallback(user);

  // Redirect về frontend với tokens trong URL hoặc set cookies
  // Ở đây tôi sẽ redirect với tokens trong query params
  // Trong production, nên dùng cookies hoặc frontend callback page
  const config = require('../config/config');
  const frontendUrl = process.env.FRONTEND_URL || config.cors.origin || 'http://localhost:3000';
  const redirectUrl = `${frontendUrl}/auth/callback?` +
    `access_token=${result.tokens.access.token}&` +
    `refresh_token=${result.tokens.refresh.token}`;

  res.redirect(redirectUrl);
});

/**
 * OAuth callback với JSON response (cho mobile apps)
 */
const oauthCallbackJson = catchAsync(async (req, res) => {
  const { user } = req;
  const result = await handleOAuthCallback(user);
  successResponse(res, httpStatus.OK, 'OAuth login successful', result);
});

module.exports = {
  oauthCallback,
  oauthCallbackJson,
};

