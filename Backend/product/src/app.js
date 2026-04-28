const express = require('express');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/product.routes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}))


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Product service is running"
    });
})

app.use('/api/products', productRoutes);


module.exports = app;