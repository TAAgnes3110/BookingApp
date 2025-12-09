const express = require('express');
const passport = require('../../config/passport');
const validate = require('../../middlewares/validate');
const { authValidation } = require('../../validations');
const { authController, oauthController } = require('../../controllers');

const router = express.Router();

// Traditional auth
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

// OAuth Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), oauthController.oauthCallback);
router.get('/google/callback/json', passport.authenticate('google', { session: false }), oauthController.oauthCallbackJson);

// OAuth Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), oauthController.oauthCallback);
router.get('/facebook/callback/json', passport.authenticate('facebook', { session: false }), oauthController.oauthCallbackJson);

// OAuth GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false }), oauthController.oauthCallback);
router.get('/github/callback/json', passport.authenticate('github', { session: false }), oauthController.oauthCallbackJson);

module.exports = router;

