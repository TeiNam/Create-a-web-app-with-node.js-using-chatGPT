const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function verify(req, res, next) {
    const cookies = req.cookies;

    if (!cookies || !cookies.auth_token) {
        return res.status(401).send('로그인이 필요합니다.');
    }

    try {
        const decoded = jwt.verify(cookies.auth_token, process.env.JWT_SECRET);
        req.decodedToken = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send('세션이 만료되었습니다. 다시 로그인해주세요.');
        } else {
            return res.status(401).send('유효하지 않은 토큰입니다.');
        }
    }
}

function generateEmailToken(email) {
    const payload = {
        email: email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2) // 2 hours expiration
    };

    return jwt.sign(payload, process.env.JWT_SECRET);
}

function verifyEmailToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    verify,
    generateEmailToken,
    verifyEmailToken
};
