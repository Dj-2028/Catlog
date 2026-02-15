const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { isAuthenticated } = require('../middleware/auth');
const ctrl = require('../controllers/productController');

router.get('/', ctrl.listProducts);
router.get('/:id', ctrl.getProduct);
router.post('/', isAuthenticated, upload.array('images', 5), ctrl.createProduct);
router.put('/:id', isAuthenticated, upload.array('images', 5), ctrl.updateProduct);
router.delete('/:id', isAuthenticated, ctrl.deleteProduct);

module.exports = router;