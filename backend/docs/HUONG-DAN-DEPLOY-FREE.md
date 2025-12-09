# Hướng Dẫn Deploy FREE 100% - Các Lựa Chọn Thực Sự Miễn Phí

Tài liệu này giới thiệu các nền tảng deploy **thực sự FREE 100%** cho dự án TAAgnes Backend.

## ⚠️ Lưu Ý Quan Trọng

**Railway KHÔNG còn free 100%:**
- Gói Hobby: $5/tháng (có $5 credit nhưng vẫn tính phí)
- Không hỗ trợ SMTP trên Hobby tier

**Render KHÔNG hỗ trợ SMTP:**
- Free tier không cho phép kết nối SMTP (cổng 25, 465, 587 bị chặn)

---

## 🎯 Các Lựa Chọn FREE 100%

### 1. Fly.io ⭐ Khuyến Nghị

**✅ FREE 100% thực sự:**
- **3 shared-cpu-1x VMs** (256MB RAM mỗi VM)
- **3GB persistent volume storage**
- **160GB outbound data transfer/tháng**
- **Không giới hạn inbound traffic**
- **Hỗ trợ MySQL** (có thể dùng PlanetScale free tier)
- **Hỗ trợ SMTP** (có thể dùng Gmail SMTP hoặc email API)

**Giới hạn:**
- Apps sẽ "sleep" sau 7 ngày không có traffic (wake up khi có request)
- Cần credit card để verify (nhưng không bị charge nếu trong free tier)

**Hướng dẫn deploy:**
Xem [HUONG-DAN-DEPLOY-FLYIO.md](./HUONG-DAN-DEPLOY-FLYIO.md)

---

### 2. Koyeb

**✅ FREE 100% thực sự:**
- **2 services** (web services)
- **512MB RAM** mỗi service
- **Unlimited requests**
- **Auto deploy từ GitHub**
- **Custom domain miễn phí**
- **Hỗ trợ MySQL** (có thể dùng PlanetScale free tier)
- **Hỗ trợ SMTP** (có thể dùng email API)

**Giới hạn:**
- Services sẽ "sleep" sau 7 ngày không có traffic
- Cần credit card để verify (nhưng không bị charge nếu trong free tier)

**Hướng dẫn deploy:**
Xem [HUONG-DAN-DEPLOY-KOYEB.md](./HUONG-DAN-DEPLOY-KOYEB.md)

---

### 3. Cyclic.sh

**✅ FREE 100% thực sự:**
- **Unlimited apps**
- **Serverless functions**
- **Auto deploy từ GitHub**
- **Custom domain miễn phí**
- **Hỗ trợ MySQL** (có thể dùng PlanetScale free tier)

**Giới hạn:**
- Chủ yếu cho serverless (cần điều chỉnh code)
- Không hỗ trợ SMTP trực tiếp (phải dùng email API)

---

## 📧 Giải Pháp Email FREE 100%

Vì hầu hết free tier không hỗ trợ SMTP, bạn nên dùng **Email API services**:

### 1. Resend ⭐ Khuyến Nghị

- ✅ **100 emails/ngày FREE**
- ✅ API hiện đại, dễ tích hợp
- ✅ Documentation tốt
- ✅ Không cần credit card

**Đăng ký**: [resend.com](https://resend.com)

### 2. SendGrid

- ✅ **100 emails/ngày FREE**
- ✅ API mạnh mẽ
- ✅ Analytics chi tiết
- ⚠️ Cần verify email

**Đăng ký**: [sendgrid.com](https://sendgrid.com)

### 3. Mailgun

- ✅ **5,000 emails/tháng FREE** (3 tháng đầu)
- ✅ Sau đó: 1,000 emails/tháng FREE
- ⚠️ Cần verify domain

**Đăng ký**: [mailgun.com](https://mailgun.com)

### 4. Brevo (Sendinblue)

- ✅ **300 emails/ngày FREE**
- ✅ API đơn giản
- ✅ Không cần credit card

**Đăng ký**: [brevo.com](https://brevo.com)

---

## 🗄️ Giải Pháp Database FREE 100%

### 1. PlanetScale ⭐ Khuyến Nghị

- ✅ **1 database FREE**
- ✅ **5GB storage**
- ✅ **1 billion row reads/tháng**
- ✅ **10 million row writes/tháng**
- ✅ MySQL compatible
- ✅ Branching (như Git)

**Đăng ký**: [planetscale.com](https://planetscale.com)

### 2. Aiven

- ✅ **Free tier cho MySQL**
- ✅ **1GB storage**
- ⚠️ Cần credit card để verify

**Đăng ký**: [aiven.io](https://aiven.io)

### 3. Supabase (PostgreSQL)

- ✅ **500MB database**
- ✅ **2GB bandwidth**
- ⚠️ PostgreSQL (không phải MySQL)

**Đăng ký**: [supabase.com](https://supabase.com)

---

## 🎯 Khuyến Nghị Setup FREE 100%

### Setup 1: Fly.io + PlanetScale + Resend ⭐

**Tổng chi phí: $0/tháng**

1. **Hosting**: Fly.io (free tier)
2. **Database**: PlanetScale (free tier)
3. **Email**: Resend (100 emails/ngày free)

**Ưu điểm:**
- ✅ Hoàn toàn free
- ✅ Hỗ trợ SMTP (nếu cần)
- ✅ Performance tốt
- ✅ Custom domain

**Nhược điểm:**
- Apps sleep sau 7 ngày không traffic (wake up khi có request)

### Setup 2: Koyeb + PlanetScale + Resend

**Tổng chi phí: $0/tháng**

1. **Hosting**: Koyeb (free tier)
2. **Database**: PlanetScale (free tier)
3. **Email**: Resend (100 emails/ngày free)

**Ưu điểm:**
- ✅ Hoàn toàn free
- ✅ Auto deploy từ GitHub
- ✅ Custom domain

**Nhược điểm:**
- Services sleep sau 7 ngày không traffic

---

## 📋 Checklist Deploy FREE 100%

- [ ] Chọn hosting platform (Fly.io hoặc Koyeb)
- [ ] Tạo PlanetScale database (free)
- [ ] Đăng ký Resend/SendGrid (free)
- [ ] Cấu hình environment variables
- [ ] Cập nhật OAuth callback URLs
- [ ] Test email sending
- [ ] Test database connection
- [ ] Test API endpoints
- [ ] Setup custom domain (nếu có)

---

## 💡 Tips & Best Practices

1. **Email API thay vì SMTP**: Dùng Resend/SendGrid API thay vì SMTP (dễ hơn và free)
2. **Database**: Dùng PlanetScale free tier (MySQL compatible, tốt hơn local MySQL)
3. **Monitoring**: Setup health checks để biết app có đang chạy không
4. **Logs**: Check logs thường xuyên (free tier thường có giới hạn log retention)
5. **Backup**: Backup database định kỳ (PlanetScale có auto backup)
6. **Sleep Mode**: Nếu app sleep, request đầu tiên sẽ mất vài giây để wake up

---

## 🔗 Links Hữu Ích

- [Fly.io Pricing](https://fly.io/docs/about/pricing/)
- [Koyeb Pricing](https://www.koyeb.com/pricing)
- [PlanetScale Pricing](https://planetscale.com/pricing)
- [Resend Pricing](https://resend.com/pricing)
- [SendGrid Pricing](https://sendgrid.com/pricing/)

---

## ⚠️ Lưu Ý Quan Trọng

1. **Credit Card**: Một số platform yêu cầu credit card để verify nhưng **KHÔNG bị charge** nếu trong free tier
2. **Sleep Mode**: Apps trên free tier thường sleep sau vài ngày không traffic
3. **Limits**: Luôn check limits của free tier để tránh bị charge
4. **Email**: Hầu hết free tier không hỗ trợ SMTP, phải dùng Email API
5. **Database**: Dùng managed database (PlanetScale) tốt hơn tự host

---

**Tác giả**: TAAgnes
**Email**: taagnes3110@gmail.com

---

*Tài liệu này là một phần của TAAgnes Backend Template - Mẫu backend Node.js sẵn sàng cho production với MySQL.*

