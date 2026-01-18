import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import tailwindUtil from '../../utils/tailwindUtil';

function formatDuration(seconds) {
    if (!seconds) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function timeAgo(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s") + " ago";

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";

    return Math.floor(seconds) + " seconds ago";
}

function formatViews(views) {
    if (!views) return "0 views";
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M views';
    }
    if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K views';
    }
    return views + ' views';
}

function VideoPlayer({ video, className }) {
    if (!video) return null;

    const {
        videoFile,
        thumbnail,
        duration,
        title,
        views = 0,
        createdAt,
        owner,
    } = video;

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [videoDuration, setVideoDuration] = useState(duration || 0);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (duration) setVideoDuration(duration);
    }, [duration]);

    const togglePlay = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setVideoDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const toggleMute = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div
            className={tailwindUtil("group w-full flex flex-col gap-3 cursor-pointer", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Thumbnail/Video Section */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800">
                {videoFile ? (
                    <video
                        ref={videoRef}
                        src={videoFile}
                        poster={thumbnail}
                        className="w-full h-full object-cover"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onClick={togglePlay}
                        playsInline
                    />
                ) : (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                )}

                {/* Overlay Controls - Only show if videoFile exists */}
                {videoFile && (
                    <div className={`absolute inset-0 bg-black/40 flex flex-col justify-end p-3 transition-opacity duration-300 ${isHovering || isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Center Play Button */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-black/60 p-3 rounded-full backdrop-blur-sm">
                                    <Play className="w-8 h-8 text-white fill-white" />
                                </div>
                            </div>
                        )}

                        {/* Bottom Controls Bar */}
                        <div className="flex flex-col gap-2 bg-linear-to-t from-black/80 to-transparent pt-4 pb-1 px-2 rounded-b-xl" onClick={(e) => e.stopPropagation()}>
                            {/* Progress Bar */}
                            <div className="group/slider w-full h-1 relative flex items-center cursor-pointer">
                                <input
                                    type="range"
                                    min="0"
                                    max={videoDuration || 100}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full"
                                        style={{ width: `${(currentTime / (videoDuration || 1)) * 100}%` }}
                                    />
                                </div>
                                <div
                                    className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity pointer-events-none"
                                    style={{ left: `${(currentTime / (videoDuration || 1)) * 100}%`, transform: 'translateX(-50%)' }}
                                />
                            </div>

                            {/* Buttons & Time */}
                            <div className="flex items-center justify-between text-white mt-1">
                                <div className="flex items-center gap-3">
                                    <button onClick={togglePlay} className="hover:text-purple-400 transition-colors">
                                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                    </button>
                                    <button onClick={toggleMute} className="hover:text-purple-400 transition-colors">
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <span className="text-xs font-medium font-mono">
                                        {formatDuration(currentTime)} / {formatDuration(videoDuration)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Duration Badge fallback logic */}
                {(!isPlaying && !isHovering) || !videoFile ? (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-1.5 py-0.5 rounded-md pointer-events-none">
                        {formatDuration(duration)}
                    </div>
                ) : null}
            </div>

            {/* Info Section */}
            <div className="flex gap-3 items-start px-1">
                {/* Avatar */}
                <div className="shrink-0">
                    <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-700 border border-gray-700/50">
                        {owner?.avatar ? (
                            <img
                                src={owner.avatar}
                                alt={owner.fullName || "User"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-gray-400 font-bold bg-linear-to-br from-gray-700 to-gray-800">
                                {owner?.fullName?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-gray-100 font-bold text-base leading-tight line-clamp-2 mb-1 group-hover:text-purple-400 transition-colors duration-200">
                        {title}
                    </h3>

                    <div className="text-gray-400 text-sm flex flex-col">
                        <span className="hover:text-gray-300 transition-colors duration-200 truncate">
                            {owner?.fullName || owner?.username || "Unknown Channel"}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <span>{formatViews(views)}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-gray-500"></span>
                            <span>{timeAgo(createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;
