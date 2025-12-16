const fs = require('fs');
const path = require('path');
const { connectDatabase, getConnection, closeDatabase } = require('../src/config/database');

const runSqlFile = async (sequelize, filePath) => {
  console.log(`Executing ${path.basename(filePath)}...`);
  const sql = fs.readFileSync(filePath, 'utf8');
  try {
    await sequelize.query(sql);
    console.log(`✅ Successfully executed ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error executing ${path.basename(filePath)}:`, error);
    process.exit(1);
  }
};

const resetDatabase = async () => {
  try {
    // 1. Connect to Database (Initializes the sequelize instance)
    await connectDatabase();
    const sequelize = getConnection();

    if (!sequelize) {
      throw new Error('Sequelize instance not initialized');
    }

    // 2. Define paths to SQL files
    const schemaPath = path.join(__dirname, '../database/omega_schema.sql');
    const seedPath = path.join(__dirname, '../database/omega_seed_data.sql');

    // 3. Execute Schema (Drops and Recreates Tables)
    await runSqlFile(sequelize, schemaPath);

    // 4. Execute Seed Data (Populates Tables)
    await runSqlFile(sequelize, seedPath);

    console.log('🎉 Database reset and seeded successfully!');

    // 5. Close Connection
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
};

resetDatabase();
