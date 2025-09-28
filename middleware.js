const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next){
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({ 
            success: false, 
            message: "Access token missing" 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({
                success: false,
                message: "Invalid access token"
            });
        }
        req.user = user;
        next();
    })
}

module.exports = authMiddleware;