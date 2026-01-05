import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.v2.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        console.log(`File uploaded successfully on Cloudinary! ${response.secure_url}`);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload failed
        return null;
    }
}

export { uploadOnCloudinary };