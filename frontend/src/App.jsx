import { Camera, Search, Video } from "lucide-react";
import Button from "./components/button/Button";
import Input from "./components/input/Input";
import Container from "./components/container/Container";
import Sidebar from "./components/sidebar/Sidebar";
import VideoCard from "./components/cards/VideoCard";
import VideoPlayer from "./components/cards/VideoPlayer";

function App() {
    return (
        <div className="flex bg-[#121212] min-h-screen text-white font-sans">
            <Sidebar />

            <main className="flex-1">
                <Container className="flex flex-col gap-10">

                    {/* Large Video Player Section */}
                    <div className="w-full">
                        <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
                        <div className="max-w-4xl">
                            <VideoPlayer video={{
                                title: "Nature Cinematic 4K",
                                thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
                                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                                duration: 10,
                                views: 5000,
                                createdAt: new Date(),
                                owner: {
                                    fullName: "Nature Life",
                                    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop"
                                }
                            }} />
                        </div>
                    </div>

                    {/* Video Recommendations Grid */}
                    <div className="w-full border-t border-gray-800 pt-8">
                        <h2 className="text-xl font-bold mb-6">Recommended Videos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            <VideoCard video={{
                                title: "Building a YouTube Clone with React & Node.js",
                                thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
                                duration: 1250,
                                views: 125000,
                                createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
                                owner: {
                                    fullName: "Code Master",
                                    username: "codemaster",
                                    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop"
                                }
                            }} />
                            <VideoCard video={{
                                title: "Top 10 Places to Visit in Japan",
                                thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
                                duration: 840,
                                views: 89000,
                                createdAt: new Date(Date.now() - 86400000 * 5),
                                owner: {
                                    fullName: "Travel Guide",
                                    username: "travelguide",
                                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop"
                                }
                            }} />
                            <VideoCard video={{
                                title: "Understanding Quantum Computing in 10 Minutes",
                                thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
                                duration: 600,
                                views: 450000,
                                createdAt: new Date(Date.now() - 86400000 * 10),
                                owner: {
                                    fullName: "Science Daily",
                                    username: "sciencedaily",
                                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1770&auto=format&fit=crop"
                                }
                            }} />
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    )
}

export default App;
