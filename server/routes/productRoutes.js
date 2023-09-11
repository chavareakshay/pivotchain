// routes/customerRoutes.js
const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/', productController.createProduct);
router.get('/', productController.getAllProduct);
router.get('/:PId', productController.getProductById);
router.put('/:PId', productController.updateProductById);
router.delete('/:PId', productController.deleteProductById);

module.exports = router;
