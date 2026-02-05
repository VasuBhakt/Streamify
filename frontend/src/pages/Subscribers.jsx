import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import subscriptionService from "../services/subscription";
import Container from "../components/container/Container";
import { Loader2, Users, ArrowLeft, ExternalLink, Calendar } from "lucide-react";
import { timeAgo } from "../utils/format";
import tw from "../utils/tailwindUtil";

const Subscribers = () => {
    const user = useSelector((state) => state.auth.userData);
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscribers = useCallback(async () => {
        if (!user?._id) return;
        try {
            setLoading(true);
            const response = await subscriptionService.getUserChannelSubscribers(user._id);
            if (response?.data) {
                setSubscribers(response.data);
            }
        } catch (error) {
            console.error("Subscribers :: fetchSubscribers :: error", error);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 pb-20 bg-background-page">
            <div className="bg-surface/30 border-b border-border py-12 mb-10">
                <Container>
                    <div className="px-4">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold">Back to Dashboard</span>
                        </Link>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
                                <Users size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-purple-500">Channel Audience</span>
                        </div>
                        <h1 className="text-4xl font-black text-text-main tracking-tight">Your Subscribers</h1>
                        <p className="text-text-secondary mt-2 font-medium">
                            A list of people who have subscribed to your channel
                        </p>
                    </div>
                </Container>
            </div>

            <Container className="px-4">
                <div className="bg-surface/10 rounded-4xl border border-border/40 overflow-hidden">
                    <div className="p-8 border-b border-border flex items-center justify-between">
                        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-purple-500 rounded-full" />
                            Subscriber List
                        </h2>
                        <span className="text-xs font-bold text-text-muted italic">Total {subscribers.length} subscribers</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface/30 border-b border-border">
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted">User</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted text-center">Subscribed At</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {subscribers.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-20 text-center text-text-secondary font-medium italic">
                                            No subscribers yet. Keep creating great content!
                                        </td>
                                    </tr>
                                ) : (
                                    subscribers.map((item) => (
                                        <tr key={item._id} className="hover:bg-surface/20 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-hover shrink-0 border-2 border-border group-hover:border-purple-500 transition-colors">
                                                        <img
                                                            src={item.subscriber.avatar}
                                                            alt={item.subscriber.fullName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-bold text-text-main truncate">{item.subscriber.fullName}</span>
                                                        <span className="text-xs text-text-muted">@{item.subscriber.username}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
                                                        <Calendar size={14} className="text-text-muted" />
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <span className="text-[10px] text-text-muted uppercase mt-0.5">{timeAgo(item.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Link
                                                    to={`/c/${item.subscriber.username}`}
                                                    className="inline-flex items-center gap-2 p-2.5 bg-surface text-text-secondary hover:text-purple-500 hover:bg-purple-500/10 rounded-xl border border-border transition-all cursor-pointer group/link"
                                                >
                                                    <span className="text-xs font-bold hidden sm:inline">View Channel</span>
                                                    <ExternalLink size={16} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Subscribers;
