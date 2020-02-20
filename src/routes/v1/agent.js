import express from 'express';
import authorization from '../../middleware/authorization';
import authentication from '../../middleware/authentication';

import agentController from '../../controllers/v1/agent';

const router = express.Router();

router.get('/', [authorization, authentication], agentController.data);

export default router;
