"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function Login() {
    return (
        <div className="min-h-screen flex flex-col font-space bg-background-light dark:bg-background-dark">
            <Navbar />
            <main className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-syne font-bold mb-4 text-gray-900 dark:text-white">Client Portal</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Secure client access coming soon.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
