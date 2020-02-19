import express from 'express';

import authRoute from './v1/auth';
import userRoute from './v1/user';

const router = express.Router();

router.use('/api/v1/auth', authRoute);
router.use('/api/v1/user', userRoute);

export default router;
