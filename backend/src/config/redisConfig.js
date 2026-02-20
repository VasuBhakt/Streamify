import Redis from "ioredis";

const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null, // Required for BullMQ
};

const redisConnection = new Redis(process.env.REDIS_URL || redisConfig);

redisConnection.on("connect", () => console.log("Redis connected successfully"));
redisConnection.on("error", (err) => console.error("Redis connection error:", err));

export default redisConnection;
