"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Star,
    Brain,
    Zap,
    Wand2,
    Terminal,
    Search,
    Box,
    Plus,
} from "lucide-react";

import { useState, useEffect } from "react";
import { getImagePath } from "@/utils/imagePath";

// Initial data removed for dynamic loading
import Skeleton from "@/components/Skeleton";

export default function Team() {
    const [founders, setFounders] = useState<any[]>([]);
    const [squad, setSquad] = useState<any[]>([]);
    const [filter, setFilter] = useState("All Talent");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/content.php")
            .then(res => res.text())
            .then(text => {
                // console.log("DEBUG - RAW SERVER RESPONSE:", text);
                return JSON.parse(text);
            })
            .then(data => {
                if (data.team_members) {
                    let allMembers;
                    try {
                        allMembers = typeof data.team_members === 'string'
                            ? JSON.parse(data.team_members)
                            : data.team_members;
                    } catch (e) {
                        console.error("Parse Error", e);
                        allMembers = [];
                    }

                    if (Array.isArray(allMembers)) {
                        const newFounders = allMembers.filter((m: any) => m.role.toLowerCase().includes("founder"));
                        const newSquad = allMembers.filter((m: any) => !m.role.toLowerCase().includes("founder"));

                        if (newFounders.length > 0) setFounders(newFounders);
                        if (newSquad.length > 0) setSquad(newSquad);
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("CMS Load Error (Team)", err);
                setLoading(false);
            });
    }, []);

    const filteredSquad = filter === "All Talent"
        ? squad
        : squad.filter(member => member.category === filter || (filter === "Design" && member.category === "Design") || (filter === "Strategy" && member.category === "Strategy") || (filter === "Motion" && member.category === "Motion"));

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-jakarta">
            <Navbar />
            <main className="flex-grow pt-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-20">
                    {/* Page Heading & Filters */}
                    <div className="flex flex-col gap-10 mb-16">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                            <div className="max-w-2xl">
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white mb-4">
                                    The Minds Behind <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                                        The Magic
                                    </span>
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                                    Meet the collective defining the future of creative strategy.
                                </p>
                            </div>
                            {/* Filter Chips */}
                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 w-full lg:w-auto lg:justify-end">
                                <FilterButton active={filter === "All Talent"} onClick={() => setFilter("All Talent")} icon={<Star className="h-4 w-4" />}>
                                    All Talent
                                </FilterButton>
                                <FilterButton active={filter === "Design"} onClick={() => setFilter("Design")} icon={<Wand2 className="h-4 w-4" />}>
                                    Design
                                </FilterButton>
                                <FilterButton active={filter === "Strategy"} onClick={() => setFilter("Strategy")} icon={<Brain className="h-4 w-4" />}>
                                    Strategy
                                </FilterButton>
                                <FilterButton active={filter === "Motion"} onClick={() => setFilter("Motion")} icon={<Zap className="h-4 w-4" />}>
                                    Motion
                                </FilterButton>
                            </div>
                        </div>
                    </div>

                    {/* Founders Grid */}
                    <div className="mb-16">
                        <div className="flex items-center gap-2 mb-6 opacity-80">
                            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-white/20"></span>
                            <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold">
                                Founders
                            </span>
                            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-white/20"></span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {loading ? (
                                <>
                                    <Skeleton className="h-[500px] w-full rounded-2xl" />
                                    <Skeleton className="h-[500px] w-full rounded-2xl" />
                                </>
                            ) : (
                                founders.map((founder, index) => (
                                    <FounderCard
                                        key={index}
                                        name={founder.name}
                                        role={founder.role}
                                        superpower={founder.superpower || "Visionary Leadership"}
                                        image={founder.image}
                                        icon={<Brain className="text-primary" />}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Team Grid */}
                    <div>
                        <div className="flex items-center gap-2 mb-8 opacity-80">
                            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-white/20"></span>
                            <span className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-white/60 font-bold">
                                The Squad
                            </span>
                            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-white/20"></span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {loading ? (
                                <>
                                    <Skeleton className="h-[400px] w-full rounded-xl" />
                                    <Skeleton className="h-[400px] w-full rounded-xl" />
                                    <Skeleton className="h-[400px] w-full rounded-xl" />
                                    <Skeleton className="h-[400px] w-full rounded-xl" />
                                </>
                            ) : (
                                filteredSquad.map((member, index) => (
                                    <TeamCard
                                        key={index}
                                        name={member.name}
                                        role={member.role}
                                        strength={member.strength || "Dedication"}
                                        category={member.category}
                                        image={member.image}
                                        icon={<Wand2 className="h-4 w-4" />}
                                    />
                                ))
                            )}

                            {/* Join Us Card */}
                            <div className="relative h-[400px] flex flex-col items-center justify-center rounded-xl bg-surface-light dark:bg-[#2a2828] border-2 border-dashed border-gray-300 dark:border-white/10 group cursor-pointer hover:border-primary transition-colors text-center p-6">
                                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-colors">
                                    <Plus className="h-10 w-10 text-gray-400 dark:text-white group-hover:text-background-dark" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    You?
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-[200px]">
                                    We are always looking for new superpowers.
                                </p>
                                <span className="text-primary font-bold text-sm border-b-2 border-primary pb-0.5 group-hover:text-gray-900 dark:group-hover:text-white group-hover:border-gray-900 dark:group-hover:border-white transition-colors">
                                    Apply Now
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function FilterButton({
    children,
    active = false,
    icon,
    onClick,
}: {
    children: React.ReactNode;
    active?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`whitespace-nowrap flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${active
                ? "bg-primary text-background-dark shadow-[0_0_15px_rgba(233,180,7,0.3)]"
                : "border border-gray-300 dark:border-white/10 bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/20"
                }`}
        >
            {icon}
            {children}
        </button>
    );
}

function FounderCard({
    name,
    role,
    superpower,
    image,
    icon,
}: {
    name: string;
    role: string;
    superpower: string;
    image: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="group relative h-[500px] w-full overflow-hidden rounded-2xl bg-surface-dark cursor-pointer">
            <div className="absolute inset-0 z-0">
                <img
                    src={getImagePath(image)}
                    alt={name}
                    className="h-full w-full object-cover grayscale brightness-90 transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
            {/* Badge */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 rounded bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10 group-hover:bg-primary group-hover:text-background-dark group-hover:border-primary transition-colors">
                <Star className="h-3 w-3 fill-current" />
                Founder
            </div>
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="relative overflow-hidden">
                    <h3 className="text-4xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <p className="text-lg text-gray-300 font-medium mb-4">{role}</p>
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                        <div className="overflow-hidden">
                            <div className="border-t border-white/20 pt-4 flex items-start gap-3">
                                <div className="pt-1">{icon}</div>
                                <div>
                                    <p className="text-xs uppercase text-white/50 tracking-wider font-bold mb-1">
                                        Superpower
                                    </p>
                                    <p className="text-white text-base font-bold italic">
                                        "{superpower}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TeamCard({
    name,
    role,
    strength,
    category,
    image,
    icon,
}: {
    name: string;
    role: string;
    strength: string;
    category: string;
    image: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="group relative h-[400px] overflow-hidden rounded-xl bg-surface-dark">
            <img
                src={getImagePath(image)}
                alt={name}
                className="absolute inset-0 h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
            />
            {/* Hover Overlay (Yellow Pop) */}
            <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    <p className="text-background-dark font-black text-2xl leading-none mb-1">
                        {name}
                    </p>
                    <p className="text-background-dark/70 font-bold text-sm mb-4">
                        {role}
                    </p>
                    <div className="bg-background-dark/10 p-3 rounded-lg backdrop-blur-sm border border-black/5">
                        <p className="text-[10px] uppercase font-bold text-background-dark/60 mb-1">
                            Unique Strength
                        </p>
                        <p className="text-background-dark font-bold text-sm flex items-center gap-1">
                            {icon}
                            {strength}
                        </p>
                    </div>
                </div>
            </div>
            {/* Default Overlay (Dark) */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                <p className="text-white font-bold text-lg">{name}</p>
                <p className="text-gray-400 text-sm">{category}</p>
            </div>
        </div>
    );
}
