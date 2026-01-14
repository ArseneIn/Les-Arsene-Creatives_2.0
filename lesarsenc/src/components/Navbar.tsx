"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            {/* Using the image URL from the design for now */}
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvjcibI-vclK9BE1r8IYF-kD4TKvzeUC9W3p-VAeLjVpBwlwgLs3F15-O-XonHqI9cAg3yGSD4bWeflaPS2UShXpxrY1t8u1HQDHMDYak8K6OV18mYbpeEZaXVvuT3ancwo02PHJ8xnkpmZspmft2AhVODlyhUJLptzhxooLbiDEwoH0Jo-vUm38L-_c49bHOrloV2p_hDcc2QygsbKiShe5EcxvnWw3Jml-ZPoWwKir1QcMqYKr7uCuHCDCbNpwEx90pftpFvESOU"
                                alt="Les Arsene Creatives Logo"
                                className="h-10 w-auto"
                            />
                            <span className="font-display font-bold text-xl tracking-wider uppercase text-gray-900 dark:text-white hidden sm:block">
                                Les Arsene
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/services">Services</NavLink>
                            <NavLink href="/portfolio">Portfolio</NavLink>
                            <NavLink href="/about">About</NavLink>
                            <Link
                                href="/contact"
                                className="bg-primary text-background-dark px-5 py-2 rounded-full text-sm font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20"
                            >
                                Let's Talk
                            </Link>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-gray-200 dark:bg-surface-dark inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-400 hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                        <MobileNavLink href="/services" onClick={() => setIsOpen(false)}>Services</MobileNavLink>
                        <MobileNavLink href="/portfolio" onClick={() => setIsOpen(false)}>Portfolio</MobileNavLink>
                        <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>About</MobileNavLink>
                        <Link
                            href="/contact"
                            className="block w-full text-center bg-primary text-background-dark px-5 py-3 rounded-md text-base font-bold hover:bg-yellow-400 transition-colors mt-4"
                            onClick={() => setIsOpen(false)}
                        >
                            Let's Talk
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
        >
            {children}
        </Link>
    );
}
