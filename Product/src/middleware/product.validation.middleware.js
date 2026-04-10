const { body, validationResult } = require('express-validator');

const validateProductRequest = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('discription')
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .isLength({ max: 500 })
    .withMessage('discription must be at most 500 characters'),

  body('priceAmount')
    .notEmpty()
    .withMessage('Valid priceAmount is required')
    .bail()
    .isFloat({ gt: 0 })
    .withMessage('Valid priceAmount is required'),
  body('currency')
    .optional()
    .isIn(['INR', 'USD'])
    .withMessage('Currency must be INR or USD'),
  body('seller').optional().isMongoId().withMessage('Seller must be a valid MongoId')
];

function validateProductImages(req, res, next) {

  const files = Array.isArray(req.files)
    ? req.files
    : req.files && typeof req.files === 'object'
      ? Object.values(req.files).flat()
      : (req.file ? [req.file] : []);

  if (!files.length) {

    return res.status(400).json({ message: 'At least one image is required' });

  }

  return next();
}

function handleValidationErrors(req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({

      message: errors.array()[0].msg,

      errors: errors.array()

    });

  }

  return next();
    
}

module.exports = {
  validateProductRequest,
  validateProductImages,
  handleValidationErrors
};