const fs = require('fs');
const path = require('path');
const { getConnection } = require('../config/database');
const logger = require('../config/logger');

const runMigrations = async () => {
  const sequelize = getConnection();
  if (!sequelize) {
    throw new Error('Database connection not established');
  }

  try {
    const sqlPath = path.join(__dirname, '../../database/omega_schema.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Migration file not found at ${sqlPath}`);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');

    logger.info('Executing database schema migration...');
    await sequelize.query(sql);
    logger.info('✅ Database migration completed successfully.');
  } catch (error) {
    logger.error('❌ Migration error:', error);
    throw error;
  }
};

module.exports = {
  runMigrations
};
