"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, ArrowRight, Sparkles, Brain, Code } from "lucide-react";
import KineticText from "@/components/KineticText";

export default function Careers() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-space">
            <Navbar />

            <main className="flex-grow pt-32 pb-20">
                {/* Hero Section */}
                <section className="relative px-6 lg:px-8 mb-24">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block animate-fade-in">
                            Join the Revolution
                        </span>
                        <h1 className="font-syne text-5xl md:text-7xl font-extrabold leading-tight mb-8 text-gray-900 dark:text-white">
                            <KineticText>Build the Future</KineticText><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-300">
                                With Us.
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            We are always looking for visionaries, rebels, and pixel-perfect obsessives.
                            If you believe that code is poetry and design is improved by breaking the rules,
                            you might just belong here.
                        </p>

                        <a
                            href="mailto:careers@lesarsene.com"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
                        >
                            <Mail className="w-5 h-5" />
                            Apply via Email
                        </a>
                    </div>
                </section>

                {/* Values / Perks */}
                <section className="px-6 lg:px-8 mb-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PerkCard
                            icon={<Brain className="w-8 h-8 text-primary" />}
                            title="Deep Work"
                            description="We value focus over frantic meetings. We give you the space to do the best work of your life."
                        />
                        <PerkCard
                            icon={<Sparkles className="w-8 h-8 text-primary" />}
                            title="Creative Freedom"
                            description="Micromanagement is a dirty word here. You own your projects from concept to execution."
                        />
                        <PerkCard
                            icon={<Code className="w-8 h-8 text-primary" />}
                            title="Cutting Edge"
                            description="We don't support IE11. We use the latest stack to build lightning-fast experiences."
                        />
                    </div>
                </section>

                {/* Open Positions (Static for now) */}
                <section className="px-6 lg:px-8 mb-20">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12">
                        <h2 className="font-syne text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Open Positions</h2>

                        <div className="space-y-6">
                            <JobListing
                                title="Senior Frontend Developer"
                                type="Remote / Kigali"
                                tag="Engineering"
                            />
                            <JobListing
                                title="UI/UX Designer"
                                type="Remote"
                                tag="Design"
                            />
                            <JobListing
                                title="Digital Strategist"
                                type="Kigali"
                                tag="Marketing"
                            />
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-gray-500 text-sm mb-4">Don&apos;t see your role?</p>
                            <a
                                href="mailto:careers@lesarsene.com"
                                className="text-primary font-bold hover:underline"
                            >
                                Send us your portfolio anyway &rarr;
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function PerkCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5">
            <div className="mb-6">{icon}</div>
            <h3 className="font-syne text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

function JobListing({ title, type, tag }: { title: string, type: string, tag: string }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 dark:bg-black/40 rounded-xl border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
            <div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors">{title}</h4>
                <div className="flex items-center gap-4 mt-2 text-xs font-mono uppercase tracking-wide text-gray-500">
                    <span>{type}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{tag}</span>
                </div>
            </div>
            <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
                    Apply <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </div>
    );
}
