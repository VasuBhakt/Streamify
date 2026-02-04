import { Playlist } from "../models/playlist.model.js";
import APIError from "../utils/ApiError.js";
import APIResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videos } = req.body;
    if (!name || !description) {
        throw new APIError(400, "Name and description are required")
    }

    // allow at most 500 videos in a single playlist
    let validatedVideos = Array.isArray(videos) ? videos : [];
    validatedVideos = (validatedVideos.length > 500) ? validatedVideos.slice(0, 500) : validatedVideos;

    const playlist = await Playlist.create({
        name,
        description,
        videos: validatedVideos,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(new APIResponse(201, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;
    const { userId } = req.params;
    // validate userId
    if (!userId) {
        throw new APIError(400, "Valid User id is required")
    }

    const playlistAggregate = Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        }
    ]);

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {
            [sortBy]: sortType === "asc" ? 1 : -1
        }
    }

    const result = await Playlist.aggregatePaginate(playlistAggregate, options);

    return res
        .status(200)
        .json(new APIResponse(200, result, "User Playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new APIError(400, "Playlist ID is required");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            ownerDetails: { $first: "$ownerDetails" }
                        }
                    }
                ]
            }
        }
    ]);

    if (!playlist?.length) {
        throw new APIError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new APIResponse(200, playlist[0], "Playlist fetched successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new APIError(400, "Invalid playlist Id");
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
        throw new APIError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new APIResponse(200, {}, "Playlist deleted successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { videoId, position } = req.body;
    if (!playlistId) {
        throw new APIError(400, "A valid playlist is required");
    }
    if (!videoId) {
        throw new APIError(400, "Video is needed");
    }

    // Check if playlist exists and its current size
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new APIError(404, "Playlist not found")
    }

    if (playlist.videos.length >= 500) {
        throw new APIError(400, "Playlist can have maximum 500 videos")
    }
    if (position - 1 >= playlist.videos.length) {
        playlist.videos.push(videoId);
    } else {
        playlist.videos.splice(position - 1, 0, videoId);
    }
    await playlist.save();
    return res
        .status(200)
        .json(new APIResponse(200, playlist, "Video added to playlist successfully"))
})

const deleteVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.body;
    if (!playlistId) {
        throw new APIError(400, "A valid playlist is required");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new APIError(404, "Playlist not found");
    }
    if (playlist.videos.length === 1) {
        throw new APIError(400, "Playlist can't be empty");
    }
    // Atomic removal using $pull
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: videoId }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new APIResponse(200, updatedPlaylist, "Video deleted from playlist successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId) {
        throw new APIError(400, "Invalid Playlist ID");
    }

    if (!name && !description) {
        throw new APIError(400, "Name or description is required for update");
    }
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: { name, description }
        },
        { new: true }
    );
    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                playlist,
                "Playlist updated successfully"
            )
        )
})

export { createPlaylist, getUserPlaylists, getPlaylistById, deletePlaylist, addVideoToPlaylist, deleteVideoFromPlaylist, updatePlaylist }
