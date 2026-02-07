# Streamify Frontend

A modern, responsive React-based frontend application for the Streamify video streaming platform. Built with Vite, React 19, Redux Toolkit, and TailwindCSS, this application provides a seamless user experience for video content consumption and management.

> **Note:** This is proprietary software and is not open source. All rights reserved.

---

## 🎯 Overview

The Streamify frontend is a single-page application (SPA) that delivers a YouTube-like experience with advanced features for video streaming, user interactions, and content management. The application emphasizes performance, accessibility, and user experience through modern React patterns and optimized rendering strategies.

---

## 🏗️ Architecture

### Project Structure

```
frontend/
├── public/
│   ├── streamify_icon.svg    # Application icon
│   └── ...                    # Static assets
│
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── button/           # Button components
│   │   ├── comment/          # Comment-related components
│   │   ├── container/        # Layout containers
│   │   ├── input/            # Form input components
│   │   ├── modals/           # Modal dialogs
│   │   ├── navbar/           # Navigation components
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── video/            # Video-related components
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   └── VideoDescription.jsx
│   │   └── Loading.jsx       # Loading states
│   │
│   ├── pages/                 # Route-based page components
│   │   ├── Landing.jsx       # Public landing page
│   │   ├── Login.jsx         # Authentication
│   │   ├── Register.jsx      # User registration
│   │   ├── Home.jsx          # Main feed
│   │   ├── VideoDetail.jsx   # Video player page
│   │   ├── Channel.jsx       # Channel profile
│   │   ├── Studio.jsx        # Content creation/editing
│   │   ├── Dashboard.jsx     # Analytics dashboard
│   │   ├── SearchResults.jsx # Search page
│   │   ├── Subscriptions.jsx # Subscribed channels
│   │   ├── Subscribers.jsx   # Channel subscribers
│   │   ├── LikedVideos.jsx   # Liked content
│   │   ├── WatchHistory.jsx  # View history
│   │   ├── Settings.jsx      # User settings
│   │   ├── Support.jsx       # Help/Support
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── services/              # API integration layer
│   │   ├── auth.js           # Authentication services
│   │   ├── user.js           # User operations
│   │   ├── video.js          # Video operations
│   │   ├── comment.js        # Comment operations
│   │   ├── like.js           # Like operations
│   │   ├── playlist.js       # Playlist operations
│   │   └── subscription.js   # Subscription operations
│   │
│   ├── features/              # Redux slices
│   │   ├── authSlice.js      # Authentication state
│   │   └── uiSlice.js        # UI state (sidebar, etc.)
│   │
│   ├── store/                 # Redux store
│   │   └── store.js          # Store configuration
│   │
│   ├── utils/                 # Utility functions
│   │   ├── format.js         # Formatting helpers
│   │   ├── tailwindUtil.js   # TailwindCSS utilities
│   │   └── ...
│   │
│   ├── conf/                  # Configuration
│   │   └── conf.js           # Environment config
│   │
│   ├── App.jsx               # Root component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
│
├── index.html                 # HTML template
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint configuration
├── package.json              # Dependencies
└── vercel.json               # Deployment config
```

---

## ✨ Features

### 🎨 User Interface

#### Design System
- **Electric Blue Theme**: Custom color palette with vibrant, modern aesthetics
- **Dark Mode**: Optimized for low-light viewing
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Glassmorphism Effects**: Modern UI with frosted glass aesthetics
- **Smooth Animations**: Framer Motion-powered transitions and micro-interactions
- **Custom Typography**: Carefully selected font hierarchy for readability

#### Component Library
- **Reusable Components**: Modular, composable UI elements
- **Consistent Styling**: Centralized design tokens via TailwindCSS
- **Accessible**: ARIA labels and keyboard navigation support
- **Loading States**: Skeleton screens and spinners for better UX

### 🎬 Video Features

#### Video Player
- **Custom Controls**: Play/pause, volume, fullscreen, playback speed
- **Progress Bar**: Seekable timeline with preview thumbnails
- **Keyboard Shortcuts**: Space (play/pause), arrows (seek), M (mute)
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
- **Settings Page**: Account preferences and security

#### Social Interactions
- **Subscribe/Unsubscribe**: Follow favorite channels
- **Like/Unlike**: Engage with videos and comments
- **Comments**: Post, edit, delete comments
- **Playlists**: Create and manage video collections

### 📊 Analytics & Dashboard

#### Channel Dashboard
- **Statistics Overview**:
  - Total views across all videos
  - Subscriber count
  - Total videos published
  - Total likes received
  
- **Video Management Table**:
  - Sortable columns (title, views, likes, date)
  - Quick actions (edit, delete, toggle publish)
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
- **Sort Options**: Relevance, date, views
- **Pagination**: Efficient loading of large result sets
- **No Results State**: Helpful messaging when no matches found

#### Content Discovery
- **Home Feed**: Curated video feed
- **Subscriptions Feed**: Videos from subscribed channels
- **Watch History**: Chronological viewing history
- **Liked Videos**: Collection of liked content
- **Trending**: Popular videos (if implemented)

### 📱 Pages

#### Public Pages
- **Landing Page**: Hero section, features, call-to-action
- **Login/Register**: Authentication forms with validation
- **Password Recovery**: Forgot/reset password flow

#### Authenticated Pages
- **Home**: Main video feed
- **Video Detail**: Full video player with comments and recommendations
- **Channel**: User/channel profile with videos
- **Studio**: Video upload and editing interface
- **Dashboard**: Analytics and content management
- **Search Results**: Search query results
- **Subscriptions**: Feed of subscribed channels
- **Subscribers**: List of channel subscribers
- **Liked Videos**: User's liked content
- **Watch History**: Viewing history
- **Settings**: Account and profile settings
- **Support**: Help and support information

---

## 🛠️ Technology Stack

### Core Framework
- **React 19.2.0**: Latest React with concurrent features
- **Vite 7.2.4**: Lightning-fast build tool and dev server
- **React Router DOM 7.12.0**: Client-side routing

### State Management
- **Redux Toolkit 2.11.2**: Simplified Redux with modern patterns
- **React Redux 9.2.0**: React bindings for Redux
- **Slices**:
  - `authSlice`: User authentication state
  - `uiSlice`: UI state (sidebar collapse, modals)

### Styling
- **TailwindCSS 4.1.18**: Utility-first CSS framework
- **@tailwindcss/vite 4.1.18**: Vite integration
- **tailwind-merge 3.4.0**: Merge Tailwind classes intelligently
- **clsx 2.1.1**: Conditional class name utility
- **Custom Design System**: Centralized color palette and spacing

### Animations
- **Framer Motion 12.33.0**: Production-ready animation library
- **Micro-interactions**: Hover effects, transitions, loading states
- **Page Transitions**: Smooth route changes

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

### Development Tools
- **ESLint 9.39.1**: Code linting and quality
- **@vitejs/plugin-react 5.1.1**: React plugin for Vite
- **TypeScript Types**: Type definitions for better DX

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running (see backend README)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
npm run dev      # Start development server with HMR
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint for code quality
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |

### Vite Configuration

The `vite.config.js` includes:
- React plugin with Fast Refresh
- Path aliases for cleaner imports
- Build optimizations
- Development server proxy (if needed)

### TailwindCSS Configuration

Custom theme extensions in `index.css`:
- **Colors**: Electric blue palette, background, text colors
- **Spacing**: Consistent spacing scale
- **Typography**: Font families and sizes
- **Breakpoints**: Mobile, tablet, desktop

---

## 📡 API Integration

### Service Layer Architecture

All API calls are abstracted into service modules in `src/services/`:

```javascript
// Example: video.js
import axios from 'axios';

const videoService = {
  getAllVideos: async (params) => {
    return await axios.get('/videos', { params });
  },
  
  getVideoById: async (videoId) => {
    return await axios.get(`/videos/${videoId}`);
  },
  
  publishVideo: async (formData) => {
    return await axios.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // ... more methods
};

export default videoService;
```

### Axios Configuration

**Interceptors** (in `main.jsx`):
- **Request Interceptor**: Attach access token to all requests
- **Response Interceptor**: Handle token refresh on 401 errors
- **Error Handling**: Centralized error logging and user feedback

### API Endpoints Used

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/users/register` | POST | User registration |
| `/users/login` | POST | User login |
| `/users/logout` | POST | User logout |
| `/users/current-user` | GET | Get current user |
| `/users/refresh-token` | POST | Refresh access token |
| `/users/forgot-password` | POST | Request password reset |
| `/users/reset-password/:token` | POST | Reset password |
| `/users/change-password` | POST | Change password |
| `/users/update-account` | PATCH | Update profile |
| `/users/avatar` | PATCH | Update avatar |
| `/users/cover-image` | PATCH | Update cover image |
| `/users/c/:userId` | GET | Get channel profile |
| `/users/history` | GET | Get watch history |
| `/videos` | GET, POST | Get all videos, publish video |
| `/videos/:videoId` | GET, PATCH, DELETE | Video operations |
| `/videos/toggle/publish/:videoId` | PATCH | Toggle publish status |
| `/comments/:videoId` | GET, POST | Get/add comments |
| `/comments/c/:commentId` | PATCH, DELETE | Update/delete comment |
| `/likes/toggle/v/:videoId` | POST | Toggle video like |
| `/likes/toggle/c/:commentId` | POST | Toggle comment like |
| `/likes/videos` | GET | Get liked videos |
| `/playlists` | GET, POST | Get/create playlists |
| `/playlists/:playlistId` | GET, PATCH, DELETE | Playlist operations |
| `/playlists/add/:videoId/:playlistId` | PATCH | Add video to playlist |
| `/playlists/remove/:videoId/:playlistId` | PATCH | Remove video from playlist |
| `/subscriptions/c/:channelId` | POST | Toggle subscription |
| `/subscriptions/u/:subscriberId` | GET | Get subscribed channels |
| `/subscriptions/subscribers/:channelId` | GET | Get channel subscribers |
| `/dashboard/stats` | GET | Get channel statistics |
| `/dashboard/videos` | GET | Get channel videos |

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--electric-blue: #0066FF
--electric-blue-dark: #0052CC
--electric-blue-light: #3385FF

/* Background */
--background: #0A0A0A
--surface: #1A1A1A
--surface-hover: #2A2A2A

/* Text */
--text-main: #FFFFFF
--text-secondary: #B3B3B3
--text-tertiary: #666666

/* Accent */
--accent: #FF0066
--success: #00CC66
--warning: #FFAA00
--error: #FF3333
```

### Typography

- **Headings**: Bold, large sizes for hierarchy
- **Body**: Regular weight, optimized line height
- **Captions**: Smaller, secondary color for metadata

### Component Patterns

#### Button Variants
- **Primary**: Electric blue background
- **Secondary**: Outlined style
- **Ghost**: Transparent with hover effect
- **Danger**: Red for destructive actions

#### Layout Patterns
- **Container**: Max-width wrapper with padding
- **Grid**: Responsive video grid (1-4 columns)
- **Flex**: Flexible layouts for navigation and cards

---

## 🔐 Authentication Flow

### Login Process
1. User enters username/email and password
2. Frontend sends credentials to `/users/login`
3. Backend validates and returns access + refresh tokens
4. Tokens stored in cookies (httpOnly for refresh)
5. Redux state updated with user data
6. Redirect to home page

### Token Refresh
1. Access token expires (15 minutes)
2. API request receives 401 error
3. Axios interceptor catches error
4. Sends refresh token to `/users/refresh-token`
5. New access token received and stored
6. Original request retried automatically

### Logout Process
1. User clicks logout
2. Frontend sends request to `/users/logout`
3. Backend clears refresh token cookie
4. Redux state cleared
5. Redirect to landing page

### Protected Routes
- Implemented in `main.jsx` with route guards
- Redirect to login if not authenticated
- Automatic user fetch on app load

---

## 📊 State Management

### Redux Store Structure

```javascript
{
  auth: {
    status: boolean,      // Authentication status
    userData: {           // Current user data
      _id: string,
      username: string,
      email: string,
      fullName: string,
      avatar: string,
      coverImage: string,
      // ... more fields
    }
  },
  ui: {
    sidebarExpanded: boolean  // Sidebar collapse state
  }
}
```

### Redux Slices

#### authSlice
- **Actions**: `login`, `logout`
- **Initial State**: `{ status: false, userData: null }`
- **Usage**: Authentication state across the app

#### uiSlice
- **Actions**: `toggleSidebar`, `setSidebarExpanded`
- **Initial State**: `{ sidebarExpanded: true }`
- **Usage**: UI state like sidebar visibility

---

## 🧪 Development Best Practices

### Code Organization
- **Component Modularity**: Small, focused components
- **Service Abstraction**: Separate API logic from components
- **Custom Hooks**: Reusable logic extraction
- **Utility Functions**: Shared helpers in `utils/`

### Performance Optimizations
- **Code Splitting**: Route-based lazy loading
- **Memoization**: `useMemo` and `useCallback` for expensive operations
- **Debouncing**: Search input debouncing
- **Image Optimization**: Cloudinary transformations
- **Lazy Loading**: Images and components

### Error Handling
- **Try-Catch Blocks**: Wrap async operations
- **User Feedback**: Toast notifications or inline errors
- **Fallback UI**: Error boundaries for component errors
- **Logging**: Console errors for debugging

### Accessibility
- **Semantic HTML**: Proper element usage
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Tab order and shortcuts
- **Color Contrast**: WCAG AA compliance

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment Platforms

The application is configured for deployment on:
- **Vercel** (via `vercel.json`)
- **Netlify**
- **AWS S3 + CloudFront**
- **Any static hosting service**

### Environment Variables for Production

Ensure the following are set in your hosting platform:
```env
VITE_API_URL=https://your-production-api.com
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Cannot connect to backend"
- **Solution**: Check `VITE_API_URL` in `.env` and ensure backend is running

**Issue**: "Token refresh loop"
- **Solution**: Clear cookies and localStorage, then re-login

**Issue**: "Video not playing"
- **Solution**: Check Cloudinary URL and CORS settings

**Issue**: "Build fails"
- **Solution**: Clear `node_modules` and `package-lock.json`, reinstall dependencies

---

## 📝 License

This project is **proprietary software** and is not open source. All rights reserved. Unauthorized use, copying, modification, or distribution is prohibited.

---

## 👨‍💻 Author

**VasuBhakt**

---

**Built with modern React and cutting-edge web technologies** ⚡
