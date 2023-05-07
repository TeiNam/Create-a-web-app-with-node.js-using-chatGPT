require('dotenv').config();
const crypto = require('crypto');

const algorithm = process.env.CRYPTO_ALGORITHM;
const key = Buffer.from(process.env.CRYPTO_KEY, 'hex');

async function encrypt(text) {
    if (!text) {
        throw new Error('Text to encrypt must be a non-empty string or buffer.');
    }
    const salt = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, salt);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return salt.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
    const [salt, encText] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(salt, 'hex'));
    let decrypted = decipher.update(encText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt,
};
