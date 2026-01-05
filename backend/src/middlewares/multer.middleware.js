import multer from "multer";

const storage = multer.diskStorage({ // disk storage instead of memory storage
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname) // fieldname is the name of the file in the form
    }
})

export const upload = multer({
    storage: storage
})