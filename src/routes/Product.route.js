const express = require('express');
const router = express.Router();

const productController = require('../controllers/Product.controller');

router.get('/selling-watch', productController.getSellingWatchs);
router.get('/', productController.getAllProduct);

router.post('/add', productController.addProduct);

module.exports = router;
