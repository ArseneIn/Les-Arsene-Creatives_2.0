"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KineticText from "@/components/KineticText";
import Magnetic from "@/components/Magnetic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import DigitalAlchemyBackground from "@/components/DigitalAlchemyBackground";

const projects = [
    {
        id: 1,
        title: "FinTech Dashboard",
        category: "UI/UX Design",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCkzjPWQBonERsnJk9qyLU3nKlLo8GVLFUQbgoTAqgt3m7dBf8PuyCRL9fusWSChYd_IYSX6x9_4s8aVvyq6SZQJDxYN5cxsgtmT25DBs960AI38vUCSjLm0yyuEyd0ZRxn00cQTKT-KMlQZgv5yxzzGizCEZnVOsrPy4pm9HQ-fYVbHzdQ8ObUQH--QRGpr7B84Kft1krZPTeazrghZz_rABcEKs1yLfoy0ECUJyPX2lBomNl5OC2In_L2btKrMWsmW3_j8lwonhU",
        size: "large",
    },
    {
        id: 2,
        title: "Nexus Identity",
        category: "Branding",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPsTuT3Rc7U2z0-4E_Q8HIQzE3jacT0bWEskJ_G2_FnVosvf9Il1TTxaXcOGerVI9uALl2LAwbH5ohpFbshQinHGgy4yHmwr_KYaMCvKWtq0DOT9-8ATrb6NicqvR4jfZYMvD7gkjHThLLVhMhgoLPaseqbynLgGzd_7BV8hztN0TxElza0nkLov0_FJoOu_ymCyLG7vjtVusDtqj-mmSZjuiRntqMZ9ANUQx-oha7twcpsfgaoHnrxhmZEHR5NeP92XG1z5KCd-Fg",
        size: "small",
    },
    {
        id: 3,
        title: "Lumina App",
        category: "Mobile App",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1xlQl61uHnnUKUh7dL3UTp3kyGVW79uIcYA3umIP-KWevZsIQ7xVt5wYAC_0gdZhSe3MhuduoEZoWy7MMR5M9jhWIBbPnwSWDIt_gUP1dOwSK8Z0BfkJoUGIxaQ678hA6jc6bY8t6vpi35MQxw1C-THAyxDt7VNcU-JgeRNuFf7m55iBc2nOQ1oi8V_EDAjcZAz7yracd1PQQo80Xq1srvMzNGolN_t_27jtpzyF2JvgZNX_nOtqJBcp3kFjimy4wa7sYWRyrrTXa",
        size: "small",
    },
    {
        id: 4,
        title: "Quantum Web",
        category: "Web Design",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPksaTxWNM9qy1RC4ndtlxRWLYer2uxBv_FL3hppt19f9tedwPKStt6Tz0lzo82JF7NuzcOPmLkt90KXTHg1xlI-KRiuRkOsLBAps1RgzEB3TI_XjaYF_YgSy2ahNjsO2QiN0sFkXJq3YvtUfjAfeP4CtvnXIWKl-X9b3U4adSAxLGkCXu4TDvL0pOwrgBDe_gUuSV2rR-PV4FAKSA5q2AJKDMEYdGRkAujUK__wZH3-BSXsZNdUvuVnIiztXHq9Ofo9QxCFVBS7ii",
        size: "large",
    },
    {
        id: 5,
        title: "Aero Systems",
        category: "Branding",
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop",
        size: "small",
    },
    {
        id: 6,
        title: "Cyber Security Hub",
        category: "Web Design",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
        size: "small",
    },
    {
        id: 7,
        title: "EcoTrack Mobile",
        category: "Mobile App",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop",
        size: "large",
    },
    {
        id: 8,
        title: "Zenith Finance",
        category: "UI/UX Design",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
        size: "small",
    },
];

const filters = ["All", "UI/UX Design", "Branding", "Web Design", "Mobile App"];

export default function Portfolio() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredProjects = activeFilter === "All"
        ? projects
        : projects.filter(p => p.category === activeFilter);

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-space">
            <Navbar />
            <main className="flex-grow pt-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 relative">
                    <DigitalAlchemyBackground />
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
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
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
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
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
