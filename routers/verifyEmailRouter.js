const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const db = require('../modules/pgsqlConnector');
const { verifyEmailToken } = require('../modules/jwt');

router.get('/:token', async (req, res) => {
    const token = req.params.token;

    // Verify email token
    const decoded = verifyEmailToken(token);

    if (!decoded) {
        return res.status(400).send('유효하지 않은 토큰입니다.');
    }

    const email = decoded.email;

    // Check if the email exists
    const existingUser = await db.query('SELECT * FROM public.user WHERE email = $1', [email]);
    if (existingUser.rowCount === 0) {
        return res.status(400).send('등록되지 않은 이메일입니다.');
    }

    try {
        // Update auth_mail column
        await db.query('UPDATE user SET public.auth_mail = true WHERE email = $1', [email]);
        res.status(200).send('이메일 인증이 완료되었습니다.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
