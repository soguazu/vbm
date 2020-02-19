import express from 'express';

import authController from '../../controllers/v1/auth';
import userController from '../../controllers/v1/user';

const router = express.Router();

router.post('/register', authController.register);
router.post('/password', userController.password);

export default router;
