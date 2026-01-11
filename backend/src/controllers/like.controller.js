import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import APIError from "../utils/ApiError.js";
import APIResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleLikeVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new APIError(400, "Video ID is required")
    }
    const like = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })
    let response;
    if (!like) {
        response = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
    } else {
        response = await Like.deleteOne({
            video: videoId,
            likedBy: req.user._id
        })
    }

    return res
        .status(201)
        .json(
            new APIResponse(201, response, "Like on video toggled successfully")
        )
})

const toggleLikeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new APIError(400, "Comment ID is required")
    }
    const like = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })
    let response;
    if (!like) {
        response = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
    } else {
        response = await Like.deleteOne({
            comment: commentId,
            likedBy: req.user._id
        })
    }
    return res
        .status(201)
        .json(
            new APIResponse(201, response, "Like on comment toggled successfully")
        )
})

const userLikedVideos = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const pipelines = [];
    pipelines.push({
        $match: {
            likedBy: new mongoose.Types.ObjectId(req.user._id),
            video: {
                $exists: true
            }
        }
    })
    pipelines.push(
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                        _id: 0
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    )
    pipelines.push({
        $unwind: "$video"
    })
    const likedVideosAggregate = Like.aggregate(pipelines);
    const options = {
        page: parseInt(page),
        limit: 20,
        sort: {
            createdAt: -1
        }
    }
    const likedVideos = await Like.aggregatePaginate(likedVideosAggregate, options);
    return res
        .status(200)
        .json(
            new APIResponse(200, likedVideos, "Liked videos fetched successfully")
        )
})

export { toggleLikeVideo, toggleLikeComment, userLikedVideos }