import { Link } from 'react-router-dom'
import tw from '../../utils/tailwindUtil'
import { formatDuration, timeAgo, formatViews } from '../../utils/format'

function VideoCard({ video, className }) {
    if (!video) return null;
    const {
        _id,
        thumbnail,
        duration,
        title,
        views = 0,
        createdAt,
        ownerDetails
    } = video;

    return (
        <Link to={`/video/${_id}`} className={tw("group w-full flex flex-col gap-3", className)}>
            {/*Thumbnail Section*/}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface shadow-lg shadow-black/20 group-hover:shadow-primary/10 transition-all duration-300">
                <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                <div className='absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300' />
                {/*Duration Badge*/}
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-text-main text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wider">
                    {formatDuration(duration)}
                </div>
            </div>
            {/*Info Section*/}
            <div className="flex gap-3 items-start px-0.5">
                {/*Avatar*/}
                <Link to={`/c/${ownerDetails?.username}`} className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <div className="h-9 w-9 rounded-full overflow-hidden bg-surface-hover border border-border group-hover:border-primary/50 transition-colors duration-300">
                        {ownerDetails?.avatar ? (
                            <img src={ownerDetails?.avatar} alt={ownerDetails?.fullName || "User"} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-text-secondary font-bold bg-linear-to-br from-surface to-surface-hover">
                                {ownerDetails?.fullName?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                </Link>
                {/*Details*/}
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-text-main font-bold text-sm leading-snug line-clamp-2 mb-1 group-hover:text-primary-hover transition-colors duration-200">
                        {title}
                    </h3>
                    <div className='text-text-secondary text-xs flex flex-col gap-0.5'>
                        <Link
                            to={`/c/${ownerDetails?.username}`}
                            className='hover:text-text-main transition-colors duration-200 truncate font-medium'
                            onClick={(e) => e.stopPropagation()}
                        >
                            {ownerDetails?.fullName || ownerDetails?.username || "Unknown"}
                        </Link>
                        <div className='flex items-center gap-1 text-[11px] text-text-muted'>
                            <span>{formatViews(views)}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-text-muted"></span>
                            <span>{timeAgo(createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;

