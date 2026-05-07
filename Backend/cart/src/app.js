const express = require('express');
const cartRoutes = require('./routes/cart.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3002', // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent
}));



app.get('/', (req, res) => {
    res.status(200).json({
        message: "Cart service is running"
    });
})

app.use('/api/cart', cartRoutes);





module.exports = app;