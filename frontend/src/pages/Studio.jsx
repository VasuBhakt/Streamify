import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import videoService from "../services/video";
import Container from "../components/container/Container";
import Button from "../components/button/Button";
import Input from "../components/input/Input";
import {
    Upload,
    X,
    Film,
    Image as ImageIcon,
    Loader2,
    Info,
    CheckCircle2,
    AlertCircle,
    Globe,
    Lock,
    ChevronLeft
} from "lucide-react";
import tw from "../utils/tailwindUtil";
import VideoPlayer from "../components/video/VideoPlayer";
import Loading from "../components/Loading";

const Studio = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!videoId);
    const [status, setStatus] = useState({ type: null, message: "" });

    // Video Data
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublished, setIsPublished] = useState(true);

    // Files
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);

    // Previews (URLs)
    const [videoPreview, setVideoPreview] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const videoInputRef = useRef();
    const thumbnailInputRef = useRef();

    // Fetch existing video data if updating
    const fetchVideo = async () => {
        try {
            setFetching(true);
            const response = await videoService.getVideoById({ videoId });
            if (response?.data) {
                const v = response.data;
                setTitle(v.title);
                setDescription(v.description);
                setIsPublished(v.isPublished);
                setVideoPreview(v.videoFile);
                setThumbnailPreview(v.thumbnail);
            }
        } catch (error) {
            console.error("Error fetching video for edit:", error);
            setStatus({ type: "error", message: "Failed to load video details." });
        } finally {
            setFetching(false);
        }
    };
    // Handle File Selections
    const handleVideoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleThumbnailSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setStatus({ type: "error", message: "Title is required" });
            return;
        }

        if (!description.trim()) {
            setStatus({ type: "error", message: "Description is required" });
            return;
        }

        if (!videoId && !videoFile) {
            setStatus({ type: "error", message: "Video file is required for new uploads" });
            return;
        }

        if (!videoId && !thumbnailFile) {
            setStatus({ type: "error", message: "Thumbnail is required for new uploads" });
            return;
        }

        try {
            setLoading(true);
            setStatus({ type: "loading", message: videoId ? "Updating your creative..." : "Uploading to the multiverse..." });

            let response;
            if (videoId) {
                // Update Logic
                response = await videoService.updateVideo({
                    videoId,
                    title,
                    description,
                    isPublished,
                    video: videoFile,
                    thumbnail: thumbnailFile
                });
            } else {
                // Create Logic
                response = await videoService.publishVideo({
                    title,
                    description,
                    isPublished,
                    video: videoFile,
                    thumbnail: thumbnailFile
                });
            }

            if (response?.success) {
                setStatus({ type: "success", message: videoId ? "Changes saved successfully!" : "Video published successfully!" });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: "error", message: "Operation failed. Please check your connection and try again." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (videoId) {
            fetchVideo();
        }
    }, [videoId]);


    if (fetching) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <Loading fullScreen={false} />
            </div>
        );
    }

    return (
        <div className="flex-1 bg-background-page pb-20 overflow-x-hidden">
            {/* Header */}
            <div className="bg-surface/30 border-b border-border py-10 sticky top-16 z-40 my-15">
                <Container>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="p-3 bg-surface border border-border rounded-2xl text-text-secondary hover:text-primary transition-all group active:scale-90 cursor-pointer"
                            >
                                <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-2 py-0.5 rounded">Creator Studio</span>
                                </div>
                                <h1 className="text-3xl font-black text-text-main tracking-tight">
                                    {videoId ? "Edit Masterpiece" : "New Production"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/dashboard")}
                                className="font-bold border border-transparent hover:border-border rounded-2xl px-6"
                            >
                                Discard
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="rounded-2xl px-10 font-black py-4 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (videoId ? "Save Changes" : "Publish Video")}
                            </Button>
                        </div>
                    </div>

                    {status.message && (
                        <div className={tw(
                            "mt-8 mx-4 p-4 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-top-2 duration-500 shadow-sm",
                            status.type === "success" ? "bg-success/10 border-success/20 text-success" :
                                status.type === "error" ? "bg-error/10 border-error/20 text-error" :
                                    "bg-primary/10 border-primary/20 text-primary"
                        )}>
                            {status.type === "success" ? <CheckCircle2 size={18} /> : status.type === "error" ? <AlertCircle size={18} /> : <Loader2 size={18} className="animate-spin" />}
                            <p className="font-bold text-xs uppercase tracking-wider">{status.message}</p>
                            <button onClick={() => setStatus({ type: null, message: "" })} className="ml-auto p-1 hover:bg-surface rounded-lg transition-colors">
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </Container>
            </div>

            <Container className="px-4">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Previews */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Video Preview */}
                        <div className="group relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                                    <Film size={16} className="text-primary" />
                                    Video Preview
                                </h3>
                                <button
                                    onClick={() => videoInputRef.current.click()}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary-hover transition-colors cursor-pointer"
                                >
                                    {videoPreview ? "Replace File" : "Select Source"}
                                </button>
                            </div>

                            {videoPreview ? (
                                <div className="rounded-4xl overflow-hidden border-2 border-border shadow-2xl bg-black">
                                    <VideoPlayer
                                        video={{
                                            videoFile: videoPreview,
                                            thumbnail: thumbnailPreview,
                                            title: title || "Preview",
                                            duration: 0
                                        }}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="aspect-video rounded-4xl overflow-hidden border-2 border-dashed border-border/50 bg-black relative group/player hover:border-primary/50 transition-all cursor-pointer"
                                    onClick={() => videoInputRef.current.click()}
                                >
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                        <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center text-text-muted group-hover/player:scale-110 group-hover/player:bg-primary/10 group-hover/player:text-primary transition-all duration-500">
                                            <Upload size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-text-main font-bold">Import your footage</p>
                                            <p className="text-xs text-text-secondary mt-1">MP4, WebM or OGG files</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <input type="file" ref={videoInputRef} accept="video/*" className="hidden" onChange={handleVideoSelect} />
                        </div>

                        {/* Thumbnail Preview */}
                        <div className="group relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon size={16} className="text-secondary" />
                                    Key Visual (Thumbnail)
                                </h3>
                                <button
                                    onClick={() => thumbnailInputRef.current.click()}
                                    className="text-[10px] font-black uppercase tracking-widest text-secondary text-primary hover:text-secondary-hover transition-colors cursor-pointer"
                                >
                                    {thumbnailPreview ? "Change Visual" : "Select Visual"}
                                </button>
                            </div>

                            <div
                                className={tw(
                                    "h-64 rounded-4xl border-2 bg-surface overflow-hidden relative group/thumb",
                                    thumbnailPreview ? "border-border shadow-xl" : "border-dashed border-border/50 hover:border-secondary/50 transition-all cursor-pointer"
                                )}
                                onClick={() => thumbnailInputRef.current.click()}
                            >
                                {thumbnailPreview ? (
                                    <img src={thumbnailPreview} className="w-full h-full object-contain group-hover/thumb:scale-105 transition-transform duration-700" alt="Thumbnail Preview" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                        <div className="w-12 h-12 bg-surface-hover rounded-2xl flex items-center justify-center text-text-muted group-hover/thumb:bg-secondary/10 group-hover/thumb:text-secondary transition-all">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-xs font-bold text-text-secondary">Capture the moment</p>
                                    </div>
                                )}
                                <input type="file" ref={thumbnailInputRef} accept="image/*" className="hidden" onChange={handleThumbnailSelect} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Metadata Form */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-surface/30 p-8 rounded-4xl border border-border/50 space-y-8 h-fit lg:sticky lg:top-44">
                            <div className="space-y-6">
                                <Input
                                    label="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="The title of your next masterpiece..."
                                    className="text-lg font-bold"
                                />

                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Info size={14} />
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="What's the story behind this production?"
                                        className="w-full h-64 bg-background-page/50 border border-border/60 rounded-3xl p-6 text-text-main outline-none focus:border-primary/40 focus:bg-background-page transition-all resize-none shadow-inner text-sm leading-relaxed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border/40">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={tw(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                            isPublished ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                                        )}>
                                            {isPublished ? <Globe size={20} /> : <Lock size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-main">{isPublished ? "Public" : "Private"}</p>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">{isPublished ? "Visible to Everyone" : "Only You can View"}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsPublished(!isPublished)}
                                        className={tw(
                                            "w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out cursor-pointer",
                                            isPublished ? "bg-primary" : "bg-text-muted/30"
                                        )}
                                    >
                                        <div className={tw(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out shadow-md",
                                            isPublished ? "translate-x-7" : "translate-x-1"
                                        )} />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-8">
                                <p className="text-[10px] text-text-muted uppercase tracking-widest leading-loose text-center italic">
                                    By publishing, you agree to our Terms of Production and Content Quality Standards.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Studio;
