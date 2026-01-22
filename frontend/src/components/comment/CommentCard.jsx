/*import React from 'react';
import { timeAgo } from '../../utils/format';
import { ThumbsUp, ThumbsDown, Reply } from 'lucide-react';

const CommentCard = ({ comment }) => {
    if (!comment) return null;

    const {
        content,
        createdAt,
        owner,
        likesCount = 0,
        isLiked = false,
        isDisliked = false
    } = comment;

    return (
        <div className="flex gap-4 group">
            {/* Avatar }
            <div className="shrink-0 mt-1">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-hover border border-border">
                    {owner?.avatar ? (
                        <img src={owner.avatar} alt={owner.fullName} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-sm font-bold bg-linear-to-br from-surface to-surface-hover">
                            {owner?.fullName?.[0]?.toUpperCase() || "?"}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section }
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-text-main text-sm font-bold leading-none hover:text-primary cursor-pointer transition-colors">
                        @{owner?.username || "username"}
                    </span>
                    <span className="text-text-secondary text-[11px] font-medium pt-0.5">
                        {timeAgo(createdAt)}
                    </span>
                </div>

                <p className="text-text-main text-sm leading-relaxed mb-2 whitespace-pre-wrap">
                    {content}
                </p>

                {/* Actions }
                <div className="flex items-center gap-4 text-text-secondary">
                    <div className="flex items-center gap-1.5">
                        <button className={`p-1.5 -ml-1.5 hover:bg-surface-hover rounded-full transition-all duration-200 ${isLiked ? 'text-primary' : 'hover:text-text-main'}`}>
                            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-primary' : ''}`} />
                        </button>
                        {likesCount > 0 && (
                            <span className="text-xs font-medium">{likesCount}</span>
                        )}
                    </div>

                    <button className={`p-1.5 hover:bg-surface-hover rounded-full transition-all duration-200 ${isDisliked ? 'text-primary' : 'hover:text-text-main'}`}>
                        <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-primary' : ''}`} />
                    </button>

                    <button className="px-3 py-1 text-xs font-bold text-text-main hover:bg-surface-hover rounded-full transition-all duration-200">
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
*/

import { timeAgo } from '../../utils/format'
import { ThumbsUp, Trash, Reply, Pencil } from 'lucide-react'
import tw from "../../utils/tailwindUtil";

const CommentCard = ({ comment }) => {
    if (!comment) return null;

    const {
        content,
        createdAt,
        owner,
        isLiked = false,
        isDeletable = false,
        isEditable = false
    } = comment;

    return (
        <div className='flex gap-4 group'>
            {/*Avatar*/}
            <div className='shrink-0 mt-1'>
                <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-hover border border-border">
                    {owner?.avatar ? (
                        <img src={owner.avatar} alt={owner.fullName} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-sm font-bold bg-linear-to-br from-surface to-surface-hover">
                            {owner?.fullName?.[0]?.toUpperCase() || "?"}
                        </div>
                    )}
                </div>
            </div>
            {/*Content Section*/}
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className='text-text-main text-sm font-bold leading-none hover:text-primary cursor-pointer transition-color'>
                        @{owner?.username || "user"}
                    </span>
                    <span className='text-text-secondary text-[11px] font-medium pt-0.5'>
                        {timeAgo(createdAt)}
                    </span>
                </div>

                <p className='text-text-main text-sm leading-relaxed mb-2 whitespace-pre-wrap'>
                    {content}
                </p>

                {/*Actions*/}
                <div className='flex items-center gap-4 text-text-secondary'>
                    <div className='flex items-center gap-1.5'>
                        <button className={tw("p-1.5 -ml-1.5 hover:bg-surface-hover rounded-full transition-all duration-200", isLiked ? "text-primary" : "hover:text-text-main")}>
                            <ThumbsUp className={tw("w-4 h-4", isLiked ? "fill-primary" : "")} />
                        </button>
                        <button className="px-3 py-1 text-xs font-bold text-text-main hover:bg-surface-hover rounded-full transition-all duration-200">
                            <Reply />
                        </button>
                        <button className={tw(isDeletable ? "px-3 py-1 text-xs font-bold text-text-main hover:bg-surface-hover rounded-full transition-all duration-200" : "hidden")}>
                            <Trash className="w-4 h-4" />
                        </button>
                        <button className={tw(isEditable ? "px-3 py-1 text-xs font-bold text-text-main hover:bg-surface-hover rounded-full transition-all duration-200" : "hidden")}>
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentCard;