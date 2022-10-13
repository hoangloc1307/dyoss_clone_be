import { Router } from 'express';

import homeController from '../controllers/Home.controller.js';

const router = Router();

router.get('/', homeController.index);
router.post('/newsletter', homeController.newsletter);

export default router;
