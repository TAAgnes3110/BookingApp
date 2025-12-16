const { pick, catchAsync } = require('../utils/index');
const { userService } = require('../services/index');

const getUserById = catchAsync(async (req, res) => {
    const { userId } = pick(req.params, ['userId'])
    const user = await userService.getUserById({ id: userId })
    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    })
});

module.exports = {
    getUserById
}
