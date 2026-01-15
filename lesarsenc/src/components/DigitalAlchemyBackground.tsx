"use client";

import { motion } from "framer-motion";

export default function DigitalAlchemyBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Dark Background Base */}
            <div className="absolute inset-0 bg-background-light dark:bg-background-dark transition-colors duration-500"></div>

            {/* Animated Gradient Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary blur-[80px] opacity-50"
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0.7, 0.4],
                    x: [0, 100, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute top-[10%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-500 blur-[100px] opacity-40"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                }}
                className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-purple-500 blur-[80px] opacity-40"
            />

            {/* Tech Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            ></div>

            {/* Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>
    );
}
