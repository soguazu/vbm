import express from 'express';

import authorization from '../../middleware/authorization';

import authController from '../../controllers/v1/auth';

const router = express.Router();

router.post('/register', authorization, authController.register);
router.post('/login', authorization, authController.login);

export default router;
