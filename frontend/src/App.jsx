import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/navbar/Sidebar";
import Home from "./pages/Home";
import VideoDetail from "./pages/VideoDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Channel from "./pages/Channel";
import tw from "./utils/tailwindUtil";
import { useDispatch } from "react-redux";
import { login, logout } from "./features/authSlice";
import { useEffect } from "react";
import authService from "./services/auth";

function App() {
    const location = useLocation();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthPage) return;
        authService.getCurrentUser()
            .then((response) => {
                if (response?.data) {
                    dispatch(login(response.data));
                } else {
                    dispatch(logout());
                }
            })
            .catch((error) => {
                console.log("App :: useEffect :: getCurrentUser :: error", error);
                dispatch(logout());
            })
    }, [])
    return (
        <div className="flex flex-col bg-background-page min-h-screen text-text-main font-sans overflow-x-hidden">
            <Navbar />
            <div className="flex flex-1 pt-16">
                {!isAuthPage && <Sidebar />}

                <main className={tw("flex-1 w-full overflow-x-hidden", isAuthPage && "flex items-center justify-center pt-0")}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/video/:videoId" element={<VideoDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/c/:username" element={<Channel />} />
                        {/* More routes can be added here */}
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
