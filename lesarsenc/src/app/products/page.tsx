"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getImagePath } from "@/utils/imagePath";

import Skeleton from "@/components/Skeleton";

interface Product {
    id: number;
    name: string;
    description: string;
    link: string;
    image: string;
    features?: string;
    pricing_plans?: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await fetch("/api/content.php");
                const data = await res.json();
                if (data.products) {
                    try {
                        setProducts(JSON.parse(data.products));
                    } catch (e) {
                        console.error("Error parsing products", e);
                        setProducts([]);
                    }
                }
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black font-space">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-6xl font-syne font-bold mb-6 text-center text-gray-900 dark:text-white">
                        SaaS Solutions
                    </h1>
                    <p className="text-center text-gray-500 max-w-2xl mx-auto mb-16">
                        Powerful tools designed to scale your business. Choose the plan that fits you best.
                    </p>

                    <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
                        {loading ? (
                            <>
                                <Skeleton className="h-[400px] w-full rounded-3xl" />
                                <Skeleton className="h-[400px] w-full rounded-3xl" />
                            </>
                        ) : products.length === 0 ? (
                            <p className="text-center col-span-full text-gray-500">Coming soon...</p>
                        ) : (
                            products.map((product) => (
                                <div key={product.id} className="bg-gray-50 dark:bg-white/5 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl">
                                    <div className="grid grid-cols-1 lg:grid-cols-2">
                                        {/* Content Side */}
                                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                                            <div className="flex items-center gap-4 mb-6">
                                                {product.image && (
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                                                        <img
                                                            src={getImagePath(product.image)}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <h2 className="text-3xl font-bold">{product.name}</h2>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                                {product.description}
                                            </p>

                                            {product.features && (
                                                <div className="mb-8 p-6 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-white/5">
                                                    <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Core Features</h4>
                                                    <ul className="space-y-3">
                                                        {product.features.split('\n').map((feature: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 text-sm">
                                                                <span className="text-primary font-bold">✓</span>
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Fallback Link */}
                                            {product.link && !product.pricing_plans && (
                                                <a href={product.link} target="_blank" className="inline-block text-center w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                                                    Learn More
                                                </a>
                                            )}
                                        </div>

                                        {/* Pricing Side */}
                                        {product.pricing_plans && (
                                            <div className="bg-gray-100 dark:bg-white/5 border-l border-gray-200 dark:border-white/5 p-8 lg:p-12 flex flex-col justify-center">
                                                <h3 className="font-syne font-bold text-2xl mb-8 text-center">Pricing Options</h3>
                                                <div className="space-y-4">
                                                    {product.pricing_plans.split('\n').map((planLine: string, idx: number) => {
                                                        // Expected format: Name | Price | Features
                                                        const parts = planLine.split('|');
                                                        const planName = parts[0]?.trim() || "Standard";
                                                        const price = parts[1]?.trim() || "Contact Us";
                                                        const details = parts[2]?.trim() || "";

                                                        return (
                                                            <div key={idx} className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary transition-colors cursor-default group relative overflow-hidden">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="font-bold text-lg">{planName}</span>
                                                                    <span className="font-syne font-bold text-xl text-primary">{price}</span>
                                                                </div>
                                                                {details && <p className="text-xs text-gray-500 dark:text-gray-400">{details}</p>}

                                                                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 bottom-4">
                                                                    <a href={product.link || "/contact"} className="text-xs font-bold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full">
                                                                        Select
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <p className="text-xs text-center text-gray-400 mt-8">
                                                    Need a custom enterprise solution? <Link href="/contact" className="underline hover:text-primary">Contact Sales</Link>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
