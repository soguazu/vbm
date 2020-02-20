import express from 'express';

import authRoute from './v1/auth';
import userRoute from './v1/user';
import tokenRoute from './v1/token';
import agentRoute from './v1/agent';

const router = express.Router();

router.use('/api/v1/auth', authRoute);
router.use('/api/v1/user', userRoute);
router.use('/api/v1/token', tokenRoute);
router.use('/api/v1/agent', agentRoute);

export default router;
