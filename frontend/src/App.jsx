import { Camera, Search, Video } from "lucide-react";
import Button from "./components/button/Button";
import Input from "./components/input/Input";
import Container from "./components/container/Container";
import Sidebar from "./components/navbar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import VideoCard from "./components/video/VideoCard";
import VideoPlayer from "./components/video/VideoPlayer";
import VideoDescription from "./components/video/VideoDescription";
import CommentCard from "./components/comment/CommentCard";

function App() {
    const mainVideo = {
        title: "Nature Cinematic 4K - The Beauty of Earth",
        description: "Experience the breathtaking beauty of our planet in stunning 4K resolution. This cinematic journey takes you through lush forests, majestic mountains, and serene waterfalls.\n\nCaptured over 2 years in various locations around the world.\n\nGear used:\n- Sony A7SIII\n- DJI Mavic 3\n- 24-70mm f2.8 GMaster",
        thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
        videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: 245,
        views: 125430,
        likesCount: 15400,
        isSubscribed: false,
        createdAt: new Date(Date.now() - 3600000 * 5),
        owner: {
            fullName: "Nature Life Productions",
            username: "naturelife",
            subscribersCount: 850000,
            avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop"
        }
    };

    const comments = [
        {
            content: "The quality of the shots is absolutely insane! What drone did you use for the first mountain scene?",
            createdAt: new Date(Date.now() - 3600000 * 2),
            likesCount: 124,
            isLiked: true,
            owner: {
                username: "adventure_seeker",
                fullName: "John Doe",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop"
            }
        },
        {
            content: "This is so relaxing. I've been watching this on repeat while working. Please make more of these!",
            createdAt: new Date(Date.now() - 86400000),
            likesCount: 45,
            owner: {
                username: "chill_vibes",
                fullName: "Sarah Wilson",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
            }
        }
    ];

    return (
        <div className="flex flex-col bg-background-page min-h-screen text-text-main font-sans">
            <Navbar />

            <div className="flex flex-1 pt-16">
                <Sidebar />

                <main className="flex-1">
                    <Container className="py-8 flex flex-col gap-8">

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content (Left Column) */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="w-full">
                                    <VideoPlayer video={mainVideo} />
                                </div>

                                <VideoDescription video={mainVideo} />

                                {/* Comments Section */}
                                <div className="pt-6 border-t border-border">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                        {comments.length} Comments
                                    </h3>
                                    <div className="space-y-6">
                                        {comments.map((comment, index) => (
                                            <CommentCard key={index} comment={comment} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Content (Right Column - Recommendations) */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold">Up Next</h2>
                                <div className="flex flex-col gap-6">
                                    <VideoCard video={{
                                        title: "Building a YouTube Clone with React & Node.js",
                                        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
                                        duration: 1250,
                                        views: 125000,
                                        createdAt: new Date(Date.now() - 86400000 * 2),
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
                                </div>
                            </div>
                        </div>

                    </Container>
                </main>
            </div>
        </div>
    )
}

export default App;
