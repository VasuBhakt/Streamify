import dotenv from "dotenv/config"

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        // Init Workers
        import("./workers/video.worker.js");

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`)
        })
    })
    .catch((err) => {
        console.log("MONGODB connection failed !!!", err);
    })




/*import express from "express";

const app = express()

    ; (async () => {  // ; before for cleaning purposes to seperate IIFE from previous code 

        try {
            await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
            app.on("error", () => {
                console.error("ERROR: ", error);
                throw error
            })
            app.listen(process.env.PORT, () => {
                console.log(`Server running on port ${process.env.PORT}`)
            })
        } catch (error) {
            console.error("ERROR: ", error)
            throw error
        }

    })()
*/
