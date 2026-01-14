import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Search, Zap, Edit, Rocket } from "lucide-react";

export default function Services() {
    return (
        <div className="min-h-screen flex flex-col bg-background-dark text-white">
            <Navbar />
            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section className="px-6 lg:px-12 py-20 lg:py-32 flex flex-col items-start justify-center max-w-7xl mx-auto w-full">
                    <p className="text-primary font-bold tracking-[0.2em] uppercase mb-4 text-sm animate-pulse">
                        Our Expertise
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8">
                        CRAFTING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            DIGITAL
                        </span>{" "}
                        <br />
                        EXCELLENCE
                    </h1>
                    <p className="max-w-2xl text-gray-400 text-lg md:text-xl leading-relaxed">
                        We are a digital-first agency blending strategic thinking with
                        brutalist aesthetics. We don't just build brands; we forge visual
                        languages that dominate markets.
                    </p>
                </section>

                {/* Divider */}
                <div className="w-full h-px bg-[#333] mb-12"></div>

                {/* Service 1: Brand Identity */}
                <section className="group relative px-6 lg:px-12 py-16 lg:py-24 max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Image */}
                        <div className="relative order-2 lg:order-1">
                            <div className="absolute inset-0 bg-primary/10 rounded-lg transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
                            <div className="relative h-[400px] lg:h-[500px] w-full rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                <img
                                    alt="Abstract dark 3D geometric shapes with dramatic lighting"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzRdO8H2ATzLh2epW_oWB0C13LpyoslVPp4KbDw0YIpLH48sVXxadaDmCeV92u5xidNOh4LLzaIyWdooALugKFTr6Gdta0UnfBw8I0hB0Fi90hMhRUjyqZsf9PbyHCo-AvDh4DRV4gylh2Nv-U8N87yeWhFLd9CwXCuSlAjA8mbaBzNf6uTeK9BJFW939INTEGoQt6s6GcZuTWCie3-EsiHF4E2_BHeM4GGcvFa_ssWmgk8ROLEcjcMPiZb7IAhr4G2Q7amFgmF3xb"
                                />
                            </div>
                        </div>
                        {/* Content */}
                        <div className="flex flex-col gap-6 order-1 lg:order-2">
                            <h2 className="text-4xl lg:text-5xl font-bold text-white uppercase tracking-tighter">
                                Brand <span className="text-primary">Identity</span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed font-light">
                                We dismantle the ordinary to build brands that speak louder than
                                words. Our strategic approach to visual storytelling defines your
                                market position through bold choices and rigorous consistency.
                            </p>
                            {/* Chips */}
                            <div className="flex flex-wrap gap-3 py-4">
                                <ServiceChip text="Brand Strategy" />
                                <ServiceChip text="Logo Design" />
                                <ServiceChip text="Visual Systems" />
                                <ServiceChip text="Tone of Voice" />
                            </div>
                            <Link
                                href="/portfolio"
                                className="w-fit mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider hover:text-white transition-colors group/btn"
                            >
                                Explore Branding
                                <ArrowRight className="transition-transform group-hover/btn:translate-x-1 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="max-w-7xl mx-auto w-full px-6 lg:px-12">
                    <div className="w-full h-px bg-[#333]"></div>
                </div>

                {/* Service 2: UI/UX Design */}
                <section className="group relative px-6 lg:px-12 py-16 lg:py-24 max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Content */}
                        <div className="flex flex-col gap-6">
                            <h2 className="text-4xl lg:text-5xl font-bold text-white uppercase tracking-tighter">
                                UI/UX <span className="text-primary">Design</span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed font-light">
                                User-centric digital experiences that blend brutalist aesthetics
                                with seamless functionality. We design for clarity, engagement,
                                and conversion, ensuring every pixel serves a purpose.
                            </p>
                            {/* Chips */}
                            <div className="flex flex-wrap gap-3 py-4">
                                <ServiceChip text="Web Design" />
                                <ServiceChip text="Mobile Apps" />
                                <ServiceChip text="Prototyping" />
                                <ServiceChip text="Design Systems" />
                            </div>
                            <Link
                                href="/portfolio"
                                className="w-fit mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider hover:text-white transition-colors group/btn"
                            >
                                Explore Digital
                                <ArrowRight className="transition-transform group-hover/btn:translate-x-1 h-5 w-5" />
                            </Link>
                        </div>
                        {/* Image */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/10 rounded-lg transform -translate-x-4 translate-y-4 transition-transform group-hover:-translate-x-6 group-hover:translate-y-6"></div>
                            <div className="relative h-[400px] lg:h-[500px] w-full rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                <img
                                    alt="Abstract fluid liquid gradient background in dark colors"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCniFaztN0KhdntdzywBoJlXO9TALHOvuVgtEQzXA_-Go1LAnJthtukJfvPZPHegcUEy43lvw2ARV5uVvthxJ13h7p1FYHYYq5wIU2t4axkBXzr0E2Zs23XgbblWg2dgjLsGUZWIP0oO-g6Wy827BNpUim3XhIAV4_0adi4v69KmqdsR-QUKX3ZAeIz8pkKniZMepf6cWv1dKAtfQ6JnrBOp0FglfNo78xa8ptmBdDS44CuqU_gm70JBSP2ZWBKppOWucMtjCAb76hP"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="max-w-7xl mx-auto w-full px-6 lg:px-12">
                    <div className="w-full h-px bg-[#333]"></div>
                </div>

                {/* Service 3: Motion & Graphics */}
                <section className="group relative px-6 lg:px-12 py-16 lg:py-24 max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Image */}
                        <div className="relative order-2 lg:order-1">
                            <div className="absolute inset-0 bg-primary/10 rounded-lg transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
                            <div className="relative h-[400px] lg:h-[500px] w-full rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                <img
                                    alt="Retro vaporwave style grid landscape with neon lights"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbRstDx0eFUbbM51tdsmvSU5EHqggq-GvHekG2FSYYSfAhyCS2AqPUIjXo_yXp7mET6iEfcneSezdJxqo0T4NJ-WEyHFO7qR6ZM8RPT_xK-F8t-Mi_VyRMz4GatBhH3-upAOvBPAVITJ9LgcVJ2mOI1m3WtHP0YnnYDTRsVzaQazgfK6F3uNbI_usnz51BAcCDzRl2Ser11cWbRUwRKNqakfcskmbZJ4I5ZXh8vJ8cjwvkV7t_oaui70Xq7Wn8-O_8nVwN-oXWrFAS"
                                />
                            </div>
                        </div>
                        {/* Content */}
                        <div className="flex flex-col gap-6 order-1 lg:order-2">
                            <h2 className="text-4xl lg:text-5xl font-bold text-white uppercase tracking-tighter">
                                Motion <span className="text-primary">& Graphics</span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed font-light">
                                Static is boring. We bring your brand to life with kinetic
                                typography, 3D motion, and immersive interactions that capture
                                attention in a distracted world.
                            </p>
                            {/* Chips */}
                            <div className="flex flex-wrap gap-3 py-4">
                                <ServiceChip text="2D/3D Animation" />
                                <ServiceChip text="Kinetic Type" />
                                <ServiceChip text="Social Assets" />
                                <ServiceChip text="Micro-interactions" />
                            </div>
                            <Link
                                href="/portfolio"
                                className="w-fit mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider hover:text-white transition-colors group/btn"
                            >
                                Explore Motion
                                <ArrowRight className="transition-transform group-hover/btn:translate-x-1 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="bg-[#232121] py-24 w-full border-y border-[#333]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="mb-16">
                            <p className="text-primary font-bold tracking-[0.2em] uppercase mb-4 text-sm">
                                How We Work
                            </p>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white uppercase tracking-tighter">
                                The Process
                            </h2>
                        </div>
                        <div className="relative mt-20">
                            {/* Connecting Line */}
                            <div className="absolute top-[28px] left-0 w-full h-0.5 bg-[#444] hidden lg:block"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                                <ProcessStep
                                    number="01"
                                    title="Discovery"
                                    description="We deep dive into your business model, audience, and competitors to unearth opportunities."
                                    icon={<Search className="text-2xl" />}
                                />
                                <ProcessStep
                                    number="02"
                                    title="Strategy"
                                    description="Formulating a tactical roadmap. We define the problem and prototype the solution."
                                    icon={<Zap className="text-2xl" />}
                                />
                                <ProcessStep
                                    number="03"
                                    title="Creation"
                                    description="The heavy lifting. Our team crafts high-fidelity designs, assets, and code with precision."
                                    icon={<Edit className="text-2xl" />}
                                />
                                <ProcessStep
                                    number="04"
                                    title="Launch"
                                    description="Deployment and handoff. We ensure a smooth takeoff and provide guidelines for the future."
                                    icon={<Rocket className="text-2xl" />}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="px-6 lg:px-12 py-24 lg:py-32 flex flex-col items-center justify-center text-center bg-background-dark">
                    <h2 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8 max-w-4xl">
                        Ready to disrupt <br /> the <span className="text-primary">market?</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-xl">
                        Stop blending in. Let's build something that demands attention. Book
                        a discovery call today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link
                            href="/contact"
                            className="h-14 px-10 rounded-lg bg-primary text-background-dark font-bold text-lg uppercase tracking-wider hover:bg-white transition-colors duration-300 flex items-center justify-center"
                        >
                            Start a Project
                        </Link>
                        <Link
                            href="/portfolio"
                            className="h-14 px-10 rounded-lg border border-[#444] text-white font-bold text-lg uppercase tracking-wider hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center"
                        >
                            View Portfolio
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function ServiceChip({ text }: { text: string }) {
    return (
        <span className="px-4 py-2 border border-[#444] rounded-lg text-sm text-white font-medium hover:border-primary hover:text-primary transition-colors cursor-default">
            {text}
        </span>
    );
}

function ProcessStep({
    number,
    title,
    description,
    icon,
}: {
    number: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="relative group">
            <div className="w-14 h-14 bg-[#1d1b1b] border-2 border-[#444] group-hover:border-primary rounded-full flex items-center justify-center text-white group-hover:text-primary transition-colors relative z-10 mb-6 mx-auto lg:mx-0">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center lg:text-left">
                {number}. {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed text-center lg:text-left">
                {description}
            </p>
        </div>
    );
}
