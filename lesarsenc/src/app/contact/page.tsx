"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KineticText from "@/components/KineticText";
import Magnetic from "@/components/Magnetic";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin, MessageCircle, Plus, Minus, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-space">
            <Navbar />

            <main className="flex-grow pt-32">
                {/* Hero Section */}
                <section className="px-6 lg:px-8 mb-20">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-syne font-black tracking-tighter text-gray-900 dark:text-white leading-[0.8] mb-8">
                            <KineticText>LET&apos;S TALK</KineticText> <br />
                            <span className="text-primary"><KineticText>BUSINESS</KineticText></span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
                            Ready to start the reaction? Tell us about your vision, and we&apos;ll help you engineer the solution.
                        </p>
                    </div>
                </section>

                {/* Split Content Section */}
                <section className="px-6 lg:px-8 pb-32">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                        {/* Left Column: Info & Socials */}
                        <div className="flex flex-col justify-between h-full">
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6">Contact Info</h3>
                                    <div className="space-y-8">
                                        <a href="mailto:hello@lesarsene.com" className="group flex items-center gap-6 text-2xl md:text-4xl font-syne font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">
                                            <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            hello@lesarsene.com
                                        </a>
                                        <a href="tel:+33123456789" className="group flex items-center gap-6 text-2xl md:text-4xl font-syne font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">
                                            <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            +33 1 23 45 67 89
                                        </a>
                                        <div className="group flex items-center gap-6 text-xl md:text-2xl font-syne font-bold text-gray-900 dark:text-white">
                                            <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <span>123 Creative Avenue, Suite 400<br />Paris, France 75001</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6">Socials</h3>
                                    <div className="flex gap-4">
                                        <SocialLink icon={<Instagram className="w-5 h-5" />} />
                                        <SocialLink icon={<Twitter className="w-5 h-5" />} />
                                        <SocialLink icon={<Linkedin className="w-5 h-5" />} />
                                        <SocialLink icon={<MessageCircle className="w-5 h-5" />} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Glassmorphic Form */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50"></div>
                            <div className="relative bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
                                <h3 className="text-2xl font-syne font-bold mb-8 text-gray-900 dark:text-white">Project Inquiry</h3>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Name" placeholder="John Doe" />
                                        <InputGroup label="Company" placeholder="Acme Inc." />
                                    </div>
                                    <InputGroup label="Email" placeholder="john@example.com" type="email" />

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Budget Range</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {["$5k-10k", "$10k-25k", "$25k-50k", "$50k+"].map((range) => (
                                                <label key={range} className="cursor-pointer">
                                                    <input type="radio" name="budget" className="peer sr-only" />
                                                    <div className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-center text-sm font-bold text-gray-600 dark:text-gray-300 peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary transition-all hover:border-primary/50">
                                                        {range}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Message</label>
                                        <textarea
                                            rows={4}
                                            className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none"
                                            placeholder="Tell us about your goals..."
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-primary hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group">
                                        <span>Send Message</span>
                                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="px-6 lg:px-8 pb-32">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-syne font-bold text-center mb-16">Before you ask...</h2>
                        <div className="space-y-4">
                            <FAQItem
                                question="What is your typical timeline?"
                                answer="Most projects take between 4-8 weeks, depending on complexity. We value speed without compromising quality."
                            />
                            <FAQItem
                                question="Do you work with startups?"
                                answer="Absolutely. We love ambitious startups. Our 'GrowthOS' and 'ArseneFlow' tools are specifically designed to help SMEs scale."
                            />
                            <FAQItem
                                question="What is your pricing model?"
                                answer="We offer both project-based pricing and monthly retainers for ongoing growth and support. Contact us for a custom quote."
                            />
                            <FAQItem
                                question="Do you provide post-launch support?"
                                answer="Yes. We don't just launch and leave. We offer maintenance packages to ensure your digital ecosystem remains healthy and secure."
                            />
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}

function InputGroup({ label, placeholder, type = "text" }: { label: string, placeholder: string, type?: string }) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
            />
        </div>
    )
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
    return (
        <Magnetic>
            <a href="#" className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all">
                {icon}
            </a>
        </Magnetic>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg md:text-xl font-syne font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{question}</span>
                <div className={`w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center transition-colors ${isOpen ? 'bg-primary border-primary text-black' : 'text-gray-400'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <p className="pb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {answer}
                </p>
            </motion.div>
        </div>
    )
}
