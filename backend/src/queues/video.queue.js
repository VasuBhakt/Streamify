import { Queue } from "bullmq";
import redisConnection from "../config/redisConfig.js";

const videoQueue = new Queue("video-processing", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3, // Retry up to 3 times on failure
        backoff: {
            type: "exponential",
            delay: 5000, // Wait 5s, then 10s, then 20s
        },
        removeOnComplete: true, // Clean up Redis memory after success
        removeOnFail: false, // Keep failed jobs for debugging
    },
});

export const addVideoJob = async (jobName, data) => {
    return await videoQueue.add(jobName, data);
};

export default videoQueue;
