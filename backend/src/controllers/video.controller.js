import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import APIResponse from "../utils/ApiResponse.js";
import APIError from "../utils/ApiError.js";
import { uploadVideoOnCloudinary, uploadImageOnCloudinary, deleteVideoFromCloudinary } from "../utils/Cloudinary.js";
import mongoose from "mongoose";
import { VIDEO_SIZE_LIMIT, IMAGE_SIZE_LIMIT } from "../constants.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
    // take query parameters
    const { page = 1, limit = 10, query, sortBy, sortType } = req.query;

    // aggregation pipelines
    const pipelines = []

    pipelines.push({
        $match: {
            isPublished: true
        }
    })

    // joining for search by username or full name
    pipelines.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails",
            pipeline: [
                {
                    $project: {
                        username: 1,
                        fullName: 1,
                        avatar: 1,
                        _id: 1
                    }
                }
            ]
        }
    });

    pipelines.push({
        $unwind: {
            path: "$ownerDetails",
        }
    })

    // Search logic (Moved after lookup to allow searching by owner details)
    if (query) {
        // Intelligent multi-keyword search
        const keywords = query.trim().split(/\s+/).map(k => ({
            $or: [
                { title: { $regex: k, $options: "i" } },
                { description: { $regex: k, $options: "i" } },
                { "ownerDetails.username": { $regex: k, $options: "i" } },
                { "ownerDetails.fullName": { $regex: k, $options: "i" } }
            ]
        }));

        pipelines.push({
            $match: {
                $and: keywords
            }
        });
    }


    pipelines.push({
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "likes"
        }
    });

    pipelines.push({
        $addFields: {
            likesCount: { $size: "$likes" }
        }
    });

    const videoAggregate = Video.aggregate(pipelines);

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {
            [sortBy || "createdAt"]: sortType === "asc" ? 1 : -1
        }
    };

    const result = await Video.aggregatePaginate(videoAggregate, options);
    return res
        .status(200)
        .json(
            new APIResponse(200, result, "Videos fetched successfully")
        )
})

const publishVideo = asyncHandler(async (req, res) => {
    // get title and description from frontend
    const { title, description, isPublished = true } = req.body;
    // validate title and description
    if (
        [title, description].some((field) => !field || field?.trim() === "")
    ) {
        throw new APIError(400, "Title and description are required")
    }
    // get video local path
    const videoLocalPath = req.files?.video[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    // if video local path is not present throw error
    if (!videoLocalPath) {
        throw new APIError(400, "Video is required")
    }

    if (req.files?.video[0]?.size > VIDEO_SIZE_LIMIT) {
        throw new APIError(400, "Video file is too large! Maximum size allowed is 100MB.")
    }

    // if thumbnail is not present throw error
    if (!thumbnailLocalPath) {
        throw new APIError(400, "Thumbnail is required")
    }

    if (req.files?.thumbnail[0]?.size > IMAGE_SIZE_LIMIT) {
        throw new APIError(400, "Thumbnail is too large! Maximum size allowed is 10MB.")
    }
    const videoPublicId = new mongoose.Types.ObjectId()

    // upload video to cloudinary
    const videoFile = await uploadVideoOnCloudinary(videoLocalPath, videoPublicId);
    const thumbnailFile = await uploadImageOnCloudinary(thumbnailLocalPath, `${videoPublicId}_thumbnail`);
    // if video upload fails throw error
    if (!videoFile) {
        throw new APIError(500, "Video upload failed")
    }
    // if thumbnail upload fails throw error
    if (!thumbnailFile) {
        throw new APIError(500, "Thumbnail upload failed")
    }
    // create video object
    const video = await Video.create({
        _id: videoPublicId,
        videoFile: videoFile.secure_url,
        thumbnail: thumbnailFile.secure_url,
        title: title,
        description: description,
        duration: videoFile.duration,
        isPublished: isPublished,
        owner: req.user._id
    })

    // return 
    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                video,
                "Video published successfully"
            )
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new APIError(400, "Invalid video ID");
    }

    // Increment views only if requested (specifically from VideoDetail page)
    // We do this BEFORE the main aggregation so the response includes the updated count
    if (req.query.incrementView === "true") {
        await Video.findByIdAndUpdate(videoId, {
            $inc: { views: 1 }
        });

        // Add to watch history only when viewing
        // Move to front + unique using sequential database calls for maximum reliability
        if (req.user) {
            try {
                // Remove the video from history if it exists (Atomic Pull)
                await User.findByIdAndUpdate(req.user._id, {
                    $pull: { watchHistory: new mongoose.Types.ObjectId(videoId) }
                });

                // Add it to the front (Atomic Push at position 0)
                await User.findByIdAndUpdate(req.user._id, {
                    $push: {
                        watchHistory: {
                            $each: [new mongoose.Types.ObjectId(videoId)],
                            $position: 0
                        }
                    }
                });
            } catch (err) {
                console.error("Watch history update failed:", err);
            }
        }
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
                $or: [
                    { isPublished: true },
                    { owner: req.user?._id }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            subscribersCount: { $size: "$subscribers" },
                            isSubscribed: {
                                $cond: {
                                    if: req.user?._id ? { $in: [new mongoose.Types.ObjectId(req.user._id), "$subscribers.subscriber"] } : false,
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                            description: 1,
                            subscribersCount: 1,
                            isSubscribed: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                ownerDetails: {
                    $first: "$ownerDetails"
                }
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                isLiked: {
                    $cond: {
                        if: req.user?._id ? { $in: [new mongoose.Types.ObjectId(req.user._id), "$likes.likedBy"] } : false,
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "comments"
            }
        },
        {
            $addFields: {
                commentsCount: {
                    $size: "$comments"
                }
            }
        }

    ]);

    if (!video?.length) {
        throw new APIError(404, "Video not found");
    }


    return res
        .status(200)
        .json(
            new APIResponse(200, video[0], "Video fetched successfully")
        );
})

const updateVideo = asyncHandler(async (req, res) => {
    // get videoId from params
    const { videoId } = req.params;
    // get video from db
    const video = await Video.findById(videoId);
    const userId = req.user?._id;
    // if video is not there, throw error
    if (!video) {
        throw new APIError(404, "Video not found");
    }

    if (!userId || userId.toString() !== video.owner.toString()) {
        throw new APIError(401, "Unauthorized");
    }
    // get update details from body
    const { title, description, isPublished } = req.body;
    // update details
    video.title = title || video.title;
    video.description = description || video.description;

    if (isPublished !== undefined) {
        video.isPublished = isPublished;
    }

    // get local paths for video and thumbnail
    const newVideoLocalPath = req.files?.video?.[0]?.path;
    const newThumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (newVideoLocalPath) {
        if (req.files?.video[0]?.size > VIDEO_SIZE_LIMIT) {
            throw new APIError(400, "Video file is too large! Maximum size allowed is 100MB.")
        }
        const videoFile = await uploadVideoOnCloudinary(newVideoLocalPath, video._id);
        if (!videoFile) {
            throw new APIError(500, "Video upload failed");
        }
        video.videoFile = videoFile.secure_url;
        video.duration = videoFile.duration;
    }

    if (newThumbnailLocalPath) {
        if (req.files?.thumbnail[0]?.size > IMAGE_SIZE_LIMIT) {
            throw new APIError(400, "Thumbnail is too large! Maximum size allowed is 10MB.")
        }
        const thumbnailFile = await uploadImageOnCloudinary(newThumbnailLocalPath, `${video._id}_thumbnail`);
        if (!thumbnailFile) {
            throw new APIError(500, "Thumbnail upload failed");
        }
        video.thumbnail = thumbnailFile.secure_url;
    }

    await video.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                video,
                "Video updated successfully"
            )
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    // get videoId from params
    const { videoId } = req.params;
    const userId = req.user?._id;
    // get video from db
    const video = await Video.findById(videoId);
    // if video is not there, throw error
    if (!video) {
        throw new APIError(404, "Video not found");
    }

    if (!userId || userId.toString() !== video.owner.toString()) {
        throw new APIError(401, "Unauthorized");
    }
    // delete video from cloudinary
    const deletedVideo = await deleteVideoFromCloudinary((video._id).toString());
    // delete video from db
    await video.deleteOne();
    // delete comments
    const deleteComments = await Comment.deleteMany({ video: videoId });
    // delete likes
    const deleteLikes = await Like.deleteMany({ video: videoId });
    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                video,
                "Video deleted successfully"
            )
        )
})

export { getAllVideos, publishVideo, getVideoById, updateVideo, deleteVideo }