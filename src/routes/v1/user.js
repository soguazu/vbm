import express from 'express';
import authorization from '../../middleware/authorization';

import userController from '../../controllers/v1/user';

const router = express.Router();

router.post('/password', authorization, userController.password);
router.post('/forgot-password', authorization, userController.forgotPassword);
router.post('/reset-password', authorization, userController.resetPassword);

export default router;
