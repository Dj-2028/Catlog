const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const upload = require('../middleware/upload');
const { isAuthenticated } = require('../middleware/auth');
const ctrl = require('../controllers/productController');
const categoryCtrl = require('../controllers/categoryController');
const serviceCtrl = require('../controllers/serviceController');
const enquiryCtrl = require('../controllers/enquiryController');
const settingsCtrl = require('../controllers/settingsController');

// Stricter limit for public enquiry submissions (spam protection)
const enquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many enquiries from this device. Please try again later or contact us by phone.' },
});

// ---------- Categories ----------
router.get('/categories', categoryCtrl.getCategories);
router.post('/categories', isAuthenticated, categoryCtrl.createCategory);
router.put('/categories/:id', isAuthenticated, categoryCtrl.updateCategory);
router.delete('/categories/:id', isAuthenticated, categoryCtrl.deleteCategory);

// ---------- Products ----------
router.get('/products', ctrl.listProducts);
router.get('/products/filters', ctrl.getProductFilters);
router.get('/products/:id', ctrl.getProduct);
router.post('/products', isAuthenticated, upload.array('images', 6), ctrl.createProduct);
router.put('/products/:id', isAuthenticated, upload.array('images', 6), ctrl.updateProduct);
router.delete('/products/:id', isAuthenticated, ctrl.deleteProduct);

// ---------- Services ----------
router.get('/services', serviceCtrl.listServices);
router.put('/services/reorder', isAuthenticated, serviceCtrl.reorderServices);
router.get('/services/:id', serviceCtrl.getService);
router.post('/services', isAuthenticated, serviceCtrl.setUploadFolder, upload.single('image'), serviceCtrl.createService);
router.put('/services/:id', isAuthenticated, serviceCtrl.setUploadFolder, upload.single('image'), serviceCtrl.updateService);
router.delete('/services/:id', isAuthenticated, serviceCtrl.deleteService);

// ---------- Enquiries ----------
router.post('/enquiries', enquiryLimiter, enquiryCtrl.createEnquiry);
router.get('/enquiries', isAuthenticated, enquiryCtrl.listEnquiries);
router.patch('/enquiries/:id', isAuthenticated, enquiryCtrl.updateEnquiry);
router.delete('/enquiries/:id', isAuthenticated, enquiryCtrl.deleteEnquiry);

// ---------- Store settings ----------
router.get('/settings', settingsCtrl.getSettings);
router.put('/settings', isAuthenticated, settingsCtrl.updateSettings);

module.exports = router;