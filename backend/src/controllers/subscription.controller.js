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

    if (!mongoose.isValidObjectId(channelId)) {
        throw new APIError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.aggregate([
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

    return res
        .status(200)
        .json(
            new APIResponse(200, subscribers, "Subscribers fetched successfully!")
        )
})

const getSubscriptionStatus = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new APIError(400, "Invalid channel ID");
    }

    const subscribersCount = await Subscription.countDocuments({ channel: channelId });
    let isSubscribed = false;
    if (req.user) {
        const sub = await Subscription.findOne({
            channel: channelId,
            subscriber: req.user._id
        });
        isSubscribed = !!sub;
    }

    return res
        .status(200)
        .json(
            new APIResponse(200, { subscribersCount, isSubscribed }, "Subscription status fetched successfully")
        );
})

export { toggleSubscription, getSubscriptions, getSubscribers, getSubscriptionStatus }