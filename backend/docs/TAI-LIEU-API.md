# Tài liệu API

## URL Cơ sở
```
http://localhost:3000/v1
```

## Xác thực

Tất cả các endpoints yêu cầu xác thực (trừ register và login) cần có header:
```
Authorization: Bearer <access_token>
```

## Các Endpoint

### Xác thực

#### Đăng ký
```http
POST /v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Phản hồi:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "tokens": {
      "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2024-01-01T12:00:00.000Z"
      },
      "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2024-01-31T12:00:00.000Z"
      }
    }
  }
}
```

#### Đăng nhập
```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Phản hồi:** Tương tự như đăng ký

#### Làm mới Token
```http
POST /v1/auth/refresh-tokens
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Đăng xuất
```http
POST /v1/auth/logout
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Người dùng

#### Lấy Tất cả Người dùng
```http
GET /v1/users?page=1&limit=10&sortBy=name:asc
Authorization: Bearer <access_token>
```

**Tham số Query:**
- `page`: Số trang (mặc định: 1)
- `limit`: Số kết quả mỗi trang (mặc định: 10)
- `sortBy`: Trường sắp xếp và thứ tự (ví dụ: `name:asc`, `createdAt:desc`)
- `name`: Lọc theo tên
- `role`: Lọc theo vai trò

**Phản hồi:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalResults": 50
  }
}
```

#### Lấy Người dùng theo ID
```http
GET /v1/users/:userId
Authorization: Bearer <access_token>
```

#### Cập nhật Người dùng
```http
PATCH /v1/users/:userId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### Xóa Người dùng
```http
DELETE /v1/users/:userId
Authorization: Bearer <access_token>
```

## Phản hồi Lỗi

```json
{
  "success": false,
  "message": "Thông báo lỗi",
  "requestId": "uuid-request-id"
}
```

### Mã Trạng thái
- `200` - Thành công
- `201` - Đã tạo
- `400` - Yêu cầu không hợp lệ
- `401` - Chưa xác thực
- `403` - Không có quyền
- `404` - Không tìm thấy
- `500` - Lỗi máy chủ

