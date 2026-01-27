import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb",
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

// routes import

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import healthCheckRouter from "./routes/healthcheck.routes.js"

// routes declaration

app.use("/users", userRouter)
app.use("/videos", videoRouter)
app.use("/playlists", playlistRouter)
app.use("/subscriptions", subscriptionRouter)
app.use("/likes", likeRouter)
app.use("/comments", commentRouter)
app.use("/dashboard", dashboardRouter)
app.use("/healthcheck", healthCheckRouter)

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || [],
    });
});

export { app }