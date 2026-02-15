require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const multer = require('multer');

// --------------- Validate Required Env Vars ---------------
const REQUIRED_ENV = [
    'MONGO_URI',
    'SESSION_SECRET',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
    console.error(
        `✗ Missing required environment variables:\n  ${missing.join('\n  ')}`
    );
    console.error('  → Please check your .env file');
    process.exit(1);
}

const app = express();

// --------------- Config ---------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// --------------- Middleware ---------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: 'sessions',
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    })
);

// Make session available in all EJS views
app.use((req, res, next) => {
    res.locals.isAdmin = req.session && req.session.isAdmin;
    next();
});

// --------------- Routes ---------------
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.use('/', publicRoutes);
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/api/products', apiRoutes);

// --------------- 404 Handler ---------------
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.',
        currentPage: '',
    });
});

// --------------- Centralized Error Handler ---------------
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    const isApi = req.originalUrl.startsWith('/api/');

    // Multer errors (file size, field count, etc.)
    if (err instanceof multer.MulterError) {
        const msg =
            err.code === 'LIMIT_FILE_SIZE'
                ? 'File too large. Maximum size is 5MB.'
                : err.message;
        if (isApi) return res.status(400).json({ error: msg });
        return res.status(400).render('error', {
            title: 'Upload Error',
            message: msg,
            currentPage: '',
        });
    }

    // Image file type rejection from upload middleware
    if (err.message && err.message.includes('Only image files')) {
        if (isApi) return res.status(400).json({ error: err.message });
        return res.status(400).render('error', {
            title: 'Upload Error',
            message: err.message,
            currentPage: '',
        });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        if (isApi) return res.status(400).json({ error: messages.join(', ') });
        return res.status(400).render('error', {
            title: 'Validation Error',
            message: messages.join(', '),
            currentPage: '',
        });
    }

    // Duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        const msg = `Duplicate value for "${field}"`;
        if (isApi) return res.status(400).json({ error: msg });
        return res.status(400).render('error', {
            title: 'Duplicate Error',
            message: msg,
            currentPage: '',
        });
    }

    // Cloudinary errors
    if (err.http_code) {
        const msg = 'Image upload failed. Please try again.';
        if (isApi) return res.status(500).json({ error: msg });
    }

    // Catch-all
    if (isApi) {
        return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(500).render('error', {
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later.',
        currentPage: '',
    });
});

// --------------- Start Server ---------------
const PORT = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✓ MongoDB connected');
        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('✗ MongoDB connection error:', err.message);
        process.exit(1);
    });

module.exports = app;
