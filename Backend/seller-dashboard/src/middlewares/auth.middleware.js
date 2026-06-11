const jwt = require('jsonwebtoken');

function createAuthMiddleware(roles = ["seller"]) {
    return function authMiddleware(req, res, next) {

        console.log("middleware entered");

        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];

        console.log("token =", token);

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided"
            });
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            console.log(decoded);

            req.user = decoded;

            next();
        } catch (err) {
            console.log(err);
            return res.status(401).json({
                message: "Unauthorized: Invalid token"
            });
        }
    };
}


module.exports = createAuthMiddleware;