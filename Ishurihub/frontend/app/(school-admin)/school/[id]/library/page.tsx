"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

export default function LibraryDashboardPage() {
    const params = useParams();
    const schoolId = params.id as string;
    
    const [stats, setStats] = useState({
        totalBooks: 0,
        borrowedBooks: 0,
        overdueBooks: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        try {
            // Simplified: we would normally fetch a dedicated stats endpoint
            const [booksRes, issuedRes] = await Promise.all([
                api.get(`/library/books?schoolId=${schoolId}`),
                api.get(`/library/issued?schoolId=${schoolId}`)
            ]);
            
            const total = booksRes.data.reduce((acc: number, b: { quantity: number }) => acc + b.quantity, 0);
            const borrowed = issuedRes.data.filter((r: { status: string }) => r.status === 'Issued').length;
            const overdue = issuedRes.data.filter((r: { status: string; dueDate: string }) => new Date(r.dueDate) < new Date() && r.status === 'Issued').length;
            
            setStats({
                totalBooks: total,
                borrowedBooks: borrowed,
                overdueBooks: overdue
            });
        } catch (error) {
            console.error("Failed to fetch library stats:", error);
        } finally {
            setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <div className="p-8 space-y-8 min-h-screen bg-gray-50 dark:bg-black/20 font-sans text-[#0d111b] dark:text-white">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Library Dashboard</h1>
                    <p className="text-gray-500 font-medium">Overview of your library&apos;s performance</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1e2538] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                            <span className="material-symbols-outlined text-3xl">menu_book</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Books</p>
                            <h3 className="text-3xl font-black">{isLoading ? '...' : stats.totalBooks}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e2538] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                            <span className="material-symbols-outlined text-3xl">swap_horiz</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Currently Borrowed</p>
                            <h3 className="text-3xl font-black">{isLoading ? '...' : stats.borrowedBooks}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e2538] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Overdue Items</p>
                            <h3 className="text-3xl font-black">{isLoading ? '...' : stats.overdueBooks}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href={`/school/${schoolId}/library/books`} className="p-4 bg-white dark:bg-[#1e2538] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">collections_bookmark</span>
                        <span className="font-bold">Manage Books</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <Link href={`/school/${schoolId}/library/circulation`} className="p-4 bg-white dark:bg-[#1e2538] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">outbound</span>
                        <span className="font-bold">Lend & Return</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <Link href={`/school/${schoolId}/library/overdue`} className="p-4 bg-white dark:bg-[#1e2538] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">history</span>
                        <span className="font-bold">Overdue Records</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
}
