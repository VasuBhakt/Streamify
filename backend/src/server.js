import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env"
});

connectDB()
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
