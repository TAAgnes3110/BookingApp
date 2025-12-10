const express = require('express');
const cors = require('cors');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const helmet = require('helmet');
const httpStatus = require('http-status');
const xss = require('xss-clean');
const config = require('./config/config');
const logger = require('./config/logger');
const { successHandler, errorHandler } = require('./config/morgan');
const routes = require('./routes/v1');

const app = express();

// SECURITY MIDDLEWARE
app.use(helmet());
app.use(compression());

// CORS CONFIGURATION
app.use(cors(config.cors));
app.options('*', cors());

// BODY PARSING
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

// Handle JSON parsing for requests without proper Content-Type
app.use((req, res, next) => {
  // Handle text/plain content type that might contain JSON
  if (req.is('text/plain') && req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      // If parsing fails, continue with original body
    }
  }

  // Handle requests with no content type that might contain JSON
  if (!req.get('Content-Type') && req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      // If parsing fails, continue with original body
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

// Sanitize request data
app.use(xss());

// REQUEST LOGGING
if (config.env !== 'test') {
  app.use(successHandler);
  app.use(errorHandler);
}

// AUTHENTICATION
app.use(passport.initialize());
// passport.use('jwt', jwtStrategy); // Enable if JWT strategy is defined in config/passport

// RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/v1/health'
});
app.use('/v1', limiter);

// ROOT ENDPOINT
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Booking App API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: config.env
  });
});

// API ROUTES
app.use('/v1', routes);

// 404 HANDLER
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    code: httpStatus.NOT_FOUND,
    message: 'Not found'
  });
});

// ERROR HANDLER
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);

  let statusCode = error.status || error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  if (!statusCode || typeof statusCode !== 'number') {
    statusCode = 500;
  }

  const message = error.message || httpStatus[statusCode];

  res.status(statusCode).json({
    success: false,
    code: statusCode,
    message,
    stack: config.env === 'development' ? error.stack : undefined
  });
});

module.exports = app;
