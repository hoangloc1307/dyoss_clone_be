const express = require('express');
const router = express.Router();

const productController = require('../controllers/Product.controller');

router.get('/detail/:slug/:amount', productController.getProductDetailAndRelated);
router.get('/options/:slug', productController.getProductOptions);
router.get('/collections', productController.getProductsOfCollections);
router.get('/', productController.getProducts);

router.post('/add', productController.addProduct);

module.exports = router;
