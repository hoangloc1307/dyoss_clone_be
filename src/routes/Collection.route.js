const express = require('express');
const router = express.Router();

const collectionController = require('../controllers/Collection.controller');

router.get('/', collectionController.getAllCollection);

router.post('/add', collectionController.addCollection);

module.exports = router;
