import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice";
import authService from "../../services/auth";
import { toggleSidebar } from "../../features/uiSlice";
import { Search, Bell, Video, Menu, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import Button from "../button/Button";
import Input from "../input/Input";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const user = useSelector((state) => state.auth.userData);
    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    }

    const handleLogout = async () => {
        try {
            await authService.logoutUser();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error("Navbar :: handleLogout :: error", error);
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md z-50 px-4 flex items-center justify-between">
            {/* Left: Logo & Menu */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 hover:bg-surface-hover rounded-full text-text-secondary hover:text-text-main transition-all duration-200 active:scale-95"
                >
                    <Menu size={24} />
                </button>
                <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                    <span className="text-xl font-bold text-text-main hidden sm:block">
                        <span className="text-primary">Stream</span>ify
                    </span>
                </Link>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                <form onSubmit={handleSearch} className="w-full">
                    <Input
                        icon={Search}
                        type="text"
                        placeholder="Search videos, channels, and more..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-full"
                        rightElement={
                            searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="p-1 mr-1 text-text-muted hover:text-text-main hover:bg-surface-hover rounded-full transition-all duration-200"
                                >
                                    <X size={16} />
                                </button>
                            )
                        }
                    />
                </form>
            </div>

            {/* Right: Actions */}
            {user && (
                <div className="flex items-center lg:gap-5">
                    <button className="p-2 hover:bg-surface-hover rounded-full text-text-secondary hover:text-text-main transition-all duration-200 relative">
                        <Video size={22} />
                    </button>
                    <button className="p-2 hover:bg-surface-hover rounded-full text-text-secondary hover:text-text-main transition-all duration-200 relative">
                        <Bell size={22} />
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                    </button>
                    <Link to={`/c/${user.username}`} className="ml-2 pl-2 border-l border-border flex items-center gap-3 cursor-pointer group">
                        <div className="text-right hidden lg:block">
                            <p className="text-sm font-semibold text-text-main leading-none mb-1">{user.fullName || "User"}</p>
                            <p className="text-xs text-text-muted">@{user.username || "user"}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-border group-hover:border-primary transition-all duration-300 overflow-hidden shadow-lg shadow-primary/5">
                            <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                        </div>
                    </Link>
                    <Button
                        onClick={handleLogout}
                        variant="danger"
                        size="md"
                        className="rounded-full px-6 font-semibold"
                    >
                        Sign Out
                    </Button>
                </div>
            )}
            {!user && (
                <div className="flex items-center">
                    <div className="mr-2">
                        <Link to="/login">
                            <Button
                                variant="primary"
                                size="sm"
                                className="px-6 py-2 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all duration-200 cursor-pointer mr-6"
                            >
                                <span className="text-sm">Sign In</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar;