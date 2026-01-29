import { useState, useEffect } from "react";
import { X, Copy, Check, Facebook, Twitter, Linkedin, Send, Instagram } from "lucide-react";
import tw from "../../utils/tailwindUtil";
import Button from "../button/Button";

const ShareModal = ({ isOpen, onClose, videoTitle, videoUrl }) => {
    const [isCopied, setIsCopied] = useState(false);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(videoUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: videoTitle,
                    url: videoUrl,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        }
    };

    const WhatsAppIcon = (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );

    const shareLinks = [
        {
            name: "WhatsApp",
            icon: WhatsAppIcon,
            color: "text-[#25D366]",
            bg: "hover:bg-[#25D366]/10",
            url: `https://wa.me/?text=${encodeURIComponent(videoTitle + " - " + videoUrl)}`
        },
        {
            name: "Twitter",
            icon: Twitter,
            color: "text-text-main",
            bg: "hover:bg-white/5",
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(videoTitle)}`
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            color: "text-[#0A66C2]",
            bg: "hover:bg-[#0A66C2]/10",
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(videoUrl)}`
        },
        {
            name: "Facebook",
            icon: Facebook,
            color: "text-[#1877F2]",
            bg: "hover:bg-[#1877F2]/10",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 isolate">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                    <h3 className="text-xl font-bold text-text-main">Share video</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-hover rounded-full text-text-muted hover:text-text-main transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Social Icons Row */}
                    <div className="flex items-center justify-between px-2 overflow-x-auto pb-2 scrollbar-hide">
                        {shareLinks.map((platform) => (
                            <a
                                key={platform.name}
                                href={platform.url}
                                target={platform.url ? "_blank" : undefined}
                                rel={platform.url ? "noopener noreferrer" : undefined}
                                onClick={platform.onClick}
                                className={tw(
                                    "flex flex-col items-center gap-2 group shrink-0 min-w-[70px]",
                                    "transition-transform active:scale-95 cursor-pointer"
                                )}
                            >
                                <div className={tw(
                                    "w-12 h-12 flex items-center justify-center rounded-2xl bg-surface-hover transition-all duration-300 border border-transparent group-hover:border-border",
                                    platform.bg
                                )}>
                                    <platform.icon className={tw("w-6 h-6", platform.color)} />
                                </div>
                                <span className="text-xs font-semibold text-text-secondary group-hover:text-text-main transition-colors">
                                    {platform.name}
                                </span>
                            </a>
                        ))}
                    </div>

                    {/* Link Copy Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">
                            Video Link
                        </label>
                        <div className="flex items-center gap-2 bg-surface-hover p-2 rounded-2xl border border-border focus-within:border-primary/50 transition-colors">
                            <input
                                type="text"
                                readOnly
                                value={videoUrl}
                                className="flex-1 bg-transparent px-2 text-sm text-text-secondary outline-none font-medium truncate"
                            />
                            <Button
                                variant="ghost"
                                className={tw(
                                    "shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                                    isCopied ? "bg-primary text-white" : "bg-surface hover:bg-surface text-text-main"
                                )}
                                onClick={handleCopy}
                            >
                                <div className="flex items-center gap-2">
                                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{isCopied ? "Copied" : "Copy"}</span>
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* Native Share Button (Mobile friendly) */}
                    {navigator.share && (
                        <Button
                            variant="secondary"
                            className="w-full rounded-2xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-surface-hover transition-all border border-border/50"
                            onClick={handleNativeShare}
                        >
                            <span>Share via platform</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
