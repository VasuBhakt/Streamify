# 📺 Streamify | Full-Stack Video Platform

<p align="center">
    <img src="frontend/public/streamify_logo.png" height="240px"><br>
</p>

**Streamify** is a full-stack video streaming platform built with modern web technologies, offering a comprehensive suite of features for video content creation, management, and consumption. This proprietary application provides a YouTube-like experience with advanced user authentication, video management, social interactions, and analytics capabilities.

> **Note:** This project is **not open source** and is proprietary software. All rights reserved.

---

## 🎯 Project Overview

Streamify is built to handle the full lifecycle of digital video—from secure creator uploads and Cloudinary-powered processing to real-time user engagement and channel analytics.

## 🚀 Core Capabilities
- **Secure Auth**: JWT-based authentication with Refresh Token rotation and Brevo password recovery.
- **Video Lifecycle**: Drag-and-drop uploads, custom thumbnails, and draft/publish workflows.
- **Engagement Engine**: Subscription models, commenting, and like/unlike functionality.
- **Creator Dashboard**: Real-time analytics for views, subscribers, and video-level performance.
- **Advanced Discovery**: Full-text search with MongoDB indexing and chronological watch history.
  
---

## 🏗️ System Architecture

```
Streamify/
├── frontend/     # Vite + React 19 (Hosted on Vercel)
└── backend/      # Node.js + Express + MongoDB (Hosted on Render)

```
---

## 🛠️ Technology Stack

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) |
| **Backend** | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) |
| **Media & Services** | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white) ![Brevo](https://img.shields.io/badge/Brevo-6358DE?style=for-the-badge&logo=brevo&logoColor=white) ![Multer](https://img.shields.io/badge/Multer-grey?style=for-the-badge) |
| **Deployment** | ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white) ![Atlas](https://img.shields.io/badge/MongoDB_Atlas-white?style=for-the-badge&logo=mongodb&logoColor=47A248) |

---

## 🔐 Security Features

- **State-of-the-Art Auth**: HttpOnly cookies and salt-round Bcrypt hashing.
- **Database Efficiency**: Complex data retrieval via MongoDB Aggregation Pipelines.
- **Optimized Delivery**: Lazy loading, code splitting, and Cloudinary CDN transformations.

---

## 📝 License

This project is **proprietary software** and is not open source. All rights reserved. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

---

## 👨‍💻 Author

**VasuBhakt** Built with the MERN stack and a focus on scalable system design.

---

**Built with ❤️ using modern web technologies**
