import KineticText from "@/components/KineticText";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    ArrowUpRight,
    Star,
    Brain,
    Zap,
    Wand2,
    Terminal,
    Search,
    Box,
    Plus,
    Filter,
} from "lucide-react";
import Link from "next/link";

export default function Team() {
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
                                <FilterButton active icon={<Star className="h-4 w-4" />}>
                                    All Talent
                                </FilterButton>
                                <FilterButton icon={<Wand2 className="h-4 w-4" />}>
                                    Design
                                </FilterButton>
                                <FilterButton icon={<Brain className="h-4 w-4" />}>
                                    Strategy
                                </FilterButton>
                                <FilterButton icon={<Zap className="h-4 w-4" />}>
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
                            <FounderCard
                                name="Arsene Lupin"
                                role="Co-Founder & Creative Director"
                                superpower="The Visionary Architect"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuBeI-uFC_I15qom9EU03EDAjxDh9jRrEUQr1QewlX--Zimmr6MF-28Rm5sLnaxwOoWPH-QueXtx8kU_nepcGPn-to6ilhy9EtGJ-FKE1AMC4tpp-K_hxuACrB2UyaxHHMzi-wEThpSk2SnrPvFcRseLGDSsxhLisyphyw40VBISu-REoMSZo0pnZ378OBfG9PFQf6flumDkV7OBiANrzm1p1fSf3uoTe0SBgwb0K2Tod7L87KvTJZnFTwkpw9ajs6X8RU-xfQpgpUMR"
                                icon={<Brain className="text-primary" />}
                            />
                            <FounderCard
                                name="Arsene Wenger"
                                role="Co-Founder & Lead Strategist"
                                superpower="The Master Tactician"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCPGSicHucW6gG-3QUOW59y1E2cJJWMnSEIa_XjckiIPwdtjLMWATUDieWyGPo-7-Ee8yEFJcPr9LNR1EGqBQ4xymaSl-PsYff2VCWWLnYOrnOQfUXT3nF2lcTdZCMa56uZaEOYlNsaGsF0WRInqPGm1Q4ghlpCy4ohIY9rbO8RcUJjz8hs52lyoloeKZAJ2p3jxCJWfDzafRrPuD5WmGHHCHM35Eh5kRuj2a79JSgY7QUmvbjczdSdjK9NR5Scu_QfuigQPHmW54j7"
                                icon={<Zap className="text-primary" />}
                            />
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
                            <TeamCard
                                name="Elena Rostova"
                                role="Sr. Product Designer"
                                strength="Pixel Perfectionist"
                                category="Design"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuA1xlQl61uHnnUKUh7dL3UTp3kyGVW79uIcYA3umIP-KWevZsIQ7xVt5wYAC_0gdZhSe3MhuduoEZoWy7MMR5M9jhWIBbPnwSWDIt_gUP1dOwSK8Z0BfkJoUGIxaQ678hA6jc6bY8t6vpi35MQxw1C-THAyxDt7VNcU-JgeRNuFf7m55iBc2nOQ1oi8V_EDAjcZAz7yracd1PQQo80Xq1srvMzNGolN_t_27jtpzyF2JvgZNX_nOtqJBcp3kFjimy4wa7sYWRyrrTXa"
                                icon={<Wand2 className="h-4 w-4" />}
                            />
                            <TeamCard
                                name="Marcus Chen"
                                role="Lead Developer"
                                strength="Code Whisperer"
                                category="Development"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDPpiXQWjv2ufALgIqL3SG3Bfln6YbbhwX8_zIm1jjnT9eFfivVnJVxee5Fx05x0lKQeoNPfFh63EJNTER7hBnhWy7QvbhGWchfcdyioV6mDHSr4t5ldVONjGYd0uXPR4XLZxu2Us-2zO5faKprTbz3bAh6aQpk1mFuSPTDoPqlGYdl2BO0K6JUSnDYFhUeD9whb5w_3E5GVDj-Ga6181pWtK3tJLRMcXGsDl7CaTYrq8tFV1ENb8nCXTLSV3MHL5BlQD39yRL4-lN3"
                                icon={<Terminal className="h-4 w-4" />}
                            />
                            <TeamCard
                                name="Sarah Jenkins"
                                role="Motion Director"
                                strength="The Keyframe Wizard"
                                category="Motion"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuA27mWQG_o_qpxGDfFayFnCQlQRccGhTe9kl4Ff7pHMkkqBJh4uMXPcxBNN5iqNwZeamk8PdppcCOBwbEZXSqm8gProebztg-wfk8gnD0W5qaN5wsjFo99JgmFZ7BaU39ff2_R3fnda9Od241MlklKZb_Wcbn84dLL68DyBe7BSxbGha_8tl1D9bh-4kvPHV-s48Yv2Um5IwOWv5FTNjDEH23-4uRh-QjQ9tYAKcMvRFN0jfmKYi76HEJnXG49cvBVY6Y_Ft9t7ampx"
                                icon={<Zap className="h-4 w-4" />}
                            />
                            <TeamCard
                                name="David Okonjo"
                                role="Brand Strategist"
                                strength="Insight Hunter"
                                category="Strategy"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuBPksaTxWNM9qy1RC4ndtlxRWLYer2uxBv_FL3hppt19f9tedwPKStt6Tz0lzo82JF7NuzcOPmLkt90KXTHg1xlI-KRiuRkOsLBAps1RgzEB3TI_XjaYF_YgSy2ahNjsO2QiN0sFkXJq3YvtUfjAfeP4CtvnXIWKl-X9b3U4adSAxLGkCXu4TDvL0pOwrgBDe_gUuSV2rR-PV4FAKSA5q2AJKDMEYdGRkAujUK__wZH3-BSXsZNdUvuVnIiztXHq9Ofo9QxCFVBS7ii"
                                icon={<Search className="h-4 w-4" />}
                            />
                            <TeamCard
                                name="Priya Patel"
                                role="UX Researcher"
                                strength="Empathy Engine"
                                category="Strategy"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDeVyhOncfqYQ4s54NEQQCF9zqgJsZy1hbXQnTyEOEpC2VcB0UlPhsJFqNCdJ7gauxOddeY8697ooHp-ZIW7tcgC1AEJhJEIPVqZ2HlM-up3vVVfEP1dEzKVyYjK3MWkWDwk7YzJzjQL6K6be_P8Br2C-sQT1cvty_QGGMRXmKgBner6lAbP7N2e_sRoVjvmrkPALj1oWp1djjsafbCfd5a8n4cNQb1_GxdmCWv3pIHCeV4qNVcwmBrYLI6U6is4YdUsePO_S_hcGN1"
                                icon={<Search className="h-4 w-4" />}
                            />
                            <TeamCard
                                name="Julian Ross"
                                role="3D Artist"
                                strength="Polygon Master"
                                category="Motion"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuAFQBFEJcLnXcHvE7v3Dwff9XPNhB-zVEeeuDo_BOu-TmjzIDOs_Xk0mpwAhZMgTi90manObl7HKCO4jethrimHBhfFQ0vcr2ejMWMeEYEFJn0rPEGjv9rvpDyIA_06t3OmKWeApZb0RpixxPAfAN9qxV65DaOHoTIDLtQLO_utjK6YNAfr5JxyI4fzj2EZ-03ZBkeaQBY4BpAbZBS9_lpy3cUkAjaZ_bqIZ8WMJ2RLlr11fIMxD6gEHfTT6ccjBUDJLZgm63xSnUaN"
                                icon={<Box className="h-4 w-4" />}
                            />

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
}: {
    children: React.ReactNode;
    active?: boolean;
    icon?: React.ReactNode;
}) {
    return (
        <button
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
                    src={image}
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
                src={image}
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
