# BookingApp - Hệ thống Đặt phòng & Dịch vụ Du lịch

BookingApp là một nền tảng web toàn diện cho phép người dùng tìm kiếm và đặt phòng khách sạn, tour du lịch, và các dịch vụ spa. Hệ thống hỗ trợ nhiều vai trò người dùng (Admin, Host, Guest) và tích hợp các tính năng quản lý mạnh mẽ.

## 🚀 Công nghệ Sử dụng

### Frontend
*   **React JS** (Vite): Framework chính để xây dựng giao diện người dùng.
*   **Tailwind CSS**: Framework CSS utility-first cho thiết kế nhanh chóng và hiện đại.
*   **Lucide React**: Thư viện icon nhẹ và đẹp mắt.
*   **React Router DOM**: Quản lý điều hướng trang.
*   **Axios**: Client HTTP để giao tiếp với Backend.
*   **Framer Motion**: Thư viện cho các hiệu ứng chuyển động mượt mà.

### Backend
*   **Node.js & Express**: Máy chủ và API RESTful.
*   **PostgreSQL**: Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ.
*   **Sequelize ORM**: Tương tác với cơ sở dữ liệu thông qua Code.
*   **JWT (JSON Web Token)**: Xác thực và bảo mật người dùng.
*   **Firebase Admin**: Hỗ trợ xác thực xã hội và các dịch vụ nền tảng Google.
*   **Nodemailer**: Gửi email thông báo (xác thực, đặt phòng...).

## 🛠️ Yêu cầu Hệ thống

*   **Node.js**: v14.0.0 trở lên.
*   **npm** hoặc **yarn**: Trình quản lý gói.
*   **PostgreSQL**: Đã cài đặt và đang chạy server database.

## 📦 Cài đặt & Chạy Dự án

### 1. Thiết lập Backend

Di chuyển vào thư mục backend:
```bash
cd backend
```

Cài đặt các thư viện phụ thuộc:
```bash
npm install
```

**Cấu hình biến môi trường:**
*   Sao chép file `.env.example` thành `.env`:
    ```bash
    cp .env.example .env
    ```
*   Mở file `.env` và cập nhật thông tin:
    *   `POSTGRES_USER`, `POSTGRES_PASSWORD`: Thông tin đăng nhập PostgreSQL của bạn.
    *   `POSTGRES_DB`: Tên database (mặc định là `BookingApp`).
    *   Các cấu hình JWT, Email, Firebase, OAuth nếu cần thiết.

**Khởi tạo Cơ sở dữ liệu:**
Dự án có sẵn các script để tự động tạo và seed dữ liệu mẫu.
```bash
# Tạo database và bảng
npm run db:create

# (Tùy chọn) Reset và seed lại dữ liệu mẫu Omega
npm run db:reset
```

Chạy server backend:
```bash
npm run dev
```
*Backend sẽ chạy tại: `http://localhost:3000`*

### 2. Thiết lập Frontend

Mở một terminal mới và di chuyển vào thư mục frontend:
```bash
cd frontend
```

Cài đặt các thư viện phụ thuộc:
```bash
npm install
```

Chạy server frontend:
```bash
npm run dev
```
*Frontend sẽ chạy tại: `http://localhost:5173`*

## 🌟 Tính năng Chính

### Người dùng (Guest)
*   **Tìm kiếm & Lọc**: Tìm kiếm khách sạn/tour theo địa điểm, giá, tiện ích.
*   **Đặt phòng/Dịch vụ**: Xem chi tiết, chọn ngày (lịch trống), và đặt dịch vụ.
*   **Thanh toán**: Tích hợp cổng thanh toán (VNPay mockup) và quản lý lịch sử giao dịch.
*   **Tài khoản**: Đăng ký/Đăng nhập (Email, Google, Facebook), Quản lý hồ sơ, Đổi mật khẩu.

### Host (Chủ dịch vụ)
*   Đăng ký và quản lý các Property/Service của mình (đang phát triển).

### Admin (Quản trị viên)
*   **Dashboard**: Xem thống kê tổng quan (User, Doanh thu, Booking).
*   **Quản lý Users**: Xem, tìm kiếm, và quản lý người dùng (Ban/Active).
*   **Quản lý Services**: Duyệt, chỉnh sửa dịch vụ; **Quản lý phòng** (trạng thái phòng trống/bảo trì).
*   **Quản lý Giao dịch**: Theo dõi dòng tiền và trạng thái thanh toán.

## 📁 Cấu trúc Thư mục

```
BookingApp/
├── backend/                # Source code Backend
│   ├── src/
│   │   ├── config/         # Cấu hình DB, môt trường
│   │   ├── controllers/    # Logic xử lý request
│   │   ├── database/       # File SQL schema & seed
│   │   ├── middleware/     # Auth, Validation middleware
│   │   ├── models/         # Sequelize Models
│   │   ├── routes/         # Định nghĩa API routes
│   │   └── services/       # Business logic layer
│   └── ...
├── frontend/               # Source code Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (Auth, Cart...)
│   │   ├── pages/          # Các trang chính (Home, Profile, Admin...)
│   │   ├── services/       # API calling functions
│   │   └── ...
│   └── ...
└── README.md               # Tài liệu dự án
```

## 📝 Ghi chú

*   Dữ liệu hiện tại trên Frontend đang sử dụng kết hợp giữa Mock Data và API thực tế (đang trong quá trình chuyển đổi hoàn toàn sang API).
*   Để trải nghiệm đầy đủ tính năng Admin, hãy đăng nhập với tài khoản có role `super_admin` (hoặc sửa trong Database).

---
*Dự án được phát triển bởi Team.*
