/* eslint-disable @next/next/no-img-element */
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Brain, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import ImigongoPattern from "@/components/ImigongoPattern";
import { useState, useEffect } from "react";
import Skeleton from "@/components/Skeleton";
import { getImagePath } from "@/utils/imagePath";

// Define interface for team members
interface Founder {
    name: string;
    role: string;
    bio?: string;
    experience?: string;
    accolades?: string;
    skills?: string;
    image: string;
}

export default function AboutClient() {
    const [aboutData, setAboutData] = useState({
        story: "",
        image1: "",
        image2: ""
    });
    const [founders, setFounders] = useState<Founder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/content.php")
            .then(res => res.json())
            .then(data => {
                setAboutData({
                    story: data.about_story || "",
                    image1: data.about_image_1 || "",
                    image2: data.about_image_2 || ""
                });

                if (data.team_members) {
                    try {
                        const members = JSON.parse(data.team_members);
                        if (Array.isArray(members)) {
                            // Filter for founders (case insensitive)
                            const found = members.filter((m: Founder) => m.role.toLowerCase().includes("founder"));
                            setFounders(found);
                        }
                    } catch (e) {
                        console.error("Failed to parse team members", e);
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-space">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-gray-400/20 dark:bg-gray-700/20 rounded-full blur-3xl"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
                                    The Origin Story
                                </span>
                                <h1 className="font-syne text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-gray-900 dark:text-white">
                                    Two Arsenes.<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-300">
                                        One Vision.
                                    </span>
                                </h1>

                                {loading ? (
                                    <div className="space-y-4 max-w-lg mb-8">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-4/6" />
                                    </div>
                                ) : (
                                    <div
                                        className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mb-8 leading-relaxed prose dark:prose-invert"
                                        dangerouslySetInnerHTML={{ __html: aboutData.story || "It started with a coincidence. Two creatives, same name, crossing paths in a crowded Paris agency. We realized our shared name wasn't the only thing we had in common—we shared a relentless drive to break design norms." }}
                                    />
                                )}

                                <div className="flex items-center gap-4">
                                    <a
                                        href="#mission"
                                        className="group flex items-center gap-2 text-gray-900 dark:text-white font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors"
                                    >
                                        Discover our Mission
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform text-primary h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4">
                                    {loading ? (
                                        <>
                                            <Skeleton className="h-64 w-full rounded-2xl transform translate-y-8" />
                                            <Skeleton className="h-64 w-full rounded-2xl transform -translate-y-4" />
                                        </>
                                    ) : (
                                        <>
                                            <img
                                                alt="Arsene One working on a laptop"
                                                className="rounded-2xl shadow-xl transform translate-y-8 grayscale hover:grayscale-0 transition-all duration-500 object-cover h-64 w-full"
                                                src={getImagePath(aboutData.image1) || "https://lh3.googleusercontent.com/aida-public/AB6AXuA-aHSUeBduR_xxi-tHSB6fbi3YyN1LHJphr-NtWnRIW1cWZiiA6qVbRogj-qb1-H4KqB6A9sD5oX80hNbgcailzkqA5odr_tnJniG1cCbgaE0I_9qmm4SObE5mrq9sPw8kNfz_iDhF0WuMAmFTBFfdIUrjJ_rn445FjHOWy03uYlLUAgGgUxhjkz2CkPyI--5p178nMiRtA3lyIoxS-FSM9pRvLDsOqazhgOzJ9HXaWDdg9HciPk1TOnUs73WqhrrBuRuzBY5FTS5e"}
                                            />
                                            <img
                                                alt="Arsene Two portrait"
                                                className="rounded-2xl shadow-xl transform -translate-y-4 grayscale hover:grayscale-0 transition-all duration-500 object-cover h-64 w-full"
                                                src={getImagePath(aboutData.image2) || "https://lh3.googleusercontent.com/aida-public/AB6AXuBwVnYQS_BzHdm7VpQgo7sxXspkhSmc8g_uXjBiTeSPAr0KC_l5eHt2kXMcoUczVa8v7exuzFpdqCnj1bQ3EHfdFNTYZ8SUsWo26LV1Nk42dS86Fba1tuyBXFL-FJmWAbkNfhQ9jzObuo217x8e56KA0aDpbbJANFIpGVyMnriSQgwvBmq6lTea4cMQKz-5RlfZ9HlQ-e_5dmSRh6-Tz1WAd88zrSZ2sjzNZlSC0Nk_S_qIn5GrolK0FEyRXE_cUgw6Jn8umWU55rMR"}
                                            />
                                        </>
                                    )}
                                </div>
                                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gray-200 dark:border-gray-800 rounded-full opacity-50"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-white dark:bg-surface-dark relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16">
                            <h2 className="font-syne text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                                Meet the <span className="text-primary">Arsenes</span>
                            </h2>
                        </div>
                        {/* Dynamic Founders Loop */}
                        {founders.length > 0 ? (
                            founders.map((founder, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <div key={index} className="flex flex-col lg:flex-row gap-12 mb-24 items-center">
                                        {/* Image Column */}
                                        <div className={`lg:w-5/12 ${isEven ? 'order-2 lg:order-1' : 'order-2 lg:order-2'}`}>
                                            <div className="relative group">
                                                <div className={`absolute inset-0 ${isEven ? 'bg-primary transform translate-x-3 translate-y-3' : 'bg-gray-200 dark:bg-gray-800 transform -rotate-2 scale-105'} rounded-2xl transition-transform group-hover:translate-x-2 group-hover:translate-y-2 group-hover:rotate-0`}></div>
                                                <img
                                                    alt={founder.name}
                                                    className="relative rounded-2xl shadow-lg w-full h-[500px] object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                                                    src={getImagePath(founder.image)}
                                                />
                                            </div>
                                        </div>

                                        {/* Content Column */}
                                        <div className={`lg:w-7/12 order-1 ${isEven ? 'lg:order-2 lg:pl-10' : 'lg:order-1 lg:pr-10'}`}>
                                            <h3 className="font-syne text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                                                {founder.name}
                                            </h3>
                                            <p className="text-primary font-medium mb-6 uppercase tracking-wider text-sm">
                                                {founder.role}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 whitespace-pre-line">
                                                {founder.bio || "No bio available."}
                                            </p>

                                            {/* Render Skills (Chips) OR Stats (Grid) */}
                                            {founder.skills ? (
                                                <div className="flex flex-wrap gap-3 mt-4">
                                                    {founder.skills.split(',').map((skill: string, i: number) => (
                                                        <SkillChip key={i} text={skill.trim()} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-6">
                                                    {founder.experience && (
                                                        <div>
                                                            <span className="block text-3xl font-syne font-bold text-gray-300 dark:text-gray-700">
                                                                {founder.experience}
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Years Experience
                                                            </span>
                                                        </div>
                                                    )}
                                                    {founder.accolades && (
                                                        <div>
                                                            <span className="block text-3xl font-syne font-bold text-gray-300 dark:text-gray-700">
                                                                {founder.accolades} ({new Date().getFullYear()})
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Recognized
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <p>Loading Team Data...</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Mission Section */}
                <section
                    className="py-24 bg-gray-900 dark:bg-black text-white relative overflow-hidden"
                    id="mission"
                >
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                        <div className="absolute -right-20 top-20 text-[20rem] font-display font-black text-white leading-none">
                            A
                        </div>
                        <ImigongoPattern opacity={0.05} />
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">
                                Our Philosophy
                            </span>
                            <h2 className="font-syne text-4xl md:text-6xl font-bold mb-8">
                                We don&apos;t just build websites. We build{" "}
                                <span className="text-primary">legacies</span>.
                            </h2>
                            <p className="text-gray-400 text-xl leading-relaxed">
                                Les Arsene Creatives was born from a desire to strip away the
                                corporate noise and return to the essence of storytelling. We
                                believe that every brand has a soul, and our mission is to make it
                                visible.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                            <PhilosophyCard
                                icon={<Brain className="text-white h-6 w-6" />}
                                title="Human-Centered"
                                description="Technology is the tool, but emotion is the goal. We design for the human on the other side of the screen."
                            />
                            <PhilosophyCard
                                icon={<Sparkles className="text-white h-6 w-6" />}
                                title="Bold Innovation"
                                description="We reject safe. Safe is boring. We push boundaries to create memorable digital interactions."
                            />
                            <PhilosophyCard
                                icon={<ShieldCheck className="text-white h-6 w-6" />}
                                title="Radical Honesty"
                                description="No jargon. No hidden fees. Just transparent collaboration and exceptional results."
                            />
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="py-24 bg-background-light dark:bg-background-dark">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-2 block">
                                    How We Work
                                </span>
                                <h2 className="font-syne text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                                    The Process
                                </h2>
                            </div>
                            <div className="hidden md:block w-1/3 h-[1px] bg-gray-300 dark:bg-gray-700 mb-4"></div>
                        </div>
                        <div className="relative">
                            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 z-0"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                                <ProcessStep
                                    number="01"
                                    title="Discovery"
                                    description="We dive deep into your brand DNA. We listen, we question, and we uncover the unique story only you can tell."
                                />
                                <ProcessStep
                                    number="02"
                                    title="Strategy"
                                    description="We map out the user journey. Architecture meets art as we plan the structural foundation of your digital presence."
                                />
                                <ProcessStep
                                    number="03"
                                    title="Creation"
                                    description="Design and development in parallel. This is where the magic happens, crafting pixels and code into a seamless experience."
                                />
                                <ProcessStep
                                    number="04"
                                    title="Launch"
                                    description="Testing, refining, and finally, release. We ensure a flawless launch and provide the tools for you to grow."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-white dark:bg-surface-dark">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                        <h2 className="font-syne text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                            Ready to tell your story?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                            Let&apos;s build something extraordinary together. The Arsenes are
                            waiting.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/contact"
                                className="bg-primary text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
                            >
                                Start a Project
                            </Link>
                            <Link
                                href="/portfolio"
                                className="bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center"
                            >
                                View Portfolio
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function SkillChip({ text }: { text: string }) {
    return (
        <span className="px-4 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
            {text}
        </span>
    );
}

function PhilosophyCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-8 border border-gray-800 bg-gray-900 rounded-2xl hover:border-primary/50 transition-colors group">
            <div className="bg-gray-800 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-syne font-bold mb-3 text-white">
                {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

function ProcessStep({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) {
    return (
        <div className="group">
            <div className="w-24 h-24 bg-white dark:bg-surface-dark border-4 border-background-light dark:border-background-dark rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-primary transition-colors">
                <span className="font-syne text-3xl font-bold text-gray-300 group-hover:text-primary transition-colors">
                    {number}
                </span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>
    );
}
