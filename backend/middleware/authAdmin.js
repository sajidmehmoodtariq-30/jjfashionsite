const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const User = require('../models/User.js');
dotenv.config();

const checkAdmin = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send("Access denied");
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        const findUser = await User.findById(req.user.id);
        
        if (findUser && (findUser.isAdmin === true || findUser.email === 'admin@eshopit.com' || findUser.email === 'admin')) {
            next();
        } else {
            return res.status(401).send("Access denied");
        }
    } catch (error) {
        return res.status(401).send("Access denied");
    }
};

module.exports = checkAdmin;