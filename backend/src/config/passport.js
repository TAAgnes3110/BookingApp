const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
// eslint-disable-next-line import/no-extraneous-dependencies
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { authService } = require('../services/index');

// Serialize người dùng cho session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize người dùng từ session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await authService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google
if (config.google.clientId && config.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await authService.findOrCreateSocialUser(profile, 'google');
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// Facebook
if (config.facebook.appId && config.facebook.appSecret) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebook.appId,
        clientSecret: config.facebook.appSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'emails', 'name', 'photos', 'displayName']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await authService.findOrCreateSocialUser(profile, 'facebook');
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// GitHub
if (config.github.clientId && config.github.clientSecret) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL,
        scope: ['user:email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await authService.findOrCreateSocialUser(profile, 'github');
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// JWT
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      if (payload.type !== 'access') {
        return done(null, false, { message: 'Invalid token type' });
      }
      const user = await authService.getUserById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
