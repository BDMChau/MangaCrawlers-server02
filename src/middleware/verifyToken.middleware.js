const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const jsonResponse = require('../utils/jsonResponse');

const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        jsonResponse(res, 401, "tokenAuthorization_fail", false, {});
        return;
    }

    const token = req.headers.authorization;

    jwt.verify(token, keys.JWT_SECRET, (err, payload) => {
        // payload is userValue
        if (err) {
            console.log("Token err: ", err);
            
            jsonResponse(res, 401, "tokenAuthorization_fail", false, {});
            return
        }

        req.user = payload;
        next();
    })
}

module.exports = verifyToken;