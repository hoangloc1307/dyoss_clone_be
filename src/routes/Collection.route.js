import { Router } from 'express';

import collectionController from '../controllers/Collection.controller.js';

const router = Router();

router.get('/', collectionController.getCollections);

router.post('/add', collectionController.addCollection);

export default router;
