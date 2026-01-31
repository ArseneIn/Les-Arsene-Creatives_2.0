"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function SystemOverviewPage() {
    const [stats, setStats] = useState({
        totalSchools: 0,
        totalRevenue: 0,
        totalUsers: 0,
        openTickets: 0
    });

    useEffect(() => {
        const loadStats = async () => {
            // Parallel fetch would be better, but doing simplified sequential/mock-mix for now or dedicated stats endpoint
            try {
                const schoolsRes = await api.get('/schools');
                const usersRes = await api.get('/users');
                const subsStats = await api.get('/subscriptions/stats');
                // For tickets we don't have a stats endpoint yet, so we'll just check specific fetch or mock
                // Leaving openTickets for now or fetching all.

                setStats({
                    totalSchools: schoolsRes.data.length,
                    totalRevenue: subsStats.data.totalRevenue,
                    totalUsers: usersRes.data.length,
                    openTickets: 0 // Placeholder until ticket stats
                });
            } catch (e) {
                console.error("Failed to load overview stats", e);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">System Overview</h1>
            <p className="text-slate-500 mb-8">Welcome back. Here&rsquo;s what&rsquo;s happening on IshuriHub today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link href="/system/dashboard" className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all group">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">domain</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalSchools}</h3>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Registered Institutions</p>
                </Link>

                <Link href="/system/finance" className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-green-500/50 transition-all group">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumSignificantDigits: 3 }).format(stats.totalRevenue)}</h3>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
                </Link>

                <Link href="/system/users" className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 transition-all group">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</h3>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
                </Link>

                <Link href="/system/support" className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 transition-all group">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">support_agent</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.openTickets}</h3>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Open Tickets</p>
                </Link>
            </div>
        </div>
    );
}
