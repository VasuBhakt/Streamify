# Streamify

<p align="center">
    <img src="frontend/public/streamify_logo.png" height="240px"><br>
</p>
**Streamify** is a full-stack video streaming platform built with modern web technologies, offering a comprehensive suite of features for video content creation, management, and consumption. This proprietary application provides a YouTube-like experience with advanced user authentication, video management, social interactions, and analytics capabilities.

> **Note:** This project is **not open source** and is proprietary software. All rights reserved.

---

## 🎯 Project Overview

Streamify is a production-ready video streaming platform that enables users to upload, manage, and share video content while providing viewers with an engaging experience through features like comments, likes, and subscriptions. The platform is designed with scalability, security, and user experience as core priorities.

### Key Highlights

- **Full-Stack Architecture**: Decoupled frontend and backend for optimal performance and maintainability
- **Cloud-Based Media Storage**: Leverages Cloudinary for efficient video and image hosting
- **Real-Time Analytics**: Comprehensive dashboard with channel statistics and insights
- **Secure Authentication**: JWT-based authentication with refresh token rotation
- **Responsive Design**: Mobile-first approach with TailwindCSS and custom design system
- **Advanced Search**: Full-text search with MongoDB text indexing
- **Email Integration**: SendGrid-powered email notifications for password recovery

---

## 🏗️ Architecture

```
Streamify/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-based page components
│   │   ├── services/      # API integration layer
│   │   ├── features/      # Redux slices
│   │   ├── store/         # Redux store configuration
│   │   └── utils/         # Helper functions and utilities
│   └── public/            # Static assets
│
└── backend/           # Node.js + Express API
    └── src/
        ├── controllers/   # Request handlers
        ├── models/        # MongoDB schemas
        ├── routes/        # API route definitions
        ├── middlewares/   # Authentication & file upload
        ├── utils/         # Cloudinary, email, error handling
        └── db/            # Database connection
```
---

## 🚀 Core Features

### User Management
- **Authentication & Authorization**
  - Secure registration with email validation
  - Login with username or email
  - JWT-based access and refresh tokens
  - Password reset via email with time-limited tokens
  - Automatic token refresh mechanism
  
- **Profile Management**
  - Customizable user profiles with avatar and cover images
  - Channel descriptions and metadata
  - Watch history tracking
  - Account settings management

### Video Management
- **Content Creation**
  - Video upload with automatic duration extraction
  - Custom thumbnail upload support
  - Draft and publish workflow
  - Studio interface for content management

- **Video Operations**
  - Update video details and thumbnails
  - Toggle publish/unpublish status
  - Delete videos with automatic cloud cleanup
  - View count tracking (page-specific)
  - Video search with full-text indexing

### Social Features
- **Engagement**
  - Like/unlike videos and comments
  - Subscribe/unsubscribe to channels
  - Subscriber count tracking
  
- **Content Organization**
  - Watch history with chronological ordering
  - Liked videos collection

### Analytics & Dashboard
- **Channel Statistics**
  - Total views across all videos
  - Total subscribers count
  - Total videos published
  - Total likes received
  - Video-level analytics (views, likes, comments)

- **Content Management Dashboard**
  - Video performance metrics
  - Quick edit and delete actions
  - Publish status management
  - Subscriber list with detailed information

### Search & Discovery
- **Advanced Search**
  - Full-text search across video titles and descriptions
  - Search by channel/creator name
  - Pagination support
  - Real-time search results

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.12.0
- **State Management**: Redux Toolkit 2.11.2
- **Styling**: TailwindCSS 4.1.18
- **Animations**: Framer Motion 12.33.0
- **Forms**: React Hook Form 7.71.1
- **HTTP Client**: Axios 1.13.2
- **Icons**: Lucide React 0.562.0

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: MongoDB with Mongoose 9.1.1
- **Authentication**: JSON Web Tokens (jsonwebtoken 9.0.3)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer 2.0.2
- **Cloud Storage**: Cloudinary 2.8.0
- **Email Service**: SendGrid (@sendgrid/mail 8.1.6)
- **Validation**: Validator 13.15.26
- **Pagination**: mongoose-aggregate-paginate-v2 1.1.4

### Development Tools
- **Code Quality**: Prettier
- **Process Management**: Nodemon
- **Environment Variables**: dotenv

---

## 🔐 Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **Token Management**: Separate access and refresh tokens with automatic rotation
- **CORS Protection**: Configured origin whitelisting
- **Input Validation**: Server-side validation for all user inputs
- **Email Verification**: Secure password reset with time-limited tokens
- **Authentication Middleware**: Protected routes with JWT verification
- **File Upload Security**: Type and size validation for media uploads

---

## 🎨 Design System

The frontend implements a custom design system with:
- **Color Scheme**: Electric Blue theme
- **Typography**: Modern, readable font hierarchy
- **Components**: Reusable, accessible UI components
- **Animations**: Smooth transitions and micro-interactions
- **Responsive Layout**: Mobile-first design approach
---

## 📈 Performance Optimizations

- **Database Indexing**: Optimized queries with MongoDB indexes
- **Aggregation Pipelines**: Efficient data retrieval with MongoDB aggregation
- **Pagination**: Server-side pagination for large datasets
- **Lazy Loading**: Component and route-based code splitting
- **Image Optimization**: Cloudinary transformations for responsive images

---

## 📝 License

This project is **proprietary software** and is not open source. All rights reserved. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

---

## 👨‍💻 Author

**VasuBhakt**

---

**Built with ❤️ using modern web technologies**
