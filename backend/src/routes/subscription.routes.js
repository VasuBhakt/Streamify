import { Router } from "express";
import { verifyJWT, getOptionalUser } from "../middlewares/auth.middleware.js";
import { getSubscribers, getSubscriptions, toggleSubscription, getSubscriptionStatus } from "../controllers/subscription.controller.js";

const router = Router();

router.route("/c/:channelId").post(verifyJWT, toggleSubscription);
router.route("/c/:channelId").get(getSubscribers);
router.route("/status/c/:channelId").get(getOptionalUser, getSubscriptionStatus);
router.route("/user").get(verifyJWT, getSubscriptions);

export default router;
