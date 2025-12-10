const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('./logger');
const { initModels } = require('../models');

let sequelize = null;

/**
 * Connect to PostgreSQL database
 */
const connectDatabase = async () => {
  try {
    const { postgres } = config;
    sequelize = new Sequelize(postgres.database, postgres.username, postgres.password, {
      host: postgres.host,
      port: postgres.port,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true
      },
      dialectOptions:
        config.env === 'production' && postgres.ssl === 'true'
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false
              }
            }
          : {}
    });

    await sequelize.authenticate();
    logger.info('✅ PostgreSQL connected successfully');

    initModels(sequelize);

    if (config.env === 'development') {
      try {
        await sequelize.sync({ alter: true });
      } catch (err) {
        logger.warn(
          '⚠️ Sync failed (alter). This might be due to existing data conflict. Ignoring for now if seeding will fix it.',
          err.message
        );
      }
    }
  } catch (error) {
    logger.error('❌ PostgreSQL connection error:', error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

const getConnection = () => sequelize;

const closeDatabase = async () => {
  try {
    if (sequelize) {
      await sequelize.close();
      logger.info('PostgreSQL connection closed');
    }
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

module.exports = {
  connectDatabase,
  getConnection,
  closeDatabase,
  sequelize
};
