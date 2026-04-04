// Server start karne se pehle env load kar rahe hain
require('dotenv').config();

// Main app import kar rahe hain
const app = require('./src/app')

// Database connect karne wali helper file le rahe hain
const connectToDB = require('./src/db/db')


// Pehle DB connect hoga, phir server chalega
connectToDB().then(()=>{

    // App ko port 3000 par chala rahe hain
    app.listen(3000,()=>{

    console.log("server running on port 3000")


 })
 
})
 