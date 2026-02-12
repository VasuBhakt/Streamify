import mongoose, { Schema, model } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import crypto from "crypto";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: "Please enter a valid email"
        }
    },
    fullName: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    password: {
        type: String,
        required: [
            true, " Password is required"
        ],

    },
    refreshToken: {
        type: String,
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordTokenExpiry: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyToken: {
        type: String,
    },
    verifyTokenExpiry: {
        type: Date,
    }
}, { timestamps: true })

userSchema.plugin(mongooseAggregatePaginate)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return; // doesn't need next to be called
    this.password = await bcrypt.hash(this.password, 10)
    // doesn't need next to be called
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

userSchema.methods.generateForgotPasswordToken = function () {
    // 1. generate random token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. hash token and set to db field
    this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // 3. set expire
    this.forgotPasswordTokenExpiry = Date.now() + 30 * 60 * 1000; // 10 minutes

    return resetToken;
}

userSchema.methods.generateVerifyToken = function () {
    const verificationToken = crypto.randomBytes(20).toString('hex');

    this.verifyToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    this.verifyTokenExpiry = Date.now() + 3 * 60 * 60 * 1000; // 3 hours

    return verificationToken;
}

// TTL index to delete unverified accounts after 3 hours
// This index will only apply to documents that have verifyTokenExpiry
userSchema.index({ verifyTokenExpiry: 1 }, { expireAfterSeconds: 0 });

export const User = model("User", userSchema)