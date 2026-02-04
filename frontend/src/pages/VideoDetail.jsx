import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import videoService from "../services/video";
import commentService from "../services/comment";
import likeService from "../services/like";
import subscriptionService from "../services/subscription";
import userService from "../services/user";
import Container from "../components/container/Container";
import VideoCard from "../components/video/VideoCard";
import VideoPlayer from "../components/video/VideoPlayer";
import VideoDescription from "../components/video/VideoDescription";
import CommentCard from "../components/comment/CommentCard";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import { Loader2, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import tw from "../utils/tailwindUtil";

const VideoDetail = () => {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [channel, setChannel] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Comments State
    const [comments, setComments] = useState([]);
    const [commentsPage, setCommentsPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [totalComments, setTotalComments] = useState(0);

    // Social Stats (Separated Concerns)
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const user = useSelector((state) => state.auth.userData);
    const status = useSelector((state) => state.auth.status);

    // Observer for infinite scroll on comments
    const observer = useRef();
    const lastCommentElementRef = useCallback(node => {
        if (commentsLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreComments) {
                setCommentsPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [commentsLoading, hasMoreComments]);

    const fetchVideoData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await videoService.getVideoById({ videoId });
            if (response?.data) {
                setVideo(response.data);
                setLikesCount(response.data.likesCount || 0);
                setIsLiked(response.data.isLiked || false);
                setTotalComments(response.data.commentsCount || 0);

                // 1. Initialize logic immediately from video owner data (which now includes sub stats)
                // This prevents the "not working" feel while waiting for the second call.
                if (response.data.ownerDetails) {
                    setChannel(response.data.ownerDetails);
                    setIsSubscribed(response.data.ownerDetails.isSubscribed || false);
                    setSubscribersCount(response.data.ownerDetails.subscribersCount || 0);
                }

                // 2. Restore the original separate API call pattern as explicitly requested.
                // Updated to use ownerDetails.username instead of _id for SEO.
                if (response.data.ownerDetails?.username) {
                    try {
                        const channelResponse = await userService.getUserChannelProfile(response.data.ownerDetails.username);
                        if (channelResponse?.data) {
                            setChannel(channelResponse.data);
                            setIsSubscribed(channelResponse.data.isSubscribed);
                            setSubscribersCount(channelResponse.data.subscribersCount);
                        }
                    } catch (channelErr) {
                        console.error("Error fetching channel detail:", channelErr);
                        // We don't set the main error here so the video can still be watched
                    }
                }
            } else {
                setError("Video not found");
            }

            // Fetch related videos
            const relatedResponse = await videoService.getAllVideos({ limit: 12 });
            if (relatedResponse?.data?.docs) {
                setRelatedVideos(relatedResponse.data.docs.filter(v => v._id !== videoId));
            }

        } catch (err) {
            console.error("Error fetching video detail:", err);
            setError("Failed to load video details.");
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (pageToFetch = commentsPage) => {
        if (!videoId) return;
        try {
            setCommentsLoading(true);
            const response = await commentService.getVideoComments({
                videoId,
                page: pageToFetch,
                limit: 10
            });

            if (response?.data?.docs) {
                setComments((prev) => {
                    const newDocs = response.data.docs;
                    if (pageToFetch === 1) return newDocs;

                    // Filter out already existing comments to prevent duplicates (Strict Mode safe)
                    const filteredNewDocs = newDocs.filter(
                        (newDoc) => !prev.some((oldDoc) => oldDoc._id === newDoc._id)
                    );
                    return [...prev, ...filteredNewDocs];
                });
                setHasMoreComments(response.data.hasNextPage);
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setCommentsLoading(false);
        }
    };

    const commentObserver = useRef();
    const addComment = async () => {
        try {
            const content = commentObserver.current.value.trim();
            if (!content) return;
            const response = await commentService.addComment({
                videoId,
                content
            });
            if (response?.data) {
                // Initialize likes data for the new comment
                const newComment = {
                    ...response.data,
                    isLiked: false,
                    likesCount: 0
                };
                setComments((prev) => [newComment, ...prev]);
                setTotalComments((prev) => prev + 1);
                commentObserver.current.value = "";
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }

    const cancelComment = () => {
        commentObserver.current.value = "";
    }

    const updateComment = async (commentId, content) => {
        try {
            const response = await commentService.updateComment({
                videoId,
                commentId,
                content
            });
            if (response?.data) {
                setComments((prev) =>
                    prev.map((c) => c._id === commentId ? { ...c, ...response.data, ownerDetails: c.ownerDetails } : c)
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error editing comment:", error);
            return false;
        }
    }

    const deleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await commentService.deleteComment({ videoId, commentId });
            setComments((prev) => prev.filter((c) => c._id !== commentId));
            setTotalComments((prev) => prev - 1);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    const handleToggleLike = async () => {
        if (!status) return;

        // Optimistic update
        const prevLiked = isLiked;
        const prevCount = likesCount;

        setIsLiked(!prevLiked);
        setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

        try {
            await likeService.toggleLikeVideo({ videoId });
        } catch (error) {
            console.error("Error liking video:", error);
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
        }
    }

    const handleToggleSubscribe = async () => {
        if (!status) {
            window.alert("Please sign in to subscribe to channels");
            return;
        }
        if (!channel?._id) return;

        const ownerId = channel._id.toString();

        // Optimistic update
        const prevSubscribed = isSubscribed;
        const prevCount = subscribersCount;

        setIsSubscribed(!prevSubscribed);
        setSubscribersCount(prevSubscribed ? (prevCount > 0 ? prevCount - 1 : 0) : prevCount + 1);

        try {
            await subscriptionService.toggleSubscription(ownerId);
        } catch (error) {
            console.error("Error toggling subscription:", error);
            setIsSubscribed(prevSubscribed);
            setSubscribersCount(prevCount);
        }
    }
    const handleToggleCommentLike = async (commentId) => {
        if (!status) return;

        setComments((prev) =>
            prev.map((c) => {
                if (c._id === commentId) {
                    const isLiked = c.isLiked || false;
                    const likesCount = c.likesCount || 0;
                    return {
                        ...c,
                        isLiked: !isLiked,
                        likesCount: isLiked ? likesCount - 1 : likesCount + 1
                    };
                }
                return c;
            })
        );

        try {
            await likeService.toggleLikeComment({ commentId });
        } catch (error) {
            console.error("Error toggling comment like:", error);
            // Revert on error
            setComments((prev) =>
                prev.map((c) => {
                    if (c._id === commentId) {
                        const isLiked = c.isLiked || false;
                        const likesCount = c.likesCount || 0;
                        return {
                            ...c,
                            isLiked: !isLiked,
                            likesCount: isLiked ? likesCount - 1 : likesCount + 1
                        };
                    }
                    return c;
                })
            );
        }
    };

    // Initial load for video, channel and comments
    useEffect(() => {
        if (videoId) {
            window.scrollTo(0, 0);
            setVideo(null);
            setChannel(null);
            setComments([]);
            setCommentsPage(1);
            fetchVideoData();
            fetchComments(1);
        }
    }, [videoId]);

    // Fetch comments whenever commentsPage changes
    useEffect(() => {
        if (commentsPage > 1) {
            fetchComments(commentsPage);
        }
    }, [commentsPage]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[70vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-text-secondary font-medium tracking-wide">Initializing theater mode...</p>
                </div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <Container className="py-20 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-16 h-16 text-error mb-4" />
                <h2 className="text-2xl font-bold text-text-main mb-2">Video Unavailable</h2>
                <p className="text-text-secondary mb-8 max-w-md">{error || "The video could not be loaded."}</p>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-surface hover:bg-surface-hover border border-border rounded-full transition-all"
                >
                    Go Back
                </button>
            </Container>
        );
    }

    return (
        <div className="bg-background-page min-h-screen">
            <Container className="py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Player Section */}
                        <div className="rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video ring-1 ring-white/5">
                            <VideoPlayer video={video} />
                        </div>

                        {/* Description Section */}
                        <VideoDescription
                            video={{
                                ...video,
                                likesCount,
                                isLiked,
                                ownerDetails: {
                                    ...video.ownerDetails,
                                    subscribersCount,
                                }
                            }}
                            isLiked={isLiked}
                            isSubscribed={isSubscribed}
                            onLike={handleToggleLike}
                            onSubscribe={handleToggleSubscribe}
                            ownVideo={user && (channel?._id === user?._id || video?.ownerDetails?._id === user?._id)}
                        />

                        {/* Comments Section */}
                        <div className="bg-surface/10 rounded-2xl p-6 border border-border/40">
                            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <span className="text-primary">{totalComments}</span> Comments
                            </h3>

                            {/* Comment Input */}
                            <div className="flex gap-4 mb-5">
                                <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center shrink-0 border border-border">
                                    <span className="text-text-secondary font-bold">{user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.username ? user.username.charAt(0).toUpperCase() : "U"}</span>
                                </div>
                                <div className="flex-1 group">
                                    <Input
                                        ref={commentObserver}
                                        type="text"
                                        readOnly={!status}
                                        placeholder={status ? "Add a comment" : "Add a public comment (Sign in required)..."}
                                        className={tw("w-full bg-transparent border-b border-border py-2 outline-none text-text-muted", !status && "cursor-not-allowed")}
                                    />
                                    {status && (<div className="flex justify-end gap-3 mt-3 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                                        <Button variant="ghost" className="px-4 py-1.5 text-sm font-semibold text-text-secondary hover:text-text-main transition-colors" onClick={cancelComment}>Cancel</Button>
                                        <Button variant="ghost" className="px-4 py-1.5 text-sm font-semibold bg-primary text-white rounded-full hover:bg-secondary-hover transition-all" onClick={addComment}>Comment</Button>
                                    </div>)}
                                </div>
                            </div>

                            <div className="space-y-8">
                                {comments.map((comment, index) => {
                                    const isOwner = user?._id === comment.ownerDetails?._id;
                                    const commentProps = {
                                        comment,
                                        onUpdate: updateComment,
                                        onDelete: deleteComment,
                                        onLike: handleToggleCommentLike,
                                        isEditable: isOwner,
                                        isDeletable: isOwner
                                    };

                                    if (comments.length === index + 1) {
                                        return (
                                            <div ref={lastCommentElementRef} key={comment._id}>
                                                <CommentCard {...commentProps} />
                                            </div>
                                        );
                                    }
                                    return <CommentCard key={comment._id} {...commentProps} />;
                                })}

                                {commentsLoading && (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                    </div>
                                )}

                                {!hasMoreComments && comments.length > 0 && (
                                    <p className="text-center text-text-muted text-sm pt-4 border-t border-border/20">
                                        No more comments to show.
                                    </p>
                                )}

                                {comments.length === 0 && !commentsLoading && (
                                    <p className="text-center text-text-muted text-sm py-10">
                                        No comments yet. Be the first to start the conversation!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Recommendations Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                Up Next
                            </h2>
                        </div>
                        <div className="flex flex-col gap-5">
                            {relatedVideos.length > 0 ? (
                                relatedVideos.map((v) => (
                                    <VideoCard
                                        key={v._id}
                                        video={v}
                                        className="hover:bg-surface/30 p-2 rounded-xl transition-all duration-300 border border-transparent hover:border-border/40"
                                    />
                                ))
                            ) : (
                                <div className="text-center py-10 bg-surface/10 rounded-2xl border border-dashed border-border">
                                    <p className="text-text-muted text-sm tracking-wide">Seeking more videos...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default VideoDetail;
