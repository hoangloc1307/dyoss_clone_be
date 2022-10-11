import { Router } from 'express';

import productController from '../controllers/Product.controller.js';

const router = Router();

router.get('/detail/:slug/:amount', productController.getProductDetailAndRelated);
router.get('/options/:slug', productController.getProductOptions);
router.get('/collections', productController.getProductsOfCollections);
router.get('/', productController.getProducts);

router.post('/add', productController.addProduct);

export default router;
