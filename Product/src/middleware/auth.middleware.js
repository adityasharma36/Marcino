
const jwt = require('jsonwebtoken');

function createAuthMiddleware(roles = ['user']) {
    
    return function authMiddleware(req, res, next) {
        // Cookie token ko priority di gayi hai, header fallback hai.
        const authHeader = req.headers.authorization || '';
        const headerToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        const token = req.cookies?.token || headerToken;

        if (!token) {
            return res.status(401).json({
                message: 'Token not found'
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            if (!roles.includes(decode.role)) {
                return res.status(403).json({
                    message: 'Forbidden: Insufficient permission'
                });
            }

            req.user = decode;
            return next();
        } catch (error) {
            return res.status(401).json({
                message: 'Unauthorized: Invalid token'
            });
        }
    };
}

module.exports = createAuthMiddleware;