import { useState, useEffect, useRef, useCallback } from "react";
import videoService from "../services/video";
import VideoCard from "../components/video/VideoCard";
import Container from "../components/container/Container";
import Loading from "../components/Loading";
import { Loader2, AlertCircle } from "lucide-react";

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);

    const observer = useRef();
    const lastVideoElementRef = useCallback((node) => {
        if (loading || fetchingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {  // Since we store the observer in observer.current (a Ref), we aren't actually creating thousands of objects that leak memory; we are just replacing the one we have and letting the old one be cleaned up by the browser
            if (entries[0].isIntersecting && hasNextPage) {
                setPage((prev) => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, fetchingMore, hasNextPage]);

    const fetchVideos = async (pageNumber, isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            else setFetchingMore(true);

            const response = await videoService.getAllVideos({ page: pageNumber, limit: 12 });

            if (response?.data?.docs) {
                setVideos((prev) => isInitial ? response.data.docs : [...prev, ...response.data.docs]);
                setHasNextPage(response.data.hasNextPage);
            }
        } catch (err) {
            console.error("Error fetching videos:", err);
            setError("Failed to load videos. Please try again later.");
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchVideos(1, true);
    }, []);

    // Fetch more when page changes
    useEffect(() => {
        if (page > 1) {
            fetchVideos(page);
        }
    }, [page]);

    if (loading && videos.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <Loading fullScreen={false} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-error/10">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-text-main mb-2 tracking-tight">System Hiccup</h2>
                <p className="text-text-secondary max-w-sm mb-8 leading-relaxed">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-10 py-3 bg-primary hover:bg-secondary-hover text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 pb-20">
            <Container>
                {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center mt-20">
                        <div className="w-24 h-24 bg-surface/50 rounded-full flex items-center justify-center mb-8 border border-border/50 shadow-inner">
                            <Loader2 className="w-10 h-10 text-text-muted/50" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-main mb-3">No videos streaming yet</h3>
                        <p className="text-text-secondary max-w-xs">Be the first one to stream!</p>
                        <button className="mt-8 px-6 py-2.5 bg-surface hover:bg-surface-hover border border-border rounded-full text-sm font-bold transition-all">
                            Upload Video
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-12 mt-8 md:mt-12">
                            {videos.map((video, index) => {
                                if (videos.length === index + 1) {
                                    return (
                                        <div ref={lastVideoElementRef} key={video._id}>
                                            <VideoCard video={video} className="w-full" />
                                        </div>
                                    )
                                } else {
                                    return <VideoCard key={video._id} video={video} className="w-full" />
                                }
                            })}
                        </div>

                        {/* Infinite Loading Indicator */}
                        {fetchingMore && (
                            <div className="flex justify-center mt-12 mb-8">
                                <div className="flex items-center gap-3 bg-surface/50 px-6 py-3 rounded-full border border-border/50 backdrop-blur-sm shadow-lg">
                                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                    <span className="text-sm font-semibold text-text-secondary tracking-wide">Loading more premium content...</span>
                                </div>
                            </div>
                        )}

                        {/* End of content message */}
                        {!hasNextPage && videos.length > 0 && (
                            <div className="flex flex-col items-center mt-16 pb-10 opacity-50">
                                <div className="w-10 h-px bg-border mb-4" />
                                <p className="text-sm font-medium text-text-muted tracking-widest uppercase">You've reached the horizon</p>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
};

export default Home;
