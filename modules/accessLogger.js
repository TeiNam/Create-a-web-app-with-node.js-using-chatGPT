// accessLogger.js
const db = require('./pgsqlConnector');

async function logLoginAttempt(email, user_no, isSuccess, clientIP, reason = null) {
    const log = {
        email,
        user_no: user_no || null,
        action: 'login',
        isSuccess,
        clientIP,
        reason,
        timestamp: new Date(),
    };

    await db.query(
        'INSERT INTO log.access_log (email, user_no, action, is_success, client_ip, reason, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [log.email, log.user_no, log.action, log.isSuccess, log.clientIP, log.reason, log.timestamp]
    );
}

async function logLogoutAttempt(email, user_no, isSuccess, clientIP, reason = null) {
    const log = {
        email,
        user_no: user_no,
        action: 'logout',
        isSuccess,
        clientIP,
        reason,
        timestamp: new Date(),
    };

    await db.query(
        'INSERT INTO log.access_log (email, user_no, action, is_success, client_ip, reason, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [log.email, log.user_no, log.action, log.isSuccess, log.clientIP, log.reason, log.timestamp]
    );
}

module.exports = {
    logLoginAttempt,
    logLogoutAttempt
};
