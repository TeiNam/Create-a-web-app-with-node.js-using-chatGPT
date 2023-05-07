// resendEmailRouter.js
const express = require('express');
const router = express.Router();
const db = require('../modules/pgsqlConnector');
const jwt = require('../modules/jwt');
const { sendVerificationEmail } = require('../modules/emailSender');

router.post('/', async (req, res) => {
    const { email } = req.body;
    const foundUser = (await db.query('SELECT * FROM user WHERE email = $1', [email])).rows[0];

    if (!foundUser) {
        return res.status(400).send('ID가 존재하지 않습니다.');
    }

    if (foundUser.auth_email === false) {
        const emailToken = jwt.generateEmailToken(email);
        await sendVerificationEmail(email, emailToken);
        res.status(200).send('인증 이메일이 다시 발송되었습니다.');
    } else {
        res.status(400).send('이미 인증된 이메일입니다.');
    }
});

module.exports = router;
