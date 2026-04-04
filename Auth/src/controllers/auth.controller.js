// User model import, taaki user create/find kar sakein
const userModel = require('../models/user.model');

// Password hash aur compare ke liye bcrypt
const bcrypts = require('bcryptjs');

// JWT token banane aur verify flow ke liye
const jwt = require('jsonwebtoken');

// Redis client, logout ke time token blacklist karne ke liye
const redis = require('../db/redis')

// ================= REGISTER =================
async function registerUser(req, res) {

    // 🔹 request body se data nikal rahe hain
    const { username, email, password, fullName: { firstName, lastName } ,role} = req.body;

    // 🔍 check karo user already exist karta hai ya nahi
    const isUserAlreadyPresent = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserAlreadyPresent) {
        return res.status(409).json({
            message: "Username or email already exists"
        });
    }

    // 🔐 password ko hash karo
    const hash = await bcrypts.hash(password, 10);

    // 🟢 user create karo
    const user = await userModel.create({
        username,
        email,
        password: hash,
        fullName: { firstName, lastName },
        role:role || 'user'
    });

    // 🔑 JWT token generate
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // 🍪 cookie set karo
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    });

    // ✅ response (password nahi bhejna)
    res.status(201).json({
        message: "User successfully registered",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            address: user.addresses
        }
    });
}



// ================= LOGIN (UPDATED 🔥) =================
async function loginUser(req, res) {

    // Try-catch use kiya hai taaki unexpected error pe app crash na ho
    try {

        // Request body se login data le rahe hain
        const { identifier, password } = req.body;

        // ❌ basic validation
        if (!identifier || !password) {
            return res.status(400).json({
                message: "Identifier and password required"
            });
        }

        // ⚡ FAST: email ya username detect karo (no $or → faster query)
        const isEmail = identifier.includes('@');

        const user = await userModel
            .findOne(isEmail ? { email: identifier } : { username: identifier })
            .select('+password'); // 🔐 password explicitly include

        // ❌ user not found
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials" // 🔐 generic message (security)
            });
        }

        // 🔐 password compare
        const isMatch = await bcrypts.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials" // 🔐 same message (avoid info leak)
            });
        }

        // 🔑 JWT token generate
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 🍪 secure cookie
        res.cookie('token', token, {
            httpOnly: true,     // JS access nahi kar sakta
            secure: true,       // only HTTPS
            sameSite: 'Strict', // CSRF protection 🔥
            maxAge: 24 * 60 * 60 * 1000
        });

        // ✅ response (minimal data)
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName:{
                    // fullName object bhi bhej rahe hain taaki frontend direct use kar sake
                    firstName:user.fullName.firstName,
                    lastName:user.fullName.lastName
                },
                role:user.role
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getCurrentUser(req,res){

    // auth middleware ne req.user set kiya hota hai, wahi response me bhej rahe hain
    return res.status(200).json({
        message:'user fetch successfully',
        user:req.user
    })
}


async function logoutUser(req,res) {

    // Cookie se current token le rahe hain
    const token = req.cookies.token;

    // Agar token mila to usko Redis blacklist me daal do (24 hours)
    if(token){
        await redis.set(`blacklist:${token}`,true,'EX',24*60*60)
    }

    // Client side se token cookie clear kar rahe hain
    res.clearCookie('token',{
        httpOnly:true,
        secure:true
    })

    // Logout success response
    return res.status(200).json({
        message:"logout successfully"
    })
}

async function getCurrentAddress(req,res){

    const id = req.user.id;

    const user = await userModel.findById(id).select('addresses');

    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }

    res.status(200).json({
        message:"user Address",
        addresses: user.addresses
    })


}

async function addUserAddress(req,res){

    const id = req.user.id;

    const {street, city, state,pincode,country ,phone,isDefault}= req.body;

    const user = await userModel.findOneAndUpdate({_id:id},{
        $push:{
            addresses:{
                street,
                city,
                state,
                pincode,
                country,
                phone ,
                isDefault
            }
        }
    },{new:true})

    if(!user){
        return res.status(404).json({
            message:"User not found" 
        })
    }

    res.status(201).json({
        message:'Address successfully Update',
        address:user.addresses[user.addresses.length-1]
    });

}

async function removeUserAddress(req,res){
    const id = req.user.id;
    const {addressId}= req.params;


    const isAddressExist = await userModel.findOne({_id:id,'addresses._id':addressId})

    if(!isAddressExist){
        return res.status(404).json({message:"Address not found"})
    }
    const user = await userModel.findByIdAndUpdate(
        id,
        {
            $pull: {
                addresses: { _id: addressId }
            }
        },
        { new: true }
    );

    if(!user){
        return res.status(404).json({
            message:'User not Found'
        })
    }


    const addressExist = user.addresses.some(addr=>addr._id.toString()===addressId);

    if(addressExist){
        return res.status(500).json({message:"fail to delete Address"})
    }

    res.status(200).json({
        message:"User Address Has been deleted",
        addresses: user.addresses

    })

}

// Saare auth controllers export kar rahe hain routes me use karne ke liye
module.exports = { registerUser, loginUser ,getCurrentUser,logoutUser,getCurrentAddress,addUserAddress , removeUserAddress};