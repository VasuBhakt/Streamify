import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SearchResults from './pages/SearchResults.jsx'
import VideoDetail from './pages/VideoDetail.jsx'
import AuthLayout from './utils/authLayout.jsx'
import LikedVideos from './pages/LikedVideos.jsx'
import WatchHistory from './pages/WatchHistory.jsx'
import Settings from './pages/Settings.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Studio from './pages/Studio.jsx'
import Subscribers from './pages/Subscribers.jsx'
import Subscriptions from './pages/Subscriptions.jsx'
import Register from './pages/Register.jsx'
import Channel from './pages/Channel.jsx'
import Landing from './pages/Landing.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import Support from './pages/Support.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "login",
        element:
          <AuthLayout auth={false}>
            <Login />
          </AuthLayout>
      },
      {
        path: "register",
        element:
          <AuthLayout auth={false}>
            <Register />
          </AuthLayout>
      },
      {
        path: "forgot-password",
        element:
          <AuthLayout auth={false}>
            <ForgotPassword />
          </AuthLayout>
      },
      {
        path: "reset-password/:token",
        element:
          <AuthLayout auth={false}>
            <ResetPassword />
          </AuthLayout>
      },
      {
        path: "verify-email/:token",
        element:
          <AuthLayout auth={false}>
            <VerifyEmail />
          </AuthLayout>
      },
      {
        path: "/c/:username",
        element: <Channel />
      },
      {
        path: "search",
        element: <SearchResults />
      },
      {
        path: "video/:videoId",
        element: <VideoDetail />
      },
      {
        path: "liked-videos",
        element: (
          <AuthLayout>
            <LikedVideos />
          </AuthLayout>
        )
      },
      {
        path: "history",
        element: (
          <AuthLayout>
            <WatchHistory />
          </AuthLayout>
        )
      },
      {
        path: "settings",
        element: (
          <AuthLayout>
            <Settings />
          </AuthLayout>
        )
      },
      {
        path: "dashboard",
        element: (
          <AuthLayout>
            <Dashboard />
          </AuthLayout>
        )
      },
      {
        path: "studio",
        element: (
          <AuthLayout>
            <Studio />
          </AuthLayout>
        )
      },
      {
        path: "studio/:videoId",
        element: (
          <AuthLayout>
            <Studio />
          </AuthLayout>
        )
      },
      {
        path: "subscribers",
        element: (
          <AuthLayout>
            <Subscribers />
          </AuthLayout>
        )
      },
      {
        path: "subscriptions",
        element: (
          <AuthLayout>
            <Subscriptions />
          </AuthLayout>
        )
      },
      {
        path: "support",
        element: <Support />
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
