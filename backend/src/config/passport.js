const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('./config');
const { User } = require('../models');
const { getConnection } = require('./database');
const { generateAuthTokens } = require('../utils/token');

// Helper để lấy Op từ sequelize
const getOp = () => {
  const sequelize = getConnection();
  if (!sequelize) {
    throw new Error('Database connection not initialized');
  }
  return sequelize.Sequelize.Op;
};

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (config.google?.clientId && config.google?.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || profile.name?.givenName;
          const avatar = profile.photos?.[0]?.value;
          const providerId = profile.id;

          // Tìm user theo email hoặc providerId (case-insensitive cho PostgreSQL)
          const { Op } = getOp();
          let user = await User.findOne({
            where: {
              email: { [Op.iLike]: email }, // Case-insensitive cho PostgreSQL
            },
          });

          if (user) {
            // User đã tồn tại, cập nhật thông tin OAuth
            if (!user.providerId) {
              user.provider = 'google';
              user.providerId = providerId;
              user.avatar = avatar;
              user.isEmailVerified = true;
              await user.save();
            }
          } else {
            // Tạo user mới
            user = await User.create({
              name,
              email,
              provider: 'google',
              providerId,
              avatar,
              isEmailVerified: true,
              password: null, // OAuth users không cần password
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Facebook OAuth Strategy
if (config.facebook?.appId && config.facebook?.appSecret) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebook.appId,
        clientSecret: config.facebook.appSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const avatar = profile.photos?.[0]?.value;
          const providerId = profile.id;

          const { Op } = getOp();
          let user = await User.findOne({
            where: {
              email: { [Op.iLike]: email }, // Case-insensitive cho PostgreSQL
            },
          });

          if (user) {
            if (!user.providerId) {
              user.provider = 'facebook';
              user.providerId = providerId;
              user.avatar = avatar;
              user.isEmailVerified = true;
              await user.save();
            }
          } else {
            user = await User.create({
              name,
              email,
              provider: 'facebook',
              providerId,
              avatar,
              isEmailVerified: true,
              password: null,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// GitHub OAuth Strategy
if (config.github?.clientId && config.github?.clientSecret) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
          const name = profile.displayName || profile.username;
          const avatar = profile.photos?.[0]?.value;
          const providerId = profile.id.toString();

          const { Op } = getOp();
          let user = await User.findOne({
            where: {
              email: { [Op.iLike]: email }, // Case-insensitive cho PostgreSQL
            },
          });

          if (user) {
            if (!user.providerId) {
              user.provider = 'github';
              user.providerId = providerId;
              user.avatar = avatar;
              user.isEmailVerified = true;
              await user.save();
            }
          } else {
            user = await User.create({
              name,
              email,
              provider: 'github',
              providerId,
              avatar,
              isEmailVerified: true,
              password: null,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

module.exports = passport;

