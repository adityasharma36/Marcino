// .env file se config values load kar rahe hain
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes')





// Express app create kar rahe hain
const app = express();

// Cookies read karne ke liye ye middleware hai
app.use(cookieParser());
// JSON body ko parse karne ke liye ye middleware hai
app.use(express.json());




// Auth routes ko /api/auth pe mount kar rahe hain
app.use('/api/auth',authRouter) 






// App ko export kar rahe hain taaki server aur tests use kar saken
module.exports = app;