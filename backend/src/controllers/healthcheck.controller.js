import APIResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import redisConnection from "../config/redisConfig.js";

const healthCheck = asyncHandler(async (req, res) => {
    const redisStatus = redisConnection.status;

    if (redisStatus !== "ready") {
        return res.status(503).json(
            new APIResponse(503, { redis: redisStatus }, "Redis is not ready")
        );
    }

    return res.status(200).json(
        new APIResponse(200, { redis: "connected" }, "OK")
    )
})

export { healthCheck }