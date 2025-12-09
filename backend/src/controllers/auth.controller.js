const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { successResponse } = require('../utils/response');
const { authService, userService } = require('../services');
const { generateAuthTokens } = require('../utils/token');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await generateAuthTokens(user);
  successResponse(res, httpStatus.CREATED, 'User registered successfully', { user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await generateAuthTokens(user);
  successResponse(res, httpStatus.OK, 'Login successful', { user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  successResponse(res, httpStatus.OK, 'Logout successful');
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  successResponse(res, httpStatus.OK, 'Tokens refreshed successfully', tokens);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
};

