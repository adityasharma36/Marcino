require('dotenv').config();

const cookieparser = require('cookie-parser');
const multer = require('multer');

const productRoutes = require('./routes/product.route');


const express = require('express');



const app = express();


app.use(express.json());
// Cookies read karne ke liye cookie-parser middleware lagaya hai.
app.use(cookieparser());

app.use('/api/products', productRoutes);

app.use((err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === 'LIMIT_UNEXPECTED_FILE') {
			return res.status(400).json({
				message: 'Unexpected file field. Use form-data key "image".'
			});
		}

		return res.status(400).json({ message: `Upload error: ${err.message}` });
	}

	return next(err);
});

app.use((err, req, res, next) => {
	return res.status(500).json({ message: err.message || 'Internal server error' });
});


module.exports = app;