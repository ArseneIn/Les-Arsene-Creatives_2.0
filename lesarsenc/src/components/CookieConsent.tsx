"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Delay slightly for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "true");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "false");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6"
                >
                    <div className="max-w-4xl mx-auto bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-grow">
                            <h3 className="text-lg font-syne font-bold mb-2">We value your privacy</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                                <br className="hidden md:block" />
                                Read our <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link> and <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>.
                            </p>
                        </div>
                        <div className="flex flex-row gap-4 shrink-0 w-full md:w-auto">
                            <button
                                onClick={handleDecline}
                                className="flex-1 md:flex-none px-6 py-3 rounded-full border border-gray-300 dark:border-white/20 text-sm font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 md:flex-none px-6 py-3 rounded-full bg-primary text-background-dark text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                            >
                                Accept All
                            </button>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-black dark:hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
