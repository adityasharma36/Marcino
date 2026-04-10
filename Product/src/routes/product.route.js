const express = require('express');
const multer = require('multer');
const productController = require('../controller/product.controller');
const createAuthMiddleware = require('../middleware/auth.middleware');
const {
	validateProductImages,
	validateProductRequest,
	handleValidationErrors
} = require('../middleware/product.validation.middleware');


const routes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });



// Hinlish: sirf admin/seller product bana sake, aur max 5 images upload ho.
routes.post(
	'/',
	createAuthMiddleware(['admin', 'seller']),

	upload.fields([
		{ name: 'image', maxCount: 5 },
		{ name: 'images', maxCount: 5 }
	]),

	...validateProductRequest,

	handleValidationErrors,

	validateProductImages,

	productController.createProduct
	
);

module.exports = routes;