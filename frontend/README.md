# Streamify Frontend

A modern, responsive React-based frontend application for the Streamify video streaming platform. Built with Vite, React 19, Redux Toolkit, and TailwindCSS, this application provides a seamless user experience for video content consumption and management.

> **Note:** This is proprietary software and is not open source. All rights reserved.

---

## 🎯 Overview

The Streamify frontend is a single-page application (SPA) that delivers a YouTube-like experience with advanced features for video streaming, user interactions, and content management. The application emphasizes performance, accessibility, and user experience through modern React patterns and optimized rendering strategies.

---

## ✨ Features

### 🎨 User Interface

#### Design System
- **Electric Blue Theme**: Custom color palette with vibrant, modern aesthetics
- **Dark Mode**: Optimized for low-light viewing
- **Smooth Animations**: Framer Motion-powered transitions and micro-interactions
- **Custom Typography**: Carefully selected font hierarchy for readability

#### Component Library
- **Reusable Components**: Modular, composable UI elements
- **Consistent Styling**: Centralized design tokens via TailwindCSS

### 🎬 Video Features

#### Video Player
- **Custom Controls**: Play/pause, volume
- **Progress Bar**: Seekable timeline with preview thumbnails
- **Responsive Sizing**: Adapts to container dimensions
- **Auto-quality**: Cloudinary-optimized video delivery

#### Video Display
- **Video Cards**: Thumbnail, title, channel info, views, timestamp
- **Duration Overlay**: Video length display on thumbnails
- **Lazy Loading**: Optimized image loading for performance
- **Hover Effects**: Interactive preview states

#### Video Management (Studio)
- **Upload Interface**: Drag-and-drop video and thumbnail upload
- **Metadata Editor**: Title, description, publish status
- **Preview Mode**: Real-time preview of video and thumbnail
- **Publish Controls**: Draft/publish toggle
- **Update Functionality**: Edit existing video details

### 👤 User Features

#### Authentication
- **Login/Register**: Email or username-based authentication
- **Password Recovery**: Email-based password reset flow
- **Persistent Sessions**: Automatic token refresh
- **Protected Routes**: Redirect unauthenticated users
- **Auto-login**: Remember user sessions

#### Profile Management
- **Channel Pages**: Public profile with videos and stats
- **Avatar/Cover**: Image upload and management
- **Bio/Description**: Customizable channel information

#### Social Interactions
- **Subscribe/Unsubscribe**: Follow favorite channels
- **Like/Unlike**: Engage with videos and comments
- **Comments**: Post, edit, delete comments
  
### 📊 Analytics & Dashboard

#### Channel Dashboard
- **Statistics Overview**:
  - Total views across all videos
  - Subscriber count
  - Total videos published
  - Total likes received
  
- **Video Management Table**:
  - Quick actions (edit, delete)
  - Publish status indicators
  - Performance metrics per video

#### Subscriber Management
- **Subscriber List**: View all channel subscribers
- **Subscriber Details**: Avatar, username, subscriber count
- **Subscription Date**: When user subscribed

### 🔍 Search & Discovery

#### Search Functionality
- **Real-time Search**: Instant results as you type
- **Multi-field Search**: Search across titles, descriptions, channels
- **Pagination**: Efficient loading of large result sets
- **No Results State**: Helpful messaging when no matches found

#### Content Discovery
- **Home Feed**: Curated video feed
- **Subscriptions Feed**: Videos from subscribed channels
- **Watch History**: Chronological viewing history
- **Liked Videos**: Collection of liked content

---

## 🛠️ Technology Stack

### Core Framework
- **React 19.2.0**: Latest React with concurrent features
- **Vite 7.2.4**: Lightning-fast build tool and dev server
- **React Router DOM 7.12.0**: Client-side routing

### State Management
- **Redux Toolkit 2.11.2**: Simplified Redux with modern patterns
- **React Redux 9.2.0**: React bindings for Redux

### Styling
- **TailwindCSS 4.1.18**: Utility-first CSS framework
- **Custom Design System**: Centralized color palette and spacing

### Animations
- **Framer Motion 12.33.0**: Production-ready animation library

### Forms & Validation
- **React Hook Form 7.71.1**: Performant form management
- **Built-in Validation**: Email, password strength, required fields
- **Error Handling**: User-friendly error messages

### HTTP & API
- **Axios 1.13.2**: Promise-based HTTP client
- **Interceptors**: Automatic token refresh and error handling
- **Service Layer**: Abstracted API calls for maintainability

### Icons & UI
- **Lucide React 0.562.0**: Beautiful, consistent icon set
- **Custom Components**: Button, Input, Container, Modal

---

## 📝 License

This project is **proprietary software** and is not open source. All rights reserved. Unauthorized use, copying, modification, or distribution is prohibited.

---

## 👨‍💻 Author

**VasuBhakt**

---

**Built with modern React and cutting-edge web technologies** ⚡
