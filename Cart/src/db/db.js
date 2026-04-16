
const mongoose = require('mongoose');



async function connectedToDB(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected To DB")
    } catch (error) {
        console.log('error occur in DB' , error)
    }
}


module.exports = connectedToDB;