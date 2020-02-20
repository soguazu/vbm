import express from 'express';

import authorization from '../../middleware/authorization';

import tokenController from '../../controllers/v1/token';

const router = express.Router();

router.get('/validity', authorization, tokenController.validity);
router.get('/', authorization, tokenController.getToken);

export default router;
