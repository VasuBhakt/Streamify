import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/navbar/Sidebar";
import Home from "./pages/Home";
import VideoDetail from "./pages/VideoDetail";

function App() {
    return (
        <div className="flex flex-col bg-background-page min-h-screen text-text-main font-sans">
            <Navbar />

            <div className="flex flex-1 pt-16">
                <Sidebar />

                <main className="flex-1 w-full overflow-x-hidden">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/video/:videoId" element={<VideoDetail />} />
                        {/* More routes can be added here */}
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
