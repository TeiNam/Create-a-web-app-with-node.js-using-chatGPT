// getClientIP.js
const requestIp = require('request-ip'); // Import 'request-ip' library

function getClientIP(req) {
    return requestIp.getClientIp(req); // Use the 'request-ip' library to get the client IP address
}

module.exports = {
    getClientIP
};
