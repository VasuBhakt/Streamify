import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import APIResponse from "../utils/ApiResponse.js";
import APIError from "../utils/ApiError.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!channelId) {
        throw new APIError(400, "Channel ID is required")
    }
    if (channelId === req.user._id) {
        throw new APIError(400, "You cannot subscribe to yourself")
    }
    const pipelines = [];
    pipelines.push({
        $match: {
            subscriber: new mongoose.Types.ObjectId(req.user._id),
            channel: new mongoose.Types.ObjectId(channelId)
        }
    })
    const subscription = await Subscription.aggregate(pipelines);
    let response;
    if (!subscription || subscription.length === 0) {
        response = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
    } else {
        response = await Subscription.deleteOne({
            subscriber: req.user._id,
            channel: channelId
        })
    }
    return res
        .status(201)
        .json(
            new APIResponse(201, response, "Subscription toggled successfully!")
        )
})

const getSubscriptions = asyncHandler(async (req, res) => {
    const subscriberId = req.user._id;

    const subscriptions = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
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
            $unwind: "$channel"
        },
        {
            $project: {
                _id: 1,
                channel: 1,
                createdAt: 1
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new APIResponse(200, subscriptions, "Subscriptions fetched successfully!")
        )
})

const getSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new APIError(400, "Invalid channel ID");
    }

    const subscribersAggregate = Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
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
            $unwind: "$subscriber"
        }
    ]);

    // Check if pagination is requested (query params exist)
    if (req.query.page || req.query.limit) {
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const result = await Subscription.aggregatePaginate(subscribersAggregate, options);

        return res
            .status(200)
            .json(
                new APIResponse(200, result, "Subscribers fetched successfully with pagination!")
            );
    }

    // Default: return all subscribers (maintaining backward compatibility)
    const subscribers = await subscribersAggregate;

    return res
        .status(200)
        .json(
            new APIResponse(200, subscribers, "Subscribers fetched successfully!")
        )
})

export { toggleSubscription, getSubscriptions, getSubscribers }