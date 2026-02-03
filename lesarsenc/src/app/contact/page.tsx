"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KineticText from "@/components/KineticText";
import Magnetic from "@/components/Magnetic";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin, MessageCircle, Plus, Minus, Send } from "lucide-react";
import { useState, useEffect } from "react";

export default function Contact() {
    const [contactInfo, setContactInfo] = useState({
        email: "hello@lesarsene.com",
        phone: "+33 1 23 45 67 89",
        address: "123 Creative Avenue, Suite 400\nParis, France 75001",
        instagram: "#",
        twitter: "#",
        linkedin: "#",
        message_circle: "#"
    });

    useEffect(() => {
        fetch("/api/content.php")
            .then(res => res.json())
            .then(data => {
                if (data.contact_info) {
                    try {
                        const parsed = JSON.parse(data.contact_info);
                        setContactInfo({
                            email: parsed.email || "hello@lesarsene.com",
                            phone: parsed.phone || "+33 1 23 45 67 89",
                            address: parsed.address || "123 Creative Avenue, Suite 400\nParis, France 75001",
                            instagram: parsed.instagram || "#",
                            twitter: parsed.twitter || "#",
                            linkedin: parsed.linkedin || "#",
                            message_circle: "#"
                        });
                    } catch (e) {
                        console.error("Failed to parse contact info", e);
                    }
                }
            })
            .catch(err => console.error(err));
    }, []);

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
                                        <a href={`mailto:${contactInfo.email}`} className="group flex items-center gap-6 text-2xl md:text-4xl font-syne font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">
                                            <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            {contactInfo.email}
                                        </a>
                                        <a href={`tel:${contactInfo.phone}`} className="group flex items-center gap-6 text-2xl md:text-4xl font-syne font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">
                                            <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            {contactInfo.phone}
                                        </a>
                                        <div className="group flex items-center gap-6 text-xl md:text-2xl font-syne font-bold text-gray-900 dark:text-white">
                                            <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <span className="whitespace-pre-line">{contactInfo.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6">Socials</h3>
                                    <div className="flex gap-4">
                                        <SocialLink href={contactInfo.instagram} icon={<Instagram className="w-5 h-5" />} />
                                        <SocialLink href={contactInfo.twitter} icon={<Twitter className="w-5 h-5" />} />
                                        <SocialLink href={contactInfo.linkedin} icon={<Linkedin className="w-5 h-5" />} />
                                        <SocialLink href={contactInfo.message_circle} icon={<MessageCircle className="w-5 h-5" />} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Glassmorphic Form */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50"></div>
                            <div className="relative bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
                                <h3 className="text-2xl font-syne font-bold mb-8 text-gray-900 dark:text-white">Project Inquiry</h3>
                                <ContactForm />
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

function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        budget: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const res = await fetch("/api/messages.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.status === "success" || data.message?.includes("sent")) {
                setStatus("success");
                setFormData({ name: "", company: "", email: "", budget: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBudgetChange = (range: string) => {
        setFormData({ ...formData, budget: range });
    };

    if (status === "success") {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you shortly.</p>
                <button onClick={() => setStatus("idle")} className="mt-6 text-primary font-bold hover:underline">Send another?</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Company</label>
                    <input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Inc."
                        className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Email</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Budget Range</label>
                <div className="grid grid-cols-2 gap-4">
                    {["$5 - $50", "$50 - $100", "$100 - $500", "$500+"].map((range) => (
                        <label key={range} className="cursor-pointer">
                            <input
                                type="radio"
                                name="budget"
                                checked={formData.budget === range}
                                onChange={() => handleBudgetChange(range)}
                                className="peer sr-only"
                            />
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
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tell us about your goals..."
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-primary hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
                <span>{status === "submitting" ? "Sending..." : "Send Message"}</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {status === "error" && <p className="text-red-500 text-center font-bold">Failed to send. Please try again.</p>}
        </form>
    );
}



function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <Magnetic>
            <a href={href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all">
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
