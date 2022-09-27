const express = require('express');
const router = express.Router();

const productController = require('../controllers/Product.controller');

router.get('/selling/:type', productController.getSellingProducts);
router.get(/(sex)+|(type)+|(limit)+/, productController.getProducts);
router.get('/', productController.getAllProduct);

router.post('/add', productController.addProduct);

module.exports = router;
