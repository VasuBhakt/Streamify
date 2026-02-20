import { motion } from "framer-motion";

const Loading = ({ fullScreen = true, message = "Loading Streamify..." }) => {
    return (
        <div className={`flex flex-col items-center justify-center bg-background z-50 ${fullScreen ? "fixed inset-0 h-screen w-screen" : "w-full h-full min-h-[300px]"}`}>

            {/* Logo Container */}
            <div className="relative flex items-center justify-center">
                {/* Outer Glow Ring */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute w-32 h-32 rounded-full bg-primary/20 blur-xl"
                />

                {/* Spinning Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="w-24 h-24 rounded-full border-2 border-transparent border-t-primary border-r-primary/50"
                />

                {/* Inner Pulse */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute w-16 h-16 bg-surface rounded-full flex items-center justify-center shadow-lg border border-border/50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-8 h-8 text-primary ml-1"
                    >
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                </motion.div>
            </div>

            {/* Loading Text */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 flex flex-col items-center gap-2"
            >
                <h3 className="text-xl font-bold text-text-main tracking-tight font-heading">
                    <span className="text-primary">Stream</span>ify
                </h3>
                <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm text-text-muted font-medium uppercase tracking-widest text-center"
                >
                    {message}<br />
                    <span className="text-xs text-text-muted">If you are loading for the first time, it may take some time.</span>
                    <span className="text-xs text-text-muted">We ask for your patience!</span>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Loading;
