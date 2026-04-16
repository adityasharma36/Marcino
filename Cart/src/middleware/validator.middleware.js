const {body, validationResult}= require('express-validator')
const mongoose = require('mongoose')
const { param } = require('express-validator')

function validateResult(req,res,next){

    // Validation errors ko collect karke response bhej rahe hain.
    const error = validationResult(req);

    // Agar koi validation fail hua hai to 400 return karo.
    if(!error.isEmpty()){
        return res.status(400).json({
            error:error.array()
        })
    }
    // Sab theek hai to next middleware pe jao.
    next();
}

const validateAddItemToCart = [

    // ProductId string aur valid ObjectId hona chahiye.
    body('productId').isString().withMessage('product id must be in string').

    custom(value =>mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid Product Id')
    ,
    // Quantity positive integer honi chahiye.
    body('qty').isInt({gt:0}).withMessage('quantity must be a positive integer'),

    // Common validation result handler.
    validateResult
]

const validateUpdateCartItem = [
    // URL param productId ko validate kar rahe hain.
    param('productId').isString().withMessage('product id must be in string').

    custom(value =>mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid Product Id'),
    // Nayi quantity bhi valid positive integer honi chahiye.
    body('qty').isInt({gt:0}).withMessage('quantity must be a positive integer'),

    // Common validation result handler.
    validateResult
]

module.exports = {validateAddItemToCart, validateUpdateCartItem};