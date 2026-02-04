import { useState, useEffect, useCallback, useRef } from "react";
import userService from "../services/user";
import VideoCard from "../components/video/VideoCard";
import Container from "../components/container/Container";
import { Loader2, ThumbsUp, AlertCircle } from "lucide-react";
import tw from "../utils/tailwindUtil";

const LikedVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalVideos, setTotalVideos] = useState(0);

    const observer = useRef();
    const lastVideoElementRef = useCallback((node) => {
        if (loading || fetchingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                setPage((prev) => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, fetchingMore, hasNextPage]);

    const fetchLikedVideos = async (pageNumber, isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            else setFetchingMore(true);

            const response = await userService.getLikedVideos({ page: pageNumber, limit: 12 });

            if (response?.data) {
                const newVideos = response.data.docs.map(doc => ({
                    ...doc.video,
                }));

                setVideos((prev) => isInitial ? newVideos : [...prev, ...newVideos]);
                setHasNextPage(response.data.hasNextPage);
                setTotalVideos(response.data.totalDocs);
            }
        } catch (err) {
            console.error("Error fetching liked videos:", err);
            setError("Failed to load liked videos.");
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    };

    useEffect(() => {
        fetchLikedVideos(1, true);
    }, []);

    useEffect(() => {
        if (page > 1) {
            fetchLikedVideos(page);
        }
    }, [page]);

    if (loading && videos.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-text-secondary font-medium">Fetching your favorites...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertCircle size={48} className="text-error mb-4" />
                <h2 className="text-2xl font-bold text-text-main mb-2">Something went wrong</h2>
                <p className="text-text-secondary mb-8">{error}</p>
                <button
                    onClick={() => fetchLikedVideos(1, true)}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold transition-all active:scale-95"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 pb-20">
            <div className="bg-surface/30 border-b border-border py-12 mb-8">
                <Container>
                    <div className="flex flex-col md:flex-row items-center gap-8 px-4">
                        <div className="w-48 h-28 md:w-64 md:h-36 bg-linear-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-primary/20 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                            <ThumbsUp size={48} className="text-primary relative z-10" />
                        </div>
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-black text-text-main tracking-tight mb-2">Liked Videos</h1>
                            <div className="flex items-center gap-2 text-text-secondary font-bold">
                                <span>{totalVideos} contents</span>
                                <span className="w-1 h-1 rounded-full bg-text-muted" />
                                <span>Updated just now</span>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="p-6 bg-surface-hover rounded-full mb-4">
                            <ThumbsUp size={32} className="text-text-muted" />
                        </div>
                        <h3 className="text-xl font-bold text-text-main">No liked videos yet</h3>
                        <p className="text-text-secondary max-w-xs mt-1">Start exploring and show some love to your favorite creators!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 px-4">
                        {videos.map((video, index) => {
                            if (videos.length === index + 1) {
                                return (
                                    <div ref={lastVideoElementRef} key={video._id}>
                                        <VideoCard video={video} />
                                    </div>
                                )
                            }
                            return <VideoCard key={video._id} video={video} />
                        })}
                    </div>
                )}

                {fetchingMore && (
                    <div className="flex justify-center mt-12">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                )}
            </Container>
        </div>
    );
};

export default LikedVideos;
