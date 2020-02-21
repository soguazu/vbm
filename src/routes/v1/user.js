import express from 'express';
import authorization from '../../middleware/authorization';
import authentication from '../../middleware/authentication';

import userController from '../../controllers/v1/user';

const router = express.Router();

router.post('/password', authorization, userController.password);
router.post(
  '/change-password',
  [authorization, authentication],
  userController.changePassword,
);
router.post('/forgot-password', authorization, userController.forgotPassword);
router.post('/reset-password', authorization, userController.setPassword);

export default router;
