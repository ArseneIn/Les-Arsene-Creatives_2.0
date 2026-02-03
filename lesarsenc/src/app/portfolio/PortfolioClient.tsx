"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KineticText from "@/components/KineticText";
import Magnetic from "@/components/Magnetic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import ImigongoWireframeBackground from "@/components/ImigongoWireframeBackground";
import Skeleton from "@/components/Skeleton";
import { getImagePath } from "@/utils/imagePath";

interface Project {
    id: number;
    title: string;
    category: string;
    image: string;
    size?: string;
}

const filters = ["All", "UI/UX Design", "Branding", "Web Design", "Mobile App"];

export default function PortfolioClient() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/content.php")
            .then(res => res.json())
            .then(data => {
                if (data.portfolio_items) {
                    try {
                        const parsed = JSON.parse(data.portfolio_items);
                        // Ensure IDs are unique if coming from DB, usually they are timestamps
                        setProjects(parsed);
                    } catch (e) {
                        console.error("Failed to parse portfolio", e);
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredProjects = activeFilter === "All"
        ? projects
        : projects.filter(p => p.category === activeFilter);

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-space">
            <Navbar />
            <main className="flex-grow pt-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 relative">
                    <ImigongoWireframeBackground />
                    <div className="relative z-10 pt-10">
                        <h1 className="text-6xl md:text-8xl font-syne font-black tracking-tighter text-gray-900 dark:text-white mb-12">
                            <KineticText>SELECTED</KineticText> <br />
                            <span className="text-primary"><KineticText>WORKS</KineticText></span>
                        </h1>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4">
                            {filters.map((filter) => (
                                <Magnetic key={filter}>
                                    <button
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-6 py-2 rounded-full border text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeFilter === filter
                                            ? "bg-primary border-primary text-background-dark"
                                            : "border-gray-300 dark:border-white/20 text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary"
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                </Magnetic>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <>
                                <Skeleton className="aspect-video md:aspect-[16/9] w-full rounded-2xl" />
                                <Skeleton className="aspect-video md:aspect-[16/9] w-full rounded-2xl" />
                                <Skeleton className="aspect-video md:aspect-[16/9] w-full rounded-2xl" />
                                <Skeleton className="aspect-video md:aspect-[16/9] w-full rounded-2xl" />
                                <Skeleton className="aspect-video md:aspect-[16/9] w-full rounded-2xl" />
                                <Skeleton className="aspect-video md:aspect-[16/9] w-full rounded-2xl" />
                            </>
                        ) : filteredProjects.length > 0 ? (
                            <AnimatePresence mode="popLayout">
                                {filteredProjects.map((project, index) => (
                                    <ProjectCard key={project.id || index} project={project} />
                                ))}
                            </AnimatePresence>
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-500">No projects found in this category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="group cursor-pointer"
        >
            <div className="relative overflow-hidden rounded-2xl aspect-video md:aspect-[16/9] mb-6 bg-gray-200 dark:bg-white/5">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
                {project.image && (
                    <div className="relative w-full h-full">
                        <Image
                            src={getImagePath(project.image)}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                        <ArrowUpRight className="w-8 h-8" />
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-end border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                    <h3 className="text-3xl font-syne font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-sm font-space text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {project.category}
                    </p>
                </div>
                <span className="text-xs font-space text-gray-400">2024</span>
            </div>
        </motion.div>
    );
}
