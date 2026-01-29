import { useState } from 'react';
import { timeAgo } from '../../utils/format'
import { ThumbsUp, Trash, Reply, Pencil, X, Check } from 'lucide-react'
import tw from "../../utils/tailwindUtil";
import Button from '../button/Button';
import { Link } from 'react-router-dom';

const CommentCard = ({ comment, onUpdate, onDelete, onLike, isEditable, isDeletable }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment?.content || "");

    if (!comment) return null;

    const {
        content,
        createdAt,
        owner,
        isLiked = false,
        likesCount = 0,
    } = comment;

    const handleUpdate = async () => {
        if (editedContent.trim() === content) {
            setIsEditing(false);
            return;
        }
        const success = await onUpdate(comment._id, editedContent);
        if (success) setIsEditing(false);
    }

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
                    <Link to={`/profile/${owner._id}`}>
                        <span className='text-text-main text-sm font-bold leading-none hover:text-primary-hover cursor-pointer transition-color'>
                            @{owner?.username || "user"}
                        </span>
                    </Link>
                    <span className='text-text-secondary text-[11px] font-medium pt-0.5'>
                        {timeAgo(createdAt)}
                    </span>
                    {comment?.updatedAt !== createdAt && (
                        <span className="text-text-muted text-[10px] italic">(edited)</span>
                    )}
                </div>

                {isEditing ? (
                    <div className="mt-1 mb-2">
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full bg-surface/30 border-b border-primary p-2 text-sm text-text-main outline-none focus:bg-surface/50 transition-all rounded-t-lg resize-none"
                            rows={2}
                            autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setIsEditing(false); setEditedContent(content); }}
                                className="p-1 px-3 text-xs font-bold text-text-secondary hover:text-text-main hover:bg-surface-hover rounded-full transition-all"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUpdate}
                                className="p-1 px-4 text-xs font-bold bg-primary text-white rounded-full hover:bg-secondary-hover transition-all"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className='text-text-main text-sm leading-relaxed mb-2 whitespace-pre-wrap'>
                        {content}
                    </p>
                )}

                {/*Actions*/}
                {!isEditing && (
                    <div className='flex items-center gap-4 text-text-secondary'>
                        <div className='flex items-center gap-1.5'>
                            <button
                                onClick={() => onLike(comment._id)}
                                className={tw("p-1.5 -ml-1.5 hover:bg-surface-hover rounded-full transition-all duration-200 cursor-pointer flex items-center gap-2", isLiked ? "text-primary" : "hover:text-text-main")}
                            >
                                <ThumbsUp className={tw("w-4 h-4", isLiked ? "fill-primary" : "")} />
                                <span className="text-xs font-bold leading-none">{likesCount}</span>
                            </button>
                        </div>

                        {(isEditable || isDeletable) && (
                            <div className="flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                {isEditable && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 hover:bg-surface-hover rounded-full text-text-muted hover:text-primary transition-all cursor-pointer"
                                        title="Edit comment"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                )}
                                {isDeletable && (
                                    <button
                                        onClick={() => onDelete(comment._id)}
                                        className="p-2 hover:bg-error/10 rounded-full text-text-muted hover:text-error transition-all cursor-pointer"
                                        title="Delete comment"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentCard;
