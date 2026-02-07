import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, LogIn, Sparkles, Zap, Shield, Globe, LayoutDashboard } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import authService from '../services/auth';
import { login, logout } from '../features/authSlice';

const Landing = () => {
    const { status, userData } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        // Still check auth status on landing to personalize it if they return
        authService.getCurrentUser()
            .then((response) => {
                if (response?.data) {
                    dispatch(login(response.data));
                } else {
                    dispatch(logout());
                }
            })
            .catch(() => {
                dispatch(logout());
            });
    }, [dispatch]);

    return (
        <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center justify-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -40, 0],
                        y: [0, -60, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]"
                />
            </div>

            <main className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-6 flex justify-center"
                >
                    <div className="px-4 py-1.5 rounded-full bg-surface border border-primary/20 flex items-center gap-2 text-primary text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>{status ? `Welcome back, ${userData?.fullName}` : 'Experience the Future of Video'}</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
                >
                    <span className="bg-linear-to-r from-text-main to-primary bg-clip-text text-transparent">
                        Streamify
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-2xl mx-auto text-text-secondary text-lg md:text-xl mb-12 leading-relaxed"
                >
                    The next generation video platform for creators. High-quality streaming,
                    seamless interactions, and a community that matters.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/home">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 bg-primary text-white rounded-2xl font-semibold overflow-hidden transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] flex items-center gap-2 cursor-pointer"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            <span>Start Watching</span>
                        </motion.button>
                    </Link>

                    {status ? (
                        <Link to="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-surface border border-border hover:border-primary/50 text-text-main rounded-2xl font-semibold transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                <span>Go to Dashboard</span>
                            </motion.button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-surface border border-border hover:border-primary/50 text-text-main rounded-2xl font-semibold transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <LogIn className="w-5 h-5" />
                                <span>Creator Login</span>
                            </motion.button>
                        </Link>
                    )}
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                >
                    {[
                        { icon: Zap, title: "Ultra Fast", desc: "Native performance with lightning quick load times." },
                        { icon: Shield, title: "Secure", desc: "Enterprise grade security for your content and data." },
                        { icon: Globe, title: "Global", desc: "Stream to anyone, anywhere in the world effortlessly." }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-sm">
                            <feature.icon className="w-8 h-8 text-primary mb-4 mx-auto" />
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-text-secondary text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </main>

            <footer className="absolute bottom-8 left-0 w-full text-center text-text-muted text-sm">
                &copy; 2026 Maadhava. All rights reserved.
            </footer>
        </div>
    );
};

export default Landing;
