import { useState } from "react";
import { formatViews, timeAgo } from "../../utils/format";
import Button from "../button/Button";
import { Bell, Heart, Share2, MoreHorizontal } from "lucide-react";
import tw from "../../utils/tailwindUtil";


const VideoDescription = ({ video }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!video) return null;

    const {
        title,
        description,
        views,
        createdAt,
        owner,
        likesCount = 0,
        isSubscribed = false
    } = video;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/*Title & Top Stats*/}
            <div className="space-y-2">
                <h1 className="text-xl md:text-2xl font-bold text-text-main line-clamp-2 leading-tight">
                    {title}
                </h1>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    {/*Owner info*/}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden bg-surface-hover border border=border">
                            {owner?.avatar ? (
                                <img src={owner.avatar} alt={owner.fullName} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-sm font-bold bg-linear-to-br from-surface to-surface-hover">
                                    {owner?.fullName?.[0]?.toUpperCase() || "?"}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-text-main font-bold text-base leading-none hover:text-primary-hover cursor-pointer">
                                {owner?.fullName || "Unknown Channel"}
                            </span>
                            <span className="text-text-secondary text-xs mt-1">
                                {formatViews(owner?.subscribersCount || 0).replace(' views', '')} subscribers
                            </span>
                        </div>
                        {/*Subscribe button*/}
                        <Button
                            variant={isSubscribed ? "secondary" : "primary"}
                            size="md"
                            className="ml-4 rounded-full px-6 cursor-pointer font-semibold"
                            label={isSubscribed ? "Subscribed" : "Subscribe"}
                            icon={isSubscribed ? Bell : null}
                        />
                    </div>
                    {/*Action Buttons*/}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-surface-hover rounded-full overflow-hidden border border-border">
                            <button className="flex items-center gap-2 px-4 py-2 hover:bg-surface transition-colors border-r border-border cursor-pointer">
                                <Heart className="w-5 h-5" />
                                <span className="text-sm font-medium">{likesCount}</span>
                            </button>
                            <button className="px-4 py-2 hover:bg-surface transition-colors cursor-pointer">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                        <button className="p-2 bg-surface-hover hover:bg-surface border border-border rounded-full transition-colors cursor-pointer">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            {/*Description Box*/}
            <div className={tw(
                "p-4 bg-surface-hover rounded-2xl border border-border transition-all duration-300",
                isExpanded ? "pb-8" : "hover:bg-surface cursor-pointer"
            )}
                onClick={() => !isExpanded && setIsExpanded(true)}
            >
                <div className="flex items-center gap-2 text-sm font-bold text-text-main mb-2">
                    <span>{formatViews(views)}</span>
                    <span className="w-1 h-1 rounded-full bg-text-secondary" />
                    <span>{timeAgo(createdAt)}</span>
                </div>
                <div className={tw(
                    "text-sm text-text-secondary whitespace-pre-wrap leading-relaxed",
                    !isExpanded && "line-clamp-2"
                )}>
                    {description || "No description provided."}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="mt-2 text-text-main text-sm font-bold hover:text-primary transition-colors cursor-pointer"
                >
                    {isExpanded ? "Show less" : "...more"}
                </button>
            </div>
        </div>
    )
}

export default VideoDescription;
