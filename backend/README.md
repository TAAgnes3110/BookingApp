# TAAgnes Backend - Node.js/Express API với PostgreSQL và pgAdmin 4

**TAAgnes** - Mẫu backend Node.js sẵn sàng cho production sử dụng PostgreSQL và pgAdmin 4.

Mẫu thiết kế backend với PostgreSQL và pgAdmin 4 của TAAgnes.

## Thông tin liên hệ

- **Email**: taagnes3110@gmail.com
- **Tác giả**: TAAgnes

## Tính năng

- ✅ **Cơ sở dữ liệu PostgreSQL**: Sequelize ORM với PostgreSQL
- ✅ **pgAdmin 4**: Giao diện quản lý database qua web
- ✅ **Xác thực và Phân quyền**: JWT với access/refresh tokens, phân quyền theo vai trò
- ✅ **OAuth Integration**: Đăng nhập bằng Google, Facebook, GitHub (Passport.js)
- ✅ **Xác thực Request**: Joi validation với các validator tùy chỉnh
- ✅ **Xử lý Lỗi**: Xử lý lỗi tập trung với logging đầy đủ
- ✅ **Ghi Log**: Winston với xoay vòng file và structured logging
- ✅ **Bảo mật**: Helmet, giới hạn tốc độ, bảo vệ XSS
- ✅ **Theo dõi Request**: Request ID cho mỗi request để theo dõi
- ✅ **Kiểm tra Sức khỏe**: Health endpoint với trạng thái database
- ✅ **Định dạng Response API**: Chuẩn hóa định dạng response
- ✅ **Xác thực Môi trường**: Xác thực biến môi trường khi khởi động
- ✅ **Giao dịch Database**: Hỗ trợ transactions với Sequelize
- ✅ **Chất lượng Code**: ESLint, Prettier với pre-commit hooks
- ✅ **Kiểm thử**: Jest với báo cáo coverage
- ✅ **Docker**: Hỗ trợ Docker & Docker Compose
- ✅ **Tài liệu**: Tài liệu API và hướng dẫn đóng góp

## Yêu cầu

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 12.0 (hoặc sử dụng Docker)

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd taagnes-backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:
```bash
# Trên Windows (Git Bash)
cp .env.example .env

# Hoặc trên Windows (PowerShell)
Copy-Item .env.example .env

# Trên Linux/Mac
cp .env.example .env
```

4. Cấu hình các biến môi trường trong file `.env`:
   - **PostgreSQL**: Cấu hình thông tin kết nối (host, port, database, user, password)
   - **JWT_SECRET**: Thay đổi thành secret key mạnh (quan trọng cho bảo mật!)
   - **CORS_ORIGIN**: URL của frontend nếu có
   - **LOG_LEVEL**: Mức độ logging (info cho production, debug cho development)

5. Chạy migrations:
```bash
npm run migrate
```

6. Chạy ứng dụng:
```bash
# Development
npm run dev

# Production
npm start
```

## Cấu trúc thư mục

```
TAAgnes-Backend/
├── bin/
│   └── server.js          # Điểm khởi chạy ứng dụng
├── src/
│   ├── config/
│   │   ├── database.js    # Cấu hình kết nối database
│   │   ├── logger.js      # Cấu hình ghi log
│   │   └── roles.js       # Phân quyền theo vai trò
│   ├── controllers/       # Điều khiển các route
│   ├── middlewares/       # Middleware của Express
│   ├── models/           # Model cơ sở dữ liệu
│   ├── routes/           # Định tuyến API
│   ├── services/         # Logic nghiệp vụ
│   ├── utils/            # Các hàm tiện ích
│   ├── validations/      # Schema xác thực request
│   └── app.js            # Thiết lập ứng dụng Express
├── tests/                # File kiểm thử
├── logs/                 # Thư mục lưu log (tự động tạo)
│   ├── error.log         # Log các lỗi
│   └── combined.log      # Log tổng hợp
├── scripts/              # Script tiện ích
│   └── migrate.js        # Script chạy migration
├── docs/                 # Tài liệu hướng dẫn
│   ├── KIEN-TRUC.md      # Tài liệu kiến trúc và cấu trúc
│   ├── TAI-LIEU-API.md   # Tài liệu API
│   ├── HUONG-DAN-OAUTH.md # Hướng dẫn OAuth (Google, Facebook, GitHub)
│   ├── HUONG-DAN-CAC-FOLDER.md # Hướng dẫn các folder (bin, scripts, logs, tests)
│   ├── HUONG-DAN-ADMIN.md # Hướng dẫn viết code admin (phân quyền)
│   ├── HUONG-DAN-DEPLOY-FREE.md # Hướng dẫn deploy FREE 100% (Fly.io, Koyeb)
│   ├── HUONG-DAN-DEPLOY-RAILWAY.md # Hướng dẫn deploy lên Railway ($5/tháng)
│   ├── NHAT-KY-THAY-DOI.md # Nhật ký thay đổi
│   └── HUONG-DAN-DONG-GOP.md # Hướng dẫn đóng góp
├── .env.example          # Mẫu biến môi trường
└── package.json
```

> 📖 **Xem chi tiết**: Đọc file [KIEN-TRUC.md](./docs/KIEN-TRUC.md) để hiểu rõ cách hoạt động của từng file và các tầng trong ứng dụng.

### Thư mục Logs

Thư mục `logs/` được sử dụng để lưu trữ các file log của ứng dụng:

- **`logs/error.log`**: Chỉ lưu các log mức lỗi (error level) - giúp dễ dàng tìm và xử lý lỗi
- **`logs/combined.log`**: Lưu tất cả các log (từ error đến debug) - để theo dõi toàn bộ hoạt động

**Mục đích:**
- Theo dõi lỗi và debug khi phát triển
- Ghi lại tất cả hoạt động của ứng dụng
- Hỗ trợ troubleshooting khi có sự cố
- Phân tích hiệu suất và hành vi ứng dụng

**Lưu ý:**
- Thư mục `logs/` được tự động tạo khi ứng dụng chạy (không cần tạo thủ công)
- Các file log được ghi tự động bởi Winston logger (đã cấu hình sẵn)
- File log có thể phát triển lớn theo thời gian, nên cần xoay vòng log (log rotation) trong production
- Thư mục `logs/` đã được thêm vào `.gitignore` để không commit vào git
- **Trên server free**: Nhiều platform (Railway, Fly.io) tự quản lý logs, bạn có thể xem logs qua dashboard của platform thay vì file local
- **Đã đủ cho development**: Cấu hình hiện tại đủ dùng cho phát triển và test. Để production, có thể thêm `winston-daily-rotate-file` cho log rotation

## API Endpoints

### Kiểm tra Sức khỏe
- `GET /health` - Kiểm tra sức khỏe với trạng thái database

### Xác thực
- `POST /v1/auth/register` - Đăng ký người dùng mới
- `POST /v1/auth/login` - Đăng nhập
- `POST /v1/auth/refresh-tokens` - Làm mới access token
- `POST /v1/auth/logout` - Đăng xuất

### Người dùng (Yêu cầu xác thực)
- `GET /v1/users` - Lấy danh sách người dùng (có phân trang)
- `GET /v1/users/:userId` - Lấy thông tin người dùng
- `PATCH /v1/users/:userId` - Cập nhật người dùng
- `DELETE /v1/users/:userId` - Xóa người dùng (chỉ admin)

Xem [TAI-LIEU-API.md](./docs/TAI-LIEU-API.md) để biết chi tiết về request/response format.

Xem [HUONG-DAN-OAUTH.md](./docs/HUONG-DAN-OAUTH.md) để biết cách cấu hình và sử dụng OAuth (Google, Facebook, GitHub).

Xem [HUONG-DAN-PGADMIN4.md](./docs/HUONG-DAN-PGADMIN4.md) để biết cách sử dụng pgAdmin 4 để quản lý PostgreSQL database.

## Cấu hình

### Biến Môi trường

Sao chép file `.env.example` thành `.env` và cấu hình các giá trị:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` với thông tin của bạn:

#### PostgreSQL Database
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=taagnes_backend
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_SSL=false
```

#### JWT (Quan trọng!)
```env
# ⚠️ THAY ĐỔI JWT_SECRET trong production!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
```

#### CORS
```env
CORS_ORIGIN=http://localhost:3000
```

#### Logging
```env
LOG_LEVEL=info  # error, warn, info, http, verbose, debug, silly
```

> 💡 **Lưu ý**: File `.env` đã được thêm vào `.gitignore`, không bao giờ commit file này vào git!

## Kiểm thử

```bash
# Chạy tất cả các test
npm test

# Chạy test với chế độ theo dõi
npm run test:watch
```

## Kiểm tra Code

```bash
# Kiểm tra linting
npm run lint

# Tự động sửa lỗi linting
npm run lint:fix

# Định dạng code
npm run format
```

## Triển khai (Deployment)

### Triển khai lên Server Miễn phí

### ⚠️ Lưu Ý Quan Trọng Về Free Tier

**Railway KHÔNG còn free 100%:**
- Gói Hobby: **$5/tháng** (có $5 credit nhưng vẫn tính phí)
- Hobby tier **KHÔNG hỗ trợ SMTP** (chỉ Pro $20/tháng mới có)
- Phải dùng Email API (Resend/SendGrid) thay vì SMTP

**Render KHÔNG hỗ trợ SMTP:**
- Free tier chặn cổng SMTP (25, 465, 587)

### 🎯 Các Lựa Chọn Deploy

#### 1. Fly.io (FREE 100%) ⭐ Khuyến Nghị

- ✅ **Hoàn toàn FREE 100%**
- ✅ Hỗ trợ PostgreSQL (dùng Render, Railway, hoặc Supabase free tier)
- ✅ Có thể dùng Email API (Resend/SendGrid free)
- ✅ Custom domain miễn phí

Xem hướng dẫn: [HUONG-DAN-DEPLOY-FREE.md](./docs/HUONG-DAN-DEPLOY-FREE.md)

#### 2. Railway ($5/tháng)

- 💰 Gói Hobby: $5/tháng
- ✅ Hỗ trợ PostgreSQL
- ❌ Không hỗ trợ SMTP (phải dùng Email API)
- ✅ Auto deploy từ GitHub

Xem hướng dẫn: [HUONG-DAN-DEPLOY-RAILWAY.md](./docs/HUONG-DAN-DEPLOY-RAILWAY.md)

### Lưu ý khi Deploy

1. **Database**: Sử dụng PostgreSQL cloud service (Render, Railway, Supabase, hoặc Fly.io)
2. **Environment Variables**: Đảm bảo cấu hình đầy đủ trong dashboard của platform
3. **Port**: Nhiều platform tự động set PORT, cần đọc từ `process.env.PORT`
4. **Logs**: Trên server free, logs thường được quản lý bởi platform, không cần thư mục `logs/` local
5. **Health Check**: Endpoint `/health` có thể được dùng cho monitoring

### Docker

### Sử dụng Docker Compose (khuyến nghị)

```bash
# Khởi động tất cả các dịch vụ (PostgreSQL + pgAdmin 4)
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng tất cả các dịch vụ
docker-compose down
```

#### 📊 Truy cập pgAdmin 4

Sau khi chạy `docker-compose up -d`, bạn có thể truy cập pgAdmin 4 tại:

- **URL**: http://localhost:5050
- **Email**: `admin@example.com`
- **Password**: `admin`

**Kết nối PostgreSQL trong pgAdmin 4:**

1. Đăng nhập vào pgAdmin 4
2. Click chuột phải vào "Servers" → "Register" → "Server"
3. Trong tab "General":
   - **Name**: Backend PostgreSQL
4. Trong tab "Connection":
   - **Host name/address**: `postgres` (khi dùng Docker) hoặc `localhost` (nếu chạy local)
   - **Port**: `5432`
   - **Maintenance database**: `taagnes_backend`
   - **Username**: `postgres`
   - **Password**: `postgres`
5. Click "Save"

Bây giờ bạn có thể quản lý database PostgreSQL qua giao diện web của pgAdmin 4! 🎉

### Sử dụng Docker thủ công

```bash
# Tạo image
docker build -t taagnes-backend .

# Chạy container
docker run -p 3000:3000 --env-file .env taagnes-backend
```

## Thêm Model mới

Tạo file trong `src/models/` và sử dụng Sequelize model. Sau đó chạy:
```bash
npm run migrate
```

## Thực hành Tốt nhất

1. **Bảo mật**: Luôn thay đổi `JWT_SECRET` trong môi trường production
2. **Biến Môi trường**: Không commit file `.env` vào git
3. **Cơ sở dữ liệu**: Sử dụng connection pooling cho production
4. **Ghi Log**: Kiểm tra logs thường xuyên
5. **Kiểm thử**: Viết test cho mọi tính năng mới

## Khắc phục Sự cố

### Lỗi kết nối cơ sở dữ liệu
- Kiểm tra database đã chạy chưa
- Kiểm tra thông tin kết nối trong `.env`
- Kiểm tra cài đặt firewall/mạng

### Lỗi migration (SQL)
- Đảm bảo database đã được tạo
- Kiểm tra quyền của người dùng database
- Xem logs để biết chi tiết lỗi

## Giấy phép

MIT

## Tác giả

**TAAgnes**

- Email: taagnes3110@gmail.com

---

*Đây là mẫu thiết kế backend với PostgreSQL và pgAdmin 4 của TAAgnes.*

