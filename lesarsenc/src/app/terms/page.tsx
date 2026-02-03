"use strict";
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Skeleton from "@/components/Skeleton";

export default function TermsConditions() {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/content.php")
            .then(res => res.json())
            .then(data => {
                if (data.terms_conditions) {
                    setContent(data.terms_conditions);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-space bg-white dark:bg-black text-gray-900 dark:text-white">
            <Navbar />
            <main className="flex-grow pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-syne font-bold mb-12">Terms & Conditions</h1>

                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded" />
                            <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-white/10 rounded" />
                            <Skeleton className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded" />
                            <Skeleton className="h-32 w-full bg-gray-200 dark:bg-white/10 rounded" />
                            <Skeleton className="h-4 w-4/5 bg-gray-200 dark:bg-white/10 rounded" />
                        </div>
                    ) : (
                        <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
                            {content || "No terms & conditions content available."}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
