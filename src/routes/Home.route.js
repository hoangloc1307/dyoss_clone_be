import { Router } from 'express';

import homeController from '../controllers/Home.controller.js';

const router = Router();

router.get('/', homeController.index);

export default router;
