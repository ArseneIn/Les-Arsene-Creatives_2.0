"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import ImigongoPattern from "@/components/ImigongoPattern";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col font-space bg-white dark:bg-black text-gray-900 dark:text-white">
            <Navbar />

            <main className="flex-grow flex items-center justify-center relative overflow-hidden px-6">
                {/* Background Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <ImigongoPattern opacity={0.03} className="pointer-events-none" />

                <div className="text-center relative z-10 max-w-2xl">
                    <div className="mb-6 px-4 py-1 inline-block rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                        <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Error 404</span>
                    </div>

                    <h1 className="text-6xl md:text-9xl font-syne font-black mb-6 tracking-tighter">
                        Signal <span className="text-gray-300 dark:text-white/20">Lost</span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                        The digital coordinates you are looking for have been deconstructed or do not exist in this dimension.
                    </p>

                    <Magnetic>
                        <Link
                            href="/"
                            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider overflow-hidden hover:bg-primary hover:text-black transition-all duration-300"
                        >
                            <span className="relative z-10">Return to Base</span>
                            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Magnetic>
                </div>
            </main>

            <Footer />
        </div>
    );
}
