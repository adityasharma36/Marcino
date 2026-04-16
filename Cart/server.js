require('dotenv').config()
const connectedToDB = require('./src/db/db')
const app = require('./src/app');



connectedToDB().then(()=>{
    app.listen(3002,()=>{
        console.log('server has been started')
    })
})