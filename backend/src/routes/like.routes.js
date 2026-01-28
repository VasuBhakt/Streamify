import { Router } from "express";
import { verifyJWT, getOptionalUser } from "../middlewares/auth.middleware.js";
import { toggleLikeComment, toggleLikeVideo, userLikedVideos, getVideoLikeStatus } from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle/v/:videoId").post(verifyJWT, toggleLikeVideo);
router.route("/toggle/c/:commentId").post(verifyJWT, toggleLikeComment);
router.route("/status/v/:videoId").get(getOptionalUser, getVideoLikeStatus);
router.route("/liked-videos").get(verifyJWT, userLikedVideos);

export default router;


