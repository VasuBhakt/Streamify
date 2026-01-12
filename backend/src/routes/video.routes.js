import { Router } from "express";
import { getAllVideos, getVideoById, publishVideo, updateVideo, deleteVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, getOptionalUser } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").get(getAllVideos)
router.route("/:videoId").get(getOptionalUser, getVideoById)

router.route("/publish").post(verifyJWT,
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishVideo
)
router.route("/update/:videoId").patch(verifyJWT,
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    updateVideo
)
router.route("/delete/:videoId").delete(verifyJWT, deleteVideo)

export default router