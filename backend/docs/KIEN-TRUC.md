# Kiến trúc và Cấu trúc Dự án TAAgnes Backend

Tài liệu này giải thích chi tiết về kiến trúc, cấu trúc thư mục và cách hoạt động của từng thành phần trong dự án TAAgnes Backend.

## Mục lục

1. [Tổng quan Kiến trúc](#tổng-quan-kiến-trúc)
2. [Luồng Hoạt động của Request](#luồng-hoạt-động-của-request)
3. [Chi tiết Cấu trúc Thư mục](#chi-tiết-cấu-trúc-thư-mục)
4. [Giải thích từng File](#giải-thích-từng-file)
5. [Các Tầng (Layers) trong Ứng dụng](#các-tầng-layers-trong-ứng-dụng)

---

## Tổng quan Kiến trúc

Dự án TAAgnes Backend sử dụng kiến trúc **Layered Architecture** (Kiến trúc phân tầng) với các tầng chính:

```
┌─────────────────────────────────────────┐
│         Client (Frontend/Mobile)        │
└─────────────────┬───────────────────────┘
                  │ HTTP Request
                  ▼
┌─────────────────────────────────────────┐
│         Routes Layer (Định tuyến)       │
│  - Định nghĩa endpoints                 │
│  - Kết nối URL với Controllers          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Middleware Layer (Xử lý trung gian)│
│  - Authentication (Xác thực)           │
│  - Validation (Xác thực dữ liệu)        │
│  - Error Handling (Xử lý lỗi)          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│    Controller Layer (Điều khiển)       │
│  - Nhận request                         │
│  - Gọi Services                        │
│  - Trả về response                     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Service Layer (Logic nghiệp vụ)    │
│  - Xử lý business logic                 │
│  - Tương tác với Models                │
│  - Xử lý transactions                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       Model Layer (Mô hình dữ liệu)     │
│  - Định nghĩa cấu trúc database        │
│  - Sequelize ORM                        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         MySQL Database                  │
└─────────────────────────────────────────┘
```

---

## Luồng Hoạt động của Request

### Ví dụ: Đăng ký User mới

```
1. Client gửi POST request
   POST /v1/auth/register
   Body: { name, email, password }
   │
   ▼
2. Routes Layer (routes/v1/auth.route.js)
   - Nhận request tại route '/register'
   - Áp dụng validation middleware
   - Gọi controller.register()
   │
   ▼
3. Validation Middleware (middlewares/validate.js)
   - Kiểm tra dữ liệu với Joi schema
   - Nếu hợp lệ → tiếp tục
   - Nếu không → trả về lỗi 400
   │
   ▼
4. Controller (controllers/auth.controller.js)
   - Nhận dữ liệu đã validate
   - Gọi authService.register()
   - Xử lý response
   │
   ▼
5. Service (services/auth.service.js)
   - Gọi userService.createUser()
   - Tạo JWT tokens
   - Trả về user + tokens
   │
   ▼
6. User Service (services/user.service.js)
   - Kiểm tra email đã tồn tại chưa
   - Hash password với bcrypt
   - Gọi User.create() từ Model
   │
   ▼
7. Model (models/user.model.js)
   - Sequelize tạo record trong database
   - Hook beforeCreate: hash password
   - Trả về user object
   │
   ▼
8. Response quay ngược lại các tầng
   Model → Service → Controller → Routes → Client
   │
   ▼
9. Client nhận response
   {
     success: true,
     message: "User registered successfully",
     data: { user, tokens }
   }
```

### Sơ đồ Luồng Request

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ HTTP Request
     ▼
┌─────────────────┐
│  Express App    │
│  (app.js)       │
└────┬────────────┘
     │
     ├─► Request ID Middleware
     ├─► Security (Helmet, XSS)
     ├─► Body Parser
     ├─► CORS
     ├─► Rate Limiting
     │
     ▼
┌─────────────────┐
│     Routes      │
│  /v1/auth/*     │
│  /v1/users/*    │
└────┬────────────┘
     │
     ├─► Authentication Middleware (nếu cần)
     ├─► Validation Middleware
     │
     ▼
┌─────────────────┐
│   Controllers   │
│  - auth         │
│  - user         │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│    Services     │
│  - authService  │
│  - userService  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│     Models      │
│  - User         │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  MySQL Database │
└─────────────────┘
```

---

## Chi tiết Cấu trúc Thư mục

```
TAAgnes-Backend/
│
├── bin/                          # Thư mục khởi chạy
│   └── server.js                # File khởi động server
│
├── src/                          # Source code chính
│   ├── app.js                   # Cấu hình Express app
│   │
│   ├── config/                  # Cấu hình hệ thống
│   │   ├── config.js           # Load và quản lý config
│   │   ├── validateEnv.js      # Validate biến môi trường
│   │   ├── database.js         # Kết nối MySQL
│   │   ├── logger.js           # Cấu hình Winston logger
│   │   ├── roles.js            # Định nghĩa quyền theo role
│   │   └── tokens.js           # Loại token (access/refresh)
│   │
│   ├── controllers/            # Điều khiển request/response
│   │   ├── index.js           # Export tất cả controllers
│   │   ├── auth.controller.js # Xử lý auth (login/register)
│   │   └── user.controller.js # Xử lý user CRUD
│   │
│   ├── middlewares/            # Middleware xử lý trung gian
│   │   ├── auth.js            # Xác thực JWT token
│   │   ├── error.js           # Xử lý lỗi tập trung
│   │   ├── requestId.js       # Tạo Request ID
│   │   └── validate.js        # Validate request với Joi
│   │
│   ├── models/                 # Định nghĩa database models
│   │   ├── index.js           # Export models
│   │   └── user.model.js      # Model User với Sequelize
│   │
│   ├── routes/                 # Định tuyến API
│   │   └── v1/                # API version 1
│   │       ├── index.js       # Tổng hợp routes
│   │       ├── auth.route.js  # Routes cho authentication
│   │       └── user.route.js   # Routes cho user management
│   │
│   ├── services/               # Business logic
│   │   ├── index.js          # Export services
│   │   ├── auth.service.js   # Logic xác thực
│   │   └── user.service.js   # Logic quản lý user
│   │
│   ├── utils/                  # Các hàm tiện ích
│   │   ├── ApiError.js       # Class lỗi tùy chỉnh
│   │   ├── catchAsync.js     # Bắt lỗi async
│   │   ├── pick.js           # Chọn fields từ object
│   │   ├── response.js       # Format response chuẩn
│   │   ├── token.js          # Tạo JWT tokens
│   │   ├── transaction.js    # Xử lý database transaction
│   │   └── sqlMigration.js   # Chạy migration
│   │
│   └── validations/           # Schema validation
│       ├── index.js          # Export validations
│       ├── auth.validation.js # Validation cho auth
│       ├── user.validation.js # Validation cho user
│       └── custom.validation.js # Custom validators
│
├── tests/                      # File kiểm thử
│   ├── setup.js              # Setup test environment
│   └── user.test.js          # Test cho user
│
├── logs/                       # Thư mục log (tự động tạo)
│   ├── error.log             # Log lỗi
│   └── combined.log          # Log tổng hợp
│
├── scripts/                    # Script tiện ích
│   └── migrate.js            # Script chạy migration
│
├── .env.example               # Mẫu biến môi trường
├── .gitignore                # Git ignore rules
├── .eslintrc.json            # ESLint config
├── .prettierrc.json          # Prettier config
├── .editorconfig             # Editor config
├── docker-compose.yml        # Docker Compose config
├── Dockerfile                # Docker image config
├── jest.config.js            # Jest test config
├── package.json              # Dependencies và scripts
└── README.md                 # Tài liệu chính
```

---

## Giải thích từng File

### 📁 bin/server.js

**Mục đích**: Điểm khởi chạy ứng dụng, khởi tạo server và kết nối database.

**Cách hoạt động**:
1. Import app từ `src/app.js`
2. Import config và logger
3. Kết nối database trước khi start server
4. Lắng nghe các signal để graceful shutdown
5. Xử lý uncaught exceptions và unhandled rejections

**Code flow**:
```javascript
startServer()
  → connectDatabase()
  → app.listen()
  → Server running
```

**Khi nào chạy**: Khi bạn chạy `npm start` hoặc `npm run dev`

---

### 📁 src/app.js

**Mục đích**: Cấu hình và thiết lập Express application với tất cả middleware.

**Các middleware được áp dụng (theo thứ tự)**:

1. **Request ID** (`requestId`)
   - Tạo unique ID cho mỗi request
   - Giúp tracking và debug

2. **Security** (`helmet`)
   - Bảo vệ khỏi các lỗ hổng bảo mật phổ biến
   - Set security headers

3. **Body Parser**
   - `express.json()`: Parse JSON body
   - `express.urlencoded()`: Parse form data

4. **Sanitization** (`xss`)
   - Làm sạch input để tránh XSS attacks

5. **Compression** (`compression`)
   - Nén response để giảm bandwidth

6. **CORS** (`cors`)
   - Cho phép cross-origin requests

7. **Rate Limiting** (`express-rate-limit`)
   - Giới hạn số request từ một IP
   - 100 requests / 15 phút

8. **HTTP Logger** (`morgan`)
   - Log tất cả HTTP requests

9. **Routes** (`/v1`)
   - Định tuyến đến các API endpoints

10. **Error Handlers**
    - Xử lý 404 (Not Found)
    - Convert errors
    - Format error response

**Sơ đồ Middleware Stack**:
```
Request → Request ID → Security → Body Parser → Sanitize
→ Compression → CORS → Rate Limit → Logger → Routes
→ Error Handler → Response
```

---

### 📁 src/config/

#### config.js
**Mục đích**: Load và quản lý tất cả cấu hình từ environment variables.

**Cách hoạt động**:
- Load `.env` file
- Thử load từ `validateEnv.js` (có validation)
- Nếu fail, fallback về config đơn giản (development)
- Export config object để sử dụng trong toàn bộ app

**Các config chính**:
- `env`: Môi trường (development/production)
- `port`: Port server
- `mysql`: Thông tin kết nối MySQL
- `jwt`: Cấu hình JWT tokens
- `cors`: Cấu hình CORS
- `logLevel`: Mức độ logging

#### validateEnv.js
**Mục đích**: Validate environment variables với Joi schema.

**Cách hoạt động**:
- Định nghĩa schema cho từng biến môi trường
- Validate khi app khởi động
- Throw error nếu thiếu hoặc sai format
- Đảm bảo app không chạy với config sai

#### database.js
**Mục đích**: Quản lý kết nối MySQL với Sequelize.

**Cách hoạt động**:
1. Tạo Sequelize instance với config MySQL
2. `connectDatabase()`: Kết nối và authenticate
3. `getConnection()`: Lấy connection hiện tại
4. `closeDatabase()`: Đóng connection khi shutdown

**Connection Pool**:
- `max: 5`: Tối đa 5 connections
- `min: 0`: Tối thiểu 0 connections
- `acquire: 30000`: Timeout khi lấy connection (30s)
- `idle: 10000`: Timeout khi connection idle (10s)

#### logger.js
**Mục đích**: Cấu hình Winston logger để ghi log.

**Cách hoạt động**:
- **File transports**:
  - `logs/error.log`: Chỉ log errors
  - `logs/combined.log`: Log tất cả levels
- **Console transport**:
  - Development: Colorized, readable format
  - Production: JSON format

**Log Levels** (từ thấp đến cao):
- `error`: Chỉ lỗi
- `warn`: Cảnh báo
- `info`: Thông tin
- `http`: HTTP requests
- `verbose`: Chi tiết
- `debug`: Debug
- `silly`: Rất chi tiết

#### roles.js
**Mục đích**: Định nghĩa quyền (permissions) cho từng role.

**Cấu trúc**:
```javascript
{
  user: [],                    // User thường không có quyền đặc biệt
  admin: ['getUsers', 'manageUsers']  // Admin có quyền quản lý users
}
```

**Cách sử dụng**: Trong `middlewares/auth.js` để kiểm tra quyền.

#### tokens.js
**Mục đích**: Định nghĩa các loại JWT token.

**Các loại token**:
- `ACCESS`: Token để truy cập API (hết hạn nhanh)
- `REFRESH`: Token để làm mới access token (hết hạn chậm)
- `RESET_PASSWORD`: Token để reset password

---

### 📁 src/controllers/

**Mục đích**: Xử lý HTTP request/response, gọi services và trả về response.

#### auth.controller.js
**Các functions**:
- `register()`: Đăng ký user mới
- `login()`: Đăng nhập
- `logout()`: Đăng xuất
- `refreshTokens()`: Làm mới tokens

**Flow**:
```
Request → Controller → Service → Model → Database
         ← Response ← Controller ← Service ← Model
```

#### user.controller.js
**Các functions**:
- `createUser()`: Tạo user (admin only)
- `getUsers()`: Lấy danh sách users (có pagination)
- `getUser()`: Lấy thông tin 1 user
- `updateUser()`: Cập nhật user
- `deleteUser()`: Xóa user (admin only)

**Response Format**:
Tất cả response đều dùng `successResponse()` để format chuẩn:
```javascript
{
  success: true,
  message: "Thông báo",
  data: {...},      // Dữ liệu
  meta: {...}       // Metadata (pagination, etc.)
}
```

---

### 📁 src/middlewares/

#### auth.js
**Mục đích**: Xác thực JWT token và kiểm tra quyền.

**Cách hoạt động**:
1. `authenticate()`:
   - Lấy token từ header `Authorization: Bearer <token>`
   - Verify token với JWT secret
   - Lấy user từ database
   - Attach user vào `req.user`

2. `authorize(...permissions)`:
   - Kiểm tra user có quyền cần thiết không
   - So sánh với `roles.js`
   - Trả về 403 nếu không có quyền

**Flow**:
```
Request → Extract Token → Verify JWT → Get User → Attach to req.user → Next
```

#### error.js
**Mục đích**: Xử lý lỗi tập trung.

**Cách hoạt động**:
1. `errorConverter()`:
   - Convert mọi error thành `ApiError`
   - Xử lý Sequelize errors
   - Set status code phù hợp

2. `errorHandler()`:
   - Format error response
   - Log error với Winston
   - Ẩn stack trace trong production
   - Trả về response với format chuẩn

**Error Response Format**:
```javascript
{
  success: false,
  message: "Thông báo lỗi",
  requestId: "uuid",
  stack: "..." // Chỉ trong development
}
```

#### validate.js
**Mục đích**: Validate request data với Joi schema.

**Cách hoạt động**:
- Nhận Joi schema
- Validate `req.body`, `req.query`, `req.params`
- Trả về 400 nếu không hợp lệ
- Attach validated data vào request

**Ví dụ**:
```javascript
validate(userValidation.createUser)
// Kiểm tra body có đúng schema không
```

#### requestId.js
**Mục đích**: Tạo unique ID cho mỗi request.

**Cách hoạt động**:
- Tạo UUID v4
- Set vào `req.id`
- Thêm vào response header `X-Request-ID`
- Giúp tracking request qua logs

---

### 📁 src/models/

#### user.model.js
**Mục đích**: Định nghĩa User model với Sequelize.

**Cấu trúc Model**:
```javascript
User {
  id: INTEGER (Primary Key, Auto Increment)
  name: STRING (Required)
  email: STRING (Required, Unique, Email format)
  password: STRING (Required, Min 8 chars, Hashed)
  role: ENUM('user', 'admin') (Default: 'user')
  isEmailVerified: BOOLEAN (Default: false)
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

**Hooks**:
- `beforeCreate`: Hash password trước khi tạo
- `beforeUpdate`: Hash password nếu password thay đổi

**Scopes**:
- `defaultScope`: Ẩn password khi query
- `withPassword`: Include password (dùng cho auth)

**Methods**:
- `isPasswordMatch(password)`: So sánh password
- `isEmailTaken(email, excludeId)`: Kiểm tra email đã dùng chưa
- `paginate(filter, options)`: Pagination helper

**Table Name**: `users` (Sequelize tự động chuyển thành số nhiều)

---

### 📁 src/routes/

#### v1/index.js
**Mục đích**: Tổng hợp tất cả routes của API v1.

**Cách hoạt động**:
- Import các route modules
- Mount vào Express app với prefix `/v1`
- Ví dụ: `/v1/auth/*`, `/v1/users/*`

#### v1/auth.route.js
**Endpoints**:
- `POST /v1/auth/register` → `authController.register`
- `POST /v1/auth/login` → `authController.login`
- `POST /v1/auth/logout` → `authController.logout`
- `POST /v1/auth/refresh-tokens` → `authController.refreshTokens`

**Middleware**: Validation cho mỗi endpoint

#### v1/user.route.js
**Endpoints**:
- `GET /v1/users` → `userController.getUsers` (Auth + GetUsers permission)
- `POST /v1/users` → `userController.createUser` (Auth + ManageUsers permission)
- `GET /v1/users/:userId` → `userController.getUser` (Auth)
- `PATCH /v1/users/:userId` → `userController.updateUser` (Auth)
- `DELETE /v1/users/:userId` → `userController.deleteUser` (Auth + ManageUsers permission)

**Middleware**: Authentication + Authorization + Validation

---

### 📁 src/services/

**Mục đích**: Chứa business logic, tách biệt khỏi controllers.

#### user.service.js
**Các functions**:
- `createUser()`: Tạo user, kiểm tra email trùng
- `getUserById()`: Lấy user theo ID
- `getUserByEmail()`: Lấy user theo email (với password scope)
- `queryUsers()`: Lấy danh sách users với pagination
- `updateUserById()`: Cập nhật user
- `deleteUserById()`: Xóa user

**Đặc điểm**:
- Xử lý business rules (email unique, etc.)
- Tương tác với Models
- Throw `ApiError` nếu có lỗi

#### auth.service.js
**Các functions**:
- `loginUserWithEmailAndPassword()`: Xác thực email/password
- `register()`: Đăng ký user mới
- `refreshAuth()`: Làm mới tokens
- `logout()`: Đăng xuất (có thể lưu blacklist tokens)

---

### 📁 src/utils/

#### ApiError.js
**Mục đích**: Custom Error class cho API.

**Properties**:
- `statusCode`: HTTP status code
- `message`: Thông báo lỗi
- `isOperational`: Là lỗi có thể xử lý được không

**Cách sử dụng**:
```javascript
throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
```

#### catchAsync.js
**Mục đích**: Wrapper để bắt lỗi async functions tự động.

**Cách hoạt động**:
- Wrap async function
- Tự động catch errors và pass vào `next()`
- Giúp code gọn hơn, không cần try-catch

**Ví dụ**:
```javascript
// Thay vì:
async (req, res, next) => {
  try {
    const user = await getUser();
    res.send(user);
  } catch (error) {
    next(error);
  }
}

// Có thể viết:
catchAsync(async (req, res) => {
  const user = await getUser();
  res.send(user);
});
```

#### response.js
**Mục đích**: Format response chuẩn.

**Functions**:
- `successResponse()`: Format success response
- `errorResponse()`: Format error response (ít dùng, dùng errorHandler thay thế)

**Format**:
```javascript
{
  success: true,
  message: "Thông báo",
  data: {...},
  meta: {...}  // Pagination, etc.
}
```

#### token.js
**Mục đích**: Tạo và quản lý JWT tokens.

**Functions**:
- `generateToken()`: Tạo JWT token
- `generateAuthTokens()`: Tạo cả access và refresh tokens

**Token Payload**:
```javascript
{
  sub: userId,        // Subject (user ID)
  iat: timestamp,     // Issued at
  exp: timestamp,     // Expiration
  type: 'access'      // Token type
}
```

#### transaction.js
**Mục đích**: Xử lý database transactions.

**Cách hoạt động**:
- Tạo transaction
- Execute callback với transaction
- Commit nếu success
- Rollback nếu error

**Ví dụ**:
```javascript
await runInTransaction(async (transaction) => {
  await User.create({...}, { transaction });
  await Order.create({...}, { transaction });
});
```

---

### 📁 src/validations/

**Mục đích**: Định nghĩa Joi schemas để validate request data.

#### user.validation.js
**Schemas**:
- `createUser`: Validate khi tạo user
- `getUsers`: Validate query params
- `getUser`: Validate userId param
- `updateUser`: Validate khi update
- `deleteUser`: Validate userId param

**Ví dụ Schema**:
```javascript
createUser: {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required(),
    role: Joi.string().valid('user', 'admin')
  })
}
```

#### auth.validation.js
**Schemas**:
- `register`: Validate đăng ký
- `login`: Validate đăng nhập
- `logout`: Validate logout
- `refreshTokens`: Validate refresh token

#### custom.validation.js
**Custom Validators**:
- `objectId`: Validate MongoDB ObjectId hoặc SQL integer ID

---

## Các Tầng (Layers) trong Ứng dụng

### 1. Presentation Layer (Routes + Controllers)
- **Trách nhiệm**: Nhận request, validate, gọi services, trả response
- **Files**: `routes/`, `controllers/`
- **Không chứa**: Business logic, database queries

### 2. Business Logic Layer (Services)
- **Trách nhiệm**: Xử lý business rules, orchestrate operations
- **Files**: `services/`
- **Không chứa**: HTTP concerns, database details

### 3. Data Access Layer (Models)
- **Trách nhiệm**: Tương tác với database, định nghĩa schema
- **Files**: `models/`
- **Không chứa**: Business logic, HTTP logic

### 4. Infrastructure Layer (Config, Utils)
- **Trách nhiệm**: Cấu hình, utilities, cross-cutting concerns
- **Files**: `config/`, `utils/`, `middlewares/`

---

## Sơ đồ Tương tác giữa các Tầng

```
┌─────────────────────────────────────────────────┐
│              HTTP Request                       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Routes Layer                                   │
│  - Định tuyến                                   │
│  - Áp dụng middleware                           │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Middleware Layer                                │
│  - Authentication                               │
│  - Validation                                   │
│  - Error Handling                               │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Controller Layer                                │
│  - Nhận request                                 │
│  - Gọi service                                  │
│  - Format response                              │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Service Layer                                   │
│  - Business logic                               │
│  - Validation rules                             │
│  - Call models                                  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Model Layer                                     │
│  - Database queries                             │
│  - Data transformation                          │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  MySQL Database                                  │
└─────────────────────────────────────────────────┘
```

---

## Best Practices được áp dụng

1. **Separation of Concerns**: Mỗi layer có trách nhiệm riêng
2. **DRY (Don't Repeat Yourself)**: Utils và helpers tái sử dụng
3. **Error Handling**: Centralized error handling
4. **Validation**: Validate ở nhiều tầng (route, service)
5. **Security**: Authentication, authorization, sanitization
6. **Logging**: Structured logging với Winston
7. **Configuration**: Environment-based config
8. **Testing**: Jest setup sẵn

---

## Giải thích về Admin và Version

### 🔐 Admin (Phân quyền)

**Code ở đâu**:
- **Định nghĩa roles**: `src/config/roles.js`
- **Kiểm tra quyền**: `src/middlewares/auth.js`
- **Sử dụng trong routes**: `src/routes/v1/user.route.js`
- **Model User**: `src/models/user.model.js` (field `role`)

#### 1. Định nghĩa Roles (`src/config/roles.js`)

```javascript
const roles = {
  user: [],                           // User thường không có quyền đặc biệt
  admin: ['getUsers', 'manageUsers'], // Admin có quyền quản lý users
};
```

**Giải thích**:
- `user`: Role mặc định, không có quyền đặc biệt
- `admin`: Có 2 quyền:
  - `getUsers`: Xem danh sách users
  - `manageUsers`: Tạo, sửa, xóa users

**Cách thêm quyền mới**:
```javascript
const roles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'manageProducts', 'manageOrders'],
  moderator: ['getUsers', 'manageProducts'], // Thêm role mới
};
```

#### 2. Kiểm tra Quyền (`src/middlewares/auth.js`)

**Function `authorize()`**:
```javascript
const authorize = (...requiredRights) => {
  return async (req, res, next) => {
    // Lấy role của user từ req.user (đã set bởi authenticate)
    const userRole = req.user.role || 'user';

    // Lấy danh sách quyền của role đó từ roles.js
    const userRights = roles[userRole] || [];

    // Kiểm tra user có tất cả quyền cần thiết không
    const hasRequiredRights = requiredRights.every((right) =>
      userRights.includes(right)
    );

    // Nếu không có quyền và không phải admin → 403 Forbidden
    if (!hasRequiredRights && req.user.role !== 'admin') {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
    }

    next(); // Cho phép tiếp tục
  };
};
```

**Cách hoạt động**:
1. User đã được authenticate (có `req.user`)
2. Lấy role của user (user hoặc admin)
3. So sánh quyền của role với quyền yêu cầu
4. Nếu không đủ quyền → trả về 403
5. Nếu đủ quyền → tiếp tục

#### 3. Sử dụng trong Routes (`src/routes/v1/user.route.js`)

**Ví dụ**:
```javascript
// Chỉ admin mới có thể tạo user
router.post('/',
  authenticate,                    // 1. Xác thực user
  authorize('manageUsers'),       // 2. Kiểm tra quyền manageUsers
  validate(userValidation.createUser), // 3. Validate dữ liệu
  userController.createUser       // 4. Xử lý request
);

// Chỉ admin mới có thể xóa user
router.delete('/:userId',
  authenticate,
  authorize('manageUsers'),
  validate(userValidation.deleteUser),
  userController.deleteUser
);
```

**Flow kiểm tra quyền**:
```
Request → authenticate() → req.user = { id, role, ... }
       → authorize('manageUsers') → Kiểm tra role có quyền không
       → Nếu có → Tiếp tục
       → Nếu không → 403 Forbidden
```

#### 4. Model User (`src/models/user.model.js`)

**Field role**:
```javascript
role: {
  type: DataTypes.ENUM('user', 'admin'),
  defaultValue: 'user',  // Mặc định là 'user'
}
```

**Cách set admin**:
- Khi tạo user: `{ role: 'admin' }`
- Hoặc update sau: `user.role = 'admin'`

---

### 📌 Version (API Versioning)

**Code ở đâu**:
- **Định nghĩa version**: `src/routes/v1/` (thư mục `v1`)
- **Mount routes**: `src/app.js` (dòng 86: `app.use('/v1', routes)`)
- **Tổng hợp routes**: `src/routes/v1/index.js`

#### 1. Cấu trúc Version (`src/routes/v1/`)

```
src/routes/
└── v1/                    # API Version 1
    ├── index.js          # Tổng hợp tất cả routes v1
    ├── auth.route.js     # Routes /v1/auth/*
    └── user.route.js     # Routes /v1/users/*
```

**Tại sao dùng version?**
- Cho phép thay đổi API mà không phá vỡ client cũ
- Có thể có nhiều version cùng lúc: `/v1/`, `/v2/`, `/v3/`
- Client có thể chọn version phù hợp

#### 2. Mount Routes (`src/app.js`)

```javascript
// API routes
app.use('/v1', routes);  // Tất cả routes trong routes/v1/ sẽ có prefix /v1
```

**Kết quả**:
- `routes/v1/auth.route.js` → `/v1/auth/register`
- `routes/v1/user.route.js` → `/v1/users`

#### 3. Tổng hợp Routes (`src/routes/v1/index.js`)

```javascript
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',      // → /v1/auth
    route: authRoute,
  },
  {
    path: '/users',     // → /v1/users
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
```

**Cách thêm route mới**:
```javascript
const productRoute = require('./product.route');

const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/users', route: userRoute },
  { path: '/products', route: productRoute }, // Thêm mới
];
```

#### 4. Tạo Version Mới (v2)

**Cấu trúc**:
```
src/routes/
├── v1/
│   ├── index.js
│   ├── auth.route.js
│   └── user.route.js
└── v2/                    # Version 2 mới
    ├── index.js
    ├── auth.route.js
    └── user.route.js
```

**Mount trong `src/app.js`**:
```javascript
const routesV1 = require('./routes/v1');
const routesV2 = require('./routes/v2');

app.use('/v1', routesV1);
app.use('/v2', routesV2);  // Thêm version mới
```

**Kết quả**:
- `/v1/auth/register` → Version 1 (cũ)
- `/v2/auth/register` → Version 2 (mới)

---

## Sơ đồ Tổng hợp: Admin + Version

```
Client Request
    │
    ▼
POST /v1/users
    │
    ▼
┌─────────────────────────────────┐
│  src/app.js                     │
│  app.use('/v1', routes)         │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  src/routes/v1/user.route.js    │
│  router.post('/', ...)          │
└──────────────┬──────────────────┘
               │
               ├─► authenticate()  → Kiểm tra JWT token
               │                    → Set req.user = { id, role: 'admin', ... }
               │
               ├─► authorize('manageUsers')  → Kiểm tra quyền
               │    ├─► Lấy role từ req.user.role = 'admin'
               │    ├─► Lấy quyền từ roles.js: roles['admin'] = ['getUsers', 'manageUsers']
               │    ├─► Kiểm tra 'manageUsers' có trong ['getUsers', 'manageUsers']? → Có
               │    └─► Cho phép tiếp tục
               │
               ├─► validate()     → Validate dữ liệu
               │
               └─► controller     → Xử lý request
```

---

## Kết luận

Kiến trúc này giúp:
- ✅ Dễ maintain và mở rộng
- ✅ Code rõ ràng, dễ đọc
- ✅ Tách biệt concerns
- ✅ Dễ test từng phần
- ✅ Tuân thủ best practices
- ✅ Hỗ trợ phân quyền linh hoạt
- ✅ Hỗ trợ API versioning

Khi cần thêm tính năng mới:
1. Tạo model trong `models/`
2. Tạo service trong `services/`
3. Tạo controller trong `controllers/`
4. Tạo routes trong `routes/v1/` (hoặc version mới)
5. Tạo validation trong `validations/`
6. Thêm quyền vào `config/roles.js` nếu cần

---

**Tác giả**: TAAgnes
**Email**: taagnes3110@gmail.com
**Ngày cập nhật**: 2024

