const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
    PORT: Joi.number().default(3000),
    APP_HOST: Joi.string().default('localhost'),
    POSTGRES_HOST: Joi.string().default('localhost').description('PostgreSQL host'),
    POSTGRES_PORT: Joi.number().default(5432),
    POSTGRES_DB: Joi.string().default('BookingApp').description('PostgreSQL database name'),
    POSTGRES_USER: Joi.string().default('postgres').description('PostgreSQL username'),
    POSTGRES_PASSWORD: Joi.string()
      .allow('')
      .default('postgres')
      .description('PostgreSQL password'),
    POSTGRES_SSL: Joi.string().valid('true', 'false').default('false'),
    JWT_SECRET: Joi.string().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
    CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
    LOG_LEVEL: Joi.string()
      .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
      .default('info'),
    GOOGLE_CLIENT_ID: Joi.string().optional(),
    GOOGLE_CLIENT_SECRET: Joi.string().optional(),
    GOOGLE_CALLBACK_URL: Joi.string().optional(),
    FACEBOOK_APP_ID: Joi.string().optional(),
    FACEBOOK_APP_SECRET: Joi.string().optional(),
    FACEBOOK_CALLBACK_URL: Joi.string().optional(),
    GITHUB_CLIENT_ID: Joi.string().optional(),
    GITHUB_CLIENT_SECRET: Joi.string().optional(),
    GITHUB_CALLBACK_URL: Joi.string().optional(),
    SESSION_SECRET: Joi.string().optional(),
    SMTP_HOST: Joi.string().optional(),
    SMTP_PORT: Joi.number().optional(),
    SMTP_SECURE: Joi.boolean().optional(),
    SMTP_USERNAME: Joi.string().optional(),
    SMTP_PASSWORD: Joi.string().optional(),
    EMAIL_FROM: Joi.string().optional(),
    RESEND_API_KEY: Joi.string().optional(),
    RESEND_FROM_EMAIL: Joi.string().optional(),
    SENDGRID_API_KEY: Joi.string().optional(),
    SENDGRID_FROM_EMAIL: Joi.string().optional(),
    FRONTEND_URL: Joi.string().optional()
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  host: envVars.APP_HOST,
  postgres: {
    host: envVars.POSTGRES_HOST || 'localhost',
    port: envVars.POSTGRES_PORT || 5432,
    database: envVars.POSTGRES_DB || 'BookingApp',
    username: envVars.POSTGRES_USER,
    password: envVars.POSTGRES_PASSWORD,
    ssl: envVars.POSTGRES_SSL || 'false'
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS
  },
  cors: {
    origin: envVars.CORS_ORIGIN
  },
  logLevel: envVars.LOG_LEVEL,
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: envVars.GOOGLE_CALLBACK_URL || 'http://localhost:3000/v1/auth/google/callback'
  },
  facebook: {
    appId: envVars.FACEBOOK_APP_ID,
    appSecret: envVars.FACEBOOK_APP_SECRET,
    callbackURL: envVars.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/v1/auth/facebook/callback'
  },
  github: {
    clientId: envVars.GITHUB_CLIENT_ID,
    clientSecret: envVars.GITHUB_CLIENT_SECRET,
    callbackURL: envVars.GITHUB_CALLBACK_URL || 'http://localhost:3000/v1/auth/github/callback'
  },
  session: {
    secret: envVars.SESSION_SECRET || envVars.JWT_SECRET || 'your-session-secret'
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      secure: envVars.SMTP_SECURE,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD
      }
    },
    from: envVars.EMAIL_FROM
  }
};
