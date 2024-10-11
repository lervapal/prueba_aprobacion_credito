const jwt = require('jsonwebtoken');

module.exports = token => new Promise((resuelve, rechaza) => {
    jwt.verify(token, process.env.PALABRA_SECRETA, (err, decoded) => {
        if (err) {
            return rechaza(err);
        }
        return resuelve(decoded);
    });
});