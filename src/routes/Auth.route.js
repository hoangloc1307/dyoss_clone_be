import { Router } from 'express';

import authController from '../controllers/Auth.controller.js';

const router = Router();

router.post('/register', authController.createAccount);
router.post('/login', authController.login);

export default router;
