import multer from "multer";
import os from "os";

const storage = multer.diskStorage({ // disk storage instead of memory storage
    destination: function (req, file, cb) {
        cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
})

export const upload = multer({
    storage: storage
})