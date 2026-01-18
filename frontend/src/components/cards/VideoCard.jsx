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

function VideoCard({ video, className }) {
    if (!video) return null;

    const {
        thumbnail,
        duration,
        title,
        views = 0,
        createdAt,
        owner,
    } = video;

    return (
        <div className={tailwindUtil("group w-full flex flex-col gap-3 cursor-pointer", className)}>
            {/* Thumbnail Section */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-1.5 py-0.5 rounded-md">
                    {formatDuration(duration)}
                </div>
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

export default VideoCard;
