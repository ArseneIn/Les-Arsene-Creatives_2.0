"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PromoPopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if already seen in this session
        const seen = sessionStorage.getItem("promo_seen");
        if (seen) {
            // We don't need to set state here, just let it init as false.
            // If we really wanted to avoid the render, we could init checking storage,
            // but for hydration safety, it is better to check in useEffect.
            return;
        }

        // Show after 3 minutes (180,000 ms)
        // For testing, you might want to lower this number
        const timer = setTimeout(() => {
            setIsVisible(true);
            sessionStorage.setItem("promo_seen", "true");
        }, 180000);

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 100 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="fixed bottom-6 right-6 z-[100] max-w-sm w-full"
                >
                    <div className="bg-white dark:bg-gray-900 border-2 border-primary rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                        {/* Close Button */}
                        <button
                            onClick={closePopup}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full shrink-0">
                                <Rocket className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white mb-2 leading-tight">
                                    Launch Your Site for ~$100
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                                    Stop dreaming, start building. We have exclusive starter packages for strict budgets.
                                </p>
                                <Link
                                    href="/contact"
                                    onClick={closePopup}
                                    className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Claim Offer
                                </Link>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
