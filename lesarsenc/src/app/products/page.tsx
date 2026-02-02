"use client";

import { useEffect, useState } from "react";
import { getImagePath } from "@/utils/imagePath";

interface Product {
    id: number;
    name: string;
    description: string;
    link: string;
    image: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await fetch("/api/content.php");
                const data = await res.json();
                if (data.products) {
                    setProducts(JSON.parse(data.products));
                }
            } catch (error) {
                console.error("Failed to load products", error);
            }
        };

        loadProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black font-space pt-32 pb-20 px-4">
            <div className="container mx-auto">
                <h1 className="text-4xl md:text-6xl font-syne font-bold mb-12 text-center text-gray-900 dark:text-white">
                    Our Products
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.length === 0 ? (
                        <p className="text-center col-span-full text-gray-500">Coming soon...</p>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 transition-all">
                                {product.image && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={getImagePath(product.image)}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{product.description}</p>
                                    {product.link && (
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm rounded-lg hover:opacity-80 transition-opacity"
                                        >
                                            View Product
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
