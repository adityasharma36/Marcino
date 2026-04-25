require('dotenv').config();
const app = require('./src/app');
const http = require('http');

const { initSocketServer } = require('./src/sockets/socket.server');

const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3005;


initSocketServer(httpServer);


httpServer.listen(PORT, () => {
    console.log(`AI Buddy service is running on port ${PORT}`);
})