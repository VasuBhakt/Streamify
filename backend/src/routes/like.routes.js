import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLikeComment, toggleLikeVideo, userLikedVideos } from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle/v/:videoId").post(verifyJWT, toggleLikeVideo);
router.route("/toggle/c/:commentId").post(verifyJWT, toggleLikeComment);
router.route("/liked-videos").get(verifyJWT, userLikedVideos);

export default router;


