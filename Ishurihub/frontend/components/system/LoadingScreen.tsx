"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_MESSAGES = [
    "Securing your connection...",
    "Hydrating your dashboard...",
    "Preparing academic records...",
    "Syncing with the hub...",
    "Initializing secure portal...",
    "Refining your experience...",
    "Almost there..."
];

interface LoadingScreenProps {
    message?: string;
    fullScreen?: boolean;
    opaque?: boolean;
}

export default function LoadingScreen({ message: initialMessage, fullScreen = true, opaque = false }: LoadingScreenProps) {
    const [message, setMessage] = useState(initialMessage || LOADING_MESSAGES[0]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!initialMessage) {
            const interval = setInterval(() => {
                setMessage(prev => {
                    const nextIndex = (LOADING_MESSAGES.indexOf(prev) + 1) % LOADING_MESSAGES.length;
                    return LOADING_MESSAGES[nextIndex];
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [initialMessage]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => (prev >= 90 ? 90 : prev + Math.random() * 10));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const containerClasses = fullScreen 
        ? `fixed inset-0 z-[10000] flex flex-col items-center justify-center ${
            opaque 
                ? "bg-slate-50 dark:bg-[#0f172a]" 
                : "bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl"
          }`
        : "flex flex-col items-center justify-center p-12 w-full min-h-[300px]";

    return (
        <div className={containerClasses}>
            {/* Animated Brand Icon */}
            <div className="relative mb-8">
                <motion.div 
                    className="size-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center relative z-10 shadow-2xl shadow-primary/20"
                    animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <span className="material-symbols-outlined text-5xl text-primary">school</span>
                </motion.div>
                
                {/* Decorative Rings */}
                <motion.div 
                    className="absolute inset-0 size-24 rounded-3xl border-2 border-primary/20 -z-0"
                    animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
            </div>

            {/* Loading Content */}
            <div className="flex flex-col items-center max-w-xs w-full">
                <AnimatePresence mode="wait">
                    <motion.p 
                        key={message}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-slate-600 dark:text-slate-400 font-medium text-sm mb-4 h-5"
                    >
                        {message}
                    </motion.p>
                </AnimatePresence>

                {/* Progress Bar Container */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-emerald-400"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>
                
                <div className="flex justify-between w-full px-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">IshuriHub</span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{Math.round(progress)}%</span>
                </div>
            </div>

            {/* Background Ambient Shapes */}
            {fullScreen && (
                <div className="absolute inset-0 -z-50 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />
                </div>
            )}
        </div>
    );
}
