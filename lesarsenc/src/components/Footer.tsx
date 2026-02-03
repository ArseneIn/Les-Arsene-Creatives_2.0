"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin, MessageCircle, ArrowUpRight, Heart } from "lucide-react";
import Magnetic from "./Magnetic";
import ImigongoPattern from "./ImigongoPattern";

import { useState, useEffect } from "react";

// ...

export default function Footer() {
    const [socials, setSocials] = useState({
        instagram: "#",
        linkedin: "#",
        twitter: "#"
    });

    useEffect(() => {
        fetch("/api/content.php")
            .then(res => res.json())
            .then(data => {
                if (data.contact_info) {
                    try {
                        const parsed = JSON.parse(data.contact_info);
                        setSocials({
                            instagram: parsed.instagram || "#",
                            linkedin: parsed.linkedin || "#",
                            twitter: parsed.twitter || "#"
                        });
                    } catch (e) {
                        console.error("Failed to parse contact info", e);
                    }
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <footer className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-white/10 relative overflow-hidden">

            {/* Imigongo Pattern Background */}
            <div className="text-gray-900 dark:text-white">
                <ImigongoPattern opacity={0.03} />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    {/* Brand Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="inline-block">
                            <div className="flex items-center gap-3">
                                <div className="relative w-48 h-16">
                                    {/* Light Mode Logo (Dark Text) */}
                                    <Image
                                        src="/LAC newFor white  bg @4x.png"
                                        alt="Les Arsene Creatives"
                                        fill
                                        className="object-contain object-left dark:hidden"
                                    />
                                    {/* Dark Mode Logo (White Text) */}
                                    <Image
                                        src="/LAC newforblack@4x.png"
                                        alt="Les Arsene Creatives"
                                        fill
                                        className="object-contain object-left hidden dark:block"
                                    />
                                </div>
                            </div>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                            Digital Alchemy for the modern age. We engineer growth and craft premium experiences for ambitious brands.
                        </p>
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                            <span>Kigali, Rwanda</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            <span>Global</span>
                        </div>
                    </div>

                    {/* Links Column 1: Explore (2 cols) */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em] opacity-50">
                            Explore
                        </h4>
                        <ul className="space-y-4">
                            <FooterLink href="/" label="Home" />
                            <FooterLink href="/services" label="Services" />
                            <FooterLink href="/products" label="Products" />
                            <FooterLink href="/portfolio" label="Work" />
                        </ul>
                    </div>

                    {/* Links Column 2: Company (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em] opacity-50">
                            Company
                        </h4>
                        <ul className="space-y-4">
                            <FooterLink href="/about" label="About" />
                            <FooterLink href="/contact" label="Contact" />
                            <FooterLink href="/careers" label="Careers" />
                        </ul>
                    </div>

                    {/* Socials Column (4 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em] opacity-50">
                            Connect
                        </h4>
                        <div className="flex gap-4">
                            <SocialLink href={socials.instagram} icon={<Instagram className="w-5 h-5" />} label="Instagram" />
                            <SocialLink href={socials.twitter} icon={<Twitter className="w-5 h-5" />} label="Twitter" />
                            <SocialLink href={socials.linkedin} icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
                        </div>
                        <div className="mt-8">
                            <Magnetic>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white hover:text-primary transition-colors group"
                                >
                                    Start a Project
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </Magnetic>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-black/20 backdrop-blur-sm relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 dark:text-gray-500 text-xs font-mono">
                        © <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-default">{new Date().getFullYear()}</Link> LES ARSENE CREATIVES.
                    </p>

                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                        <span>in Rwanda</span>
                        <span className="text-lg leading-none ml-1">🇷🇼</span>
                    </div>

                    <div className="flex gap-6">
                        <Link
                            href="/privacy"
                            className="text-gray-500 dark:text-gray-500 hover:text-primary text-xs font-mono uppercase transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-gray-500 dark:text-gray-500 hover:text-primary text-xs font-mono uppercase transition-colors"
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, label }: { href: string, label: string }) {
    return (
        <li>
            <Link
                href={href}
                className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors block hover:translate-x-2 duration-300"
            >
                {label}
            </Link>
        </li>
    )
}

function SocialLink({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) {
    return (
        <Magnetic>
            <a
                href={href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-background-dark hover:bg-primary hover:border-primary transition-all duration-300"
                aria-label={label}
            >
                {icon}
            </a>
        </Magnetic>
    );
}
