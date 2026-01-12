import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import APIError from "../utils/ApiError.js";
import APIResponse from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    if (!videoId) {
        throw new APIError(400, "Video ID is required")
    }
    const pipelines = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        }
    ]
    const commentsAggregate = Comment.aggregate(pipelines);
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {
            createdAt: -1
        }
    }
    const comments = await Comment.aggregatePaginate(commentsAggregate, options);
    return res
        .status(200)
        .json(
            new APIResponse(200, comments, "Comments fetched successfully")
        )
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    if (!videoId) {
        throw new APIError(400, "Video ID is required");
    }
    if (!content || content.trim() === "") {
        throw new APIError(400, "Comment cannot be empty");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new APIError(404, "Video not found");
    }
    const comment = await Comment.create({
        video: videoId,
        owner: req.user._id,
        content: content
    })
    return res
        .status(201)
        .json(
            new APIResponse(201, comment, "Comment added successfully")
        )
})

const updateComment = asyncHandler(async (req, res) => {
    const { videoId, commentId } = req.params;
    const { content } = req.body;
    if (!videoId) {
        throw new APIError(400, "Video ID is required");
    }
    if (!commentId) {
        throw new APIError(400, "Comment ID is required");
    }
    if (!content || content.trim() === "") {
        throw new APIError(400, "Comment cannot be empty");
    }
    const comment = await Comment.findOneAndUpdate({
        _id: commentId,
        video: videoId,
        owner: req.user._id
    }, {
        $set: {
            content: content
        }
    }, {
        new: true
    })
    return res
        .status(200)
        .json(
            new APIResponse(200, comment, "Comment updated successfully")
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { videoId, commentId } = req.params;
    if (!videoId) {
        throw new APIError(400, "Video ID is required");
    }
    if (!commentId) {
        throw new APIError(400, "Comment ID is required");
    }
    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        video: videoId,
        owner: req.user._id
    })
    return res
        .status(200)
        .json(
            new APIResponse(200, comment, "Comment deleted successfully")
        )
})

export { getVideoComments, addComment, updateComment, deleteComment }