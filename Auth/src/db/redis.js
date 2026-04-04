// Tests me live Redis hit na ho, isliye fake in-memory Redis use kar rahe hain
class MemoryRedis {
    constructor() {
        this.store = new Map();
    }

    async get(key) {
        return this.store.has(key) ? this.store.get(key) : null;
    }

    async set(key, value) {
        this.store.set(key, value);
        return 'OK';
    }

    on() {
        return this;
    }
}

let redis;
const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'test') {
    // Test mode me fake Redis chalega
    redis = new MemoryRedis();
} else {
    // Normal mode me actual Redis client use kar rahe hain
    const {Redis} = require('ioredis');

    // Env values se Redis client create kar rahe hain
    redis = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD
    })

    // Redis connect hone par success log aayega
    redis.on("connect",()=>{
        console.log(`redis connected (${nodeEnv})`)
    })
}

// Redis client export kar rahe hain
module.exports = redis