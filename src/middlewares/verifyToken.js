const jwt = require("jsonwebtoken");
require('dotenv').config();
// const cors = require('cors');

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).send({ message: "Unauthorized access!" });
    }
    // console.log(authorization);
    try {
        const token = authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized access!" });
            }
            req.decoded = decoded;
            next();
        });
    } catch (err) {
        console.log(err);
        next("Authentication failure!");
    }
}

module.exports = verifyToken;