# Hướng Dẫn Deploy Lên Railway

Tài liệu này hướng dẫn chi tiết cách deploy dự án TAAgnes Backend lên **Railway**.

## ⚠️ Lưu Ý Quan Trọng Về Pricing

**Railway KHÔNG còn free 100%:**
- ❌ **Không có gói free hoàn toàn**
- 💰 **Gói Hobby**: $5/tháng (bao gồm $5 credit/tháng)
- 💰 **Gói Pro**: $20/tháng (hỗ trợ SMTP)
- ⚠️ Nếu vượt quá $5 credit, sẽ bị tính phí thêm

**Về SMTP:**
- ❌ **Gói Hobby ($5/tháng) KHÔNG hỗ trợ SMTP** (cổng 25, 465, 587 bị chặn)
- ✅ **Chỉ gói Pro ($20/tháng) mới hỗ trợ SMTP**
- ✅ **Tất cả gói đều có thể dùng Email API** (Resend, SendGrid) qua HTTPS

> 💡 **Khuyến nghị**: Nếu cần FREE 100%, xem [HUONG-DAN-DEPLOY-FREE.md](./HUONG-DAN-DEPLOY-FREE.md) để biết các lựa chọn thực sự miễn phí.

## 🎯 Tại Sao Chọn Railway?

✅ **Hobby Tier**: $5/tháng với $5 credit (đủ cho dự án nhỏ)
✅ **Hỗ trợ MySQL**: Có thể tạo MySQL database dễ dàng
✅ **Email API**: Có thể dùng Resend/SendGrid (free tier) qua HTTPS
✅ **Auto Deploy**: Tự động deploy khi push code lên GitHub
✅ **Environment Variables**: Quản lý biến môi trường dễ dàng
✅ **Custom Domain**: Hỗ trợ custom domain

## 📋 Yêu Cầu

- Tài khoản GitHub
- Tài khoản Railway (đăng ký miễn phí tại [railway.app](https://railway.app))
- Tài khoản Gmail (để dùng SMTP miễn phí) HOẶC tài khoản Resend/SendGrid (cho email API)

---

## 🚀 Bước 1: Chuẩn Bị Code

### 1.1. Đảm bảo code đã push lên GitHub

```bash
# Kiểm tra remote
git remote -v

# Nếu chưa có, thêm remote
git remote add origin https://github.com/your-username/your-repo.git

# Push code
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2. Tạo file `railway.json` (tùy chọn)

Tạo file `railway.json` ở root để cấu hình Railway:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🚂 Bước 2: Tạo Project Trên Railway

### 2.1. Đăng nhập Railway

1. Truy cập [railway.app](https://railway.app)
2. Click **"Login"** → Chọn **"Login with GitHub"**
3. Authorize Railway truy cập GitHub

### 2.2. Tạo Project Mới

1. Click **"New Project"**
2. Chọn **"Deploy from GitHub repo"**
3. Chọn repository của bạn
4. Railway sẽ tự động detect và deploy

---

## 🗄️ Bước 3: Tạo MySQL Database

### 3.1. Thêm MySQL Service

1. Trong project, click **"+ New"**
2. Chọn **"Database"** → **"Add MySQL"**
3. Railway sẽ tự động tạo MySQL database

### 3.2. Lấy Thông Tin Kết Nối

1. Click vào MySQL service
2. Vào tab **"Variables"**
3. Copy các biến sau:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_DATABASE`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`

**Lưu ý**: Railway tự động tạo các biến này với prefix `MYSQL_*`

---

## ⚙️ Bước 4: Cấu Hình Environment Variables

### 4.1. Thêm Environment Variables

1. Click vào **Web Service** (service chạy app)
2. Vào tab **"Variables"**
3. Thêm các biến sau:

#### Database (từ MySQL service)
```
MYSQL_HOST=<từ MySQL service>
MYSQL_PORT=<từ MySQL service>
MYSQL_DB=<từ MySQL service>
MYSQL_USER=<từ MySQL service>
MYSQL_PASSWORD=<từ MySQL service>
```

#### Server
```
NODE_ENV=production
PORT=3000
```

#### JWT (⚠️ QUAN TRỌNG - Tạo secret mạnh!)
```
JWT_SECRET=<tạo secret mạnh, ví dụ: openssl rand -base64 32>
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
```

#### CORS
```
CORS_ORIGIN=https://your-frontend-domain.com
# Hoặc nếu chưa có frontend:
CORS_ORIGIN=*
```

#### Logging
```
LOG_LEVEL=info
```

### 4.2. Cấu Hình OAuth Callbacks

Lấy URL của app từ Railway (sẽ có dạng: `https://your-app-name.up.railway.app`)

#### Google OAuth
```
GOOGLE_CLIENT_ID=<từ Google Console>
GOOGLE_CLIENT_SECRET=<từ Google Console>
GOOGLE_CALLBACK_URL=https://your-app-name.up.railway.app/v1/auth/google/callback
```

#### Facebook OAuth
```
FACEBOOK_APP_ID=<từ Facebook Developer>
FACEBOOK_APP_SECRET=<từ Facebook Developer>
FACEBOOK_CALLBACK_URL=https://your-app-name.up.railway.app/v1/auth/facebook/callback
```

#### GitHub OAuth
```
GITHUB_CLIENT_ID=<từ GitHub Settings>
GITHUB_CLIENT_SECRET=<từ GitHub Settings>
GITHUB_CALLBACK_URL=https://your-app-name.up.railway.app/v1/auth/github/callback
```

**Lưu ý**: Cập nhật callback URLs trong Google/Facebook/GitHub console!

---

## 📧 Bước 5: Cấu Hình Email

⚠️ **Lưu ý**: Railway Hobby tier ($5/tháng) **KHÔNG hỗ trợ SMTP**. Bạn phải dùng Email API services.

### Option 1: Resend API (Miễn Phí - 100 emails/ngày) ⭐ Khuyến Nghị

#### 5.1. Đăng Ký Resend

1. Truy cập [resend.com](https://resend.com)
2. Đăng ký tài khoản miễn phí
3. Lấy API key từ dashboard

#### 5.2. Thêm Environment Variables

Thêm vào Railway Variables:

```
RESEND_API_KEY=<api-key-từ-resend>
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Lưu ý**: Nếu dự án chưa có code gửi email, bạn cần thêm sau.

### Option 2: SendGrid API (Miễn Phí - 100 emails/ngày)

#### 5.1. Đăng Ký Resend

1. Truy cập [resend.com](https://resend.com)
2. Đăng ký tài khoản miễn phí
3. Lấy API key từ dashboard

#### 5.2. Thêm Environment Variables

```
RESEND_API_KEY=<api-key-từ-resend>
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Option 3: Gmail SMTP (Chỉ dành cho Pro Tier - $20/tháng)

⚠️ **Chỉ hoạt động với Railway Pro ($20/tháng)** vì Hobby tier không hỗ trợ SMTP.

Nếu bạn đã upgrade lên Pro:

#### 5.1. Tạo App Password cho Gmail

1. Vào [Google Account](https://myaccount.google.com/)
2. **Security** → **2-Step Verification** (bật nếu chưa có)
3. **Security** → **App passwords**
4. Tạo app password mới cho "Mail"
5. Copy password (16 ký tự)

#### 5.2. Thêm Environment Variables

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=<app-password-16-characters>
SMTP_FROM=noreply@yourdomain.com
```

---

## 🔄 Bước 6: Chạy Database Migrations

### 6.1. Thêm Build Command

Railway sẽ tự động chạy migrations nếu bạn thêm vào `package.json`:

```json
{
  "scripts": {
    "start": "node bin/server.js",
    "postinstall": "npm run migrate || true"
  }
}
```

**Lưu ý**: `|| true` để không fail build nếu migration đã chạy.

### 6.2. Hoặc Chạy Manual

1. Vào MySQL service trên Railway
2. Click **"Connect"** → Copy connection string
3. Chạy migration local với connection string đó:

```bash
MYSQL_HOST=<railway-host> \
MYSQL_PORT=<railway-port> \
MYSQL_DB=<railway-db> \
MYSQL_USER=<railway-user> \
MYSQL_PASSWORD=<railway-password> \
npm run migrate
```

---

## 🚀 Bước 7: Deploy

### 7.1. Auto Deploy

Railway sẽ tự động deploy khi bạn push code lên GitHub:

```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

### 7.2. Xem Logs

1. Vào Web Service trên Railway
2. Tab **"Deployments"** → Xem logs
3. Tab **"Metrics"** → Xem CPU, Memory usage

### 7.3. Kiểm Tra App

1. Lấy URL từ Railway (dạng: `https://your-app-name.up.railway.app`)
2. Test endpoint: `https://your-app-name.up.railway.app/health`
3. Nếu thấy response → Deploy thành công! 🎉

---

## 🔒 Bước 8: Cấu Hình Custom Domain (Tùy Chọn)

### 8.1. Thêm Custom Domain

1. Vào Web Service → Tab **"Settings"**
2. Scroll xuống **"Custom Domain"**
3. Thêm domain của bạn
4. Railway sẽ cung cấp DNS records
5. Cập nhật DNS ở domain provider

### 8.2. Cập Nhật OAuth Callbacks

Sau khi có custom domain, cập nhật lại OAuth callback URLs:

```
GOOGLE_CALLBACK_URL=https://yourdomain.com/v1/auth/google/callback
FACEBOOK_CALLBACK_URL=https://yourdomain.com/v1/auth/facebook/callback
GITHUB_CALLBACK_URL=https://yourdomain.com/v1/auth/github/callback
```

---

## 📊 Bước 9: Monitoring & Logs

### 9.1. Xem Logs

- **Real-time logs**: Tab **"Deployments"** → Click vào deployment → Xem logs
- **Metrics**: Tab **"Metrics"** → Xem CPU, Memory, Network

### 9.2. Health Check

Railway tự động health check endpoint `/health`. Nếu fail, Railway sẽ restart service.

---

## 💰 Quản Lý Credit & Pricing

### Hobby Tier ($5/tháng)

- **$5 credit/tháng** (tự động reset mỗi tháng)
- **512MB RAM** cho web service
- **1GB storage** cho database
- **100GB bandwidth/tháng**
- ❌ **KHÔNG hỗ trợ SMTP** (chỉ Pro trở lên)

### Pro Tier ($20/tháng)

- Tất cả tính năng của Hobby
- ✅ **Hỗ trợ SMTP** (cổng 25, 465, 587)
- Nhiều RAM và storage hơn

### Xem Usage

1. Vào **Settings** → **Usage**
2. Xem credit đã dùng
3. Nếu vượt quá $5 credit, sẽ bị tính phí thêm
4. Nếu hết credit, service sẽ tạm dừng (không mất data)

### Tips Tiết Kiệm Credit

- Tắt service khi không dùng (Settings → Pause)
- Optimize code để giảm memory usage
- Dùng database connection pooling
- Cache responses khi có thể
- **Dùng Email API thay vì SMTP** (Resend/SendGrid free tier)

---

## 🐛 Troubleshooting

### Lỗi: Database Connection Failed

**Nguyên nhân**: Environment variables chưa đúng

**Giải pháp**:
1. Kiểm tra MySQL service đã tạo chưa
2. Copy đúng các biến từ MySQL service
3. Đảm bảo format đúng: `MYSQL_HOST`, `MYSQL_PORT`, etc.

### Lỗi: Migration Failed

**Nguyên nhân**: Migration đã chạy hoặc có lỗi

**Giải pháp**:
1. Xem logs trong Railway
2. Chạy migration manual với connection string
3. Kiểm tra database đã có tables chưa

### Lỗi: OAuth Callback Failed

**Nguyên nhân**: Callback URL chưa đúng

**Giải pháp**:
1. Lấy URL chính xác từ Railway
2. Cập nhật callback URLs trong Google/Facebook/GitHub console
3. Đảm bảo format: `https://your-app.up.railway.app/v1/auth/{provider}/callback`

### Lỗi: Out of Memory

**Nguyên nhân**: App dùng quá nhiều RAM

**Giải pháp**:
1. Optimize code
2. Giảm số lượng dependencies
3. Dùng production build (không include dev dependencies)

### Lỗi: Service Sleeping

**Nguyên nhân**: Hết credit hoặc không có traffic

**Giải pháp**:
1. Upgrade plan (nếu cần)
2. Hoặc đợi reset credit tháng sau
3. Service sẽ tự động wake up khi có request

---

## 📝 Checklist Deploy

- [ ] Code đã push lên GitHub
- [ ] Đã tạo Railway account
- [ ] Đã tạo MySQL database trên Railway
- [ ] Đã cấu hình tất cả environment variables
- [ ] Đã cập nhật OAuth callback URLs
- [ ] Đã cấu hình email (SMTP hoặc API)
- [ ] Đã chạy database migrations
- [ ] Đã test `/health` endpoint
- [ ] Đã test các API endpoints
- [ ] Đã test OAuth login
- [ ] Đã cấu hình custom domain (nếu có)

---

## 🔗 Links Hữu Ích

- [Railway Documentation](https://docs.railway.app/)
- [Railway Pricing](https://railway.app/pricing)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com/)

---

## 💡 Tips & Best Practices

1. **Environment Variables**: Luôn dùng Railway Variables, không hardcode
2. **Secrets**: JWT_SECRET phải mạnh và unique
3. **Database**: Backup database định kỳ (Railway có auto backup)
4. **Logs**: Check logs thường xuyên để phát hiện lỗi sớm
5. **Monitoring**: Setup alerts nếu có thể
6. **Testing**: Test kỹ trước khi deploy production
7. **Security**: Luôn dùng HTTPS (Railway tự động cung cấp)

---

**Tác giả**: TAAgnes
**Email**: taagnes3110@gmail.com

---

*Tài liệu này là một phần của TAAgnes Backend Template - Mẫu backend Node.js sẵn sàng cho production với MySQL.*

