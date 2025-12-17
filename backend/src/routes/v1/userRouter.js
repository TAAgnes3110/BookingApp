const express = require('express');
const { authenticate, validate, uploadCloud } = require('../../middlewares/index')
const { userController } = require('../../controllers/index')
const { userValidation } = require('../../validations/index')

const router = express.Router();

router
  .route('/avatar')
  .post(authenticate, uploadCloud.single('avatar'), userController.updateAvatar);

router
  .route('/:userId')
  .get(validate(userValidation.getUserById), userController.getUserById)

router
  .route('/:email')
  .get(validate(userValidation.getUserByEmail), userController.getUserByEmail)

router
  .route('/:phoneNumber')
  .get(validate(userValidation.getUserByPhone), userController.getUserByPhone)

router
  .route('/:username')
  .get(validate(userValidation.getUserByUsername), userController.getUserByUsername)

router
  .route('/create')
  .post(uploadCloud.single('avatar'), validate(userValidation.createUser), userController.createUser)


module.exports = router;
