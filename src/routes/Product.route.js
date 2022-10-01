const express = require('express');
const router = express.Router();

const productController = require('../controllers/Product.controller');

router.get('/selling/:type', productController.getSellingProducts);
router.get('/related/:id', productController.getProductsRelated);
router.get('/viewed', productController.getProductsViewed);
router.get('/collections', productController.getProductsOfCollections);
router.get('/search', productController.getProductsSearch);
router.get('/detail/:slug/:amount', productController.getProductDetailAndRelated);
router.get('/:slug', productController.getProductBySlug);
router.get('/', productController.getProducts);

router.post('/add', productController.addProduct);

module.exports = router;
