

const mongoose = require('mongoose');



async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        // Hinlish: DB connect ho gaya to startup ka next step safe hai.
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}


module.exports = connectToDb;