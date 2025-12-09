const express = require('express');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations');
const { userController } = require('../../controllers');
const { authenticate, authorize } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(authenticate, authorize('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(authenticate, authorize('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(authenticate, validate(userValidation.getUser), userController.getUser)
  .patch(authenticate, validate(userValidation.updateUser), userController.updateUser)
  .delete(authenticate, authorize('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;

