import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/:videoId").get(getVideoComments);

// secure
router.route("/:videoId").post(verifyJWT, addComment);
router.route("/:videoId/:commentId").patch(verifyJWT, updateComment);
router.route("/:videoId/:commentId").delete(verifyJWT, deleteComment);

export default router;