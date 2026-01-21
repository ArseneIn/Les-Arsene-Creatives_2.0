import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img
                        src={`${import.meta.env.BASE_URL}images/logo-transparent.png`}
                        alt="AKWOS Logo"
                        className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8 font-display font-medium text-sm">
                    <Link to="/" className="text-primary dark:text-blue-400 hover:text-secondary dark:hover:text-secondary transition-colors">Home</Link>

                    <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-primary dark:hover:text-blue-400 transition-colors">
                            About Us <span className="material-icons text-sm">expand_more</span>
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-background-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                            <div className="flex flex-col py-2">
                                <Link to="/about/leadership" className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-blue-400 transition-colors">Leadership</Link>
                                <Link to="/about/founder" className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-blue-400 transition-colors">Our Founder</Link>
                                <Link to="/safeguarding" className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-blue-400 transition-colors">Safeguarding</Link>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-primary dark:hover:text-blue-400 transition-colors">
                            Programs & Impact <span className="material-icons text-sm">expand_more</span>
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-background-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                            <div className="flex flex-col py-2">
                                <Link to="/programs/wps" className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-blue-400 transition-colors">WPS Program</Link>
                                <Link to="/impact" className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-blue-400 transition-colors">Impact Dashboard</Link>
                                <Link to="/impact/stories" className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-blue-400 transition-colors">Success Stories</Link>
                            </div>
                        </div>
                    </div>

                    <Link to="/resources" className="hover:text-primary dark:hover:text-blue-400 transition-colors">Resources</Link>
                    <Link to="/news" className="hover:text-primary dark:hover:text-blue-400 transition-colors">News</Link>
                    <Link to="/partnerships" className="hover:text-primary dark:hover:text-blue-400 transition-colors">Partners</Link>
                    <Link to="/contact" className="hover:text-primary dark:hover:text-blue-400 transition-colors">Contact</Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link to="/donate" className="hidden md:inline-block px-6 py-2.5 bg-primary text-white rounded-full font-bold text-sm shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                        Get Involved
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-gray-600 dark:text-gray-300"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-icons text-3xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 py-4 px-6 flex flex-col gap-4">
                    <Link to="/" className="text-primary font-bold">Home</Link>
                    <Link to="/about/leadership">Leadership</Link>
                    <Link to="/about/founder">Our Founder</Link>
                    <Link to="/safeguarding">Safeguarding</Link>
                    <Link to="/programs/wps">WPS Program</Link>
                    <Link to="/impact">Impact Dashboard</Link>
                    <Link to="/resources">Resources</Link>
                    <Link to="/news">News</Link>
                    <Link to="/partnerships">Partners</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="/donate" className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-sm text-center">
                        Get Involved
                    </Link>
                </div>
            )}
        </nav>
    );
};
