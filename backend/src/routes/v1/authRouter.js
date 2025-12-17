const express = require('express');
const { validate } = require('../../middlewares/index');
const { authValidation } = require('../../validations/index');
const { authController } = require('../../controllers/index');

const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);

module.exports = router;
