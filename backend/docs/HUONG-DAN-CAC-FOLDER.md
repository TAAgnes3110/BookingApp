# Hướng Dẫn Các Folder: bin, scripts, logs, tests

Tài liệu này giải thích chi tiết về các folder đặc biệt trong dự án và cách sử dụng chúng khi phát triển.

## 📁 Tổng Quan

Dự án có 4 folder đặc biệt với mục đích riêng:

```
├── bin/          # Entry point - Khởi động server
├── scripts/      # Scripts tiện ích (migration, seed, backup, etc.)
├── logs/         # Thư mục lưu log files (tự động tạo)
└── tests/        # Test files (unit tests, integration tests)
```

---

## 🚀 Folder `bin/` - Entry Point

### Tác Dụng

Folder `bin/` chứa các file **entry point** - điểm khởi đầu của ứng dụng. Đây là nơi khởi động server và xử lý các sự kiện hệ thống.

### File Hiện Tại

- **`bin/server.js`**: File khởi động server chính

### Cách Hoạt Động

```javascript
// bin/server.js
const app = require('../src/app');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const { connectDatabase } = require('../src/config/database');

let server;

const startServer = async () => {
  try {
    // 1. Kết nối database
    await connectDatabase();

    // 2. Khởi động server
    server = app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Xử lý lỗi và tắt server gracefully
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  if (server) server.close();
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received - shutting down gracefully');
  if (server) server.close();
});

startServer();
```

### Khi Nào Cần Thêm File Vào `bin/`

1. **Worker processes**: Nếu bạn có background workers
   ```javascript
   // bin/worker.js
   const { processQueue } = require('../src/workers/queue');
   processQueue();
   ```

2. **Cron jobs**: Nếu bạn có scheduled tasks
   ```javascript
   // bin/cron.js
   const cron = require('node-cron');
   const { cleanupOldData } = require('../src/jobs/cleanup');

   cron.schedule('0 0 * * *', cleanupOldData); // Chạy mỗi ngày lúc 00:00
   ```

3. **CLI tools**: Nếu bạn có command-line tools
   ```javascript
   // bin/cli.js
   const { Command } = require('commander');
   const program = new Command();

   program
     .command('seed')
     .description('Seed database with sample data')
     .action(() => {
       require('../scripts/seed')();
     });

   program.parse();
   ```

### Best Practices

- ✅ Chỉ chứa entry points, không chứa business logic
- ✅ Xử lý graceful shutdown (đóng kết nối DB, đóng server)
- ✅ Xử lý các signals (SIGTERM, SIGINT)
- ✅ Logging đầy đủ khi khởi động và tắt

---

## 🛠️ Folder `scripts/` - Utility Scripts

### Tác Dụng

Folder `scripts/` chứa các **script tiện ích** chạy độc lập, không phải là phần của ứng dụng chính. Thường được chạy từ command line hoặc cron jobs.

### File Hiện Tại

- **`scripts/migrate.js`**: Script chạy database migrations

### Cách Hoạt Động

```javascript
// scripts/migrate.js
require('dotenv').config();
const { connectDatabase, closeDatabase } = require('../src/config/database');
const { runMigrations } = require('../src/utils/sqlMigration');

const migrate = async () => {
  try {
    console.log('Starting migration...');
    await connectDatabase();
    await runMigrations();
    console.log('Migration completed successfully');
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
```

### Các Script Thường Gặp

#### 1. **Seed Database** - Tạo dữ liệu mẫu

```javascript
// scripts/seed.js
require('dotenv').config();
const { connectDatabase, closeDatabase } = require('../src/config/database');
const { User } = require('../src/models');

const seed = async () => {
  try {
    await connectDatabase();

    // Tạo admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123456',
      role: 'admin',
      isEmailVerified: true,
    });

    console.log('Admin user created:', admin.email);

    // Tạo sample users
    const users = await User.bulkCreate([
      { name: 'User 1', email: 'user1@example.com', password: 'user123456' },
      { name: 'User 2', email: 'user2@example.com', password: 'user123456' },
    ]);

    console.log(`Created ${users.length} sample users`);

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
```

**Sử dụng:**
```bash
node scripts/seed.js
```

#### 2. **Backup Database** - Sao lưu database

```javascript
// scripts/backup.js
require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const config = require('../src/config/config');

const backup = () => {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupDir = path.join(__dirname, '../backups');
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

  // Tạo thư mục backups nếu chưa có
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const command = `mysqldump -h ${config.mysql.host} -u ${config.mysql.user} -p${config.mysql.password} ${config.mysql.database} > ${backupFile}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Backup failed:', error);
      process.exit(1);
    }
    console.log(`Backup created: ${backupFile}`);
    process.exit(0);
  });
};

backup();
```

**Sử dụng:**
```bash
node scripts/backup.js
```

#### 3. **Cleanup Old Data** - Dọn dẹp dữ liệu cũ

```javascript
// scripts/cleanup.js
require('dotenv').config();
const { connectDatabase, closeDatabase } = require('../src/config/database');
const { Op } = require('sequelize');
const { RefreshToken } = require('../src/models'); // Giả sử có model này

const cleanup = async () => {
  try {
    await connectDatabase();

    // Xóa refresh tokens hết hạn (30 ngày trước)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleted = await RefreshToken.destroy({
      where: {
        expiresAt: {
          [Op.lt]: thirtyDaysAgo,
        },
      },
    });

    console.log(`Deleted ${deleted} expired refresh tokens`);

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
};

cleanup();
```

**Sử dụng:**
```bash
node scripts/cleanup.js
```

#### 4. **Generate API Documentation** - Tạo tài liệu API

```javascript
// scripts/generate-docs.js
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TAAgnes API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/**/*.js'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(options);
const outputPath = path.join(__dirname, '../docs/swagger.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
console.log('API documentation generated:', outputPath);
```

#### 5. **Import Data from CSV** - Nhập dữ liệu từ CSV

```javascript
// scripts/import-csv.js
require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const { connectDatabase, closeDatabase } = require('../src/config/database');
const { User } = require('../src/models');

const importCSV = async (filePath) => {
  try {
    await connectDatabase();

    const users = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        users.push({
          name: row.name,
          email: row.email,
          password: row.password,
        });
      })
      .on('end', async () => {
        await User.bulkCreate(users);
        console.log(`Imported ${users.length} users`);
        await closeDatabase();
        process.exit(0);
      });
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
};

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/import-csv.js <path-to-csv>');
  process.exit(1);
}

importCSV(filePath);
```

**Sử dụng:**
```bash
node scripts/import-csv.js data/users.csv
```

### Thêm Script Vào package.json

Để dễ sử dụng, thêm vào `package.json`:

```json
{
  "scripts": {
    "migrate": "node scripts/migrate.js",
    "seed": "node scripts/seed.js",
    "backup": "node scripts/backup.js",
    "cleanup": "node scripts/cleanup.js",
    "import:csv": "node scripts/import-csv.js"
  }
}
```

Sau đó chạy:
```bash
npm run seed
npm run backup
npm run cleanup
```

### Best Practices

- ✅ Luôn load `.env` ở đầu file: `require('dotenv').config()`
- ✅ Xử lý lỗi và exit với code phù hợp (0 = success, 1 = error)
- ✅ Đóng kết nối database sau khi xong
- ✅ Logging rõ ràng để biết script đang làm gì
- ✅ Có thể nhận arguments từ command line

---

## 📝 Folder `logs/` - Log Files

### Tác Dụng

Folder `logs/` chứa các **file log** được tạo tự động bởi Winston logger. Không cần tạo file thủ công trong folder này.

### Các File Log

- **`error.log`**: Chỉ chứa các log mức ERROR
- **`combined.log`**: Chứa tất cả các log (error, warn, info, etc.)

### Cách Hoạt Động

Logger được cấu hình trong `src/config/logger.js`:

```javascript
// src/config/logger.js
const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Ghi vào file error.log chỉ các lỗi
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    // Ghi vào file combined.log tất cả các log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
});

// Trong development, cũng log ra console
if (config.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### Sử Dụng Logger

```javascript
// Trong bất kỳ file nào
const logger = require('../config/logger');

// Log các mức độ khác nhau
logger.error('Error message', { error: err });
logger.warn('Warning message');
logger.info('Info message', { userId: 123 });
logger.debug('Debug message');
```

### Log Rotation

Winston tự động xử lý log rotation. Nếu muốn cấu hình chi tiết hơn, có thể dùng `winston-daily-rotate-file`:

```javascript
// Cài đặt: npm install winston-daily-rotate-file
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d', // Giữ 14 ngày
    }),
  ],
});
```

### Best Practices

- ✅ Không commit folder `logs/` vào git (thêm vào `.gitignore`)
- ✅ Trong production, chỉ log vào file, không log ra console
- ✅ Sử dụng log levels phù hợp (error, warn, info, debug)
- ✅ Thêm context vào log (userId, requestId, etc.)
- ✅ Rotate logs để tránh file quá lớn

### Xem Logs

```bash
# Xem log mới nhất
tail -f logs/combined.log

# Xem chỉ lỗi
tail -f logs/error.log

# Tìm kiếm trong log
grep "ERROR" logs/combined.log

# Xem log của ngày cụ thể
grep "2024-11-06" logs/combined.log
```

---

## 🧪 Folder `tests/` - Test Files

### Tác Dụng

Folder `tests/` chứa các **test files** để kiểm tra tính đúng đắn của code. Sử dụng Jest framework.

### Cấu Trúc

```
tests/
├── setup.js          # Cấu hình test environment
├── user.test.js      # Test cho user functionality
├── auth.test.js      # Test cho authentication
└── integration/      # Integration tests
    └── api.test.js
```

### File Setup

```javascript
// tests/setup.js
require('dotenv').config({ path: '.env.test' }); // Dùng .env.test riêng

// Mock database connection
jest.mock('../src/config/database', () => ({
  connectDatabase: jest.fn(),
  closeDatabase: jest.fn(),
}));

// Set timeout cho tests
jest.setTimeout(10000);
```

### Ví Dụ Test File

#### 1. **Unit Test - Service**

```javascript
// tests/services/user.service.test.js
const { userService } = require('../../src/services');
const { User } = require('../../src/models');
const ApiError = require('../../src/utils/ApiError');

// Mock User model
jest.mock('../../src/models', () => ({
  User: {
    create: jest.fn(),
    findByPk: jest.fn(),
    isEmailTaken: jest.fn(),
  },
}));

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      User.isEmailTaken.mockResolvedValue(false);
      User.create.mockResolvedValue({ id: 1, ...userData });

      const user = await userService.createUser(userData);

      expect(user).toHaveProperty('id');
      expect(User.create).toHaveBeenCalled();
    });

    it('should throw error if email is taken', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      User.isEmailTaken.mockResolvedValue(true);

      await expect(userService.createUser(userData)).rejects.toThrow(ApiError);
    });
  });
});
```

#### 2. **Integration Test - API**

```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/models');
const { connectDatabase, closeDatabase } = require('../../src/config/database');

describe('Auth API', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    // Clean up database
    await User.destroy({ where: {}, truncate: true });
  });

  describe('POST /v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.user).toHaveProperty('email', userData.email);
      expect(response.body.data.tokens).toHaveProperty('access');
    });

    it('should return 400 if email is taken', async () => {
      // Tạo user đầu tiên
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'password123',
      });

      // Thử tạo user với email trùng
      const response = await request(app)
        .post('/v1/auth/register')
        .send({
          name: 'New User',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.message).toContain('Email already taken');
    });
  });

  describe('POST /v1/auth/login', () => {
    beforeEach(async () => {
      // Tạo user để test login
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.data.tokens).toHaveProperty('access');
      expect(response.body.data.tokens).toHaveProperty('refresh');
    });

    it('should return 401 with incorrect password', async () => {
      const response = await request(app)
        .post('/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toContain('Incorrect email or password');
    });
  });
});
```

#### 3. **Test Controller**

```javascript
// tests/controllers/user.controller.test.js
const httpMocks = require('node-mocks-http');
const { userController } = require('../../src/controllers');
const { userService } = require('../../src/services');

jest.mock('../../src/services');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

      userService.getUserById.mockResolvedValue(mockUser);
      req.params.userId = '1';

      await userController.getUserById(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty('data');
    });
  });
});
```

### Chạy Tests

```bash
# Chạy tất cả tests
npm test

# Chạy test với coverage
npm test -- --coverage

# Chạy test cụ thể
npm test -- user.test.js

# Chạy test với watch mode
npm run test:watch

# Chạy test trong một file cụ thể
npm test -- tests/user.test.js
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/app.js',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
```

### Best Practices

- ✅ Đặt tên test file: `*.test.js` hoặc `*.spec.js`
- ✅ Mỗi test case nên độc lập, không phụ thuộc vào nhau
- ✅ Clean up database trước/sau mỗi test
- ✅ Mock external dependencies (database, APIs, etc.)
- ✅ Test cả success và error cases
- ✅ Sử dụng descriptive test names
- ✅ Đạt coverage tối thiểu 80%

### Test Structure

```javascript
describe('Feature Name', () => {
  // Setup
  beforeAll(() => {
    // Chạy 1 lần trước tất cả tests
  });

  beforeEach(() => {
    // Chạy trước mỗi test
  });

  // Test cases
  describe('Method Name', () => {
    it('should do something when condition', async () => {
      // Arrange
      const input = 'value';

      // Act
      const result = await functionToTest(input);

      // Assert
      expect(result).toBe(expected);
    });
  });

  // Cleanup
  afterEach(() => {
    // Chạy sau mỗi test
  });

  afterAll(() => {
    // Chạy 1 lần sau tất cả tests
  });
});
```

---

## 📋 Tóm Tắt

| Folder | Mục Đích | Khi Nào Sử Dụng | Ví Dụ |
|--------|----------|----------------|-------|
| **bin/** | Entry points | Khởi động server, workers, cron jobs | `bin/server.js`, `bin/worker.js` |
| **scripts/** | Utility scripts | Migration, seed, backup, cleanup | `scripts/migrate.js`, `scripts/seed.js` |
| **logs/** | Log files | Tự động tạo bởi logger | `logs/error.log`, `logs/combined.log` |
| **tests/** | Test files | Kiểm tra tính đúng đắn của code | `tests/user.test.js` |

---

## 🎯 Checklist Khi Viết Dự Án Mới

### bin/
- [ ] Tạo `bin/server.js` để khởi động server
- [ ] Xử lý graceful shutdown
- [ ] Xử lý uncaught exceptions
- [ ] Logging khi khởi động

### scripts/
- [ ] Tạo `scripts/migrate.js` cho database migrations
- [ ] Tạo `scripts/seed.js` cho sample data (nếu cần)
- [ ] Thêm scripts vào `package.json`
- [ ] Document cách sử dụng scripts

### logs/
- [ ] Thêm `logs/` vào `.gitignore`
- [ ] Cấu hình logger trong `src/config/logger.js`
- [ ] Setup log rotation (nếu cần)

### tests/
- [ ] Setup Jest configuration
- [ ] Tạo `tests/setup.js`
- [ ] Viết tests cho services
- [ ] Viết tests cho controllers
- [ ] Viết integration tests cho APIs
- [ ] Đạt coverage tối thiểu 80%

---

## 📚 Tài Liệu Tham Khảo

- [Jest Documentation](https://jestjs.io/)
- [Winston Documentation](https://github.com/winstonjs/winston)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Tác giả**: TAAgnes
**Email**: taagnes3110@gmail.com

---

*Tài liệu này là một phần của TAAgnes Backend Template - Mẫu backend Node.js sẵn sàng cho production với MySQL.*

