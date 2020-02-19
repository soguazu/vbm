import express from 'express';

import authRoute from './v1/auth';

const router = express.Router();

router.use('/api/v1/auth', authRoute);

export default router;
