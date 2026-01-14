import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Edit3 } from "lucide-react";

export default function Contact() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <Navbar />
            <main className="flex-grow">
                <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 lg:pt-48 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
                            Let's build something <span className="text-primary">extraordinary</span>.
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            Have a vision? We'd love to hear about it. Tell us about your project, timeline, and budget, and we'll help you bring it to life.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                                <Edit3 className="text-primary h-6 w-6" /> Project Inquiry
                            </h2>
                            <form action="#" method="POST" className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="first-name"
                                            name="first-name"
                                            placeholder="Jane"
                                            className="block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="last-name"
                                            name="last-name"
                                            placeholder="Doe"
                                            className="block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Work Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="jane@company.com"
                                        className="block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Estimated Budget (USD)
                                    </label>
                                    <select
                                        id="budget"
                                        name="budget"
                                        className="block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                                    >
                                        <option>$5k - $10k</option>
                                        <option>$10k - $25k</option>
                                        <option>$25k - $50k</option>
                                        <option>$50k+</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tell us about your project
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        placeholder="What are your goals? Who is your audience?"
                                        className="block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                                    ></textarea>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-sm font-bold text-black bg-primary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all uppercase tracking-wide"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="space-y-12 py-4">
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8">
                                    Prefer to email us directly? Reach out anytime. We're always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <Mail className="text-primary h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                                            <a href="mailto:hello@lesarsene.com" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                                                hello@lesarsene.com
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <MapPin className="text-primary h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Office</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                123 Creative Avenue, Suite 400<br />
                                                Paris, France 75001
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <Phone className="text-primary h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">+33 1 23 45 67 89</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Follow Us</h3>
                                <div className="flex space-x-6">
                                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                        <span className="sr-only">Instagram</span>
                                        <Instagram className="h-6 w-6" />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                        <span className="sr-only">Twitter</span>
                                        <Twitter className="h-6 w-6" />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                        <span className="sr-only">LinkedIn</span>
                                        <Linkedin className="h-6 w-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
