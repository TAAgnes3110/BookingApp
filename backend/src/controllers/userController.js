const { pick, catchAsync } = require('../utils/index');
const { userService, uploadService } = require('../services/index');

const getUserById = catchAsync(async (req, res) => {
    const { userId } = pick(req.params, ['userId'])
    const user = await userService.getUserById({ id: userId })
    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    })
});

const getUserByEmail = catchAsync(async (req, res) => {
  const { email } = pick(req.params, ['email']);
  const user = await userService.getUserByEmail(email);
  res.json({
    success: true,
    data: user,
    message: 'User retrieved successfully'
  })
});

const getUserByPhone = catchAsync(async (req, res) => {
  const { phoneNumber } = pick(req.params, ['phoneNumber']);
  const user = await userService.getUserByPhone(phoneNumber);
  res.json({
    success: true,
    data: user,
    message: 'User retrieved successfully'
  })
});

const getUserByUsername = catchAsync(async (req, res) => {
  const { username } = pick(req.params, ['username']);
  const user = await userService.getUserByUsername(username);
  res.json({
    success: true,
    data: user,
    message: 'User retrieved successfully'
  })
});

const createUser = catchAsync(async (req, res) => {
  const userBody = req.body;
  if (req.file) {
    userBody.avatarUrl = req.file.path;
  }
  const user = await userService.createUser(userBody);
  res.json({
    success: true,
    data: user,
    message: 'User created successfully'
  })
});

const updateAvatar = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error('Please upload a file');
  }

  const userId = req.user.id;

  const avatarUrl = req.file.path;
  const user = await uploadService.updateUserAvatar(userId, avatarUrl);

  res.json({
    success: true,
    data: user,
    message: 'Avatar updated successfully'
  });
});

module.exports = {
    getUserById,
    getUserByEmail,
    getUserByPhone,
    getUserByUsername,
    createUser,
    updateAvatar
}
