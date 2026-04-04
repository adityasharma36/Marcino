
const express = require('express');
const validator = require('../middleware/validator.middleware')
const authController = require('../controllers/auth.controller')
const authMiddleWare = require('../middleware/auth.middleware')

// Auth endpoints ke liye router bana rahe hain
const router = express.Router();

// Register route: pehle validation, phir controller
router.post('/register', validator.registerUserValidator, authController.registerUser);

// Login route: credentials validate karke login hoga
router.post('/login',validator.loginUserValidation,authController.loginUser);

// Me route: token verify karke current user deta hai
router.get('/me',authMiddleWare.authMiddleWare,authController.getCurrentUser);

// Logout route: token blacklist aur cookie clear
router.post('/logout',authController.logoutUser)


// Current user ke saare addresses fetch karne ka route
router.get('/users/me/addresses',authMiddleWare.authMiddleWare,authController.getCurrentAddress);

// Naya address add karne ka route
router.post('/users/me/addresses', authMiddleWare.authMiddleWare, validator.addUserAddressValidator, authController.addUserAddress);

// Address delete karne ka route
router.delete('/users/me/addresses/:addressId',authMiddleWare.authMiddleWare,authController.removeUserAddress);

// Router export kar rahe hain
module.exports = router



 