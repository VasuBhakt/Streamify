import { asyncHandler } from "../utils/asyncHandler.js";
import APIError from "../utils/ApiError.js";
import APIResponse from "../utils/ApiResponse.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty, email
    // check if user already exists : using username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar check
    // create user - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return response

    // Get user details from frontend
    const { fullName, username, email, password } = req.body;
    // console.log("email: ", email);

    // validate user details for empty fields
    if (
        [fullName, email, username, password].some((cred) => (
            !cred || cred?.trim() === "" // check in each field whether any of it is empty or not
        ))
    ) {
        throw new APIError(400, "All fields are required")
    }

    // validate email
    if (!validator.isEmail(email)) {
        throw new APIError(400, "Invalid email")
    }

    // check if user already exists with username or password
    const existingUser = await User.findOne({
        $or: [                               // MongoDB syntax
            { username: username }, { email: email }
        ]
    })

    // if user exists throw error
    if (existingUser) {
        throw new APIError(409, "User already exists")
    }

    // check for local image file paths
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    // if avatar is not provided throw error
    if (!avatarLocalPath) {
        throw new APIError(400, "Avatar is required")
    }

    // upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = (coverImageLocalPath) ? await uploadOnCloudinary(coverImageLocalPath) : null;

    // if avatar upload fails throw error
    if (!avatar) {
        throw new APIError(400, "Avatar upload failed")
    }

    // create user object
    const user = await User.create({
        fullName: fullName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        avatar: avatar.secure_url,
        coverImage: (coverImage) ? coverImage.secure_url : "", // if ccoverImage is not provided then return empty string
        password: password,
    })

    // remove password and refresh token from response object and check if user has been created, one extra db call
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    // if user creation fails throw error
    if (!createdUser) {
        throw new APIError(500, "Creation of user failed")
    }

    // success response
    return res.status(201).json(
        new APIResponse(201, createdUser, "User registered successfully")
    )
})

export { registerUser };
