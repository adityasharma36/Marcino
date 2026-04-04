// express-validator se body rules aur error extraction le rahe hain
const { body, validationResult } = require('express-validator')

// 🔹 Middleware to send validation errors
const responseWithValidatorError = (req, res, next) => {
    const error = validationResult(req);

    // अगर कोई validation error है तो response भेज दो
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    next(); // सब सही है → next middleware/controller
}


// 🔹 Register User Validation Rules
const registerUserValidator = [

    // ✅ Username validation
    body("username")
        .isString().withMessage("Username must be string")
        .isLength({ min: 6 }).withMessage("Username must contain at least 6 characters"),

    // ✅ Email validation
    body("email")
        .isEmail().withMessage("Invalid email"),

    // ✅ 🔥 Strong Password Validation
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character"),

    // ✅ First Name validation
    body("fullName.firstName")
        .isString().withMessage("First name must be string")
        .notEmpty().withMessage("First name must not be empty"),

    // ✅ Last Name validation
    body("fullName.lastName")
        .isString().withMessage("Last name must be string")
        .notEmpty().withMessage("Last name must not be empty"),

    // 🔹 Final error handler middleware
    responseWithValidatorError

]

const loginUserValidation = [

    // 🔹 identifier (email ya username dono ho sakta hai)
    body('identifier')
        .notEmpty().withMessage('Email or Username is required')
        .custom((value) => {

            // 👉 check karo email hai ya username
            const isEmail = value.includes('@');

            if (isEmail) {
                // 📧 agar email hai to valid email hona chahiye
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(value)) {
                    throw new Error('Invalid email format');
                }
            } else {
                // 👤 agar username hai to minimum length check karo
                if (value.length < 3) {
                    throw new Error('Username must be at least 3 characters');
                }
            }

            return true;
        }),

    // 🔐 password validation
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    // 🔹 error handler
    responseWithValidatorError
];

// Ye validator add-address API ke liye hai, taaki sirf valid address data hi save ho.
const addUserAddressValidator = [
    body('street')
        .isString().withMessage('street must be string')
        .notEmpty().withMessage('street is required'),
    body('city')
        .isString().withMessage('city must be string')
        .notEmpty().withMessage('city must not be empty'),
    body('state')
        .isString().withMessage('state must be string')
        .notEmpty().withMessage('state must not be empty'),
    body('pincode')
        .isString().withMessage('pincode must be string')
        .notEmpty().withMessage('pincode must not be empty')
        .isLength({ min: 6, max: 6 }).withMessage('pincode must be six digits')
        .isNumeric().withMessage('pincode must contain only numbers'),
    body('country')
        .isString().withMessage('country must be string')
        .notEmpty().withMessage('country must not be empty'),
    body('phone')
        .isString().withMessage('phone number must be string')
        .isLength({ min: 10, max: 10 }).withMessage('phone number must be 10 digits')
        .isNumeric().withMessage('phone number must contain only numbers')
        .notEmpty().withMessage('phone must not be empty'),
    body('role').optional().isIn(['user','seller']).withMessage('role must be either user or seller ')
        ,
    responseWithValidatorError
]


// Register aur Login dono validators export kar rahe hain
module.exports = { registerUserValidator , loginUserValidation, addUserAddressValidator}