const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const { connectDatabase, getConnection } = require('../src/config/database');
const logger = require('../src/config/logger');

const seed = async () => {
  try {
    await connectDatabase();
    const sequelize = getConnection();
    const { User, Role } = sequelize.models;

    logger.info('Cleaning up existing data...');
    logger.info('Syncing database (force)...');
    await sequelize.sync({ force: true });

    logger.info('Creating roles...');
    const userRole = await Role.create({
      name: 'User',
      description: 'Regular user',
      permissions: { canBook: true }
    });

    const adminRole = await Role.create({
      name: 'Admin',
      description: 'Administrator',
      permissions: { manageAll: true }
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    logger.info('Creating default admin...');
    await User.create({
      firstName: 'Admin',
      lastName: 'System',
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: adminRole.id,
      isEmailVerified: true,
      isPhoneVerified: true,
      status: 'active',
      bio: 'System Administrator',
      provider: 'local'
    });

    logger.info('Creating default user...');
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: hashedPassword,
      roleId: userRole.id,
      isEmailVerified: true,
      isPhoneVerified: true,
      status: 'active',
      bio: 'Regular User',
      provider: 'local'
    });

    logger.info('Creating random users...');
    const randomUsers = [];
    for (let i = 0; i < 10; i += 1) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();
      const username =
        faker.internet
          .username({ firstName, lastName })
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '') + i;

      randomUsers.push({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        roleId: userRole.id,
        isEmailVerified: Math.random() > 0.5,
        status: Math.random() > 0.8 ? 'inactive' : 'active',
        bio: faker.person.bio(),
        provider: 'local'
      });
    }

    await User.bulkCreate(randomUsers);

    logger.info('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
