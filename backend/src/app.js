const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const helmet = require('helmet');
const httpStatus = require('http-status');
const xss = require('xss-clean');
const passport = require('./config/passport');

const config = require('./config/config');
const logger = require('./config/logger');
const { successHandler, errorHandler } = require('./config/morgan');
const { userRouter } = require('./routes/v1/index');

const app = express();

// Middleware bảo mật
app.use(helmet());
app.use(compression());

// Cấu hình CORS
app.use(cors(config.cors));
app.options('*', cors());

// Xử lý Body Parsing
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

// Xử lý phân tích cú pháp JSON cho các request không có Content-Type phù hợp
app.use((req, res, next) => {
  // Xử lý content type text/plain có thể chứa JSON
  if (req.is('text/plain') && req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      // Nếu phân tích thất bại, tiếp tục với body gốc
    }
  }

  // Xử lý request không có content type có thể chứa JSON
  if (!req.get('Content-Type') && req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      // Nếu phân tích thất bại, tiếp tục với body gốc
    }
  }

  next();
});

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
);

// Làm sạch dữ liệu request (xss)
app.use(xss());

// Logging request
if (config.env !== 'test') {
  app.use(successHandler);
  app.use(errorHandler);
}

// Xác thực (Authentication)
app.use(passport.initialize());
// passport.use('jwt', jwtStrategy); // Enable if JWT strategy is defined in config/passport

// Giới hạn tốc độ request (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/v1/health'
});
app.use('/v1', limiter);

// Endpoint gốc
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Booking App API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Kiểm tra trạng thái hệ thống (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: config.env
  });
});

// Các Routes API
app.use('/api/users', userRouter)

// Xử lý lỗi 404 (Not Found)
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    code: httpStatus.NOT_FOUND,
    message: 'Not found'
  });
});

// Xử lý lỗi chung (Error Handler)
app.use((error, req, res, next) => {
  const statusCode = error.status || error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || httpStatus[statusCode];

  if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
    logger.error('Unhandled error:', error);
  } else {
    logger.warn(`Error ${statusCode}: ${message} - URL: ${req.originalUrl}`);
  }

  res.status(statusCode).json({
    success: false,
    code: statusCode,
    message,
    stack: config.env === 'development' && statusCode === httpStatus.INTERNAL_SERVER_ERROR ? error.stack : undefined
  });
});

module.exports = app;
