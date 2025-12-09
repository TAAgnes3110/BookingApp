const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const session = require('express-session');
const httpStatus = require('http-status');
const config = require('./config/config');
const logger = require('./config/logger');
const { errorConverter, errorHandler } = require('./middlewares/error');
const requestId = require('./middlewares/requestId');
const passport = require('./config/passport');
const routes = require('./routes/v1');
const { getConnection } = require('./config/database');

const app = express();

// Request ID middleware (must be first)
app.use(requestId);

// Security middleware
app.use(helmet());

// Parse json request body
app.use(express.json({ limit: '10mb' }));

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Session for OAuth (optional, có thể dùng stateless)
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.env === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Sanitize request data
app.use(xss());

// Gzip compression
app.use(compression());

// Enable CORS
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/v1', limiter);

// HTTP request logger
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// Health check
app.get('/health', async (req, res) => {
  try {
    const connection = getConnection();
    let dbStatus = 'disconnected';

    try {
      await connection.authenticate();
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'disconnected';
    }

    const healthStatus = dbStatus === 'connected' ? 'healthy' : 'unhealthy';

    res.status(healthStatus === 'healthy' ? httpStatus.OK : httpStatus.SERVICE_UNAVAILABLE).json({
      status: healthStatus,
      timestamp: new Date().toISOString(),
      database: {
        type: 'postgresql',
        status: dbStatus,
      },
    });
  } catch (error) {
    res.status(httpStatus.SERVICE_UNAVAILABLE).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// API routes
app.use('/v1', routes);

// Send back a 404 error for any unknown api request
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    code: httpStatus.NOT_FOUND,
    message: 'Not found',
  });
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

module.exports = app;

