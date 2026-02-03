import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import APIResponse from "../utils/ApiResponse.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const pipelines = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $project: {
                totalVideos: { $size: "$videos" },
                totalSubscribers: { $size: "$subscribers" },
                totalViews: { $sum: "$videos.views" },
                username: 1,
                fullName: 1,
                avatar: 1
            }
        }
    ]
    const stats = await User.aggregate(pipelines);
    return res
        .status(200)
        .json(
            new APIResponse(200, stats[0], "Profile Stats fetched successfully")
        )
})

const getAllVideosOfChannel = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { username } = req.params;
    const user = await User.findOne({ username }).select("_id");
    if (!user) {
        throw new APIError(404, "User not found");
    }
    const pipelines = [
        {
            $match: {
                owner: new mongoose.Types.ObjectId(user._id)
            }
        }
    ]
    const videosAggregate = Video.aggregate(pipelines);
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {
            createdAt: -1
        }
    }
    const videos = await Video.aggregatePaginate(videosAggregate, options);
    return res
        .status(200)
        .json(
            new APIResponse(200, videos, "Videos fetched successfully")
        )
})

export { getChannelStats, getAllVideosOfChannel }