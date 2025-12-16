const express = require('express');
const { authenticate, validate } = require('../../middlewares/index')
const { userController } = require('../../controllers/index')
const { userValidation } = require('../../validations/index')

const router = express.Router();

router
  .route('/:userId')
  .get(authenticate, validate(userValidation.getUserById), userController.getUserById)


module.exports = router;
