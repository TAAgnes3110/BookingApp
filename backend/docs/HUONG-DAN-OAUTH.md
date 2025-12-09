# Hướng Dẫn OAuth - Đăng Nhập Bằng Google, Facebook, GitHub

## Tổng Quan

Dự án này hỗ trợ đăng nhập OAuth với 3 nhà cung cấp phổ biến:
- **Google OAuth 2.0**
- **Facebook Login**
- **GitHub OAuth**

OAuth cho phép người dùng đăng nhập vào ứng dụng của bạn mà không cần tạo tài khoản mới, sử dụng tài khoản từ các nhà cung cấp bên thứ ba.

## Kiến Trúc OAuth

### Luồng Hoạt Động

```
1. User click "Đăng nhập bằng Google/Facebook/GitHub"
   ↓
2. Frontend redirect đến: GET /v1/auth/google (hoặc facebook/github)
   ↓
3. Passport redirect user đến OAuth Provider (Google/Facebook/GitHub)
   ↓
4. User xác thực tại OAuth Provider
   ↓
5. OAuth Provider redirect về: GET /v1/auth/google/callback
   ↓
6. Passport xử lý callback, tạo/cập nhật user trong database
   ↓
7. Backend redirect về Frontend với access_token và refresh_token
   ↓
8. Frontend lưu tokens và đăng nhập user
```

### Sơ Đồ Kiến Trúc

```
┌─────────────┐
│   Frontend  │
│  (React/    │
│   Vue/etc)  │
└──────┬──────┘
       │ 1. Click "Login with Google"
       │
       ▼
┌─────────────────────────────────────┐
│         Backend API                  │
│  ┌───────────────────────────────┐  │
│  │  GET /v1/auth/google           │  │
│  │  → passport.authenticate()     │  │
│  └───────────────────────────────┘  │
└──────┬──────────────────────────────┘
       │ 2. Redirect
       ▼
┌─────────────────────────────────────┐
│      Google OAuth Server              │
│  - User xác thực                     │
│  - User cấp quyền                    │
└──────┬──────────────────────────────┘
       │ 3. Callback với code
       ▼
┌─────────────────────────────────────┐
│         Backend API                  │
│  ┌───────────────────────────────┐  │
│  │  GET /v1/auth/google/callback  │  │
│  │  → passport.authenticate()     │  │
│  │  → oauthController.oauthCallback│ │
│  │  → Tạo/Cập nhật User          │  │
│  │  → Generate JWT tokens         │  │
│  └───────────────────────────────┘  │
└──────┬──────────────────────────────┘
       │ 4. Redirect với tokens
       ▼
┌─────────────┐
│   Frontend  │
│  - Lưu tokens│
│  - Đăng nhập │
└─────────────┘
```

## Cấu Hình

### 1. Cấu Hình Environment Variables

Thêm các biến môi trường vào file `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/v1/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/v1/auth/facebook/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/v1/auth/github/callback

# Frontend URL (cho redirect sau khi OAuth thành công)
FRONTEND_URL=http://localhost:3000
```

### 2. Lấy OAuth Credentials

#### Google OAuth

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Chọn **Web application**
6. Thêm **Authorized redirect URIs**: `http://localhost:3000/v1/auth/google/callback`
7. Copy **Client ID** và **Client Secret** vào `.env`

**Lưu ý**: Trong production, thay `localhost:3000` bằng domain thực tế của bạn.

#### Facebook OAuth

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Tạo **App** mới
3. Vào **Settings** → **Basic**
4. Thêm **App Domains** và **Website Site URL**
5. Vào **Products** → **Facebook Login** → **Settings**
6. Thêm **Valid OAuth Redirect URIs**: `http://localhost:3000/v1/auth/facebook/callback`
7. Copy **App ID** và **App Secret** vào `.env`

#### GitHub OAuth

1. Truy cập [GitHub Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Điền thông tin:
   - **Application name**: Tên ứng dụng của bạn
   - **Homepage URL**: URL trang chủ
   - **Authorization callback URL**: `http://localhost:3000/v1/auth/github/callback`
4. Click **Register application**
5. Copy **Client ID** và **Client Secret** vào `.env`

## Cấu Trúc Code

### 1. Passport Configuration (`src/config/passport.js`)

File này định nghĩa các Passport strategies cho từng OAuth provider:

```javascript
// Google Strategy
passport.use(new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackURL,
}, async (accessToken, refreshToken, profile, done) => {
  // Xử lý profile từ Google
  // Tạo hoặc cập nhật user trong database
  // Return user
}));
```

**Chức năng**:
- Định nghĩa cách xác thực với từng OAuth provider
- Xử lý profile data từ provider
- Tạo user mới hoặc cập nhật user hiện có
- Lưu `provider`, `providerId`, `avatar` vào database

### 2. OAuth Routes (`src/routes/v1/auth.route.js`)

```javascript
// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), oauthController.oauthCallback);
router.get('/google/callback/json', passport.authenticate('google', { session: false }), oauthController.oauthCallbackJson);
```

**Endpoints**:
- `GET /v1/auth/google` - Bắt đầu OAuth flow với Google
- `GET /v1/auth/google/callback` - Callback từ Google (redirect về frontend)
- `GET /v1/auth/google/callback/json` - Callback từ Google (trả về JSON, dùng cho mobile apps)

Tương tự cho Facebook và GitHub.

### 3. OAuth Controller (`src/controllers/oauth.controller.js`)

```javascript
const oauthCallback = catchAsync(async (req, res) => {
  const { user } = req; // User từ Passport
  const result = await handleOAuthCallback(user);

  // Redirect về frontend với tokens
  const redirectUrl = `${frontendUrl}/auth/callback?access_token=...&refresh_token=...`;
  res.redirect(redirectUrl);
});
```

**Chức năng**:
- Nhận user từ Passport sau khi OAuth thành công
- Tạo JWT tokens cho user
- Redirect về frontend với tokens (hoặc trả về JSON cho mobile)

### 4. OAuth Service (`src/services/oauth.service.js`)

```javascript
const handleOAuthCallback = async (user) => {
  const tokens = await generateAuthTokens(user);
  return { user, tokens };
};
```

**Chức năng**:
- Tạo access token và refresh token cho user
- Trả về user và tokens

### 5. User Model Updates (`src/models/user.model.js`)

User model đã được cập nhật để hỗ trợ OAuth:

```javascript
{
  provider: {
    type: DataTypes.ENUM('local', 'google', 'facebook', 'github'),
    defaultValue: 'local',
  },
  providerId: {
    type: DataTypes.STRING,
    allowNull: true, // ID từ OAuth provider
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true, // URL avatar từ OAuth provider
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // OAuth users không cần password
  },
}
```

**Các trường mới**:
- `provider`: Nhà cung cấp OAuth ('local', 'google', 'facebook', 'github')
- `providerId`: ID của user từ OAuth provider
- `avatar`: URL avatar từ OAuth provider
- `password`: Cho phép null cho OAuth users

## Sử Dụng

### Frontend Integration

#### 1. Redirect đến OAuth Endpoint

```javascript
// React/Vue/etc
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:3000/v1/auth/google';
};

const handleFacebookLogin = () => {
  window.location.href = 'http://localhost:3000/v1/auth/facebook';
};

const handleGithubLogin = () => {
  window.location.href = 'http://localhost:3000/v1/auth/github';
};
```

#### 2. Xử Lý Callback

Tạo một page callback trong frontend (ví dụ: `/auth/callback`):

```javascript
// React Router example
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // Lưu tokens vào localStorage hoặc state management
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Redirect về trang chủ hoặc dashboard
      navigate('/dashboard');
    } else {
      // Xử lý lỗi
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate]);

  return <div>Đang xử lý đăng nhập...</div>;
}
```

#### 3. Sử Dụng Tokens

Sau khi có tokens, sử dụng như authentication thông thường:

```javascript
// Axios example
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/v1',
});

// Thêm access token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/v1/auth/refresh-tokens', {
        refreshToken,
      });
      localStorage.setItem('accessToken', response.data.data.tokens.access.token);
      // Retry request
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Mobile App Integration

Cho mobile apps, sử dụng endpoint `/callback/json` thay vì `/callback`:

```javascript
// React Native example
import { Linking } from 'react-native';

const handleGoogleLogin = async () => {
  const url = 'http://localhost:3000/v1/auth/google';
  // Mở browser để user xác thực
  await Linking.openURL(url);
};

// Xử lý deep link callback
const handleCallback = async (url) => {
  if (url.includes('/auth/callback')) {
    const params = new URLSearchParams(url.split('?')[1]);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    // Lưu tokens
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
  }
};
```

Hoặc sử dụng endpoint JSON:

```javascript
// Fetch JSON response
const response = await fetch('http://localhost:3000/v1/auth/google/callback/json');
const data = await response.json();
// data = { success: true, message: "...", data: { user: {...}, tokens: {...} } }
```

## Database Migration

Sau khi cập nhật User model, cần chạy migration:

```bash
npm run migrate
```

Hoặc nếu đã có dữ liệu, tạo migration thủ công:

```sql
ALTER TABLE users
ADD COLUMN provider ENUM('local', 'google', 'facebook', 'github') DEFAULT 'local',
ADD COLUMN provider_id VARCHAR(255) NULL,
ADD COLUMN avatar VARCHAR(255) NULL;

ALTER TABLE users
MODIFY COLUMN password VARCHAR(255) NULL;
```

## Bảo Mật

### 1. HTTPS trong Production

Luôn sử dụng HTTPS trong production. Cập nhật callback URLs:

```env
GOOGLE_CALLBACK_URL=https://yourdomain.com/v1/auth/google/callback
FACEBOOK_CALLBACK_URL=https://yourdomain.com/v1/auth/facebook/callback
GITHUB_CALLBACK_URL=https://yourdomain.com/v1/auth/github/callback
FRONTEND_URL=https://yourdomain.com
```

### 2. Session Security

Session được cấu hình với `secure: true` trong production:

```javascript
cookie: {
  secure: config.env === 'production', // Chỉ gửi qua HTTPS
  httpOnly: true, // Không cho JavaScript truy cập
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
}
```

### 3. Validate OAuth State (Optional)

Để tăng cường bảo mật, có thể thêm state parameter để chống CSRF:

```javascript
// Trong passport strategy
passport.use(new GoogleStrategy({
  // ...
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  // Validate state từ req.query.state
  // ...
}));
```

## Testing

### Test OAuth Flow

1. **Start server**:
   ```bash
   npm run dev
   ```

2. **Test Google OAuth**:
   - Truy cập: `http://localhost:3000/v1/auth/google`
   - Đăng nhập với Google account
   - Kiểm tra redirect về frontend với tokens

3. **Test với Postman/Thunder Client**:
   - Sử dụng endpoint `/callback/json` để nhận JSON response
   - Kiểm tra user được tạo trong database

### Test Database

```sql
-- Kiểm tra user OAuth
SELECT id, name, email, provider, provider_id, avatar, created_at
FROM users
WHERE provider != 'local';
```

## Troubleshooting

### Lỗi: "Invalid redirect URI"

**Nguyên nhân**: Callback URL không khớp với cấu hình trong OAuth provider.

**Giải pháp**:
- Kiểm tra callback URL trong `.env` khớp với cấu hình trong Google/Facebook/GitHub
- Đảm bảo URL chính xác (bao gồm http/https, port, path)

### Lỗi: "Email already taken"

**Nguyên nhân**: Email đã được sử dụng bởi user khác (local hoặc OAuth khác).

**Giải pháp**:
- Code đã tự động xử lý: nếu user đã tồn tại với email, sẽ cập nhật thông tin OAuth
- Nếu muốn liên kết nhiều providers với cùng email, cần logic phức tạp hơn

### Lỗi: "OAuth authentication failed"

**Nguyên nhân**: OAuth provider từ chối xác thực hoặc thiếu permissions.

**Giải pháp**:
- Kiểm tra OAuth credentials (Client ID, Client Secret)
- Kiểm tra scopes được yêu cầu
- Kiểm tra app status trong OAuth provider dashboard

## Tài Liệu Tham Khảo

- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/)
- [GitHub OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)

## Tác Giả

**TAAgnes** - taagnes3110@gmail.com

---

*Tài liệu này là một phần của TAAgnes Backend Template - Mẫu backend Node.js sẵn sàng cho production với MySQL.*

