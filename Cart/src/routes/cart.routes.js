
const express = require('express');

const authMiddleware = require('../middleware/auth.middleware')
const cartController = require('../controllers/cart.controller')
const cartValidation = require('../middleware/validator.middleware')
const routes = express.Router();


// Cart me item add karne ka protected route.
routes.post('/items',authMiddleware(['user']),cartValidation.validateAddItemToCart,cartController.addToCart)
// Existing cart item ki quantity update karne ka protected route.
routes.patch('/items/:productId', authMiddleware(['user']), cartValidation.validateUpdateCartItem, cartController.updateCartItem)

// Current user ka cart fetch karne ka protected route.
routes.get('/',authMiddleware(['user']),cartController.getCart)
module.exports = routes;