const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');

describe('User API', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await User.destroy({ where: {}, truncate: true });
  });

  describe('POST /v1/users', () => {
    test('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const res = await request(app)
        .post('/v1/users')
        .send(userData)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(userData.email);
      expect(res.body.name).toBe(userData.name);
      expect(res.body).not.toHaveProperty('password');
    });
  });
});

