const express = require('express');
const multer = require('multer');
const productController = require('../controller/product.controller');
const createAuthMiddleware = require('../middleware/auth.middleware');
const productValidator = require('../middleware/product.validation.middleware');


const routes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });



// Sirf admin/seller product bana sake, aur max 5 images upload ho.
routes.post('/',createAuthMiddleware(['admin', 'seller']),upload.fields([
		{ name: 'image', maxCount: 5 },
		{ name: 'images', maxCount: 5 }])
		,

	productValidator.validateProductRequest,

	productValidator.validateProductImages,

	productController.createProduct
	
);

routes.get('/',productController.getProduct)

routes.get('/seller',createAuthMiddleware(['seller','admin']),productController.getSellerProducts)

routes.get('/:id', productController.getProductById);



routes.patch('/:id', createAuthMiddleware(['seller', 'admin']), productController.updateProduct)

routes.delete('/:id',createAuthMiddleware(['seller','admin']),productController.deleteProduct);


module.exports = routes;