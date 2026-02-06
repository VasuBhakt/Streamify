import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import videoService from "../services/video";
import Container from "../components/container/Container";
import { Loader2, Search, AlertCircle, Heart, Eye } from "lucide-react";
import { formatViews, timeAgo, formatDuration } from "../utils/format";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

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

    const fetchResults = async (pageNumber, isInitial = false) => {
        if (!query) return;
        try {
            if (isInitial) setLoading(true);
            else setFetchingMore(true);

            const response = await videoService.getAllVideos({
                page: pageNumber,
                limit: 12,
                query: query
            });

            if (response?.data) {
                setVideos((prev) => isInitial ? response.data.docs : [...prev, ...response.data.docs]);
                setHasNextPage(response.data.hasNextPage);
                setTotalResults(response.data.totalDocs);
            }
        } catch (err) {
            console.error("Error fetching search results:", err);
            setError("Failed to load search results.");
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    };

    useEffect(() => {
        if (query) {
            setPage(1);
            fetchResults(1, true);
        }
    }, [query]);

    useEffect(() => {
        if (page > 1) {
            fetchResults(page);
        }
    }, [page]);

    if (loading && videos.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-text-secondary font-medium">Scanning the multiverse for "{query}"...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertCircle size={48} className="text-error mb-4" />
                <h2 className="text-2xl font-bold text-text-main mb-2">Search failed</h2>
                <p className="text-text-secondary mb-8">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 pb-20">
            <div className="border-b border-border bg-surface/5 py-8 mb-10">
                <Container>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Search size={20} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-text-main line-clamp-1">Results for "{query}"</h1>
                                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{totalResults} matches found</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="p-6 bg-surface-hover rounded-full mb-4">
                            <Search size={32} className="text-text-muted" />
                        </div>
                        <h3 className="text-xl font-bold text-text-main">No results found</h3>
                        <p className="text-text-secondary max-w-xs mt-1">Try different keywords or check your spelling.</p>
                    </div>
                ) : (
                    <div className="space-y-6 px-4">
                        {videos.map((video, index) => (
                            <div
                                key={video._id}
                                ref={videos.length === index + 1 ? lastVideoElementRef : null}
                                className="group bg-surface/10 hover:bg-surface/30 border border-border/40 hover:border-primary/30 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
                            >
                                <div className="flex flex-col md:flex-row gap-6 p-4">
                                    {/* Thumbnail container */}
                                    <Link to={`/video/${video._id}`} className="shrink-0">
                                        <div className="relative w-full md:w-80 aspect-video rounded-2xl overflow-hidden border border-border/50 group-hover:border-primary/50 transition-colors shadow-lg shadow-black/20">
                                            <img
                                                src={video.thumbnail}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                alt={video.title}
                                            />
                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/90 text-[10px] font-black text-white rounded-lg backdrop-blur-sm border border-white/10 uppercase tracking-widest">
                                                {formatDuration(video.duration)}
                                            </div>
                                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </Link>

                                    {/* Content info */}
                                    <div className="flex-1 min-w-0 py-2">
                                        <div className="flex flex-col h-full">
                                            <div>
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <Link to={`/video/${video._id}`}>
                                                        <h2 className="text-xl font-black text-text-main leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                            {video.title}
                                                        </h2>
                                                    </Link>
                                                </div>

                                                <div className="flex items-center gap-2 mb-4">
                                                    <Link to={`/c/${video.ownerDetails?.username}`} className="flex items-center gap-2 group/owner">
                                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-border group-hover/owner:border-primary transition-colors">
                                                            <img src={video.ownerDetails?.avatar} className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="text-xs font-bold text-text-secondary group-hover/owner:text-text-main transition-colors">
                                                            {video.ownerDetails?.fullName}
                                                        </span>
                                                    </Link>
                                                    <span className="w-1 h-1 rounded-full bg-text-muted" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                                        {formatViews(video.views)}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-text-muted" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                                        {timeAgo(video.createdAt)}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-6 font-medium">
                                                    {video.description}
                                                </p>
                                            </div>

                                            <div className="mt-auto flex items-center gap-6">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface/50 border border-border/60 rounded-xl">
                                                    <Heart size={14} className="text-primary fill-primary" />
                                                    <span className="text-xs font-black text-text-main">
                                                        {video.likesCount || 0}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface/50 border border-border/60 rounded-xl">
                                                    <Eye size={14} className="text-emerald-500" />
                                                    <span className="text-xs font-black text-text-main">
                                                        {formatViews(video.views).replace(' views', '')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {fetchingMore && (
                    <div className="flex justify-center mt-12">
                        <div className="flex items-center gap-3 bg-surface/50 px-6 py-3 rounded-full border border-border/50 backdrop-blur-sm shadow-lg">
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            <span className="text-sm font-semibold text-text-secondary tracking-wide">Loading more results...</span>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default SearchResults;
