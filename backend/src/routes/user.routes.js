import { Router } from "express";
import {
    loginUser,
    registerUser,
    logoutUser,
    refreshAccessToken,
    updateAvatar,
    updateCoverImage,
    changeCurrentUserPassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    forgotPassword,
    resetPassword,
    updateAccountDetails,
    deleteAccount
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, getOptionalUser } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/update-details").patch(verifyJWT, updateAccountDetails);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/c/:username").get(getOptionalUser, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/delete-account").delete(verifyJWT, deleteAccount);


export default router