const jwt = require('jsonwebtoken');

function createAuthMiddleware(roles = ['user']) {
    
    return function authMiddleware(req, res, next) {
        // Cookie token ko priority di gayi hai, header fallback hai.
        const authHeader = req.headers.authorization || '';
        const headerToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        const token = req.cookies?.token || headerToken;
        const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

        if (!token) {
            return res.status(401).json({
                message: 'Token not found'
            });
        }

        if (!jwtSecret) {
            return res.status(500).json({
                message: 'JWT secret is not configured'
            });
        }

        try {
            // Yahan dono env names support kar rahe hain, taaki route config mismatch se na toote.
            const decode = jwt.verify(token, jwtSecret);

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