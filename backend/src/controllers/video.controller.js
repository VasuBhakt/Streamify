import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import APIResponse from "../utils/ApiResponse.js";
import APIError from "../utils/ApiError.js";
import { uploadVideoOnCloudinary, uploadImageOnCloudinary, deleteVideoFromCloudinary } from "../utils/Cloudinary.js";
import mongoose from "mongoose";

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

    // Search by query
    if (query) {
        pipelines.push({
            $match: {
                $or: [
                    // regex for expression matching on title, description of video, i for case insensitive
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                ]
            }
        });
    }

    // user joining for search by username or full name
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
                        _id: 0
                    }
                }
            ]
        }
    });

    pipelines.push({
        $unwind: "$ownerDetails"
    })

    // Search by query
    if (query) {
        pipelines.push({
            $match: {
                $or: [
                    // regex for expression matching on username (channel) of video or Channel full name, i for case insensitive
                    { "ownerDetails.username": { $regex: query, $options: "i" } },
                    { "ownerDetails.fullName": { $regex: query, $options: "i" } }
                ]
            }
        });
    }


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
    // if thumbnail is not present throw error
    if (!thumbnailLocalPath) {
        throw new APIError(400, "Thumbnail is required")
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
    // get videoId from params
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new APIError(400, "Invalid video ID");
    }

    // fetch from db and increment views
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: { views: 1 }
        },
        { new: true }
    );

    // if video is not there, throw error
    if (!video) {
        throw new APIError(404, "Video not found");
    }

    // Add to watch history if user is logged in
    if (req.user) {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { watchHistory: videoId } // pull the video id from watch history if watched previously
            }
        );
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $push: {
                    watchHistory: {
                        $each: [videoId],  //pushed into watch history
                        $position: 0
                    }
                }
            }
        );
    }

    // return video
    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                video,
                "Video fetched successfully"
            )
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    // get videoId from params
    const { videoId } = req.params;
    // get video from db
    const video = await Video.findById(videoId);
    // if video is not there, throw error
    if (!video) {
        throw new APIError(404, "Video not found");
    }
    // get update details from body
    const { title, description, isPublished } = req.body;
    // update details
    video.title = title || video.title;
    video.description = description || video.description;
    video.isPublished = isPublished || video.isPublished;

    // get local paths for video and thumbnail
    const newVideoLocalPath = req.files?.video?.[0]?.path;
    const newThumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (newVideoLocalPath) {
        const videoFile = await uploadVideoOnCloudinary(newVideoLocalPath, video._id);
        if (!videoFile) {
            throw new APIError(500, "Video upload failed");
        }
        video.videoFile = videoFile.secure_url;
        video.duration = videoFile.duration;
    }

    if (newThumbnailLocalPath) {
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
    // get video from db
    const video = await Video.findById(videoId);
    // if video is not there, throw error
    if (!video) {
        throw new APIError(404, "Video not found");
    }
    // delete video from cloudinary
    const deletedVideo = await deleteVideoFromCloudinary((video._id).toString());
    // delete video from db
    await video.deleteOne();
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