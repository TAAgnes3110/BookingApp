const http = require('http');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { connectDatabase } = require('./config/database');

const port = config.port || 3000;
const host = config.host || '0.0.0.0';

let server = null;

const startServer = async () => {
  try {
    await connectDatabase();
    logger.info('✅ Database connected');
    server = http.createServer(app);
    server.listen(port, host, () => {
      const address = server.address();
      const protocol = 'http';
      let actualHost = address.address;

      if (
        actualHost === '::' ||
        actualHost === '0.0.0.0' ||
        actualHost === '::1' ||
        actualHost === '127.0.0.1'
      ) {
        actualHost = 'localhost';
      }

      logger.info(`🚀 Server running at ${protocol}://${actualHost}:${port}`);
      logger.info(`📦 Environment: ${config.env}`);
      logger.info(`⏰ Started at: ${new Date().toISOString()}`);
    });
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${port} is already in use. Please choose a different port.`);
      } else {
        logger.error('❌ Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = (signal) => {
  logger.info(`📴 Received signal ${signal}. Shutting down server...`);

  if (server) {
    server.close((error) => {
      if (error) {
        logger.error('❌ Error shutting down server:', error);
        process.exit(1);
      } else {
        logger.info('✅ Server shut down successfully');
        process.exit(0);
      }
    });
    setTimeout(() => {
      logger.error('Timeout! Force closing server...');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

const handleUnexpectedError = (error, source) => {
  logger.error(`❌ ${source || 'Unexpected error'}:`, {
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...(error.details && { details: error.details })
  });

  setTimeout(() => {
    gracefulShutdown(source || 'UNCAUGHT_EXCEPTION');
  }, 2000);
};
process.on('uncaughtException', (error) => handleUnexpectedError(error, 'UNCAUGHT_EXCEPTION'));
process.on('unhandledRejection', (error) => handleUnexpectedError(error, 'UNHANDLED_REJECTION'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
