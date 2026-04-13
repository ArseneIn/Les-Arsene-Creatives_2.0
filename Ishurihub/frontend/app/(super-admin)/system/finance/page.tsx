"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Transaction {
    id: string;
    schoolId: string;
    plan: string;
    amount: number;
    status: string;
    createdAt: string;
}

interface TrendData {
    name: string;
    total: number;
    [key: string]: string | number;
}

interface FinanceStats {
    totalRevenue: number;
    mrr: number;
    activeSubscriptions: number;
    churnRate: number;
    recentTransactions: Transaction[];
    trends: TrendData[];
}

export default function SystemFinancePage() {
    const [stats, setStats] = useState<FinanceStats>({
        totalRevenue: 0,
        mrr: 0,
        activeSubscriptions: 0,
        churnRate: 0,
        recentTransactions: [],
        trends: []
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/subscriptions/stats');
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch finance stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Extract unique plan names for the chart areas, excluding 'name' and 'total'
    const planKeys = stats.trends.length > 0 
        ? Object.keys(stats.trends[0]).filter(key => key !== 'name' && key !== 'total')
        : [];

    const planColors: Record<string, string> = {
        'Professional': '#8884d8',
        'Elite': '#82ca9d',
        'Basic': '#ffc658',
        'Premium': '#ff8042',
        'Free': '#cbd5e1'
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-6">Financial Overview</h1>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="p-6 bg-white dark:bg-space-indigo-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(stats.totalRevenue)}
                    </h3>
                </div>

                {/* MRR */}
                <div className="p-6 bg-white dark:bg-space-indigo-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Monthly Recurring (MRR)</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(stats.mrr)}
                    </h3>
                </div>

                {/* Active Subscriptions */}
                <div className="p-6 bg-white dark:bg-space-indigo-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Subscriptions</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeSubscriptions}</h3>
                </div>

                {/* Churn Rate */}
                <div className="p-6 bg-white dark:bg-space-indigo-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Churn Rate</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.churnRate}%</h3>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="mb-8 bg-white dark:bg-space-indigo-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Trends by Plan</h3>
                    <div className="flex gap-4">
                        {planKeys.map(key => (
                            <div key={key} className="flex items-center gap-2">
                                <div className="size-3 rounded-full" style={{ backgroundColor: planColors[key] || '#94a3b8' }}></div>
                                <span className="text-xs font-medium text-slate-500">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.trends}>
                            <defs>
                                {planKeys.map(key => (
                                    <linearGradient key={`grad-${key}`} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={planColors[key] || '#94a3b8'} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={planColors[key] || '#94a3b8'} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e1e48', borderRadius: '8px', border: 'none', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number | undefined) => 
                                    value !== undefined 
                                        ? new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(value)
                                        : 'N/A'
                                }
                            />
                            {planKeys.map(key => (
                                <Area 
                                    key={key}
                                    type="monotone" 
                                    dataKey={key} 
                                    stackId="1"
                                    stroke={planColors[key] || '#94a3b8'} 
                                    fillOpacity={1} 
                                    fill={`url(#color-${key})`} 
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white dark:bg-space-indigo-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">School ID</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Plan</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                                </tr>
                            ) : stats.recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No recent transactions found.</td>
                                </tr>
                            ) : (
                                stats.recentTransactions.map((tx: Transaction) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-mono">{tx.schoolId.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {tx.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                                            {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(tx.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
