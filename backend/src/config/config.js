const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const validateEnv = require('./validateEnv');

let config;
try {
  config = validateEnv;
} catch (error) {
  if (process.env.NODE_ENV !== 'production') {
    config = {
      env: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
      host: process.env.APP_HOST || 'localhost',
      postgres: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 5432,
        database: process.env.POSTGRES_DB || 'taagnes_backend',
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        ssl: process.env.POSTGRES_SSL || 'false'
      },
      jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
        accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30,
        refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 30
      },
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
      },
      logLevel: process.env.LOG_LEVEL || 'info',
      // OAuth Config
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/v1/auth/google/callback'
      },
      facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:
          process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/v1/auth/facebook/callback'
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/v1/auth/github/callback'
      },
      session: {
        secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'your-session-secret'
      },
      email: {
        smtp: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
          }
        },
        from: process.env.EMAIL_FROM
      }
    };
  } else {
    throw error;
  }
}

module.exports = config;
