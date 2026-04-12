
require('dotenv').config();
const app = require('./src/app');

const connectToDb = require('./src/db/db');

const PORT = process.env.PORT || 3001;

connectToDb()
    .then(() => {
        // DB ready hone ke baad hi server start karna best practice hai.
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Server startup failed:', error);
        process.exit(1);
    });
