import tw from '../../utils/tailwindUtil'
import { formatDuration, timeAgo, formatViews } from '../../utils/format'

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
        <div className={tw("group w-full flex flex-col gap-3 cursor-pointer", className)}>
            {/*Thumbnail Section*/}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface">
                <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                <div className='absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300' />

                {/*Duration Badge*/}
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-text-main text-xs font-medium px-1.5 py-0.5 rounded-md">
                    {formatDuration(duration)}
                </div>
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
                    <div className='text-text-secondary text-sm flex flex-col'>
                        <span className='hover:text-text-main transition-colors duration-200 truncate'>
                            {owner?.fullName || owner?.username || "Unknown"}
                        </span>
                        <div className='flex items-center gap-1 text-xs text-text-secondary mt-0.5'>
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

export default VideoCard;

