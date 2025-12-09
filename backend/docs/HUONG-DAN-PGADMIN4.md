# Hướng dẫn sử dụng pgAdmin 4

Hướng dẫn chi tiết cách sử dụng pgAdmin 4 để quản lý PostgreSQL database.

## 🚀 Khởi động pgAdmin 4

### Với Docker Compose (Khuyến nghị)

```bash
docker-compose up -d
```

pgAdmin 4 sẽ tự động khởi động cùng với PostgreSQL.

### Truy cập pgAdmin 4

- **URL**: http://localhost:5050
- **Email đăng nhập**: `admin@example.com`
- **Mật khẩu**: `admin`

## 🔌 Kết nối PostgreSQL

### Bước 1: Đăng nhập

1. Mở trình duyệt và truy cập http://localhost:5050
2. Nhập email: `admin@example.com`
3. Nhập password: `admin`
4. Click "Login"

### Bước 2: Đăng ký Server

1. Click chuột phải vào **"Servers"** ở panel bên trái
2. Chọn **"Register"** → **"Server"**

### Bước 3: Cấu hình Connection

#### Tab "General"
- **Name**: `Backend PostgreSQL` (hoặc tên bạn muốn)

#### Tab "Connection"
- **Host name/address**:
  - `postgres` (nếu dùng Docker Compose)
  - `localhost` (nếu chạy PostgreSQL local)
- **Port**: `5432`
- **Maintenance database**: `taagnes_backend`
- **Username**: `postgres`
- **Password**: `postgres`
- ✅ **Save password**: Check để lưu mật khẩu

#### Tab "Advanced" (Tùy chọn)
- **DB restriction**: Để trống hoặc nhập `taagnes_backend` để chỉ hiển thị database này

### Bước 4: Lưu

Click nút **"Save"** ở cuối form.

## 📊 Sử dụng pgAdmin 4

### Xem Database

1. Mở rộng **"Servers"** → **"Backend PostgreSQL"** → **"Databases"**
2. Click vào **"taagnes_backend"**
3. Xem các bảng trong **"Schemas"** → **"public"** → **"Tables"**

### Xem Dữ liệu

1. Click chuột phải vào bảng (ví dụ: `users`)
2. Chọn **"View/Edit Data"** → **"All Rows"**
3. Xem và chỉnh sửa dữ liệu trực tiếp

### Chạy Query

1. Click vào **"Tools"** → **"Query Tool"** (hoặc icon SQL ở toolbar)
2. Viết SQL query:
   ```sql
   SELECT * FROM users;
   ```
3. Click **"Execute"** (F5) hoặc **"Execute/Refresh"** (F5)

### Tạo Bảng mới

1. Click chuột phải vào **"Tables"**
2. Chọn **"Create"** → **"Table"**
3. Điền thông tin:
   - **Name**: Tên bảng
   - **Columns**: Thêm các cột
4. Click **"Save"**

### Backup Database

1. Click chuột phải vào database **"taagnes_backend"**
2. Chọn **"Backup"**
3. Chọn file location
4. Click **"Backup"**

### Restore Database

1. Click chuột phải vào database **"taagnes_backend"**
2. Chọn **"Restore"**
3. Chọn file backup
4. Click **"Restore"**

## 🔧 Các Tính năng Hữu ích

### 1. Dashboard

- Xem thống kê database
- Xem kích thước tables
- Xem số lượng connections

### 2. Query Tool

- Viết và chạy SQL queries
- Xem kết quả dạng bảng
- Export kết quả ra CSV/JSON

### 3. ERD Tool (Entity Relationship Diagram)

- Tạo sơ đồ quan hệ giữa các bảng
- Visualize database structure

### 4. Statistics

- Xem thống kê về tables, indexes
- Phân tích hiệu suất

## ⚙️ Cấu hình nâng cao

### Thay đổi Password pgAdmin

Sửa trong `docker-compose.yml`:

```yaml
pgadmin:
  environment:
    PGADMIN_DEFAULT_PASSWORD: your-new-password
```

Sau đó restart:
```bash
docker-compose restart pgadmin
```

### Thay đổi Port

Sửa trong `docker-compose.yml`:

```yaml
pgadmin:
  ports:
    - "8080:80"  # Thay 5050 thành 8080
```

### Kết nối từ xa

Nếu muốn kết nối từ máy khác:

1. Sửa `docker-compose.yml`:
```yaml
pgadmin:
  ports:
    - "0.0.0.0:5050:80"  # Cho phép truy cập từ mọi IP
```

2. Truy cập: `http://your-server-ip:5050`

## 🐛 Troubleshooting

### Không kết nối được PostgreSQL

**Lỗi**: "Unable to connect to server"

**Giải pháp**:
1. Kiểm tra PostgreSQL đã chạy: `docker-compose ps`
2. Sử dụng hostname `postgres` (không phải `localhost`) khi dùng Docker
3. Kiểm tra network: `docker network ls`
4. Kiểm tra firewall

### Quên mật khẩu pgAdmin

**Giải pháp**:
1. Xóa volume: `docker-compose down -v`
2. Khởi động lại: `docker-compose up -d`
3. Mật khẩu sẽ reset về `admin`

### Port 5050 đã được sử dụng

**Giải pháp**:
1. Đổi port trong `docker-compose.yml`
2. Hoặc dừng service đang dùng port 5050

## 📚 Tài liệu Tham khảo

- [pgAdmin 4 Documentation](https://www.pgadmin.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Chúc bạn sử dụng pgAdmin 4 thành công! 🎉**

