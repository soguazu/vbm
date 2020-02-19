import express from 'express';

import userController from '../../controllers/v1/user';

const router = express.Router();

router.post('/password', userController.password);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

export default router;
