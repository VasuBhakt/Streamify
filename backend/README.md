# Streamify Backend

A robust, scalable Node.js backend API for the Streamify video streaming platform. Built with Express, MongoDB, and modern authentication patterns, this RESTful API provides comprehensive endpoints for user management, video operations, social features, and analytics.

> **Note:** This is proprietary software and is not open source. All rights reserved.

---

## 🎯 Overview

The Streamify backend is a production-ready Express.js application that handles all server-side operations for the video streaming platform. It implements secure authentication, efficient file handling, cloud storage integration, and complex database aggregations to deliver a seamless API experience.

---

## 🏗️ Architecture

### Project Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers and business logic
│   │   ├── user.controller.js        # User operations
│   │   ├── video.controller.js       # Video CRUD
│   │   ├── comment.controller.js     # Comment management
│   │   ├── like.controller.js        # Like operations
│   │   ├── playlist.controller.js    # Playlist management
│   │   ├── subscription.controller.js # Subscription logic
│   │   ├── dashboard.controller.js   # Analytics
│   │   └── healthcheck.controller.js # Health monitoring
│   │
│   ├── models/                # MongoDB schemas
│   │   ├── user.model.js     # User schema with auth methods
│   │   ├── video.model.js    # Video schema
│   │   ├── comment.model.js  # Comment schema
│   │   ├── like.model.js     # Like schema
│   │   ├── playlist.model.js # Playlist schema
│   │   └── subscription.model.js # Subscription schema
│   │
│   ├── routes/                # API route definitions
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── dashboard.routes.js
│   │   └── healthcheck.routes.js
│   │
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── multer.middleware.js  # File upload handling
│   │
│   ├── utils/                 # Utility functions
│   │   ├── ApiError.js       # Custom error class
│   │   ├── ApiResponse.js    # Standardized response
│   │   ├── asyncHandler.js   # Async error wrapper
│   │   ├── Cloudinary.js     # Cloud storage operations
│   │   └── mail.js           # Email service
│   │
│   ├── db/                    # Database connection
│   │   └── index.js          # MongoDB connection
│   │
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   └── constants.js           # Application constants
│
├── public/                    # Temporary file storage
├── .env                       # Environment variables
├── .prettierrc                # Code formatting config
├── package.json               # Dependencies
└── README.md                  # This file
```

---

## ✨ Features

### 🔐 Authentication & Authorization

#### User Authentication
- **Registration**
  - Email and username validation
  - Password hashing with bcrypt (10 salt rounds)
  - Automatic avatar upload to Cloudinary
  - Optional cover image upload
  - Duplicate username/email prevention

- **Login**
  - Login with username OR email
  - Password verification with bcrypt
  - JWT access token (15-minute expiry)
  - JWT refresh token (7-day expiry)
  - HttpOnly cookie for refresh token

- **Token Management**
  - Automatic token refresh endpoint
  - Token rotation on refresh
  - Secure token storage in cookies
  - Token verification middleware

- **Password Recovery**
  - Forgot password with email
  - Time-limited reset tokens (30 minutes)
  - SHA-256 hashed reset tokens
  - SendGrid email integration
  - Secure password reset endpoint

#### Authorization
- **Protected Routes**: JWT middleware for authenticated endpoints
- **Owner Verification**: Users can only modify their own content
- **Role-Based Access**: Channel owner checks for sensitive operations

### 🎬 Video Management

#### Video Operations
- **Upload Video**
  - Multipart form data handling with Multer
  - Video upload to Cloudinary with automatic duration extraction
  - Thumbnail upload with image optimization
  - Metadata storage (title, description, duration)
  - Draft/publish status control
  - Owner association

- **Retrieve Videos**
  - Get all published videos with pagination
  - Advanced filtering (search query, sort options)
  - Full-text search on title and description
  - MongoDB aggregation pipelines for performance
  - Owner details population
  - Like and comment counts
  - User-specific like status

- **Get Video by ID**
  - Detailed video information
  - Owner profile with subscriber count
  - Subscription status for current user
  - Like count and user like status
  - Comment count
  - View count increment (page-specific)
  - Watch history tracking

- **Update Video**
  - Update title, description, publish status
  - Replace thumbnail
  - Owner verification
  - Cloudinary asset management

- **Delete Video**
  - Soft delete from database
  - Automatic Cloudinary cleanup (video + thumbnail)
  - Owner verification
  - Cascade delete from playlists

- **Toggle Publish Status**
  - Switch between draft and published
  - Owner verification

#### Video Features
- **View Tracking**: Increment views only on video detail page access
- **Watch History**: Automatic addition to user's watch history (max 50, FIFO)
- **Search**: Full-text search with MongoDB text indexes
- **Pagination**: Efficient pagination with `mongoose-aggregate-paginate-v2`
- **Sorting**: Sort by date, views, relevance

### 👥 User Management

#### Profile Operations
- **Get Current User**: Retrieve authenticated user details
- **Get User Channel Profile**
  - Channel information with subscriber count
  - Subscription status for current user
  - Channel videos
  - Public profile view

- **Update Account Details**
  - Update full name and email
  - Email validation with `validator`
  - Prevent duplicate emails

- **Update Avatar**
  - Upload new avatar to Cloudinary
  - Delete old avatar from Cloudinary
  - Automatic image optimization

- **Update Cover Image**
  - Upload new cover image
  - Delete old cover image
  - Automatic image optimization

- **Change Password**
  - Verify old password
  - Hash new password with bcrypt
  - Invalidate old sessions

#### Watch History
- **Get Watch History**
  - Retrieve user's watch history
  - Populate video details
  - Chronological order (most recent first)
  - Limit to 50 videos

### 💬 Comment System

#### Comment Operations
- **Add Comment**
  - Post comments on videos
  - Owner association
  - Timestamp tracking

- **Get Video Comments**
  - Retrieve all comments for a video
  - Pagination support
  - Owner details population
  - Like count per comment
  - User-specific like status

- **Update Comment**
  - Edit comment content
  - Owner verification
  - Timestamp update

- **Delete Comment**
  - Remove comment from database
  - Owner verification
  - Cascade delete likes

### ❤️ Like System

#### Like Operations
- **Toggle Video Like**
  - Like/unlike videos
  - Prevent duplicate likes
  - Automatic like count update

- **Toggle Comment Like**
  - Like/unlike comments
  - Prevent duplicate likes
  - Automatic like count update

- **Get Liked Videos**
  - Retrieve all videos liked by user
  - Pagination support
  - Video details population
  - Owner information

### 📁 Playlist Management

#### Playlist Operations
- **Create Playlist**
  - Custom name and description
  - Owner association
  - Empty playlist initialization

- **Get User Playlists**
  - Retrieve all playlists for a user
  - Video count per playlist
  - Pagination support

- **Get Playlist by ID**
  - Detailed playlist information
  - All videos in playlist
  - Owner details
  - Video metadata

- **Update Playlist**
  - Update name and description
  - Owner verification

- **Delete Playlist**
  - Remove playlist from database
  - Owner verification

- **Add Video to Playlist**
  - Add video by ID
  - Prevent duplicates
  - Owner verification

- **Remove Video from Playlist**
  - Remove video by ID
  - Owner verification

### 🔔 Subscription System

#### Subscription Operations
- **Toggle Subscription**
  - Subscribe/unsubscribe to channels
  - Prevent self-subscription
  - Automatic subscriber count update

- **Get User Subscriptions**
  - List of channels user is subscribed to
  - Channel details population
  - Subscriber counts

- **Get Channel Subscribers**
  - List of users subscribed to a channel
  - Subscriber details
  - Subscriber counts
  - Pagination support

### 📊 Dashboard & Analytics

#### Channel Statistics
- **Get Channel Stats**
  - Total views across all videos
  - Total subscribers
  - Total videos published
  - Total likes received
  - Aggregated from database

- **Get Channel Videos**
  - All videos owned by user (published + drafts)
  - Video metadata (views, likes, comments)
  - Publish status
  - Pagination support
  - Sorting options

### 🏥 Health Monitoring

#### Health Check
- **Service Status**: Simple endpoint to verify API is running
- **Database Connection**: Verify MongoDB connectivity
- **Uptime Monitoring**: For load balancers and monitoring tools

---

## 🛠️ Technology Stack

### Core Framework
- **Node.js**: JavaScript runtime
- **Express 5.2.1**: Web application framework
- **ES Modules**: Modern JavaScript module system

### Database
- **MongoDB**: NoSQL document database
- **Mongoose 9.1.1**: ODM for MongoDB
- **mongoose-aggregate-paginate-v2 1.1.4**: Pagination for aggregations

### Authentication & Security
- **JSON Web Tokens (jsonwebtoken 9.0.3)**: Stateless authentication
- **bcrypt 6.0.0**: Password hashing
- **crypto**: Token generation for password reset
- **cookie-parser 1.4.7**: Parse cookies from requests
- **cors 2.8.5**: Cross-Origin Resource Sharing
- **validator 13.15.26**: Input validation

### File Handling
- **Multer 2.0.2**: Multipart form data handling
- **Cloudinary 2.8.0**: Cloud storage for videos and images

### Email Service
- **@sendgrid/mail 8.1.6**: Transactional email delivery

### Development Tools
- **nodemon 3.1.11**: Auto-restart on file changes
- **dotenv 17.2.3**: Environment variable management
- **Prettier 3.7.4**: Code formatting

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- SendGrid account

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Server Configuration
   PORT=8000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/streamify
   # Or MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streamify
   
   # CORS
   CORS_ORIGIN=http://localhost:5173
   
   # JWT Secrets (use strong, random strings)
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
   REFRESH_TOKEN_EXPIRY=7d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # SendGrid Configuration
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

5. **Verify server is running**
   ```
   Server running on http://localhost:8000
   ```

### Available Scripts

```bash
npm run dev    # Start with nodemon (auto-restart on changes)
npm start      # Start production server
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication
Most endpoints require a valid JWT access token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

### 👤 User Endpoints

#### Register User
```http
POST /users/register
Content-Type: multipart/form-data

Fields:
- username: string (required, unique)
- email: string (required, unique, valid email)
- fullName: string (required)
- password: string (required, min 6 chars)
- avatar: file (required, image)
- coverImage: file (optional, image)

Response: 201 Created
{
  "statusCode": 201,
  "data": { user object },
  "message": "User registered successfully",
  "success": true
}
```

#### Login User
```http
POST /users/login
Content-Type: application/json

Body:
{
  "username": "user123" OR "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "user": { user object },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "User logged in successfully",
  "success": true
}

Cookies:
- accessToken (httpOnly)
- refreshToken (httpOnly)
```

#### Logout User
```http
POST /users/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": {},
  "message": "User logged out successfully",
  "success": true
}
```

#### Refresh Access Token
```http
POST /users/refresh-token
Cookie: refreshToken=<refresh_token>

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  },
  "message": "Access token refreshed successfully",
  "success": true
}
```

#### Get Current User
```http
GET /users/current-user
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": { user object },
  "message": "Current user fetched successfully",
  "success": true
}
```

#### Get User Channel Profile
```http
GET /users/c/:userId
Authorization: Bearer <token> (optional, for subscription status)

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "username": "username",
    "fullName": "Full Name",
    "avatar": "avatar_url",
    "coverImage": "cover_url",
    "description": "Channel description",
    "subscribersCount": 100,
    "isSubscribed": true
  },
  "message": "User channel fetched successfully",
  "success": true
}
```

#### Update Account Details
```http
PATCH /users/update-account
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "fullName": "New Name",
  "email": "newemail@example.com",
  "description": "Channel description"
}

Response: 200 OK
```

#### Update Avatar
```http
PATCH /users/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- avatar: file (required, image)

Response: 200 OK
```

#### Update Cover Image
```http
PATCH /users/cover-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- coverImage: file (required, image)

Response: 200 OK
```

#### Change Password
```http
POST /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "oldPassword": "current_password",
  "newPassword": "new_password"
}

Response: 200 OK
```

#### Forgot Password
```http
POST /users/forgot-password
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}

Response: 200 OK
{
  "statusCode": 200,
  "data": {},
  "message": "Password reset email sent successfully",
  "success": true
}
```

#### Reset Password
```http
POST /users/reset-password/:token
Content-Type: application/json

Body:
{
  "password": "new_password"
}

Response: 200 OK
```

#### Get Watch History
```http
GET /users/history
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": [
    { video object with owner details }
  ],
  "message": "Watch history fetched successfully",
  "success": true
}
```

---

### 🎬 Video Endpoints

#### Get All Videos
```http
GET /videos?page=1&limit=10&query=search&sortBy=createdAt&sortType=desc
Authorization: Bearer <token> (optional, for like status)

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- query: string (search term)
- sortBy: string (createdAt, views, likes)
- sortType: string (asc, desc)

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "docs": [ video objects ],
    "totalDocs": 100,
    "limit": 10,
    "page": 1,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Videos fetched successfully",
  "success": true
}
```

#### Publish Video
```http
POST /videos
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- title: string (required)
- description: string (required)
- videoFile: file (required, video)
- thumbnail: file (required, image)
- isPublished: boolean (default: true)

Response: 200 OK
{
  "statusCode": 200,
  "data": { video object },
  "message": "Video published successfully",
  "success": true
}
```

#### Get Video by ID
```http
GET /videos/:videoId
Authorization: Bearer <token> (optional, for like status and watch history)

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "_id": "video_id",
    "title": "Video Title",
    "description": "Video description",
    "videoFile": "video_url",
    "thumbnail": "thumbnail_url",
    "duration": 120,
    "views": 1000,
    "isPublished": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "ownerDetails": {
      "_id": "owner_id",
      "username": "owner_username",
      "fullName": "Owner Name",
      "avatar": "avatar_url",
      "subscribersCount": 500,
      "isSubscribed": true
    },
    "likesCount": 50,
    "isLiked": true,
    "commentsCount": 20
  },
  "message": "Video fetched successfully",
  "success": true
}
```

#### Update Video
```http
PATCH /videos/:videoId
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- title: string (optional)
- description: string (optional)
- thumbnail: file (optional, image)
- isPublished: boolean (optional)

Response: 200 OK
```

#### Delete Video
```http
DELETE /videos/:videoId
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": {},
  "message": "Video deleted successfully",
  "success": true
}
```

#### Toggle Publish Status
```http
PATCH /videos/toggle/publish/:videoId
Authorization: Bearer <token>

Response: 200 OK
```

---

### 💬 Comment Endpoints

#### Get Video Comments
```http
GET /comments/:videoId?page=1&limit=10
Authorization: Bearer <token> (optional, for like status)

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "comment_id",
        "content": "Great video!",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "owner": {
          "_id": "user_id",
          "username": "username",
          "avatar": "avatar_url"
        },
        "likesCount": 10,
        "isLiked": false
      }
    ],
    "totalDocs": 50,
    "page": 1,
    "totalPages": 5
  },
  "message": "Comments fetched successfully",
  "success": true
}
```

#### Add Comment
```http
POST /comments/:videoId
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "content": "This is a comment"
}

Response: 201 Created
```

#### Update Comment
```http
PATCH /comments/c/:commentId
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "content": "Updated comment"
}

Response: 200 OK
```

#### Delete Comment
```http
DELETE /comments/c/:commentId
Authorization: Bearer <token>

Response: 200 OK
```

---

### ❤️ Like Endpoints

#### Toggle Video Like
```http
POST /likes/toggle/v/:videoId
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": { isLiked: true },
  "message": "Video liked successfully" OR "Video unliked successfully",
  "success": true
}
```

#### Toggle Comment Like
```http
POST /likes/toggle/c/:commentId
Authorization: Bearer <token>

Response: 200 OK
```

#### Get Liked Videos
```http
GET /likes/videos?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "docs": [ video objects ],
    "totalDocs": 20,
    "page": 1,
    "totalPages": 2
  },
  "message": "Liked videos fetched successfully",
  "success": true
}
```

---

### 📁 Playlist Endpoints

#### Create Playlist
```http
POST /playlists
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "My Playlist",
  "description": "Playlist description"
}

Response: 201 Created
```

#### Get User Playlists
```http
GET /playlists/user/:userId?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
```

#### Get Playlist by ID
```http
GET /playlists/:playlistId
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "_id": "playlist_id",
    "name": "Playlist Name",
    "description": "Description",
    "videos": [ video objects ],
    "owner": { user object }
  },
  "message": "Playlist fetched successfully",
  "success": true
}
```

#### Update Playlist
```http
PATCH /playlists/:playlistId
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "Updated Name",
  "description": "Updated Description"
}

Response: 200 OK
```

#### Delete Playlist
```http
DELETE /playlists/:playlistId
Authorization: Bearer <token>

Response: 200 OK
```

#### Add Video to Playlist
```http
PATCH /playlists/add/:videoId/:playlistId
Authorization: Bearer <token>

Response: 200 OK
```

#### Remove Video from Playlist
```http
PATCH /playlists/remove/:videoId/:playlistId
Authorization: Bearer <token>

Response: 200 OK
```

---

### 🔔 Subscription Endpoints

#### Toggle Subscription
```http
POST /subscriptions/c/:channelId
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": { isSubscribed: true },
  "message": "Subscribed successfully" OR "Unsubscribed successfully",
  "success": true
}
```

#### Get User Subscriptions
```http
GET /subscriptions/u/:subscriberId
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": [
    {
      "_id": "channel_id",
      "username": "channel_username",
      "fullName": "Channel Name",
      "avatar": "avatar_url",
      "subscribersCount": 1000
    }
  ],
  "message": "Subscriptions fetched successfully",
  "success": true
}
```

#### Get Channel Subscribers
```http
GET /subscriptions/subscribers/:channelId?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "docs": [ subscriber objects ],
    "totalDocs": 500,
    "page": 1,
    "totalPages": 50
  },
  "message": "Subscribers fetched successfully",
  "success": true
}
```

---

### 📊 Dashboard Endpoints

#### Get Channel Statistics
```http
GET /dashboard/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "totalViews": 10000,
    "totalSubscribers": 500,
    "totalVideos": 50,
    "totalLikes": 1000
  },
  "message": "Channel stats fetched successfully",
  "success": true
}
```

#### Get Channel Videos
```http
GET /dashboard/videos?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "video_id",
        "title": "Video Title",
        "thumbnail": "thumbnail_url",
        "views": 1000,
        "likesCount": 50,
        "commentsCount": 20,
        "isPublished": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 50,
    "page": 1,
    "totalPages": 5
  },
  "message": "Channel videos fetched successfully",
  "success": true
}
```

---

### 🏥 Health Check

#### Check API Health
```http
GET /healthcheck

Response: 200 OK
{
  "statusCode": 200,
  "data": "OK",
  "message": "Health check passed",
  "success": true
}
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique, indexed),
  email: String (unique, validated),
  fullName: String,
  description: String,
  avatar: String (Cloudinary URL),
  coverImage: String (Cloudinary URL),
  watchHistory: [ObjectId] (ref: Video),
  password: String (bcrypt hashed),
  refreshToken: String,
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  timestamps: true
}
```

### Video Model
```javascript
{
  videoFile: String (Cloudinary URL),
  thumbnail: String (Cloudinary URL),
  title: String (text indexed),
  description: String (text indexed),
  duration: Number (seconds),
  views: Number (default: 0),
  isPublished: Boolean (default: false),
  owner: ObjectId (ref: User),
  timestamps: true
}
```

### Comment Model
```javascript
{
  content: String,
  video: ObjectId (ref: Video),
  owner: ObjectId (ref: User),
  timestamps: true
}
```

### Like Model
```javascript
{
  video: ObjectId (ref: Video),
  comment: ObjectId (ref: Comment),
  likedBy: ObjectId (ref: User),
  timestamps: true
}
```

### Playlist Model
```javascript
{
  name: String,
  description: String,
  videos: [ObjectId] (ref: Video),
  owner: ObjectId (ref: User),
  timestamps: true
}
```

### Subscription Model
```javascript
{
  subscriber: ObjectId (ref: User),
  channel: ObjectId (ref: User),
  timestamps: true
}
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/streamify` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | `random_secret_string` |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry | `15m` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | `random_secret_string` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |
| `SENDGRID_API_KEY` | SendGrid API key | `SG.xxxxxxxxxxxxx` |
| `SENDGRID_FROM_EMAIL` | Verified sender email | `noreply@yourdomain.com` |

---

## 🔐 Security Features

### Password Security
- **Bcrypt Hashing**: 10 salt rounds for password hashing
- **Pre-save Hook**: Automatic password hashing on user creation/update
- **Password Comparison**: Secure password verification method

### Token Security
- **JWT**: Stateless authentication with signed tokens
- **Token Rotation**: New refresh token on each refresh
- **HttpOnly Cookies**: Prevent XSS attacks on tokens
- **Short-lived Access Tokens**: 15-minute expiry for security
- **Long-lived Refresh Tokens**: 7-day expiry for convenience

### Password Reset Security
- **Time-limited Tokens**: 30-minute expiry
- **SHA-256 Hashing**: Hashed reset tokens in database
- **One-time Use**: Tokens invalidated after use
- **Email Verification**: Reset link sent to registered email

### Input Validation
- **Email Validation**: Using `validator` library
- **Required Fields**: Server-side validation
- **File Type Validation**: Multer file filters
- **MongoDB Injection Prevention**: Mongoose sanitization

### CORS Protection
- **Origin Whitelisting**: Only allowed origins can access API
- **Credentials**: Cookie sharing enabled for authenticated requests

### Error Handling
- **Custom Error Class**: Standardized error responses
- **Try-Catch Wrapping**: `asyncHandler` for all async routes
- **Global Error Handler**: Centralized error processing
- **No Sensitive Data Leakage**: Production-safe error messages

---

## 📊 Performance Optimizations

### Database Optimizations
- **Indexing**: Text indexes on video title/description, unique indexes on username/email
- **Aggregation Pipelines**: Efficient data retrieval with MongoDB aggregation
- **Pagination**: Server-side pagination with `mongoose-aggregate-paginate-v2`
- **Selective Population**: Only populate required fields
- **Lean Queries**: Use `.lean()` for read-only operations

### File Handling
- **Cloudinary**: Offload storage and CDN delivery
- **Automatic Cleanup**: Delete old files when updating
- **Optimized Uploads**: Cloudinary transformations for images
- **Video Duration Extraction**: Automatic from Cloudinary metadata

### Caching Strategies
- **Refresh Token Caching**: Store in database for validation
- **Watch History Limit**: Cap at 50 videos to prevent bloat

---

## 🧪 Development Best Practices

### Code Organization
- **MVC Pattern**: Separation of routes, controllers, models
- **Utility Functions**: Reusable helpers in `utils/`
- **Middleware**: Modular authentication and file handling
- **Error Handling**: Consistent error responses with `ApiError`

### Error Handling
- **asyncHandler**: Wrap all async functions to catch errors
- **Custom Errors**: Use `ApiError` for consistent error responses
- **Global Handler**: Centralized error processing in `app.js`
- **Validation**: Input validation before processing

### Code Quality
- **Prettier**: Consistent code formatting
- **ESLint**: Code linting (if configured)
- **Comments**: Clear documentation for complex logic
- **Naming Conventions**: Descriptive variable and function names

---

## 🚢 Deployment

### Production Checklist
- [ ] Set strong, random JWT secrets
- [ ] Use MongoDB Atlas or production MongoDB instance
- [ ] Configure Cloudinary production account
- [ ] Set up SendGrid with verified domain
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up logging and monitoring
- [ ] Configure rate limiting
- [ ] Set up database backups

### Deployment Platforms
- **Heroku**: Easy deployment with Procfile
- **AWS EC2**: Full control over server
- **DigitalOcean**: Droplets for Node.js apps
- **Render**: Modern deployment platform
- **Railway**: Simple deployment with auto-scaling

### Environment Variables for Production
Ensure all environment variables are set in your hosting platform's configuration panel.

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Cannot connect to MongoDB"
- **Solution**: Check `MONGODB_URI` and ensure MongoDB is running

**Issue**: "Cloudinary upload failed"
- **Solution**: Verify Cloudinary credentials and check file size limits

**Issue**: "Email not sending"
- **Solution**: Verify SendGrid API key and sender email verification

**Issue**: "CORS error"
- **Solution**: Check `CORS_ORIGIN` matches frontend URL exactly

**Issue**: "Token expired"
- **Solution**: Implement token refresh on frontend or re-login

---

## 📝 License

This project is **proprietary software** and is not open source. All rights reserved. Unauthorized use, copying, modification, or distribution is prohibited.

---

## 👨‍💻 Author

**VasuBhakt**

---

**Built with Node.js, Express, and MongoDB** 🚀