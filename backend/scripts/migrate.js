require('dotenv').config();
const { connectDatabase, closeDatabase } = require('../src/config/database');
const { runMigrations } = require('../src/utils/sqlMigration');

const migrate = async () => {
  try {
    await connectDatabase();
    await runMigrations();
    await closeDatabase();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();

