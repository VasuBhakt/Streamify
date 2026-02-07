import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import userService from "../services/user";
import subscriptionService from "../services/subscription";
import Container from "../components/container/Container";
import VideoCard from "../components/video/VideoCard";
import Button from "../components/button/Button";
import { Loader2, Bell, Video, PlaySquare, User, Info, Play, Clock } from "lucide-react";
import tw from "../utils/tailwindUtil";
import { formatViews, formatDate } from "../utils/format";

const Channel = () => {
    const { username } = useParams();
    const { status, userData } = useSelector((state) => state.auth);

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [videosLoading, setVideosLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("videos"); // videos, about
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);

    const fetchChannelProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await userService.getUserChannelProfile(username);
            if (response?.data) {
                setChannel(response.data);
                setIsSubscribed(response.data.isSubscribed);
                setSubscribersCount(response.data.subscribersCount);

                // Fetch videos after channel info is loaded
                fetchChannelVideos(response.data.username);
            }
        } catch (error) {
            console.error("Error fetching channel profile:", error);
        } finally {
            setLoading(false);
        }
    }, [username]);

    const fetchChannelVideos = async (username) => {
        try {
            setVideosLoading(true);
            const response = await userService.getUserAllVideos({ username, limit: 100 });
            if (response?.data?.docs) {
                setVideos(response.data.docs);
            }
        } catch (error) {
            console.error("Error fetching channel videos:", error);
        } finally {
            setVideosLoading(false);
        }
    };

    useEffect(() => {
        if (username) {
            fetchChannelProfile();
        }
    }, [username, fetchChannelProfile]);

    const handleToggleSubscription = async () => {
        if (!status) {
            // Redirect to login or show modal
            alert("Please login to subscribe");
            return;
        }

        const prevSubscribed = isSubscribed;
        const prevCount = subscribersCount;

        setIsSubscribed(!prevSubscribed);
        setSubscribersCount(prevCount + (prevSubscribed ? -1 : 1));

        try {
            await subscriptionService.toggleSubscription(channel._id);
        } catch (error) {
            console.error("Error toggling subscription:", error);
            setIsSubscribed(prevSubscribed);
            setSubscribersCount(prevCount);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="p-6 bg-surface-hover rounded-full">
                    <User className="w-12 h-12 text-text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-text-main">Channel not found</h2>
                <Link to="/home">
                    <Button variant="primary">Go Home</Button>
                </Link>
            </div>
        );
    }

    const isOwner = userData?._id === channel?._id;

    const tabs = [
        { id: "videos", label: "Videos", icon: Video },
        { id: "about", label: "About", icon: Info },
    ];

    return (
        <div className="flex-1 bg-background-page">
            {/* Cover Image */}
            <div className="w-full h-[150px] md:h-[200px] lg:h-[250px] bg-surface-hover relative overflow-hidden">
                {channel.coverImage ? (
                    <img
                        src={channel.coverImage}
                        alt="cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-r from-surface to-surface-hover" />
                )}
            </div>

            <Container className="pt-0">
                {/* Channel Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between -mt-10 md:-mt-12 gap-6 px-4">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="h-28 w-28 md:h-36 md:w-36 rounded-full overflow-hidden border-4 border-background-page bg-surface shadow-2xl relative group shrink-0">
                            {channel.avatar ? (
                                <img
                                    src={channel.avatar}
                                    alt={channel.fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-4xl font-bold bg-linear-to-br from-surface to-surface-hover">
                                    {channel.fullName?.[0]?.toUpperCase() || "?"}
                                </div>
                            )}
                        </div>

                        {/* Channel Info */}
                        <div className="flex flex-col items-center md:items-start pt-2 md:pt-14">
                            <h1 className="text-2xl md:text-3xl font-black text-text-main tracking-tight">
                                {channel.fullName}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-text-secondary font-bold text-sm">@{channel.username}</span>
                                <span className="w-1 h-1 rounded-full bg-text-muted" />
                                <span className="text-text-secondary font-bold text-sm">
                                    {formatViews(subscribersCount).replace(" views", "")} subscribers
                                </span>
                                <span className="w-1 h-1 rounded-full bg-text-muted" />
                                <span className="text-text-secondary font-bold text-sm">
                                    {channel.channelsSubscribedToCount} subscribed
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 md:pt-14">
                        {isOwner ? (
                            <Link to="/settings">
                                <Button variant="secondary" className="rounded-full px-8">Edit Channel</Button>
                            </Link>
                        ) : (
                            <Button
                                variant={isSubscribed ? "secondary" : "primary"}
                                size="md"
                                className="rounded-full px-8 font-extrabold tracking-tight"
                                onClick={handleToggleSubscription}
                                icon={isSubscribed ? Bell : null}
                            >
                                {isSubscribed ? "Subscribed" : "Subscribe"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-border mt-10 px-4 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={tw(
                                "flex items-center gap-2 py-4 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap",
                                activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-text-secondary hover:text-text-main"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="py-8 px-4">
                    {activeTab === "videos" && (
                        <div>
                            {videosLoading && videos.length === 0 ? (
                                <div className="py-20 flex justify-center">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            ) : videos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                                    {videos.map((video) => (
                                        <VideoCard key={video._id} video={{ ...video, ownerDetails: channel }} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-surface/5 rounded-3xl border border-dashed border-border/50">
                                    <div className="mx-auto w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4">
                                        <PlaySquare className="w-8 h-8 text-text-muted" />
                                    </div>
                                    <h3 className="text-lg font-bold text-text-main">No videos uploaded yet</h3>
                                    <p className="text-text-secondary text-sm mt-1">This channel hasn't posted any content yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="max-w-3xl space-y-8">
                            <div>
                                <h3 className="text-xl font-black text-text-main mb-4 tracking-tight">Channel Description</h3>
                                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                    {channel.description || "No description provided for this channel."}
                                </p>
                            </div>
                            <div className="w-full grid grid-cols-1 gap-8 pt-8 border-t border-border/50">
                                <div>
                                    <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Stats</h4>
                                    <div className="flex flex-wrap gap-x-10 gap-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center border border-border/50">
                                                <Play className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-text-main font-semibold">{videos.length} videos</span>
                                                <span className="text-text-secondary text-[11px] uppercase tracking-wider font-bold">Total Content</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center border border-border/50">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-text-main font-semibold">{formatViews(subscribersCount).replace(" views", "")} subscribers</span>
                                                <span className="text-text-secondary text-[11px] uppercase tracking-wider font-bold">Community</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center border border-border/50">
                                                <Clock className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-text-main font-semibold">Joined {formatDate(channel.createdAt)}</span>
                                                <span className="text-text-secondary text-[11px] uppercase tracking-wider font-bold">Tenure</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default Channel;
