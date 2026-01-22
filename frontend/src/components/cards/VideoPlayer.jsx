import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume1, Volume2, VolumeX } from 'lucide-react';
import tw from '../../utils/tailwindUtil';

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
    const [currentVolume, setCurrentVolume] = useState(1.0);
    const [isVolumeHovered, setIsVolumeHovered] = useState(false);

    useEffect(() => {
        if (duration) setVideoDuration(duration);
    }, [duration]);

    useEffect(() => {
        if (videoRef.current) {
            if (currentTime === videoDuration) {
                setIsPlaying(false);
                setCurrentTime(0);
            }
        }
    }, [videoDuration, currentTime])

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
    }

    const handleVolumeChange = () => {
        if (videoRef.current) {
            setCurrentVolume((videoRef.current.volume === 0) ? 0.5 : videoRef.current.volume);
        }
    }

    const handleUserTimeUpdate = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    }

    const handleUserVolumeChange = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const volume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = volume;
            if (volume === 0) {
                videoRef.current.muted = true;
                setIsMuted(true);
            } else {
                videoRef.current.muted = false;
                setIsMuted(false);
            }
        }
    }

    const toggleMute = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            videoRef.current.volume = currentVolume;
            setIsMuted(!isMuted);
        }
    }

    return (
        <div className={tw("group w-full flex flex-col gap-3 cursor-pointer", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Thumbnail/Video Section */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface">
                {videoFile ? (
                    <video
                        ref={videoRef}
                        src={videoFile}
                        poster={thumbnail}
                        className="w-full h-full object-cover"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onVolumeChange={handleVolumeChange}
                        onClick={togglePlay}
                    />
                ) : (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                )}

                {/*overlay Controls*/}
                {videoFile && (
                    <div className={`absolute inset-0 bg-background/40 flex flex-col justify-end p-3 duration-300 pointer-events-none ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                        {/*Center play Button*/}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-background/60 p-3 rounded-full backdrop-blur-sm">
                                    <Play className="w-8 h-8 text-text-main fill-text-main" />
                                </div>
                            </div>
                        )}
                        {/*Bottom Controls Bar*/}
                        <div className="flex flex-col gap-2 bg-linear-to-t from-background/80 to-transparent pt-4 pb-1 px-2 rounded-b-xl pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                            {/*Progress Bar*/}
                            <div className="group/slider w-full h-1 relative flex items-center cursor-pointer">
                                <input
                                    type="range"
                                    min="0"
                                    max={videoDuration || 100}
                                    value={currentTime}
                                    onChange={handleUserTimeUpdate}
                                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="w-full h-1 bg-surface-hover rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full"
                                        style={{ width: `${currentTime / (videoDuration || 1) * 100}%` }} />
                                </div>
                                <div
                                    className="absolute w-3 h-3 bg-text-main rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity pointer-events-none"
                                    style={{ left: `${(currentTime / (videoDuration || 1)) * 100}%`, transform: 'translateX(-50%)' }}
                                />
                            </div>
                            {/*Buttons & Time */}
                            <div className="flex items-center justify-between text-text-main mt-1">
                                <div className="flex items-center gap-3">
                                    <button onClick={togglePlay} className="hover:text-secondary-hover transition-colors">
                                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                    </button>
                                    {/*Volume Control Container*/}
                                    <div className="flex items-center gap-3 relative z-10"
                                        onMouseEnter={() => setIsVolumeHovered(true)}
                                        onMouseLeave={() => setIsVolumeHovered(false)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button onClick={toggleMute} className="hover:text-secondary-hover transition-colors">
                                            {isMuted || currentVolume === 0 ? <VolumeX className='w-6 h-6' /> : (currentVolume < 0.5 ? <Volume1 className='w-6 h-6' /> : <Volume2 className='w-6 h-6' />)}
                                        </button>
                                        {/* Volume Slider Container */}
                                        <div className={`h-6 flex items-center transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${isVolumeHovered ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
                                            <div className="group/slider h-full w-full relative flex items-center cursor-pointer">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.05"
                                                    value={isMuted ? 0 : currentVolume}
                                                    onChange={handleUserVolumeChange}
                                                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="w-full h-1 bg-surface-hover rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full transition-all duration-100"
                                                        style={{ width: `${(isMuted ? 0 : currentVolume) * 100}%` }} />
                                                </div>
                                                <div
                                                    className="absolute w-3 h-3 bg-text-main rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity pointer-events-none"
                                                    style={{ left: `${(isMuted ? 0 : currentVolume) * 100}%`, transform: 'translateX(-50%)' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium font-mono">
                                        {formatDuration(currentTime)} / {formatDuration(videoDuration)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {(!isPlaying && !isHovering) || !videoFile ? (
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-text-main text-xs font-medium px-1.5 py-0.5 rounded-md pointer-events-none">
                        {formatDuration(duration)}
                    </div>
                ) : null}
            </div>
            {/*Info Section*/}
            <div className="flex gap-3 items-start px-1">
                {/*Avatar*/}
                <div className="shrink-0">
                    <div className="h-9 w-9 rounded-full overflow-hidden bg-surface-hover border border-border">
                        {owner?.avatar ? (
                            <img src={owner.avatar} alt={owner.fullName || "User"} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-text-secondary font-bold bg-linear-to-br from-surface to-surface-hover">
                                {owner?.fullName?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                </div>
                {/*Details*/}
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-text-main font-bold text-base leading-tight line-clamp-2 mb-1 group-hover:text-primary-hover transition-colors duration-200">
                        {title}
                    </h3>
                    <div className="text-text-secondary text-sm flex flex-col">
                        <span className="hover:text-text-main transition-colors duration-200 truncate">
                            {owner?.username || owner?.fullName || "Unknown"}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-text-secondary mt-0.5">
                            <span>{formatViews(views)}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-text-secondary"></span>
                            <span>{timeAgo(createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;