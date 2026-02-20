import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// For avatar and coverImage
const uploadOnCloudinary = async (localFilePath, desc, username) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            public_id: `${desc}_${username}`,
            overwrite: true,
            invalidate: true
        })
        console.log(`File uploaded successfully on Cloudinary! ${response.public_id}`);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload failed
        console.log(error);
        return null;
    }
}

// For videos, upload large will not work due to uploading in chunks, better keep upload for now
const uploadVideoOnCloudinary = async (localFilePath, publicId) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "video",
            public_id: publicId,
            overwrite: true,
            invalidate: true
        })
        console.log(`File uploaded successfully on Cloudinary! ${response.public_id}`);
        return response;
    } catch (error) {
        console.log("Cloudinary Video Upload Error:", error);
        return null;
    }
}

const uploadImageOnCloudinary = async (localFilePath, publicId) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
            public_id: publicId,
            overwrite: true,
            invalidate: true
        })
        console.log(`File uploaded successfully on Cloudinary! ${response.public_id}`);
        return response;
    } catch (error) {
        console.log("Cloudinary Image Upload Error:", error);
        return null;
    }
}

const deleteVideoFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        const video = await cloudinary.uploader.destroy(publicId, { resource_type: "video" }); // specify resource type for video
        const thumbnail = await cloudinary.uploader.destroy(`${publicId}_thumbnail`, { resource_type: "image" });
        console.log(`File deleted successfully from Cloudinary!`);
        console.log(`Thumbnail deleted successfully from Cloudinary!`);
        return { video, thumbnail };
    } catch (error) {
        console.log(error);
        return null;
    }
}
export { uploadOnCloudinary, uploadVideoOnCloudinary, uploadImageOnCloudinary, deleteVideoFromCloudinary };