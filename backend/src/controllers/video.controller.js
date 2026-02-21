import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import APIResponse from "../utils/ApiResponse.js";
import APIError from "../utils/ApiError.js";
import { uploadVideoOnCloudinary, uploadImageOnCloudinary, deleteVideoFromCloudinary } from "../utils/Cloudinary.js";
import mongoose from "mongoose";
import { VIDEO_SIZE_LIMIT, IMAGE_SIZE_LIMIT } from "../constants.js";
import { addVideoJob } from "../queues/video.queue.js";
import { getCachedData, invalidateCache } from "../utils/Cache.js";
import fs from "fs";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc" } = req.query;

    const cacheKey = `videos:feed:${page}:${limit}:${query || "all"}:${sortBy}:${sortType}`;

    const result = await getCachedData(cacheKey, 300, async () => {
        const pipelines = [];

        pipelines.push({
            $match: {
                isPublished: true
            }
        });

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
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        };

        return await Video.aggregatePaginate(videoAggregate, options);
    });

    return res
        .status(200)
        .json(
            new APIResponse(200, result, "Videos fetched successfully")
        )
})

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished = true } = req.body;

    if ([title, description].some((field) => !field || field?.trim() === "")) {
        throw new APIError(400, "Title and description are required");
    }

    const videoLocalPath = req.files?.video?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

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

    const videoPublicId = new mongoose.Types.ObjectId();

    // 1. CREATE VIDEO RECORD IMMEDIATELY (So user sees "Processing" in Dashboard)
    const video = await Video.create({
        _id: videoPublicId,
        title,
        description,
        isPublished: false, // Default to false until processed
        owner: req.user._id,
        videoFile: "pending", // Placeholders
        thumbnail: "pending",
        duration: 0,
        status: "processing"
    });

    // 2. HAND OFF TO QUEUE
    const job = await addVideoJob("upload", {
        videoLocalPath,
        thumbnailLocalPath,
        title,
        description,
        isPublished,
        userId: req.user._id,
        videoPublicId: videoPublicId.toString(),
        userEmail: req.user.email // Pass email for failure notification
    });

    // Invalidate the first few pages of relevant feed caches
    await invalidateCache(`videos:feed:1:10:all:createdAt:desc`);

    return res
        .status(202)
        .json(
            new APIResponse(
                202,
                { jobId: job.id, videoId: videoPublicId },
                "Video upload started in background. You will see it in your dashboard as 'processing'."
            )
        );
});

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
    const { videoId } = req.params;
    const { title, description, isPublished } = req.body;

    const video = await Video.findById(videoId);
    const userId = req.user?._id;
    // if video is not there, throw error
    if (!video) {
        throw new APIError(404, "Video not found");
    }

    if (!userId || userId.toString() !== video.owner.toString()) {
        throw new APIError(401, "Unauthorized");
    }

    const newVideoLocalPath = req.files?.video?.[0]?.path;
    const newThumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    // If no files are provided, perform a simple synchronous update
    if (!newVideoLocalPath && !newThumbnailLocalPath) {
        video.title = title || video.title;
        video.description = description || video.description;
        if (isPublished !== undefined) video.isPublished = isPublished;

        await video.save({ validateBeforeSave: false });
        await invalidateCache(`video:${videoId}`);
        await invalidateCache(`videos:feed:1:10:all:createdAt:desc`);

        return res
            .status(200)
            .json(new APIResponse(200, video, "Video details updated successfully"));
    }

    // Checking file sizes before queuing
    if (newVideoLocalPath && req.files.video[0].size > VIDEO_SIZE_LIMIT) {
        if (fs.existsSync(newVideoLocalPath)) fs.unlinkSync(newVideoLocalPath);
        throw new APIError(400, "Video file is too large! Maximum size allowed is 100MB.");
    }

    if (newThumbnailLocalPath && req.files.thumbnail[0].size > IMAGE_SIZE_LIMIT) {
        if (fs.existsSync(newThumbnailLocalPath)) fs.unlinkSync(newThumbnailLocalPath);
        throw new APIError(400, "Thumbnail is too large! Maximum size allowed is 10MB.");
    }

    // If files ARE provided, mark as processing and hand off to queue
    video.status = "processing";
    if (title) video.title = title;
    if (description) video.description = description;
    if (isPublished !== undefined) video.isPublished = isPublished;

    await video.save({ validateBeforeSave: false });

    const job = await addVideoJob("patch", {
        videoPublicId: video._id.toString(),
        videoLocalPath: newVideoLocalPath,
        thumbnailLocalPath: newThumbnailLocalPath,
        title,
        description,
        isPublished
    });

    await Promise.all([
        invalidateCache(`video:${videoId}`),
        invalidateCache(`videos:feed:1:10:all:createdAt:desc`)
    ]);

    return res
        .status(202)
        .json(
            new APIResponse(
                202,
                { jobId: job.id, videoId: video._id },
                "Video update started in background. Changes will reflect shortly."
            )
        );
});

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

    // 1. Delete the video object immediately so it disappears from UI
    // We keep the data we need for the worker first
    const videoDataForWorker = {
        videoPublicId: video._id.toString()
    };

    await video.deleteOne();

    // 2. Queue the heavy lifting (Cloudinary, Likes, Comments)
    await addVideoJob("delete", videoDataForWorker);

    // 3. Clear Cache immediately
    await Promise.all([
        invalidateCache(`video:${videoId}`),
        invalidateCache(`videos:feed:1:10:all:createdAt:desc`)
    ]);

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

export { getAllVideos, publishVideo, getVideoById, updateVideo, deleteVideo };