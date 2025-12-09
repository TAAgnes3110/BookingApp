# Hướng Dẫn Viết Code Admin

Tài liệu này giải thích chi tiết về cách viết code liên quan đến admin (phân quyền) trong dự án TAAgnes Backend.

## 📍 Tổng Quan - Code Admin Ở Đâu?

Code liên quan đến admin được viết ở các vị trí sau:

```
├── src/config/roles.js          # Định nghĩa roles và quyền
├── src/models/user.model.js      # Model User với field role
├── src/middlewares/auth.js       # Middleware kiểm tra quyền
├── src/routes/v1/user.route.js   # Routes với middleware authorize
├── src/controllers/user.controller.js  # Controllers xử lý logic admin
└── src/services/user.service.js  # Services chứa business logic
```

---

## 🔐 1. Định Nghĩa Roles và Quyền

### File: `src/config/roles.js`

Đây là nơi **định nghĩa các roles và quyền** của từng role.

```javascript
const roles = {
  user: [],                           // User thường không có quyền đặc biệt
  admin: ['getUsers', 'manageUsers'], // Admin có quyền quản lý users
};

module.exports = roles;
```

### Giải Thích

- **`user`**: Role mặc định, không có quyền đặc biệt (mảng rỗng)
- **`admin`**: Có các quyền:
  - `getUsers`: Xem danh sách users
  - `manageUsers`: Tạo, sửa, xóa users

### Cách Thêm Quyền Mới

**Ví dụ 1: Thêm quyền cho admin**

```javascript
const roles = {
  user: [],
  admin: [
    'getUsers',        // Xem danh sách users
    'manageUsers',     // Quản lý users
    'manageProducts',  // Quản lý sản phẩm (mới)
    'manageOrders',   // Quản lý đơn hàng (mới)
    'viewReports',    // Xem báo cáo (mới)
  ],
};
```

**Ví dụ 2: Thêm role mới (moderator)**

```javascript
const roles = {
  user: [],
  moderator: [
    'getUsers',        // Moderator có thể xem users
    'manageProducts', // Và quản lý sản phẩm
  ],
  admin: [
    'getUsers',
    'manageUsers',
    'manageProducts',
    'manageOrders',
    'viewReports',
  ],
};
```

**Ví dụ 3: Role phức tạp hơn (E-commerce)**

```javascript
const roles = {
  user: [],
  seller: [
    'manageOwnProducts',  // Quản lý sản phẩm của mình
    'viewOwnOrders',      // Xem đơn hàng của mình
  ],
  moderator: [
    'getUsers',
    'manageProducts',     // Quản lý tất cả sản phẩm
    'manageCategories',
  ],
  admin: [
    'getUsers',
    'manageUsers',
    'manageProducts',
    'manageOrders',
    'manageCategories',
    'viewReports',
    'manageSettings',     // Quản lý cài đặt hệ thống
  ],
};
```

---

## 👤 2. Model User - Field Role

### File: `src/models/user.model.js`

Model User có field `role` để lưu role của user.

```javascript
role: {
  type: DataTypes.ENUM('user', 'admin'),
  defaultValue: 'user',  // Mặc định là 'user'
}
```

### Cách Set Admin

**Cách 1: Khi tạo user mới**

```javascript
// Trong service hoặc controller
const admin = await User.create({
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'password123',
  role: 'admin',  // Set role là admin
  isEmailVerified: true,
});
```

**Cách 2: Update user thành admin**

```javascript
// Trong service
const user = await User.findByPk(userId);
user.role = 'admin';
await user.save();
```

**Cách 3: Sử dụng script seed (khuyến nghị)**

Tạo file `scripts/seed-admin.js`:

```javascript
// scripts/seed-admin.js
require('dotenv').config();
const { connectDatabase, closeDatabase } = require('../src/config/database');
const { User } = require('../src/models');

const seedAdmin = async () => {
  try {
    await connectDatabase();

    // Tạo admin user
    const admin = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123456',
        role: 'admin',
        isEmailVerified: true,
      },
    });

    console.log('Admin user:', admin[0].email);

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Seed admin failed:', error);
    process.exit(1);
  }
};

seedAdmin();
```

Chạy:
```bash
node scripts/seed-admin.js
```

---

## 🛡️ 3. Middleware Kiểm Tra Quyền

### File: `src/middlewares/auth.js`

Có 2 middleware chính:

#### 3.1. `authenticate` - Xác thực user

```javascript
const authenticate = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const token = extractTokenFromHeader(req);

    // 2. Verify token
    const payload = jwt.verify(token, config.jwt.secret);

    // 3. Lấy user từ database
    const user = await getUserById(payload.sub);

    // 4. Gắn user vào request
    req.user = user.toJSON(); // { id, email, role, ... }

    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
  }
};
```

**Kết quả**: Sau khi qua `authenticate`, `req.user` sẽ có:
```javascript
req.user = {
  id: 1,
  email: 'admin@example.com',
  role: 'admin',
  name: 'Admin User',
  // ... các field khác
}
```

#### 3.2. `authorize` - Kiểm tra quyền

```javascript
const authorize = (...requiredRights) => {
  return async (req, res, next) => {
    // 1. Kiểm tra user đã được authenticate chưa
    if (!req.user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
    }

    // 2. Lấy role của user
    const userRole = req.user.role || 'user';

    // 3. Lấy danh sách quyền của role đó
    const userRights = roles[userRole] || [];

    // 4. Kiểm tra user có tất cả quyền cần thiết không
    const hasRequiredRights = requiredRights.every((right) =>
      userRights.includes(right)
    );

    // 5. Nếu không có quyền VÀ không phải admin → 403
    if (!hasRequiredRights && req.user.role !== 'admin') {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
    }

    next(); // Cho phép tiếp tục
  };
};
```

**Cách hoạt động**:
1. Lấy role của user từ `req.user.role`
2. Lấy danh sách quyền của role đó từ `roles.js`
3. So sánh với quyền yêu cầu
4. **Admin luôn có tất cả quyền** (bypass check)
5. Nếu không đủ quyền → 403 Forbidden

**Ví dụ**:
```javascript
// Yêu cầu quyền 'manageUsers'
authorize('manageUsers')

// User có role 'admin' → ✅ Pass (admin luôn có tất cả quyền)
// User có role 'user' → ❌ 403 (user không có quyền 'manageUsers')
```

---

## 🛣️ 4. Routes - Sử Dụng Middleware

### File: `src/routes/v1/user.route.js`

Đây là nơi **áp dụng middleware** vào các routes.

```javascript
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { userController } = require('../../controllers');
const { userValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

// Chỉ admin mới có thể tạo user
router.post(
  '/',
  authenticate,                    // 1. Xác thực user
  authorize('manageUsers'),       // 2. Kiểm tra quyền manageUsers
  validate(userValidation.createUser), // 3. Validate dữ liệu
  userController.createUser      // 4. Xử lý request
);

// Chỉ admin mới có thể xóa user
router.delete(
  '/:userId',
  authenticate,
  authorize('manageUsers'),
  validate(userValidation.deleteUser),
  userController.deleteUser
);

// User thường có thể xem danh sách users (nếu có quyền getUsers)
// Admin luôn có thể xem
router.get(
  '/',
  authenticate,
  authorize('getUsers'),
  userController.getUsers
);

// User thường chỉ có thể xem thông tin của chính mình
// Admin có thể xem thông tin bất kỳ user nào
router.get(
  '/:userId',
  authenticate,
  userController.getUserById
);

module.exports = router;
```

### Flow Kiểm Tra Quyền

```
Request → authenticate()
       → req.user = { id: 1, role: 'admin', ... }
       → authorize('manageUsers')
       → Kiểm tra: roles['admin'] có chứa 'manageUsers'?
       → Có → ✅ Pass → Tiếp tục
       → Không → ❌ 403 Forbidden
```

### Ví Dụ Các Routes Admin Thường Gặp

**Ví dụ 1: E-commerce - Quản lý sản phẩm**

```javascript
// Chỉ admin và moderator mới có thể tạo sản phẩm
router.post(
  '/products',
  authenticate,
  authorize('manageProducts'),
  validate(productValidation.createProduct),
  productController.createProduct
);

// Chỉ admin mới có thể xóa sản phẩm
router.delete(
  '/products/:productId',
  authenticate,
  authorize('manageProducts'),
  productController.deleteProduct
);
```

**Ví dụ 2: Blog - Quản lý bài viết**

```javascript
// Admin và author có thể tạo bài viết
router.post(
  '/posts',
  authenticate,
  authorize('createPost'),
  validate(postValidation.createPost),
  postController.createPost
);

// Chỉ admin mới có thể xóa bài viết của người khác
router.delete(
  '/posts/:postId',
  authenticate,
  authorize('deletePost'),
  postController.deletePost
);
```

**Ví dụ 3: Chỉ admin mới truy cập được**

```javascript
// Route chỉ dành cho admin
router.get(
  '/admin/dashboard',
  authenticate,
  authorize('viewDashboard'), // Chỉ admin có quyền này
  adminController.getDashboard
);
```

---

## 🎮 5. Controllers - Xử Lý Logic Admin

### File: `src/controllers/user.controller.js`

Controllers xử lý request và response. Có thể kiểm tra thêm logic admin ở đây.

```javascript
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { successResponse } = require('../utils/response');

const createUser = catchAsync(async (req, res) => {
  // req.user đã được set bởi authenticate middleware
  // req.user.role = 'admin' (nếu là admin)

  const user = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).json(
    successResponse(user, 'User created successfully')
  );
});

const getUsers = catchAsync(async (req, res) => {
  // Admin có thể xem tất cả users
  // User thường chỉ có thể xem danh sách hạn chế

  const filter = {};
  const options = {
    page: req.query.page,
    limit: req.query.limit,
  };

  // Nếu không phải admin, chỉ lấy users của chính mình
  if (req.user.role !== 'admin') {
    filter.id = req.user.id;
  }

  const result = await userService.queryUsers(filter, options);

  res.json(successResponse(result, 'Users retrieved successfully'));
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  // User thường chỉ có thể xem thông tin của chính mình
  // Admin có thể xem thông tin bất kỳ user nào
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only view your own profile');
  }

  res.json(successResponse(user, 'User retrieved successfully'));
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);

  // User thường chỉ có thể update thông tin của chính mình
  // Admin có thể update thông tin bất kỳ user nào
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own profile');
  }

  res.json(successResponse(user, 'User updated successfully'));
});

const deleteUser = catchAsync(async (req, res) => {
  // Chỉ admin mới có thể xóa user (đã được kiểm tra ở route)
  await userService.deleteUserById(req.params.userId);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
```

### Ví Dụ Controller Phức Tạp Hơn

**Ví dụ: Admin Dashboard**

```javascript
// src/controllers/admin.controller.js
const getDashboard = catchAsync(async (req, res) => {
  // Chỉ admin mới có thể truy cập (đã được kiểm tra ở route)

  const stats = await adminService.getDashboardStats();

  res.json(successResponse(stats, 'Dashboard stats retrieved successfully'));
});

const manageUserRole = catchAsync(async (req, res) => {
  // Chỉ admin mới có thể thay đổi role của user
  const { userId } = req.params;
  const { role } = req.body;

  // Validate role
  const validRoles = ['user', 'admin', 'moderator'];
  if (!validRoles.includes(role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
  }

  const user = await userService.updateUserById(userId, { role });

  res.json(successResponse(user, 'User role updated successfully'));
});
```

---

## 🔧 6. Services - Business Logic

### File: `src/services/user.service.js`

Services chứa business logic. Có thể có logic riêng cho admin.

```javascript
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createUser = async (userBody) => {
  // Kiểm tra email đã tồn tại chưa
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Tạo user
  const user = await User.create(userBody);

  return user;
};

const queryUsers = async (filter, options) => {
  // Admin có thể query với filter phức tạp
  // User thường chỉ query được chính mình

  const users = await User.findAll({
    where: filter,
    limit: options.limit,
    offset: (options.page - 1) * options.limit,
  });

  return users;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);

  // Nếu update email, kiểm tra email mới có bị trùng không
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  Object.assign(user, updateBody);
  await user.save();

  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  await user.destroy();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
```

---

## 📋 7. Ví Dụ Hoàn Chỉnh - Tạo Feature Admin Mới

Giả sử bạn muốn tạo feature **"Quản lý sản phẩm"** chỉ dành cho admin.

### Bước 1: Thêm quyền vào `src/config/roles.js`

```javascript
const roles = {
  user: [],
  admin: [
    'getUsers',
    'manageUsers',
    'manageProducts',  // ← Thêm quyền mới
  ],
};
```

### Bước 2: Tạo Model `src/models/product.model.js`

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'products',
      timestamps: true,
    }
  );

  return Product;
};
```

### Bước 3: Tạo Service `src/services/product.service.js`

```javascript
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};

const getProducts = async (filter, options) => {
  const products = await Product.findAll({
    where: filter,
    limit: options.limit,
    offset: (options.page - 1) * options.limit,
  });
  return products;
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  await product.destroy();
  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
```

### Bước 4: Tạo Controller `src/controllers/product.controller.js`

```javascript
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const { successResponse } = require('../utils/response');

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).json(
    successResponse(product, 'Product created successfully')
  );
});

const getProducts = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    page: req.query.page,
    limit: req.query.limit,
  };
  const result = await productService.getProducts(filter, options);
  res.json(successResponse(result, 'Products retrieved successfully'));
});

const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  res.json(successResponse(product, 'Product retrieved successfully'));
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(
    req.params.productId,
    req.body
  );
  res.json(successResponse(product, 'Product updated successfully'));
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
```

### Bước 5: Tạo Routes `src/routes/v1/product.route.js`

```javascript
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { productController } = require('../../controllers');
const { productValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

// Tất cả routes đều yêu cầu authenticate
// Chỉ admin mới có quyền manageProducts

router.post(
  '/',
  authenticate,
  authorize('manageProducts'),  // ← Kiểm tra quyền
  validate(productValidation.createProduct),
  productController.createProduct
);

router.get(
  '/',
  authenticate,
  authorize('manageProducts'),
  productController.getProducts
);

router.get(
  '/:productId',
  authenticate,
  authorize('manageProducts'),
  productController.getProductById
);

router.patch(
  '/:productId',
  authenticate,
  authorize('manageProducts'),
  validate(productValidation.updateProduct),
  productController.updateProduct
);

router.delete(
  '/:productId',
  authenticate,
  authorize('manageProducts'),
  productController.deleteProduct
);

module.exports = router;
```

### Bước 6: Đăng ký routes trong `src/routes/v1/index.js`

```javascript
const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route'); // ← Thêm route mới

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/products', productRoute); // ← Đăng ký route

module.exports = router;
```

### Bước 7: Test

```bash
# Đăng nhập với admin
POST /v1/auth/login
{
  "email": "admin@example.com",
  "password": "admin123456"
}

# Tạo sản phẩm (chỉ admin mới được)
POST /v1/products
Authorization: Bearer <admin_token>
{
  "name": "Product 1",
  "price": 100000,
  "description": "Description"
}
```

---

## ✅ Checklist Khi Viết Code Admin

- [ ] Đã định nghĩa quyền trong `src/config/roles.js`
- [ ] Đã thêm field `role` vào model (nếu chưa có)
- [ ] Đã sử dụng `authenticate` middleware trong routes
- [ ] Đã sử dụng `authorize` middleware với quyền phù hợp
- [ ] Đã kiểm tra logic trong controller (nếu cần)
- [ ] Đã test với user thường (phải bị từ chối)
- [ ] Đã test với admin (phải thành công)
- [ ] Đã thêm validation cho dữ liệu đầu vào

---

## 🎯 Best Practices

1. **Luôn kiểm tra quyền ở route level** (sử dụng `authorize`)
2. **Kiểm tra thêm ở controller level** nếu logic phức tạp
3. **Admin luôn có tất cả quyền** (bypass check trong `authorize`)
4. **Sử dụng descriptive permission names** (`manageUsers`, không phải `admin`)
5. **Tách biệt logic admin và user** trong services nếu cần
6. **Log các hành động admin** để audit trail
7. **Không hardcode role check** trong nhiều nơi, dùng `authorize` middleware

---

## 📚 Tài Liệu Liên Quan

- [KIEN-TRUC.md](./KIEN-TRUC.md) - Kiến trúc tổng thể
- [TAI-LIEU-API.md](./TAI-LIEU-API.md) - Tài liệu API
- [HUONG-DAN-CAC-FOLDER.md](./HUONG-DAN-CAC-FOLDER.md) - Hướng dẫn các folder

---

**Tác giả**: TAAgnes
**Email**: taagnes3110@gmail.com

---

*Tài liệu này là một phần của TAAgnes Backend Template - Mẫu backend Node.js sẵn sàng cho production với MySQL.*

