// logoutRouter.js
const express = require('express');
const router = express.Router();
const jwt = require('../modules/jwt'); // Import jwt to verify the token
const accessLogger = require('../modules/accessLogger'); // Import accessLogger
const getClientIP = require('../modules/getClientIP'); // Import getClientIP module

router.get('/', async (req, res) => {
    const token = req.cookies.auth_token;
    const clientIP = getClientIP.getClientIP(req); // Use getClientIP module to get the client IP

    if (token) {
        // Assuming the token contains an email and a user_no, you need to decode it before passing it to logLogoutAttempt
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { email, user_no } = decodedToken;

        await accessLogger.logLogoutAttempt(email, user_no, true, clientIP); // Log logout event
        res.clearCookie('auth_token');
    }

    res.redirect('/');
});

module.exports = router;
