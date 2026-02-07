# Streamify Backend

A robust Node.js backend API for the Streamify video streaming platform. Built with Express, MongoDB, Cloudinary, and JWT authentication.

> **Note:** This is proprietary software and is not open source. All rights reserved.

---

## 🎯 Overview

Production-ready Express.js application handling authentication, video management, social features, and analytics for the Streamify platform.

---

## 🏗️ Architecture

```
backend/
├── src/
│   ├── controllers/      # Business logic (user, video, comment, like, playlist, subscription, dashboard)
│   ├── models/           # MongoDB schemas (User, Video, Comment, Like, Playlist, Subscription)
│   ├── routes/           # API route definitions
│   ├── middlewares/      # JWT auth & file upload (Multer)
│   ├── utils/            # Cloudinary, email, error handling
│   └── db/               # MongoDB connection
├── public/               # Temporary file storage
└── .env                  # Environment variables
```

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

### 📁 **Playlist Service**
- Create, update, delete playlists
- Add/remove videos from playlists
- Get user playlists with video counts
- Owner-only modification permissions

### 🔔 **Subscription Service**
- Subscribe/unsubscribe to channels
- Get list of subscribed channels
- Get channel subscribers with pagination
- Prevent self-subscription

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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- SendGrid account

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `.env` file:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/streamify
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### Run Server

```bash
npm run dev    # Development with nodemon
npm start      # Production
```

---

## 📡 API Endpoints

### Authentication
All protected endpoints require:
```
Authorization: Bearer <access_token>
```

### **User** (`/users`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /refresh-token` - Refresh access token
- `GET /current-user` - Get current user
- `GET /c/:userId` - Get channel profile
- `PATCH /update-account` - Update profile
- `PATCH /avatar` - Update avatar
- `PATCH /cover-image` - Update cover
- `POST /change-password` - Change password
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password
- `GET /history` - Get watch history

### **Video** (`/videos`)
- `GET /` - Get all videos (with search, pagination, sorting)
- `POST /` - Upload video
- `GET /:videoId` - Get video by ID
- `PATCH /:videoId` - Update video
- `DELETE /:videoId` - Delete video
- `PATCH /toggle/publish/:videoId` - Toggle publish status

### **Comment** (`/comments`)
- `GET /:videoId` - Get video comments
- `POST /:videoId` - Add comment
- `PATCH /c/:commentId` - Update comment
- `DELETE /c/:commentId` - Delete comment

### **Like** (`/likes`)
- `POST /toggle/v/:videoId` - Toggle video like
- `POST /toggle/c/:commentId` - Toggle comment like
- `GET /videos` - Get liked videos

### **Playlist** (`/playlists`)
- `GET /user/:userId` - Get user playlists
- `POST /` - Create playlist
- `GET /:playlistId` - Get playlist by ID
- `PATCH /:playlistId` - Update playlist
- `DELETE /:playlistId` - Delete playlist
- `PATCH /add/:videoId/:playlistId` - Add video to playlist
- `PATCH /remove/:videoId/:playlistId` - Remove video from playlist

### **Subscription** (`/subscriptions`)
- `POST /c/:channelId` - Toggle subscription
- `GET /u/:subscriberId` - Get user subscriptions
- `GET /subscribers/:channelId` - Get channel subscribers

### **Dashboard** (`/dashboard`)
- `GET /stats` - Get channel statistics
- `GET /videos` - Get channel videos

### **Health** (`/healthcheck`)
- `GET /` - Check API health

---

## 🗄️ Database Models

### User
- username, email, fullName, description
- avatar, coverImage (Cloudinary URLs)
- password (bcrypt hashed), refreshToken
- watchHistory (array of video IDs)
- forgotPasswordToken, forgotPasswordTokenExpiry

### Video
- videoFile, thumbnail (Cloudinary URLs)
- title, description, duration, views
- isPublished, owner (User ref)

### Comment
- content, video (Video ref), owner (User ref)

### Like
- video (Video ref), comment (Comment ref), likedBy (User ref)

### Playlist
- name, description, videos (array of Video refs), owner (User ref)

### Subscription
- subscriber (User ref), channel (User ref)

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
- **Watch History Limit**: Capped at 50 videos (FIFO)

---

## 📝 License

This project is **proprietary software** and is not open source. All rights reserved.

---

## 👨‍💻 Author

**VasuBhakt**

---

**Built with Node.js, Express, and MongoDB** 🚀