import { Worker } from "bullmq";
import redisConnection from "../config/redisConfig.js";
import { uploadVideoOnCloudinary, uploadImageOnCloudinary, deleteVideoFromCloudinary } from "../utils/Cloudinary.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import fs from "fs";
import { invalidateCache } from "../utils/Cache.js";
import { sendEmail } from "../utils/mail.js";
import APIError from "../utils/ApiError.js";

const videoWorker = new Worker(
    "video-processing",
    async (job) => {
        try {
            switch (job.name) {
                case "upload": {
                    const { videoLocalPath, thumbnailLocalPath, title, isPublished, videoPublicId } = job.data;
                    console.log(`Processing UPLOAD job ${job.id} for video: ${title}`);

                    const videoFile = await uploadVideoOnCloudinary(videoLocalPath, videoPublicId);
                    const thumbnailFile = await uploadImageOnCloudinary(thumbnailLocalPath, `${videoPublicId}_thumbnail`);

                    if (!videoFile || !thumbnailFile) {
                        throw new APIError(500, "Cloudinary upload failed");
                    }

                    // Update the existing record we created in the controller
                    await Video.findByIdAndUpdate(videoPublicId, {
                        videoFile: videoFile.secure_url,
                        thumbnail: thumbnailFile.secure_url,
                        duration: videoFile.duration || 0,
                        isPublished: isPublished,
                        status: "completed"
                    });

                    await invalidateCache(`videos:feed:1:10:all:createdAt:desc`);

                    if (videoLocalPath && fs.existsSync(videoLocalPath)) fs.unlinkSync(videoLocalPath);
                    if (thumbnailLocalPath && fs.existsSync(thumbnailLocalPath)) fs.unlinkSync(thumbnailLocalPath);

                    console.log(`Upload job ${job.id} completed.`);
                    break;
                }

                case "delete": {
                    const { videoPublicId } = job.data;
                    console.log(`Processing DELETE job ${job.id} for videoId: ${videoPublicId}`);

                    // 1. Delete from Cloudinary
                    await deleteVideoFromCloudinary(videoPublicId);

                    // 2. Clear related data and cache
                    await Promise.all([
                        Comment.deleteMany({ video: videoPublicId }),
                        Like.deleteMany({ video: videoPublicId }),
                        invalidateCache(`video:${videoPublicId}`),
                        invalidateCache(`videos:feed:1:10:all:createdAt:desc`)
                    ]);

                    console.log(`Delete job ${job.id} completed.`);
                    break;
                }

                case "patch": {
                    const { videoLocalPath, thumbnailLocalPath, videoPublicId, title, description, isPublished } = job.data;
                    console.log(`Processing PATCH job ${job.id} for video: ${videoPublicId}`);

                    const updateData = {};
                    if (title) updateData.title = title;
                    if (description) updateData.description = description;
                    if (isPublished !== undefined) updateData.isPublished = isPublished;

                    if (videoLocalPath) {
                        const videoFile = await uploadVideoOnCloudinary(videoLocalPath, videoPublicId);
                        if (!videoFile) throw new APIError(500, "Video update failed on Cloudinary");
                        updateData.videoFile = videoFile.secure_url;
                        updateData.duration = videoFile.duration || 0;
                    }

                    if (thumbnailLocalPath) {
                        const thumbnailFile = await uploadImageOnCloudinary(thumbnailLocalPath, `${videoPublicId}_thumbnail`);
                        if (!thumbnailFile) throw new APIError(500, "Thumbnail update failed on Cloudinary");
                        updateData.thumbnail = thumbnailFile.secure_url;
                    }

                    updateData.status = "completed";

                    await Video.findByIdAndUpdate(videoPublicId, updateData);

                    await Promise.all([
                        invalidateCache(`video:${videoPublicId}`),
                        invalidateCache(`videos:feed:1:10:all:createdAt:desc`)
                    ]);

                    if (videoLocalPath && fs.existsSync(videoLocalPath)) fs.unlinkSync(videoLocalPath);
                    if (thumbnailLocalPath && fs.existsSync(thumbnailLocalPath)) fs.unlinkSync(thumbnailLocalPath);

                    console.log(`Patch job ${job.id} completed.`);
                    break;
                }

                default:
                    console.warn(`Unknown job name: ${job.name}`);
            }
        } catch (error) {
            console.error(`Job ${job.id} failed:`, error);
            throw error;
        }
    },
    { connection: redisConnection }
);

videoWorker.on("completed", (job) => {
    console.log(`Job ${job.id} (${job.name}) completed successfully`);
});

videoWorker.on("failed", async (job, err) => {
    console.error(`Job ${job.id} (${job.name}) failed: ${err.message}`);

    // Clean up files after ALL retries have failed for upload or patch jobs
    if (job.name === "upload" || job.name === "patch") {
        const { videoLocalPath, thumbnailLocalPath, videoPublicId, title, userEmail } = job.data;

        if (job.attemptsMade >= job.opts.attempts) {
            console.log(`Max retries reached for ${job.name} job ${job.id}. Cleaning up and notifying user...`);

            // 1. Mark status as failed in DB
            await Video.findByIdAndUpdate(videoPublicId, { status: "failed" });

            // 2. Send email to user
            if (userEmail) {
                try {
                    await sendEmail({
                        email: userEmail,
                        subject: `Video Upload Failed: ${title}`,
                        message: `
                            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                                <h2 style="color: #e53e3e;">Upload Failed</h2>
                                <p>We're sorry, your video <strong>"${title}"</strong> could not be processed after several attempts.</p>
                                <p><strong>Reason:</strong> ${err.message}</p>
                                <p>Please try uploading it some time later from the Studio.</p>
                                <hr />
                                <small>You are receiving this because you are a creator on Streamify.</small>
                            </div>
                        `
                    });
                } catch (emailErr) {
                    console.error("Failed to notify user via email:", emailErr);
                }
            }

            if (videoLocalPath && fs.existsSync(videoLocalPath)) fs.unlinkSync(videoLocalPath);
            if (thumbnailLocalPath && fs.existsSync(thumbnailLocalPath)) fs.unlinkSync(thumbnailLocalPath);
        }
    }
});

export default videoWorker;

