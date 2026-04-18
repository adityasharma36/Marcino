
const rabbit = require('amqplib');


let channel, connection;

async function connect(){
    try {

        if(connection) return connection;
        connection = await rabbit.connect(process.env.RABBIT_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
        
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

async function publishToQueue(queueName,data= {}){
    try {
        // agar channel ya connection nahi hai to connect karlo
        if(!channel || !connection) await connect();

        // queue create karlo agar nahi hai to, aur message bhejo
        await channel.assertQueue(queueName,{durable: true});

        // message bhejo queue me
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));

        // console log karo ki message bhej diya
        console.log(`Message sent to queue ${queueName}:`, data);

    } catch (error) {
        console.error('Error publishing to queue:', error);
    }
}

async function subscribeToQueue(queueName,callback){
    try {
        // agar channel ya connection nahi hai to connect karlo
        if(!channel || !connection) await connect();

        // queue create karlo agar nahi hai to, aur message receive karo
        await channel.assertQueue(queueName,{durable: true});

        // message receive karo queue se
        channel.consume(queueName,(message)=>{
            if(message !== null){
                const data = JSON.parse(message.content.toString());
                callback(data);
                channel.ack(message);
            }
        });

    } catch (error) {
        console.error('Error subscribing to queue:', error);
    }
}


module.exports = {
    connect,
    channel,
    connection,
    publishToQueue,
    subscribeToQueue
}