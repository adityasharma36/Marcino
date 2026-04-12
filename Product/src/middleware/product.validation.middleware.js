const { body, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    // First validation error ko response me bhej rahe hain.
    return res.status(400).json({

      message: errors.array()[0].msg,

      errors: errors.array()

    });

  }

  return next();
    
}

const validateProductRequest = [
  // Case: title empty ho to request reject.
  body('title').trim().notEmpty().withMessage('Title is required'),
  // Case: discription optional hai, but max 500 chars tak hi allowed hai.
  body('discription')
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .isLength({ max: 500 })
    .withMessage('discription must be at most 500 characters'),

  // Case: priceAmount missing ya 0 se chhota ho to reject.
  body('priceAmount')
    .notEmpty()
    .withMessage('Valid priceAmount is required')
    .bail()
    .isFloat({ gt: 0 })
    .withMessage('Valid priceAmount is required'),
  // Case: currency sirf INR ya USD accept kare.
  body('currency')
    .optional()
    .isIn(['INR', 'USD'])
    .withMessage('Currency must be INR or USD'),
  // Case: seller diya ho to valid MongoId hona chahiye.
  body('seller').optional().isMongoId().withMessage('Seller must be a valid MongoId')
  ,
  handleValidationErrors
];

function validateProductImages(req, res, next) {

  // Multer ka output alag shape me aa sakta hai, isliye sab cases handle kar rahe hain.
  const files = Array.isArray(req.files)
    ? req.files
    : req.files && typeof req.files === 'object'
      ? Object.values(req.files).flat()
      : (req.file ? [req.file] : []);

  // Case: agar koi image nahi aayi to request reject.
  if (!files.length) {

    return res.status(400).json({ message: 'At least one image is required' });

  }

  return next();
}



module.exports = {
  validateProductRequest,
  validateProductImages,

};