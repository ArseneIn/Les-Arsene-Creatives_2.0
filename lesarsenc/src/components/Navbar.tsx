"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "./Magnetic";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100, x: "-50%" }}
                animate={{ y: 0, x: "-50%" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className={`fixed top-6 left-1/2 z-50 transition-all duration-500 w-[95%] max-w-5xl rounded-full border ${scrolled
                    ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl border-gray-200/50 dark:border-white/10 py-3 shadow-lg shadow-black/5"
                    : "bg-white/10 dark:bg-black/10 backdrop-blur-md border-white/20 py-4"
                    }`}
            >
                <div className="px-6 lg:px-8 flex items-center justify-between">
                    {/* Logo */}
                    {/* Logo */}
                    <Link href="/" className="relative h-12 w-48">
                        {/* Dark Logo (for Light Mode) */}
                        <Image
                            src="/LAC newFor white  bg @4x.png"
                            alt="Les Arsene Creatives"
                            fill
                            className="object-contain dark:hidden"
                            priority
                        />
                        {/* Light Logo (for Dark Mode) */}
                        <Image
                            src="/LAC newforblack@4x.png"
                            alt="Les Arsene Creatives"
                            fill
                            className="object-contain hidden dark:block"
                            priority
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLinks />
                        <Magnetic>
                            <Link
                                href="/contact"
                                className="relative px-6 py-3 rounded-full bg-primary text-background-dark font-bold text-sm uppercase tracking-wider overflow-hidden group"
                            >
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                                    Let&apos;s Talk
                                </span>
                                <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
                            </Link>
                        </Magnetic>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-40 bg-background-light dark:bg-background-dark flex flex-col items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-8">
                            <MobileNavLink href="/" onClick={() => setIsOpen(false)}>
                                Home
                            </MobileNavLink>
                            <MobileNavLink href="/services" onClick={() => setIsOpen(false)}>
                                Services
                            </MobileNavLink>
                            <MobileNavLink href="/products" onClick={() => setIsOpen(false)}>
                                Products
                            </MobileNavLink>
                            <MobileNavLink href="/portfolio" onClick={() => setIsOpen(false)}>
                                Portfolio
                            </MobileNavLink>
                            <MobileNavLink href="/team" onClick={() => setIsOpen(false)}>
                                Team
                            </MobileNavLink>
                            <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>
                                About
                            </MobileNavLink>
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="text-4xl font-display font-black text-primary uppercase tracking-tighter mt-8"
                            >
                                Let&apos;s Talk
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function NavLinks() {
    const links = [
        { name: "Home", href: "/" },
        { name: "Services", href: "/services" },
        { name: "Products", href: "/products" },
        { name: "Work", href: "/portfolio" },
        { name: "Team", href: "/team" },
        { name: "About", href: "/about" },
    ];

    return (
        <>
            {links.map((link) => (
                <Magnetic key={link.name}>
                    <Link
                        href={link.href}
                        className="relative text-sm font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
                    >
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </Magnetic>
            ))}
        </>
    );
}

function MobileNavLink({
    href,
    children,
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-5xl font-display font-bold text-gray-900 dark:text-white hover:text-primary transition-colors"
        >
            {children}
        </Link>
    );
}
