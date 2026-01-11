import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribers, getSubscriptions, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();

router.route("/subscribe").post(verifyJWT, toggleSubscription);
router.route("/subscribers").get(verifyJWT, getSubscribers);
router.route("/subscribed").get(verifyJWT, getSubscriptions);

export default router;
