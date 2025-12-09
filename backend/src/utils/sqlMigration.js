/**
 * PostgreSQL Migration helper
 * Run this script to create tables for PostgreSQL
 */
const { sequelize } = require('../config/database');

const runMigrations = async () => {
  try {
    // Import models to register them
    require('../models/user.model')(sequelize);

    // Sync database (create tables)
    await sequelize.sync({ force: false, alter: true });
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };

