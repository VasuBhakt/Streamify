# Streamify Backend

A robust Node.js backend API for the Streamify video streaming platform. Built with Express, MongoDB, Cloudinary, and JWT authentication.

> **Note:** This is proprietary software and is not open source. All rights reserved.

---

## 🎯 Overview

Production-ready Express.js application handling authentication, video management, social features, and analytics for the Streamify platform.

---

## ✨ Features Overview

### 🔐 **User Service**
- Register/login with JWT (access + refresh tokens)
- Password reset via email (SendGrid)
- Profile management (avatar, cover image, account details)
- Watch history tracking (last 50 videos)
- Login with username or email

### 🎬 **Video Service**
- Upload videos with thumbnails to Cloudinary
- Full-text search across titles, descriptions, and channels
- Pagination and sorting (date, views, relevance)
- View tracking and watch history integration
- Draft/publish status management

### 💬 **Comment Service**
- Add, edit, delete comments on videos
- Paginated comment retrieval with owner details
- Like count per comment
- Owner-only edit/delete permissions

### ❤️ **Like Service**
- Toggle likes on videos and comments
- Prevent duplicate likes
- Get all videos liked by user (paginated)
- Real-time like count updates

### 🔔 **Subscription Service**
- Subscribe/unsubscribe to channels
- Get list of subscribed channels
- Get channel subscribers with pagination

### 📊 **Dashboard Service**
- Channel statistics (total views, subscribers, videos, likes)
- Get all channel videos (published + drafts)
- Video-level analytics (views, likes, comments)
- Sorting and pagination support

---

## 🛠️ Technology Stack

- **Runtime**: Node.js with Express 5.2.1
- **Database**: MongoDB with Mongoose 9.1.1
- **Authentication**: JWT (jsonwebtoken 9.0.3) + bcrypt 6.0.0
- **File Upload**: Multer 2.0.2 + Cloudinary 2.8.0
- **Email**: SendGrid (@sendgrid/mail 8.1.6)
- **Validation**: validator 13.15.26
- **Pagination**: mongoose-aggregate-paginate-v2 1.1.4

---

## 🔐 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Separate access (15min) and refresh (7d) tokens
- **HttpOnly Cookies**: Secure token storage
- **Password Reset**: Time-limited SHA-256 hashed tokens (30min)
- **CORS Protection**: Configured origin whitelisting
- **Input Validation**: Server-side validation for all inputs
- **Owner Verification**: Users can only modify their own content

---

## 📊 Performance Optimizations

- **MongoDB Indexing**: Text indexes on video title/description
- **Aggregation Pipelines**: Efficient data retrieval
- **Pagination**: Server-side pagination for large datasets
- **Cloudinary CDN**: Optimized media delivery

---

## 📝 License

This project is **proprietary software** and is not open source. All rights reserved.

---

## 👨‍💻 Author

**VasuBhakt**

---

**Built with Node.js, Express, and MongoDB** 🚀
