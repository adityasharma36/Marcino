require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { connect } = require("./src/broker/borker")
const PORT = process.env.PORT || 3001;

connectDB();

connect();

app.listen(PORT, () => {
    console.log(`Product service listening on port ${PORT}`);
})