# Tài liệu Hướng dẫn

Thư mục này chứa tất cả các tài liệu hướng dẫn chi tiết về dự án TAAgnes Backend.

## Danh sách Tài liệu

### 📐 [KIEN-TRUC.md](./KIEN-TRUC.md)
**Kiến trúc và Cấu trúc Dự án**

Tài liệu chi tiết về:
- Tổng quan kiến trúc (Layered Architecture)
- Luồng hoạt động của request
- Giải thích từng file và thư mục
- Các tầng (layers) trong ứng dụng
- Giải thích về Admin (phân quyền) và Version (API versioning)
- Sơ đồ tương tác giữa các tầng

**Khi nào đọc**: Khi bạn muốn hiểu rõ cách hoạt động của từng thành phần trong dự án.

---

### 📚 [TAI-LIEU-API.md](./TAI-LIEU-API.md)
**Tài liệu API**

Tài liệu chi tiết về:
- Tất cả các endpoints
- Request/Response format
- Authentication
- Error responses
- Status codes

**Khi nào đọc**: Khi bạn cần tích hợp API hoặc hiểu cách sử dụng các endpoints.

---

### 📝 [NHAT-KY-THAY-DOI.md](./NHAT-KY-THAY-DOI.md)
**Nhật ký Thay đổi**

Ghi lại tất cả các thay đổi đáng chú ý của dự án:
- Các tính năng mới được thêm
- Các lỗi được sửa
- Các thay đổi về bảo mật
- Các cập nhật quan trọng

**Khi nào đọc**: Khi bạn muốn biết lịch sử phát triển của dự án.

---

### 🤝 [HUONG-DAN-DONG-GOP.md](./HUONG-DAN-DONG-GOP.md)
**Hướng dẫn Đóng góp**

Hướng dẫn cho những người muốn đóng góp vào dự án:
- Thiết lập môi trường phát triển
- Phong cách code
- Quy trình commit và pull request
- Quy tắc testing

**Khi nào đọc**: Khi bạn muốn đóng góp code cho dự án.

---

### 🔐 [HUONG-DAN-OAUTH.md](./HUONG-DAN-OAUTH.md)
**Hướng dẫn OAuth - Đăng nhập bằng Google, Facebook, GitHub**

Hướng dẫn chi tiết về:
- Cách cấu hình OAuth với Google, Facebook, GitHub
- Luồng hoạt động của OAuth
- Tích hợp OAuth vào frontend
- Bảo mật và best practices
- Troubleshooting

**Khi nào đọc**: Khi bạn muốn thêm tính năng đăng nhập bằng OAuth vào ứng dụng.

---

### 🚀 [HUONG-DAN-DEPLOY-FREE.md](./HUONG-DAN-DEPLOY-FREE.md)
**Hướng dẫn Deploy FREE 100% - Các Lựa Chọn Thực Sự Miễn Phí**

Hướng dẫn chi tiết về:
- Các platform thực sự FREE 100% (Fly.io, Koyeb)
- Giải pháp email FREE (Resend, SendGrid)
- Giải pháp database FREE (PlanetScale)
- Setup hoàn chỉnh FREE 100%
- Tips & best practices

**Khi nào đọc**: Khi bạn muốn deploy hoàn toàn miễn phí, không tốn tiền.

---

### 💰 [HUONG-DAN-DEPLOY-RAILWAY.md](./HUONG-DAN-DEPLOY-RAILWAY.md)
**Hướng dẫn Deploy Lên Railway ($5/tháng)**

Hướng dẫn chi tiết về:
- Cách deploy lên Railway (Hobby tier $5/tháng)
- Cấu hình MySQL database
- Cấu hình Email API (Resend, SendGrid) - không hỗ trợ SMTP trên Hobby
- Cấu hình OAuth callbacks
- Custom domain
- Troubleshooting

**Khi nào đọc**: Khi bạn sẵn sàng trả $5/tháng cho hosting.

---

### 📁 [HUONG-DAN-CAC-FOLDER.md](./HUONG-DAN-CAC-FOLDER.md)
**Hướng dẫn Các Folder: bin, scripts, logs, tests**

Hướng dẫn chi tiết về:
- Tác dụng của từng folder (bin, scripts, logs, tests)
- Cách viết code trong mỗi folder
- Ví dụ cụ thể cho từng loại file
- Best practices và checklist

**Khi nào đọc**: Khi bạn muốn hiểu rõ cách tổ chức và sử dụng các folder đặc biệt trong dự án.

---

### 🔐 [HUONG-DAN-ADMIN.md](./HUONG-DAN-ADMIN.md)
**Hướng dẫn Viết Code Admin - Phân quyền**

Hướng dẫn chi tiết về:
- Code admin viết ở đâu (roles, middleware, routes, controllers, services)
- Cách định nghĩa roles và quyền
- Cách sử dụng middleware `authenticate` và `authorize`
- Ví dụ hoàn chỉnh tạo feature admin mới
- Best practices và checklist

**Khi nào đọc**: Khi bạn muốn thêm tính năng phân quyền hoặc tạo các chức năng chỉ dành cho admin.

---

## Cách sử dụng

1. **Bắt đầu với dự án**: Đọc [KIEN-TRUC.md](./KIEN-TRUC.md) để hiểu cấu trúc
2. **Sử dụng API**: Đọc [TAI-LIEU-API.md](./TAI-LIEU-API.md) để biết cách gọi API
3. **Thêm OAuth**: Đọc [HUONG-DAN-OAUTH.md](./HUONG-DAN-OAUTH.md) để cấu hình đăng nhập OAuth
4. **Hiểu các folder**: Đọc [HUONG-DAN-CAC-FOLDER.md](./HUONG-DAN-CAC-FOLDER.md) để biết cách sử dụng bin, scripts, logs, tests
5. **Viết code admin**: Đọc [HUONG-DAN-ADMIN.md](./HUONG-DAN-ADMIN.md) để biết cách viết code phân quyền
6. **Deploy FREE 100%**: Đọc [HUONG-DAN-DEPLOY-FREE.md](./HUONG-DAN-DEPLOY-FREE.md) để biết các lựa chọn thực sự miễn phí
7. **Deploy Railway ($5/tháng)**: Đọc [HUONG-DAN-DEPLOY-RAILWAY.md](./HUONG-DAN-DEPLOY-RAILWAY.md) nếu muốn dùng Railway
8. **Đóng góp**: Đọc [HUONG-DAN-DONG-GOP.md](./HUONG-DAN-DONG-GOP.md) để biết quy trình
9. **Theo dõi thay đổi**: Xem [NHAT-KY-THAY-DOI.md](./NHAT-KY-THAY-DOI.md) để biết các cập nhật

---

**Tác giả**: TAAgnes
**Email**: taagnes3110@gmail.com

