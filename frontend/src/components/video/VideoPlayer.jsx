import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume1, Volume2, VolumeX, Settings, Repeat, Check } from 'lucide-react';
import tw from '../../utils/tailwindUtil';
import { formatDuration, timeAgo, formatViews } from '../../utils/format';

function VideoPlayer({ video, className }) {
    if (!video) return null;

    const {
        videoFile,
        thumbnail,
        duration,
        title
    } = video;

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [videoDuration, setVideoDuration] = useState(duration || 0);
    const [isHovering, setIsHovering] = useState(false);
    const [currentVolume, setCurrentVolume] = useState(1.0);
    const [isVolumeHovered, setIsVolumeHovered] = useState(false);
    const [isPlaybackRateVisible, setIsPlaybackRateVisible] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [isLooping, setIsLooping] = useState(false);

    useEffect(() => {
        if (duration) setVideoDuration(duration);
    }, [duration]);

    useEffect(() => {
        if (videoRef.current) {
            if (currentTime >= videoDuration && !isLooping) {
                setIsPlaying(false);
                setCurrentTime(0);
            }
        }
    }, [videoDuration, currentTime, isLooping])

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    const playBackRates = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
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

    const togglePlaybackRate = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsPlaybackRateVisible(!isPlaybackRateVisible);
    }

    const toggleLoop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLooping(!isLooping);
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
                        className="w-full h-full object-contain"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onVolumeChange={handleVolumeChange}
                        playbackRate={playbackRate}
                        loop={isLooping}
                        onClick={togglePlay}
                    />
                ) : (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                )}

                {/*overlay Controls*/}
                {videoFile && (
                    <div className={tw(`absolute inset-0 bg-background/40 flex flex-col justify-end p-3 duration-300 pointer-events-none`, (isHovering || !isPlaying) ? 'opacity-100' : 'opacity-0')}>
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
                                    <button onClick={togglePlay} className="hover:text-secondary-hover transition-colors cursor-pointer">
                                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                    </button>
                                    {/*Volume Control Container*/}
                                    <div className="flex items-center gap-3 relative z-10"
                                        onMouseEnter={() => setIsVolumeHovered(true)}
                                        onMouseLeave={() => setIsVolumeHovered(false)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button onClick={toggleMute} className="hover:text-secondary-hover transition-colors cursor-pointer">
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
                                {/* Right Side Controls */}
                                <div className="flex items-center gap-4 relative">
                                    {/* Loop Toggle */}
                                    <button
                                        onClick={toggleLoop}
                                        className={tw("hover:text-primary transition-colors cursor-pointer", isLooping ? "text-primary" : "text-text-main")}
                                        title="Loop Video"
                                    >
                                        <Repeat className={tw("w-5 h-5", isLooping && "animate-spin-slow")} />
                                    </button>

                                    {/* Playback Rate Control */}
                                    <div className="relative">
                                        <button
                                            onClick={togglePlaybackRate}
                                            className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                                            title="Playback Speed"
                                        >
                                            <Settings className="w-5 h-5" />
                                            <span className="text-xs font-bold w-6">{playbackRate}x</span>
                                        </button>

                                        {isPlaybackRateVisible && (
                                            <div className="absolute bottom-full right-0 mb-4 bg-background/95 backdrop-blur-md rounded-lg overflow-hidden border border-surface-hover shadow-2xl min-w-[120px] z-50">
                                                <div className="py-1">
                                                    {playBackRates.map((rate) => (
                                                        <button
                                                            key={rate}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPlaybackRate(rate);
                                                                setIsPlaybackRateVisible(false);
                                                            }}
                                                            className={tw(
                                                                "w-full px-4 py-2 text-xs text-left hover:bg-surface-hover transition-colors flex items-center justify-between",
                                                                playbackRate === rate ? "text-primary font-bold bg-primary/10" : "text-text-main"
                                                            )}
                                                        >
                                                            {rate}x
                                                            {playbackRate === rate && <Check className="w-3 h-3" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
        </div>
    );
}

export default VideoPlayer;