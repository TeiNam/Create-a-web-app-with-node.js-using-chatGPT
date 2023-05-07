// loginRouter.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../modules/pgsqlConnector');
const crypto = require('../modules/crypto');
const jwt = require('../modules/jwt');
const accessLogger = require('../modules/accessLogger'); // Import accessLogger
const getClientIP = require('../modules/getClientIP'); // Import getClientIP module

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const clientIP = getClientIP.getClientIP(req); // Use getClientIP module to get the client IP
    const foundUser = (await db.query('SELECT * FROM user WHERE email = $1', [email])).rows[0];

    if (!foundUser) {
        await accessLogger.logLoginAttempt(email, null, false, clientIP, 'User not found');
        return res.status(400).send('ID가 존재하지 않습니다.');
    }

    const decryptedPassword = await crypto.decrypt(foundUser.password);

    const isPasswordMatch = await bcrypt.compare(password, decryptedPassword);

    if (!isPasswordMatch) {
        await accessLogger.logLoginAttempt(email, foundUser.user_no, false, clientIP, 'Wrong password');
        return res.status(400).send('비밀번호가 틀립니다.');
    }

    if (foundUser.auth_email === false) {
        await accessLogger.logLoginAttempt(email, foundUser.user_no, false, clientIP, 'Email not verified');
        return res.status(401).send({
            message: '이메일 인증이 필요합니다.',
            resendEmail: true
        });
    }

    const payload = {
        user_id: foundUser.user_id,
    };

    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Log successful login attempt
    await accessLogger.logLoginAttempt(email, foundUser.user_no, true, clientIP);

    res.cookie('auth_token', authToken, { httpOnly: true });
    res.status(200).send({ message: '로그인 성공', redirectTo: '/main' });
});

module.exports = router;
