import redisConnection from "../config/redisConfig.js";

export const getCachedData = async (key, ttl = 3600, fetchFn) => {
    try {
        const cachedData = await redisConnection.get(key);

        if (cachedData) {
            console.log(`Cache Hit: ${key}`);
            return JSON.parse(cachedData);
        }

        console.log(`Cache Miss: ${key}. Fetching from DB...`);
        const freshData = await fetchFn();

        if (freshData) {
            await redisConnection.set(key, JSON.stringify(freshData), "EX", ttl);
        }

        return freshData;
    } catch (error) {
        console.error(`Redis Cache Error for key ${key}:`, error);
        // On cache error, fallback to DB
        return await fetchFn();
    }
};

export const invalidateCache = async (key) => {
    try {
        await redisConnection.del(key);
        console.log(`Cache Invalidated: ${key}`);
    } catch (error) {
        console.error(`Redis Invalidation Error:`, error);
    }
};
