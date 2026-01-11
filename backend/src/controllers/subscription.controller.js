import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import APIResponse from "../utils/ApiResponse.js";

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
    const pipelines = [];
    pipelines.push({
        $match: {
            subscriber: new mongoose.Types.ObjectId(req.user._id)
        }
    })
    const subscriptions = await Subscription.aggregate(pipelines);
    return res
        .status(200)
        .json(
            new APIResponse(200, subscriptions, "Subscriptions fetched successfully!")
        )
})

const getSubscribers = asyncHandler(async (req, res) => {
    const pipelines = [];
    pipelines.push({
        $match: {
            channel: new mongoose.Types.ObjectId(req.user._id)
        }
    })
    const subscribers = await Subscription.aggregate(pipelines);
    return res
        .status(200)
        .json(
            new APIResponse(200, subscribers, "Subscribers fetched successfully!")
        )
})

export { toggleSubscription, getSubscriptions, getSubscribers }