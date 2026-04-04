// DB se user nikalne ke liye user model use kar rahe hain
const userModel = require('../models/user.model')

// JWT token verify karne ke liye library import kar rahe hain
const jwt = require('jsonwebtoken')

// Blacklist token check karne ke liye Redis use kar rahe hain
const redis = require('../db/redis')


// Ye middleware protected routes ke liye auth check karega
async function authMiddleWare(req,res,next){

    // Cookie se token nikal rahe hain
    const token = req.cookies.token;

    // Token nahi mila to request reject kar do
    if(!token){
        return res.status(401).json({message:"token not found"})
    }

    // Invalid token ya server error handle karne ke liye try-catch use kar rahe hain
    try {

    // Redis me check kar rahe hain ki token blacklist me hai ya nahi
    const isBlacklisted = await redis.get(`blacklist:${token}`)

    // Blacklisted token ka access block kar do
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Token is blacklisted' })
    }

    // JWT secret ke saath token verify kar rahe hain
    const decode = await jwt.verify(token,process.env.JWT_SECRET);

    // Token se user id nikaal kar DB me user dhoondh rahe hain
    const fetchData = await userModel.findById(decode.id)

    // Agar user DB me nahi mila to 404 bhejo
    if(!fetchData){
        return res.status(404).json({message:'User not found'})
    }

    // User data ko local variable me rakh rahe hain
    const user = fetchData;

    // req.user me user attach kar rahe hain
    req.user = user;

    // Sab theek hai, ab next handler pe jao
    next();
        
    } catch (error) {

        // Token invalid, expire ya verify fail ho to unauthorized bhejo
        return res.status(401).json({message:'UnAuthorised User'})
    }
}

    // Middleware export kar rahe hain
module.exports = {authMiddleWare}