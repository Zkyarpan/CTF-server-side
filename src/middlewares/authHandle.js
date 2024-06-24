const jwt = require('jsonwebtoken');
const userModel = require("../users/userModel");
const config = require("../config/config");

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send('Access Denied');

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, config.jwtSecret);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

const isAdmin = async (req, res, next) => {
    const user = await userModel.findById(req.user.sub);
    if (user.role!== 'admin') return res.status(403).send('Access Denied');
    next();
};

const isUser = async (req, res, next) => {
    const user = await userModel.findById(req.user.sub);
    if (user.role!== 'user') return res.status(403).send('Access Denied');
    next();
};

module.exports = { authenticateToken, isAdmin, isUser };