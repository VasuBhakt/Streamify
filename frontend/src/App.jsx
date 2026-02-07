import { useLocation, Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/navbar/Sidebar";
import tw from "./utils/tailwindUtil";
import { useDispatch } from "react-redux";
import { login, logout } from "./features/authSlice";
import { useEffect } from "react";
import authService from "./services/auth";

function App() {
    const location = useLocation();
    const isLandingPage = location.pathname === "/";
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
    const hideNavSidebar = isLandingPage || isAuthPage;

    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthPage || isLandingPage) return;
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
        <div className="flex flex-col min-h-screen text-text-main font-sans overflow-x-hidden relative bg-background">
            <div className="relative z-10 flex flex-col min-h-screen">
                {!hideNavSidebar && <Navbar />}
                <div className={tw("flex flex-1 pt-0", isLandingPage ? "pt-0" : "md:pt-16")}>
                    {!hideNavSidebar && <Sidebar />}

                    <main className={tw("flex-1 w-full overflow-x-hidden", hideNavSidebar && "flex items-center justify-center pt-0")}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default App;
