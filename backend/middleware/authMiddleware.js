const jwt = require('jsonwebtoken');

console.log('authMiddleware.js: Loading...');

module.exports = function (req, res, next) {
    console.log('authMiddleware.js: Middleware executed.');
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

console.log('authMiddleware.js: Exported.');