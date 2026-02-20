import mongoose, { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["processing", "completed", "failed"],
        default: "processing"
    }
}, { timestamps: true })

videoSchema.index({ title: "text", description: "text" });

videoSchema.plugin(mongooseAggregatePaginate)
// ttl for un-uploaded videos
videoSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 420,
    partialFilterExpression: { $or: [{ "status": "processing" }, { "status": "failed" }] }
});

export const Video = model("Video", videoSchema);