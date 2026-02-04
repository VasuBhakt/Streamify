import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import userService from "../services/user";
import videoService from "../services/video";
import Container from "../components/container/Container";
import Button from "../components/button/Button";
import {
    Loader2,
    Plus,
    LayoutDashboard,
    Video,
    BarChart3,
    Users,
    Heart,
    Pencil,
    Trash2,
    Eye,
    Globe,
    Lock
} from "lucide-react";
import tw from "../utils/tailwindUtil";
import { formatDuration, formatViews, timeAgo } from "../utils/format";

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-surface/10 rounded-3xl p-6 border border-border/40 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
        <div className={tw("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-lg", color)}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">{label}</p>
            <h3 className="text-2xl font-black text-text-main mt-1 tracking-tight">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const user = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsRes, videosRes] = await Promise.all([
                userService.getUserChannelStats(),
                userService.getUserAllVideos({ username: user.username, limit: 100 })
            ]);

            if (statsRes?.data) setStats(statsRes.data);
            if (videosRes?.data?.docs) setVideos(videosRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [user?.username]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video permanently?")) return;

        try {
            setIsDeleting(videoId);
            await videoService.deleteVideo({ videoId });
            setVideos(videos.filter(v => v._id !== videoId));
            setStats(prev => ({ ...prev, totalVideos: prev.totalVideos - 1 }));
        } catch (error) {
            alert("Deletion failed.");
        } finally {
            setIsDeleting(null);
        }
    };

    if (loading && !stats) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 pb-20 bg-background-page">
            <div className="bg-surface/30 border-b border-border py-12 mb-10">
                <Container>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                    <LayoutDashboard size={20} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-primary">Creator Studio</span>
                            </div>
                            <h1 className="text-4xl font-black text-text-main tracking-tight">Channel Dashboard</h1>
                            <p className="text-text-secondary mt-2 font-medium">Overview of your channel performance and content</p>
                        </div>
                        <Button
                            variant="primary"
                            className="rounded-2xl px-8 font-black py-4 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            onClick={() => navigate("/studio")}
                            icon={Plus}
                        >
                            Upload Video
                        </Button>
                    </div>
                </Container>
            </div>

            <Container className="px-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={Video} label="Total Videos" value={stats?.totalVideos || 0} color="bg-blue-500 shadow-blue-500/20" />
                    <StatCard icon={Eye} label="Cumulative Views" value={formatViews(stats?.totalViews || 0).replace(' views', '')} color="bg-emerald-500 shadow-emerald-500/20" />
                    <StatCard icon={Users} label="Subscribers" value={stats?.totalSubscribers || 0} color="bg-purple-500 shadow-purple-500/20" />
                    <StatCard icon={Heart} label="Channel Likes" value={formatViews(stats?.totalLikes || 0).replace(' views', '')} color="bg-rose-500 shadow-rose-500/20" />
                </div>

                {/* Video Table */}
                <div className="bg-surface/10 rounded-4xl border border-border/40 overflow-hidden">
                    <div className="p-8 border-b border-border flex items-center justify-between">
                        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                            Manage Content
                        </h2>
                        <span className="text-xs font-bold text-text-muted italic">Showing {videos.length} videos</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface/30 border-b border-border">
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted">Video</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted">Status</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted text-center">Views</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted text-center">Likes</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted text-center">Date</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {videos.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center text-text-secondary font-medium italic">
                                            No videos found. Start by uploading your first creative!
                                        </td>
                                    </tr>
                                ) : (
                                    videos.map((video) => (
                                        <tr key={video._id} className="hover:bg-surface/20 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4 min-w-[300px]">
                                                    <div className="w-24 h-14 rounded-xl overflow-hidden bg-surface-hover shrink-0 relative group/thumb">
                                                        <img src={video.thumbnail} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500" />
                                                        <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1 rounded font-bold">{formatDuration(video.duration)}</div>
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-bold text-text-main truncate group-hover:text-primary transition-colors">{video.title}</span>
                                                        <span className="text-[10px] text-text-muted uppercase tracking-tighter mt-0.5">ID: {video._id.slice(-8)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={tw(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                    video.isPublished
                                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                )}>
                                                    {video.isPublished ? <Globe size={10} /> : <Lock size={10} />}
                                                    {video.isPublished ? "Public" : "Private"}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center font-bold text-sm text-text-secondary">{video.views || 0}</td>
                                            <td className="px-8 py-5 text-center font-bold text-sm text-text-secondary">{video.likesCount || 0}</td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-text-main">{new Date(video.createdAt).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-text-muted uppercase">{timeAgo(video.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/studio/${video._id}`)}
                                                        className="p-2.5 bg-surface text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl border border-border transition-all cursor-pointer"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(video._id)}
                                                        disabled={isDeleting === video._id}
                                                        className="p-2.5 bg-surface text-text-secondary hover:text-error hover:bg-error/10 rounded-xl border border-border transition-all cursor-pointer"
                                                    >
                                                        {isDeleting === video._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Dashboard;
