const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  // Optional: const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user });
});

module.exports = {
  login,
};
