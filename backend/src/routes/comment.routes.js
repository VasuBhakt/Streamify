import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT, getOptionalUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:videoId").get(getOptionalUser, getVideoComments);

// secure
router.route("/:videoId").post(verifyJWT, addComment);
router.route("/:videoId/:commentId").patch(verifyJWT, updateComment);
router.route("/:videoId/:commentId").delete(verifyJWT, deleteComment);

export default router;