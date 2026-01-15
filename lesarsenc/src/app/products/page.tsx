"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KineticText from "@/components/KineticText";
import Magnetic from "@/components/Magnetic";
import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Shield, BarChart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DigitalAlchemyBackground from "@/components/DigitalAlchemyBackground";

const products = [
    {
        id: 1,
        title: "ArseneFlow",
        tagline: "Business Automation Engine",
        description: "A powerful workflow automation platform designed for SMEs. Connect your apps, automate repetitive tasks, and save hundreds of hours per month.",
        features: ["Visual Workflow Builder", "50+ Integrations", "Real-time Analytics", "AI-Powered Suggestions"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
        icon: <Zap className="w-6 h-6 text-primary" />,
    },
    {
        id: 2,
        title: "GrowthOS",
        tagline: "All-in-One Marketing Suite",
        description: "Manage your SEO, Paid Ads, and Social Media from a single dashboard. Built-in AI helps you write copy and optimize campaigns for maximum ROI.",
        features: ["Unified Dashboard", "AI Copywriter", "Competitor Analysis", "Automated Reporting"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
        icon: <BarChart className="w-6 h-6 text-primary" />,
    },
    {
        id: 3,
        title: "SecureGate",
        tagline: "Enterprise Security for SMEs",
        description: "Protect your business data with our advanced security platform. Real-time threat detection, compliance monitoring, and secure access control.",
        features: ["Threat Detection", "Compliance Reports", "SSO Integration", "24/7 Monitoring"],
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
        icon: <Shield className="w-6 h-6 text-primary" />,
    },
];

export default function Products() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-space">
            <Navbar />

            <main className="flex-grow pt-32">
                {/* Hero Section */}
                <section className="px-6 lg:px-8 mb-24 relative">
                    <DigitalAlchemyBackground />
                    <div className="max-w-7xl mx-auto relative z-10 pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-full"
                        >
                            <div className="mb-6 px-4 py-1 w-fit rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
                                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Proprietary Ecosystem</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-syne font-black tracking-tighter text-gray-900 dark:text-white mb-8">
                                <KineticText>INNOVATION,</KineticText> <br />
                                <span className="text-primary"><KineticText>PRODUCTIZED</KineticText></span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-2xl leading-relaxed">
                                We don&apos;t just build for clients; we build for the future. Explore the tools we engineered to solve real business challenges for SMEs.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="px-6 lg:px-8 pb-32">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-20">
                        {products.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 lg:px-8 pb-32">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-black rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-30"></div>

                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h2 className="text-4xl md:text-6xl font-syne font-bold text-white mb-8">
                                    Ready to modernize your business?
                                </h2>
                                <p className="text-xl text-white/70 mb-12 font-space">
                                    Get early access to our suite of tools or book a demo to see how they can transform your operations.
                                </p>
                                <Magnetic>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-black font-bold uppercase tracking-wider hover:bg-white transition-colors duration-300"
                                    >
                                        <span>Request Demo</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </Magnetic>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function ProductCard({ product, index }: { product: typeof products[0], index: number }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}
        >
            {/* Image Side */}
            <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                        {product.icon}
                        <span className="text-white font-bold text-sm tracking-wider uppercase">{product.tagline}</span>
                    </div>
                </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2">
                <h3 className="text-4xl md:text-5xl font-syne font-bold text-gray-900 dark:text-white mb-6">
                    {product.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    {product.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {product.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>

                <Magnetic>
                    <button className="px-8 py-3 rounded-full border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-bold uppercase tracking-wider hover:bg-primary hover:border-primary hover:text-black transition-all duration-300">
                        Learn More
                    </button>
                </Magnetic>
            </div>
        </motion.div>
    );
}
