const { connectDatabase, closeDatabase } = require('../src/config/database');

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

