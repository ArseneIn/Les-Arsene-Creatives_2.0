import Link from "next/link";
import { Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <img
                                alt="Les Arsene Creatives Logo"
                                className="h-8 w-auto"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA20S-tZQLap5_TUtNWlkLhNC_pUT3aNskJJNyAPw12k7llKXq3asmng-gXs6e3SchOlogsg99n4rdfy7MkkPWtQCJDi6fHxKfyZQgTN2ozDWkxFqEQ45WPpYJjWjE4e2phtpvu05zVc7GBCzYTK-rOYDU7iXAhBQKzhqZ_4joR71gLLaLX9np90Xo2pLUye2rcKBkPMDGmtaTfsZurReELYga7Eixk_Tr_A3CueGrhpXq2Us6jbpkOIELDY6wVlWVTyssJnWSqPhHs"
                            />
                            <span className="ml-2 font-display font-bold text-xl uppercase text-gray-900 dark:text-white">
                                Les Arsene
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs leading-relaxed">
                            A digital creative agency focused on crafting premium experiences for forward-thinking brands.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">
                            Company
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">
                            Connect
                        </h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 dark:text-gray-500 text-xs">
                        © 2023 Les Arsene Creatives. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <Link href="#" className="text-gray-500 dark:text-gray-500 hover:text-primary text-xs">
                            Terms
                        </Link>
                        <Link href="#" className="text-gray-500 dark:text-gray-500 hover:text-primary text-xs">
                            Privacy
                        </Link>
                        <Link href="#" className="text-gray-500 dark:text-gray-500 hover:text-primary text-xs">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
