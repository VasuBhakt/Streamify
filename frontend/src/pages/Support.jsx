import { motion } from 'framer-motion';
import { Github, Instagram, Mail, Linkedin, Code2, Heart, ExternalLink, MessageSquare, IdCard, University, Pin } from 'lucide-react';

const Support = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const techStack = ["React", "Redux Toolkit", "Node.js", "MongoDB", "Express", "TailwindCSS", "Framer Motion", "Cloudinary", "SendGrid"]

    return (
        <div className="min-h-full w-full bg-background-page p-6 md:p-12 lg:p-16">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-5xl mx-auto"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-linear-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                            Developer & Support
                        </span>
                    </h1>
                    <p className="text-text-secondary text-lg max-w-2xl">
                        Hello! I'm <span className='text-primary'>Swastik Bose</span>, a.k.a <span className='text-primary'>VasuBhakt</span>, a developer passionate about building clean, performant software applications. I love exploring new technologies and transforming them into functional projects. (And about Maadhava, he is my guiding light!) Radhe Radhe!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Developer Info Card */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-1 bg-surface border border-border rounded-3xl p-8 sticky top-24 h-fit"
                    >
                        <div className="mb-6 relative group">
                            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                                <Code2 className="w-12 h-12 text-primary" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-1">VasuBhakt</h2>
                        <p className="text-primary font-medium mb-6">Full Stack Developer</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-text-secondary">
                                <IdCard className="w-4 h-4" />
                                <span className="text-sm">Swastik Bose</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-secondary">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">cpswastik31@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-secondary">
                                <University className="w-4 h-4" />
                                <span className="text-sm">Jadavpur University</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-secondary">
                                <Pin className="w-4 h-4" />
                                <span className="text-sm">Kolkata, West Bengal, India</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <a href="https://www.linkedin.com/in/swastik-bose/" className="p-3 bg-background rounded-xl border border-border hover:border-primary/50 text-text-secondary hover:text-primary transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="https://github.com/VasuBhakt" className="p-3 bg-background rounded-xl border border-border hover:border-primary/50 text-text-secondary hover:text-white transition-all">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/_swaztik_" className="p-3 bg-background rounded-xl border border-border hover:border-primary/50 text-text-secondary hover:text-pink-700 transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>

                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Description */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-surface border border-border rounded-3xl p-8"
                        >
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                About Streamify
                            </h3>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                Streamify is a full-stack video hosting platform designed to showcase modern web development
                                patterns. Built with the MERN stack, it features secure authentication, high-performance video
                                playback, real-time interactions, and a fully responsive "Electric Blue" design system.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {techStack.map(tech => (
                                    <span key={tech} className="px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-full text-xs font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Why I Built This */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-surface border border-border rounded-3xl p-8"
                        >
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-error" />
                                Why I built this
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                This project serves as a comprehensive portfolio piece representing months of learning and
                                implementation. From managing complex state with Redux to handling large media uploads on the
                                backend and streamlining data managment using aggregation pipelines, Streamify covers the entire lifecycle of a production-ready application.
                            </p>
                        </motion.div>

                        {/* Call to Action */}
                        <motion.div
                            variants={itemVariants}
                            className="p-1 rounded-3xl bg-linear-to-r from-primary/50 to-blue-400/50"
                        >
                            <div className="bg-surface rounded-[22px] p-8">
                                <h3 className="text-xl font-bold mb-2">Want to collaborate</h3>
                                <p className="text-text-secondary mb-6 italic">
                                    "Code is a way to express ideas that can change the world. Let's build something amazing together. Catch me on my socials!"
                                </p>
                                <h3 className="text-xl font-bold mb-2">Want to report a problem?</h3>
                                <div className="flex flex-wrap gap-2">
                                    <a href="https://github.com/VasuBhakt" className="p-3 bg-background rounded-xl border border-border hover:border-primary/50 text-text-secondary hover:text-white transition-all">
                                        <Github className="w-5 h-5" />
                                    </a>
                                    <p className="text-text-secondary mb-6 italic">
                                        Add as an issue in the official GitHub repo!
                                    </p>
                                </div>


                            </div>
                        </motion.div>
                    </div>
                </div>

                <footer className="mt-24 text-center text-text-muted text-sm pb-12">
                    &copy; 2026 Maadhava &middot; Handcrafted with ❤️
                </footer>
            </motion.div>
        </div>
    );
};

export default Support;
