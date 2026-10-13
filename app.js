require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const app = express();

// --------------- Config ---------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('trust proxy', 1);

const fs = require('fs');

// Helmet
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'",
                    'https://cdn.tailwindcss.com', 'https:', 'http:'],
                scriptSrcAttr: ["'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'",
                    'https://cdn.tailwindcss.com', 'https:', 'http:', 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'https:', 'http:', 'data:', 'https://fonts.gstatic.com'],
                imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
                connectSrc: ["'self'", 'https:', 'http:'],
                frameSrc: ["'self'", 'https://www.google.com', 'https://maps.google.com', 'https://*.google.com'],
                objectSrc: ["'none'"],
            },
        },
        crossOriginEmbedderPolicy: false,
    })
);

// CORS for API and dev proxy
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// Rate limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
    skip: (req) => req.session && req.session.isAdmin,
});

const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many API requests, please slow down.' },
});

// --------------- Database ---------------
// Cached connection so serverless (Vercel) invocations reuse it across requests.
let dbPromise = null;
function connectDB() {
    if (!dbPromise) {
        dbPromise = mongoose
            .connect(process.env.MONGO_URI)
            .then(async (conn) => {
                console.log('✓ MongoDB connected');
                await require('./controllers/categoryController').seedCategories();
                return conn;
            })
            .catch((err) => {
                dbPromise = null; // allow retry on next request
                throw err;
            });
    }
    return dbPromise;
}

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        next(err);
    }
});

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
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        },
    })
);

app.use((req, res, next) => {
    res.locals.isAdmin = req.session && req.session.isAdmin;
    res.locals.isDashboard = req.path.startsWith('/admin');
    const rawNumber = process.env.WHATSAPP_NUMBER || '';
    res.locals.whatsappNumber = rawNumber.replace(/\D/g, '');
    next();
});

// Client SPA static files
const clientDist = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
}

// --------------- Routes ---------------
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.use('/login', authLimiter);
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/api', apiLimiter, apiRoutes);

// If client build exists, serve React SPA index.html for frontend routes
app.use((req, res, next) => {
    if (
        req.method === 'GET' &&
        !req.originalUrl.startsWith('/api') &&
        !req.originalUrl.startsWith('/admin') &&
        !req.originalUrl.startsWith('/login') &&
        !req.originalUrl.startsWith('/logout') &&
        !req.originalUrl.startsWith('/uploads') &&
        fs.existsSync(path.join(clientDist, 'index.html'))
    ) {
        return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
});

app.use('/', publicRoutes);

// --------------- 404 Handler ---------------
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint not found' });
    }
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

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const msgs = Object.values(err.errors).map(val => val.message);
        if (isApi) return res.status(400).json({ error: msgs.join('. ') });
        return res.status(400).render('error', {
            title: 'Validation Error',
            message: msgs.join('. '),
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
// Only start a long-running server when executed directly (local / Render).
// On Vercel, the exported app is imported by api/index.js instead.
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`✓ Server running on ${PORT}`);
            });
        })
        .catch((err) => {
            console.error('✗ MongoDB connection error:', err.message);
            process.exit(1);
        });
}

module.exports = app;