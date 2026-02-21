import Redis from "ioredis";

const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null, // Required for BullMQ
    commandTimeout: 60000,       // Fail commands if they take > 1m
    connectTimeout: 100000,      // Fail connection if it takes > 1m 40s
    retryStrategy(times) {
        const delay = Math.min(times * 50, 10000);
        return delay;
    }
};

const redisUrl = process.env.REDIS_URL || `${redisConfig.host}:${redisConfig.port}`;
console.log(`Attempting to connect to Redis at: ${redisUrl.replace(/:[^:@]+@/, ':****@')}`);

const redisConnection = new Redis(process.env.REDIS_URL || redisConfig);

redisConnection.on("connect", () => console.log("Redis connected successfully"));
redisConnection.on("error", (err) => console.error("Redis connection error:", err));

export default redisConnection;
