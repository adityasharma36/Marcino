require('dotenv').config();

const cookieparser = require('cookie-parser');
const routes = require('../src/routes/cart.routes')


const express = require('express');


const app = express();

app.use(cookieparser());
app.use(express.json());


app.use('/api/cart',routes)


module.exports = app;