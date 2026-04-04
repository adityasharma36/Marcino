
const mongoose = require('mongoose');


async function connectToDB(){
    try {
        // MongoDB se connection establish kar rahe hain
        await mongoose.connect(process.env.MONGOOSE_URL).then(()=>{
            console.log('db is connected properly')
        })
    } catch (error) {
        // Connection fail ho to error console me dikhayenge
        console.log('some problem occur in Db', error)
    }
}


module.exports = connectToDB;