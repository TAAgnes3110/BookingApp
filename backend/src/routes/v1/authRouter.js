const express = require('express');
const { validate } = require('../../middlewares/index');
const { authValidation } = require('../../validations/index');
const { authController } = require('../../controllers/index');

const router = express.Router();

router
  .route('/loginWithSocial')
  .post(validate(authValidation.socialLogin), authController.loginWithSocial);

module.exports = router;
