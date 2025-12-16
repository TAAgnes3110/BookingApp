const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('./config');
const { authService } = require('../services/index');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await authService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
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

// Facebook Strategy
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

// GitHub Strategy
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

module.exports = passport;
