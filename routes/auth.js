const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Render login page
router.get('/login', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin');
    }
    res.render('login', { title: 'Admin Login', error: null, currentPage: '' });
});

// Handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (username === adminUser && password === adminPass) {
        req.session.isAdmin = true;
        return res.redirect('/admin');
    }

    res.render('login', {
        title: 'Admin Login',
        error: 'Invalid username or password',
        currentPage: '',
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

module.exports = router;
