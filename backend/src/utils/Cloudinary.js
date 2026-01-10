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
            public_id: `${desc}_${username}`
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

// For videos and thumbnails
const uploadFileOnCloudinary = async (localFilePath, publicId) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            public_id: publicId
        })
        console.log(`File uploaded successfully on Cloudinary! ${response.public_id}`);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log(error);
        return null;
    }
}
export { uploadOnCloudinary, uploadFileOnCloudinary };