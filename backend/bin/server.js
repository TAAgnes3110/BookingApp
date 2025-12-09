const app = require('../src/app');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const { connectDatabase } = require('../src/config/database');

let server;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    server = app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port} (${config.env})`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error('Unexpected error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

startServer();

