import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import userService from "../services/user";
import Container from "../components/container/Container";
import { Loader2, History, ArrowLeft, ExternalLink, PlayCircle, Eye, Clock } from "lucide-react";
import { timeAgo, formatDuration } from "../utils/format";
import Loading from "../components/Loading";

const WatchHistory = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [paginationData, setPaginationData] = useState(null);

    const fetchHistory = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);
            const response = await userService.getUserWatchHistory({
                page: pageNumber,
                limit: 10
            });

            if (response?.data) {
                setVideos(response.data.docs);
                setPaginationData({
                    totalDocs: response.data.totalDocs,
                    hasNextPage: response.data.hasNextPage,
                    hasPrevPage: response.data.hasPrevPage,
                    totalPages: response.data.totalPages,
                });
            }
        } catch (error) {
            console.error("WatchHistory :: fetchHistory :: error", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory(page);
    }, [fetchHistory, page]);

    const handleNextPage = () => {
        if (paginationData?.hasNextPage) setPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (paginationData?.hasPrevPage) setPage(prev => prev - 1);
    };

    if (loading && videos.length === 0) {
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
                    <div className="px-4">
                        <Link
                            to="/home"
                            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold">Back to Feed</span>
                        </Link>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                <History size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-primary">Activity Log</span>
                        </div>
                        <h1 className="text-4xl font-black text-text-main tracking-tight">Watch History</h1>
                        <p className="text-text-secondary mt-2 font-medium">
                            The journey of content you've explored so far
                        </p>
                    </div>
                </Container>
            </div>

            <Container className="px-4">
                <div className="bg-surface/10 rounded-4xl border border-border/40 overflow-hidden">
                    <div className="p-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                            Recent Activity
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-text-muted italic">
                                Total {paginationData?.totalDocs || videos.length} videos
                            </span>
                            {paginationData && paginationData.totalPages > 1 && (
                                <div className="flex items-center gap-2 bg-surface/50 p-1 rounded-xl border border-border">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={!paginationData.hasPrevPage || loading}
                                        className="p-1.5 hover:bg-surface rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                    <span className="text-xs font-black px-2">
                                        {page} / {paginationData.totalPages}
                                    </span>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={!paginationData.hasNextPage || loading}
                                        className="p-1.5 hover:bg-surface rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors rotate-180"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto relative">
                        {loading && videos.length > 0 && (
                            <div className="absolute inset-0 bg-background-page/40 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
                                <Loader2 size={24} className="text-primary animate-spin" />
                            </div>
                        )}
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface/30 border-b border-border">
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted">Video</th>
                                    <th className="hidden md:table-cell px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted">Info</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {videos.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-20 text-center text-text-secondary font-medium italic">
                                            No videos watched yet. Start your journey today!
                                        </td>
                                    </tr>
                                ) : (
                                    videos.map((video) => (
                                        <tr key={video._id} className="hover:bg-surface/20 transition-colors group">
                                            <td className="px-8 py-5 min-w-[300px]">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-32 aspect-video rounded-xl overflow-hidden bg-surface-hover shrink-0 border border-border group-hover:border-primary transition-colors">
                                                        <img
                                                            src={video.thumbnail}
                                                            alt={video.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[10px] font-bold text-white rounded">
                                                            {formatDuration(video.duration)}
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <PlayCircle className="text-white" size={24} />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <Link to={`/video/${video._id}`} className="text-sm font-bold text-text-main truncate hover:text-primary transition-colors">
                                                            {video.title}
                                                        </Link>
                                                        <Link to={`/c/${video.ownerDetails?.username || video.owner?.username}`} className="text-xs text-text-muted hover:text-text-secondary">
                                                            {video.ownerDetails?.fullName || video.owner?.fullName}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
                                                        <Eye size={14} className="text-text-muted" />
                                                        {`${video.views} total views`}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted">
                                                        <Clock size={14} />
                                                        {`Uploaded ${timeAgo(video.createdAt)}`}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Link
                                                    to={`/video/${video._id}`}
                                                    className="inline-flex items-center gap-2 p-2.5 bg-surface text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl border border-border transition-all cursor-pointer group/link"
                                                >
                                                    <span className="text-xs font-bold hidden sm:inline">Watch Again</span>
                                                    <ExternalLink size={16} />
                                                </Link>
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

export default WatchHistory;
