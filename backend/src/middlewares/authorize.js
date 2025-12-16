const httpStatus = require('http-status');
const { ApiError } = require('../utils/index');
const { sequelize } = require('../config/database');

const authorize = (...requiredRights) => async (req, res, next) => {
  try {
    if (!req.user) {
         return next(new ApiError(httpStatus.UNAUTHORIZED, 'Người dùng chưa xác thực'));
    }

    // Lấy vai trò (role) của người dùng từ DB
    const userRole = await sequelize.models.Role.findByPk(req.user.roleId);

    if (!userRole) {
         throw new ApiError(httpStatus.FORBIDDEN, 'Bị cấm: Người dùng chưa được gán vai trò');
    }

    const userPermissions = userRole.permissions || [];

    // Super Admin check
     if (userPermissions.includes('all')) {
         return next();
    }

    // Kiểm tra các quyền bắt buộc
    if (requiredRights.length) {
        const hasRequiredRights = requiredRights.every((requiredRight) => userPermissions.includes(requiredRight));

        // Cho phép người dùng truy cập tài nguyên của chính họ (bất kể quyền hạn)
        // Kiểm tra quyền sở hữu tài nguyên (req.params.userId === req.user.id)
        const isSelf = req.params.userId && req.params.userId === req.user.id;

        if (!hasRequiredRights && !isSelf) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Bị cấm: Không đủ quyền hạn');
        }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authorize;
