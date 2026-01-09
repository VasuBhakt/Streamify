import { asyncHandler } from "../utils/asyncHandler.js";
import APIError from "../utils/ApiError.js";
import APIResponse from "../utils/ApiResponse.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new APIError(404, "User not found for this id");
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        // already validated user in login
        return { accessToken, refreshToken }

    } catch (error) {
        console.log("Refresh Token Error");
        throw new APIError(500, "Something went wrong!")
    }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        // get refresh token from cookies
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        // if no refresh token throw error
        if (!incomingRefreshToken) {
            throw new APIError(401, "Unauthorized request")
        }

        // decode refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        // find user
        const user = await User.findById(decodedToken?._id);

        // if no user is found, throw error
        if (!user) {
            throw new APIError(401, "Invalid Token")
        }

        // verify refresh token
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new APIError(401, "Refresh Token is expired")
        }

        // generate new access and refresh token
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new APIResponse(200, {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                    "Access Token Refreshed Successfully"
                )
            )
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid refresh token")
    }
})


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

    // check if user already exists with username or email
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
    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatar", username.toLowerCase());
    const coverImage = (coverImageLocalPath) ? await uploadOnCloudinary(coverImageLocalPath, "coverImage", username.toLowerCase()) : null;

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

const loginUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validate user details for empty fields
    // check if user exists with username or email
    // check password
    // generate access and refresh token
    // send cookies
    // success response

    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new APIError(400, "Email or username is required");
    }

    if (!password) {
        throw new APIError(400, "Password is required");
    }

    const user = await User.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    })

    if (!user) {
        throw new APIError(404, "User not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new APIError(401, "Invalid password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    const options = {
        httpOnly: true, // these allow cookies to be modified only via server, not via client
        secure: true,
    }

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new APIResponse(201,
                {
                    loggedInUser, accessToken, refreshToken,
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    // reset refresh token in user
    // clear cookies

    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true, // these allow cookies to be modified only via server, not via client
        secure: true,
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new APIResponse(200, {}, "User logged out successfully")
        )

})

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
    //get old and new passwords
    const { oldPassword, newPassword } = req.body
    //get user
    const userId = req.user._id
    const user = await User.findById(userId)
    // check if old password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new APIError(401, "Invalid password")
    }
    // set new password
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new APIResponse(200, {}, "Password changed successfully")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new APIResponse(
            200, req.user, "Current user fetched successfully"
        ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { fullName, email } = req.body;

    if (!fullName && !email) {
        throw new APIError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                fullName: fullName,
                email: email
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(new APIResponse(
            200, {}, "Account Details updated successfully"
        ))
})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalFilePath = req.file?.path

    if (!avatarLocalFilePath) {
        throw new APIError(404, "Bad Request")
    }

    const avatar = await uploadOnCloudinary(avatarLocalFilePath, "avatar", req.user.username)

    if (!avatar) {
        throw new APIError(500, "Avatar upload failed")
    }

    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                avatar: avatar.secure_url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    res
        .status(200)
        .json(new APIResponse(
            200, user, "Avatar updated successfully"
        ))

})

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalFilePath = req.file?.path

    if (!coverImageLocalFilePath) {
        throw new APIError(404, "Bad Request")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalFilePath, "coverImage", req.user.username)

    if (!coverImage) {
        throw new APIError(500, "Cover Image upload failed")
    }

    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                coverImage: coverImage.secure_url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    res
        .status(200)
        .json(new APIResponse(
            200, user, "Cover Image updated successfully"
        ))

})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new APIError(400, "Bad Request. Username is missing");
    }

    // aggregation pipelines for subscriber count
    const channel = await User.aggregate([
        // match the user
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        // lookup the subscriptions to user's channel
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        // lookup the channels the user is subscribed to
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        // add Fields to channel 
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                // this works by the logic
                // req.user gives the current logged in user
                // for the channel, it checks if the current logged in user is subscribed to it or not
                // if yes, return true, else false
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        // data to be provided
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new APIError(404, "Channel does not exist");
    }

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                channel[0],
                "User channel fetched successfully"
            )
        )
})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id),
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                user[0].watchHistory,
                "Watch history fetched successfully"
            )
        )
})


export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentUserPassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage, getUserChannelProfile, getWatchHistory };
