"use client";

import { motion } from "framer-motion";

export default function ImigongoWireframeBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Background Base */}
            <div className="absolute inset-0 bg-background-light dark:bg-background-dark transition-colors duration-500"></div>

            {/* Primary Wireframe (Gold) */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] opacity-[0.08] dark:opacity-[0.05]"
                animate={{ rotate: 360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full text-primary">
                    {/* Main Diamond Structure */}
                    <path d="M100 20 L180 100 L100 180 L20 100 Z" />
                    <path d="M100 30 L170 100 L100 170 L30 100 Z" />
                    <path d="M100 40 L160 100 L100 160 L40 100 Z" />
                    <path d="M100 50 L150 100 L100 150 L50 100 Z" />

                    {/* Connecting Lines */}
                    <line x1="100" y1="20" x2="100" y2="180" />
                    <line x1="20" y1="100" x2="180" y2="100" />
                </svg>
            </motion.div>

            {/* Secondary Wireframe (Dark/Black) - Counter Rotating */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] md:w-[60vw] md:h-[60vw] opacity-[0.05] dark:opacity-[0.03]"
                animate={{ rotate: -360 }}
                transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full text-black dark:text-white">
                    {/* Geometric Grid */}
                    <rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" />
                    <rect x="60" y="60" width="80" height="80" transform="rotate(45 100 100)" />
                    <rect x="70" y="70" width="60" height="60" transform="rotate(45 100 100)" />

                    {/* Circles for contrast */}
                    <circle cx="100" cy="100" r="60" strokeDasharray="4 4" />
                    <circle cx="100" cy="100" r="40" />
                </svg>
            </motion.div>
        </div>
    );
}
