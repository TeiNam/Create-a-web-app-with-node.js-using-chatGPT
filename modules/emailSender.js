const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');

const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
};

const transporter = nodemailer.createTransport(smtpConfig);

async function sendVerificationEmail(email, verificationLink) {
    // Load the email template
    const templatePath = path.join(__dirname, '../template/verification.html');
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders in the template
    const html = template.replace('<%= name %>', 'User').replace('<%= verificationLink %>', verificationLink);

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: '이메일 인증',
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Error sending verification email:', err);
        console.error(`Email: ${email}`);
        console.error(`Verification link: ${verificationLink}`);
        throw err;
    }
}

module.exports = {
    sendVerificationEmail
};
