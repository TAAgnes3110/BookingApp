const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const { google, facebook } = require('./validateEnv');
// const db = require('./database');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

module.exports = passport;
