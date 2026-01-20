import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex flex-col mb-6">
                            <img
                                src="/images/logo-transparent.png"
                                alt="AKWOS Logo"
                                className="h-14 w-auto object-contain mb-2"
                            />
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Empowering women and girls through sports, education, and leadership since 2002.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><i className="material-icons">facebook</i></a>
                            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><i className="material-icons">work</i></a>
                            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><i className="material-icons">smart_display</i></a>
                            <a href="#" className="text-gray-500 hover:text-primary transition-colors font-bold text-sm flex items-center justify-center w-6">X</a>
                            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><i className="material-icons">photo_camera</i></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display font-bold text-gray-900 dark:text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link to="/about/leadership" className="hover:text-primary dark:hover:text-blue-400">About Us</Link></li>
                            <li><Link to="/programs/wps" className="hover:text-primary dark:hover:text-blue-400">Our Programs</Link></li>
                            <li><Link to="/impact/stories" className="hover:text-primary dark:hover:text-blue-400">Impact Stories</Link></li>
                            <li><Link to="/resources" className="hover:text-primary dark:hover:text-blue-400">Resource Hub</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-display font-bold text-gray-900 dark:text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link to="/safeguarding" className="hover:text-primary dark:hover:text-blue-400">Safeguarding Policy</Link></li>
                            <li><Link to="/contact" className="hover:text-primary dark:hover:text-blue-400">Contact Us</Link></li>
                            <li><Link to="#" className="hover:text-primary dark:hover:text-blue-400">Privacy Policy</Link></li>
                            <li><Link to="/contact" className="hover:text-primary dark:hover:text-blue-400">Secure Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-display font-bold text-gray-900 dark:text-white mb-4">Stay Connected</h4>
                        <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary text-sm"
                            />
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded font-bold text-sm hover:bg-blue-800 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <p>AKWOS © Copyright 2026.</p>
                    <p className="mt-2 md:mt-0">Design by <span className="underline hover:text-primary cursor-pointer">Les Arsene Creatives</span></p>
                </div>
            </div>
        </footer>
    );
};
