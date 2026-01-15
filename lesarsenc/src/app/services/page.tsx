"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KineticText from "@/components/KineticText";
import Magnetic from "@/components/Magnetic";
import Link from "next/link";
import { ArrowRight, Fingerprint, Palette, Rocket, Search, Code, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ImigongoPattern from "@/components/ImigongoPattern";

export default function Services() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-space">
            <Navbar />
            <main className="flex-grow pt-32">
                {/* Hero */}
                <section className="px-6 lg:px-8 mb-32">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-6xl md:text-8xl font-syne font-black tracking-tighter text-gray-900 dark:text-white mb-8">
                            <KineticText>OUR</KineticText> <br />
                            <span className="text-primary"><KineticText>EXPERTISE</KineticText></span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl font-light">
                            We combine strategy, design, and technology to build brands that define categories.
                        </p>
                    </div>
                </section>

                {/* Services List */}
                <section className="px-6 lg:px-8 mb-32">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
                        <ServiceBlock
                            number="01"
                            title="SaaS & Automation"
                            desc="We build custom SaaS platforms and automate business workflows to drive efficiency. From internal tools to customer-facing products, we engineer solutions that save time and scale revenue."
                            tags={["Custom SaaS", "Business Automation", "CRM Integration", "AI Solutions"]}
                        />
                        <ServiceBlock
                            number="02"
                            title="Growth Marketing"
                            desc="Data-driven strategies to dominate your market. We combine SEO, Paid Media, and Analytics to capture your B2B audience and convert them into loyal clients."
                            tags={["SEO", "Paid Ads (PPC)", "Performance Marketing", "Analytics"]}
                        />
                        <ServiceBlock
                            number="03"
                            title="Experience Design"
                            desc="We craft intuitive digital experiences that delight users. Whether it's a corporate website or a complex web app, every interaction is designed for impact."
                            tags={["UI/UX Design", "Web Design", "Prototyping", "User Research"]}
                        />
                        <ServiceBlock
                            number="04"
                            title="Brand Identity"
                            desc="We define who you are. Our strategic approach to branding ensures your visual identity resonates with your target market and stands the test of time."
                            tags={["Strategy", "Logo Design", "Art Direction", "Brand Guidelines"]}
                        />
                    </div>
                </section>

                {/* Process Section */}
                <Process />

                {/* CTA */}
                <section className="py-32 bg-surface-dark text-white text-center">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-4xl md:text-6xl font-syne font-black mb-8">
                            Have a project in mind?
                        </h2>
                        <Magnetic>
                            <Link
                                href="/contact"
                                className="inline-block bg-primary text-background-dark font-bold text-lg px-12 py-5 rounded-full hover:bg-white transition-colors"
                            >
                                Let's Discuss
                            </Link>
                        </Magnetic>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function ServiceBlock({ number, title, desc, tags }: { number: string; title: string; desc: string; tags: string[] }) {
    return (
        <div className="group border-t border-gray-200 dark:border-white/10 py-12 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-500 relative overflow-hidden">
            <ImigongoPattern opacity={0} className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.03]" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
                <div className="md:col-span-2">
                    <span className="font-space text-sm text-gray-400 dark:text-gray-500">/{number}</span>
                </div>
                <div className="md:col-span-4">
                    <h3 className="text-3xl md:text-4xl font-syne font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                </div>
                <div className="md:col-span-4">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        {desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2 flex justify-end">
                    <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-background-dark transition-all">
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Process() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"],
    });

    return (
        <section ref={container} className="py-32 bg-black text-white relative overflow-hidden">
            <ImigongoPattern opacity={0.05} className="absolute inset-0 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="lg:sticky lg:top-32 h-fit">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">The Process</h2>
                        <h3 className="text-4xl md:text-6xl font-syne font-black mb-8">
                            From Chaos <br /> to Clarity.
                        </h3>
                        <p className="text-gray-400 text-lg max-w-md">
                            Our proven methodology ensures consistent, high-quality results for every project we undertake.
                        </p>
                    </div>

                    <div className="space-y-24">
                        {[
                            { title: "Discovery", desc: "We dive deep into your business, understanding your goals, audience, and competitors." },
                            { title: "Strategy", desc: "We define the roadmap, selecting the right tools and approach to solve your specific challenges." },
                            { title: "Design", desc: "We explore visual directions, iterating until we find the perfect expression of your brand." },
                            { title: "Development", desc: "We build robust, scalable solutions using cutting-edge technology." },
                            { title: "Launch", desc: "We ensure a smooth deployment and provide ongoing support to keep you growing." },
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="relative pl-8 border-l border-white/10"
                            >
                                <span className="absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full bg-primary"></span>
                                <span className="font-space text-primary text-sm mb-2 block">0{i + 1}</span>
                                <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
                                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
