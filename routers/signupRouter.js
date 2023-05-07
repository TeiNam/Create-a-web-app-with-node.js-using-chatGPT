const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const db = require('../modules/pgsqlConnector');
const crypto = require('../modules/crypto');
const { generateEmailToken } = require('../modules/jwt');
const { sendVerificationEmail } = require('../modules/emailSender');

router.get('/', (req, res) => {
    res.render('signup');
});

router.post('/', async (req, res) => {
    const { password, email} = req.body;

    // Log request body
    console.log(`Request body: ${JSON.stringify(req.body, null, 2)}`);

    // Check for duplicate email
    const existingEmailUser = await db.query('SELECT * FROM public.user WHERE email = $1', [email]);
    if (existingEmailUser.rowCount > 0) {
        return res.status(400).send('이미 등록된 email 입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedPassword = await crypto.encrypt(hashedPassword);

    // Generate email token
    const emailToken = generateEmailToken(email);

    // Send verification email
    const verificationLink = `${process.env.APP_BASE_URL}/verify/${emailToken}`;


    try {
        await sendVerificationEmail(email, verificationLink);
    } catch (err) {
        console.error(err);
        return res.status(500).send('이메일 발송에 실패했습니다. 다시 시도해주세요.');
    }

    try {
        await db.query('INSERT INTO public.user (email, password) VALUES ($1, $2)', [email, encryptedPassword]);
        res.status(201).send('ID등록이 완료되었습니다. 이메일을 확인하고 인증 절차를 마무리하면 가입이 완료됩니다.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
