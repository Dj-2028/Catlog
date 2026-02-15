console.log('[api.js] ✅ Route file loaded');
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { isAuthenticated } = require('../middleware/auth');
const ctrl = require('../controllers/productController');

// Wrap multer to catch and log errors that might be silently swallowed
const debugUpload = (req, res, next) => {
    console.log('[Route] Before multer — Content-Type:', req.headers['content-type']);
    console.log('[Route] Before multer — Body keys:', Object.keys(req.body || {}));

    upload.array('images', 5)(req, res, (err) => {
        if (err) {
            console.error('[Route] ❌ Multer error:', err.message, err.code);
            return next(err);
        }
        console.log('[Route] ✅ After multer — req.files:', req.files ? req.files.length + ' files' : 'none');
        if (req.files && req.files.length > 0) {
            req.files.forEach((f, i) => {
                console.log(`[Route] File ${i}:`, {
                    path: f.path,
                    filename: f.filename,
                    originalname: f.originalname,
                    size: f.size,
                });
            });
        }
        next();
    });
};

router.get('/', ctrl.listProducts);
router.get('/:id', ctrl.getProduct);
router.post('/', isAuthenticated, debugUpload, ctrl.createProduct);
router.put('/:id', isAuthenticated, debugUpload, ctrl.updateProduct);
router.delete('/:id', isAuthenticated, ctrl.deleteProduct);

module.exports = router;
