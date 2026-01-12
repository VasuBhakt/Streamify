import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideosOfChannel, getChannelStats } from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getChannelStats)
router.route("/videos").get(verifyJWT, getAllVideosOfChannel)

export default router
