# Streamify Backend

A robust Node.js backend API for the Streamify video streaming platform. Built with Express, MongoDB, Cloudinary, and JWT authentication, and hosted on Render.

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

| Category | Tools & Technologies |
| :--- | :--- |
| **Runtime & Framework** | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) |
| **Auth & Security** | ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Bcrypt](https://img.shields.io/badge/Bcrypt-37474F?style=for-the-badge) |
| **Media & Mail** | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white) ![SendGrid](https://img.shields.io/badge/SendGrid-00B2E3?style=for-the-badge&logo=SendGrid&logoColor=white) ![Multer](https://img.shields.io/badge/Multer-grey?style=for-the-badge) |
| **Infrastructure** | ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white) ![Atlas](https://img.shields.io/badge/MongoDB_Atlas-white?style=for-the-badge&logo=mongodb&logoColor=47A248) |

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
