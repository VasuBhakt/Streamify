import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import videoService from "../services/video";
import VideoCard from "../components/video/VideoCard";
import Container from "../components/container/Container";
import { Loader2, Search, AlertCircle, Filter } from "lucide-react";
import tw from "../utils/tailwindUtil";

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
            <div className="border-b border-border bg-surface/10 py-6 mb-8 sticky top-16 z-30 backdrop-blur-md">
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover border border-border rounded-lg text-sm font-bold transition-all cursor-pointer w-fit">
                            <Filter size={16} />
                            Filters
                        </button>
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

export default SearchResults;
