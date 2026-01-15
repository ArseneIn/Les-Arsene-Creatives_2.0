"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if already loaded in this session
        const hasLoaded = sessionStorage.getItem("hasLoaded");
        if (hasLoaded) {
            setTimeout(() => setIsLoading(false), 0);
            return;
        }

        const timeout = setTimeout(() => {
            setIsLoading(false);
            sessionStorage.setItem("hasLoaded", "true");
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white overflow-hidden"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Background Noise */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center">
                        {/* Techy Ring Container */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            {/* Rotating Outer Ring */}
                            <motion.div
                                className="absolute inset-0 border border-primary/30 rounded-full border-t-transparent border-l-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Counter-Rotating Inner Ring */}
                            <motion.div
                                className="absolute inset-2 border border-white/10 rounded-full border-b-transparent border-r-transparent"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Pulsing Core */}
                            <motion.div
                                className="absolute inset-0 bg-primary/5 rounded-full blur-xl"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />

                            {/* The "A" Logo */}
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="font-syne font-bold text-4xl text-white relative z-20"
                            >
                                A
                            </motion.span>
                        </div>

                        {/* Loading Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                            <span className="text-xs font-mono text-primary/80 uppercase tracking-[0.2em]">
                                System Initializing
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
