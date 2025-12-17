const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');

const loginWithSocial = catchAsync(async (req, res) => {
  const { access_token: accessToken, provider } = req.body;
  const profile = await authService.fetchSocialUserProfile(accessToken, provider);
  const user = await authService.loginWithSocial(profile, provider);
  const tokens = await authService.generateAuthTokens(user);
  res.send({ user, tokens });
});

module.exports = {
  loginWithSocial
}
