import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import userService from "../services/user";
import videoService from "../services/video";
import Container from "../components/container/Container";
import Button from "../components/button/Button";
import StatCard from "../components/container/StatCard";
import {
    Loader2,
    Plus,
    LayoutDashboard,
    Video,
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
import Loading from "../components/Loading";

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
                <Loading fullScreen={false} />
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
                    <StatCard icon={Video} label="Total Videos" value={stats?.totalVideos || 0} color="bg-primary shadow-primary/20" />
                    <StatCard icon={Eye} label="Cumulative Views" value={formatViews(stats?.totalViews || 0).replace(' views', '')} color="bg-success shadow-success/20" />
                    <StatCard
                        icon={Users}
                        label="Subscribers"
                        value={stats?.totalSubscribers || 0}
                        color="bg-warning shadow-primary/20"
                        onClick={() => navigate("/subscribers")}
                    />
                    <StatCard icon={Heart} label="Channel Likes" value={formatViews(stats?.totalLikes || 0).replace(' views', '')} color="bg-error shadow-error/20" />
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

                    <div className="w-full overflow-x-auto rounded-2xl border border-border bg-surface/10">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-surface/50 border-b border-border">
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Video</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Visibility</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted text-center">Stats</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted text-center">Date</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {videos.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-lg font-medium text-text-secondary">No creatives found</span>
                                                <p className="text-sm text-text-muted italic">Ready to share your story? Upload your first video.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    videos.map((video) => (
                                        <tr key={video._id} className="hover:bg-primary/5 transition-all duration-300 group">
                                            {/* VIDEO COLUMN */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4 group/item">
                                                    <div className="w-32 h-20 rounded-xl overflow-hidden bg-surface-hover shrink-0 relative shadow-lg ring-1 ring-white/5">
                                                        {video.status === "completed" ? (
                                                            <Link to={`/video/${video._id}`}>
                                                                <img
                                                                    src={video.thumbnail}
                                                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
                                                                    alt={video.title}
                                                                />
                                                                <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-lg font-bold tabular-nums">
                                                                    {formatDuration(video.duration)}
                                                                </div>
                                                            </Link>
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-surface/50 gap-2">
                                                                <Loader2 size={24} className={tw("text-text-muted opacity-20", video.status === "processing" && "animate-spin opacity-40 text-primary")} />
                                                                <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted opacity-40">
                                                                    {video.status}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className={tw(
                                                            "text-sm font-bold truncate transition-colors",
                                                            video.status === "completed" ? "text-text-main group-hover/item:text-primary" : "text-text-muted italic"
                                                        )}>
                                                            {video.title}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-text-muted mt-1.5 opacity-50 flex items-center gap-1.5">
                                                            <span className="w-1 h-1 rounded-full bg-text-muted" />
                                                            #{video._id.slice(-8).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-6 py-5">
                                                <div className={tw(
                                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    video.status === "processing" && "bg-primary/10 text-primary border-primary/20 animate-pulse",
                                                    video.status === "completed" && "bg-success/10 text-success border-success/20",
                                                    video.status === "failed" && "bg-error/10 text-error border-error/20"
                                                )}>
                                                    <div className={tw(
                                                        "w-1.5 h-1.5 rounded-full shrink-0",
                                                        video.status === "processing" && "bg-primary",
                                                        video.status === "completed" && "bg-success",
                                                        video.status === "failed" && "bg-error"
                                                    )} />
                                                    {video.status}
                                                </div>
                                            </td>

                                            {/* VISIBILITY */}
                                            <td className="px-6 py-5">
                                                <div className={tw(
                                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                                                    video.isPublished
                                                        ? "bg-white/5 text-text-main border-white/10"
                                                        : "bg-surface text-text-muted border-border/50"
                                                )}>
                                                    {video.isPublished ? <Globe size={12} className="text-primary" /> : <Lock size={12} className="text-warning" />}
                                                    {video.isPublished ? "Public" : "Private"}
                                                </div>
                                            </td>

                                            {/* STATS */}
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col items-center gap-1.5 text-center">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-black text-text-main">{(video.views || 0).toLocaleString()}</span>
                                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Views</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-error/5 text-primary text-[10px] font-bold">
                                                        <Heart size={10} className="fill-current" />
                                                        {video.likesCount || 0}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* DATE */}
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-text-main">{new Date(video.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                                                    <span className="text-[10px] text-text-muted uppercase tracking-tighter mt-1 font-medium">{timeAgo(video.createdAt)}</span>
                                                </div>
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-2 transition-all">
                                                    <button
                                                        onClick={() => navigate(`/studio/${video._id}`)}
                                                        className="p-2.5 bg-surface-hover text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl border border-border/50 transition-all hover:scale-110 active:scale-90 cursor-pointer"
                                                        title="Edit Video"
                                                        disabled={video.status === "processing"}
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(video._id)}
                                                        disabled={isDeleting === video._id || video.status === "processing"}
                                                        className="p-2.5 bg-surface-hover text-text-secondary hover:text-error hover:bg-error/10 rounded-xl border border-border/50 transition-all hover:scale-110 active:scale-90 cursor-pointer"
                                                        title="Delete Video"

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
