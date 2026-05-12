'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import KpiCard from '@/components/KpiCard';
import TaxLiabilityCard from '@/components/dashboard/TaxLiabilityCard';
import { DollarSign, Package, Users, TrendingUp, Plus, Bell, Download, Eye, ArrowRight, FileText, AlertTriangle, ShoppingCart } from 'lucide-react';
import { api } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';

interface DashboardStats {
    todaySales: number;
    todayProfit: number;
    todayTransactionCount: number;
    todayVat: number;
    lowStockCount: number;
    totalDebt: number;
    yieldRate: number;
}

interface Transaction {
    id: string;
    customer?: { name: string };
    total: number;
    created_at: string;
    payment_method: string;
}

interface LowStockItem {
    id: string;
    name: string;
    stock: number;
    unit: string;
    min: number;
    critical: boolean;
}

export default function MerchantDashboard() {
    const t = useTranslations('MerchantDashboard');
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setRole(user.role);
            }

            const [statsData, transactionsData, lowStockData] = await Promise.all([
                api.get<DashboardStats>('/dashboard/stats'),
                api.get<Transaction[]>('/dashboard/recent-transactions'),
                api.get<LowStockItem[]>('/dashboard/low-stock')
            ]);

            setStats(statsData);
            setRecentTransactions(transactionsData);
            setLowStockItems(lowStockData);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}${t('s')} ${t('ago')}`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}${t('m')} ${t('ago')}`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}${t('h')} ${t('ago')}`;
        return `${Math.floor(diffInSeconds / 86400)}${t('d')} ${t('ago')}`;
    };

    if (loading && !stats) {
        return <div className="p-8 text-center text-gray-500">{t('loading')}</div>;
    }

    if (!stats) {
        return (
            <div className="p-8 text-center flex flex-col items-center justify-center h-[50vh]">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 max-w-md border border-red-100">
                    <h3 className="font-bold mb-2 flex items-center justify-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        {t('connectionError')}
                    </h3>
                    <p className="text-sm">{t('connectionErrorDesc')}</p>
                </div>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => fetchDashboardData()}
                        className="px-6 py-2 bg-jet text-white rounded-lg hover:bg-onyx transition-colors shadow-sm"
                    >
                        {t('retry')}
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                        className="px-6 py-2 border border-gray-300 text-jet rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {t('logout')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 bg-platinum-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-jet font-heading">{t('title')}</h1>
                    <p className="text-gray-500 mt-1 text-sm flex items-center gap-2">
                        {t('subtitle')}
                        {lastUpdated && (
                            <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchDashboardData}
                        disabled={loading}
                        className={`px-4 py-2 bg-white border border-gray-200 text-jet rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm ${loading ? 'opacity-50' : ''}`}
                    >
                        <Bell className={`h-4 w-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Refreshing...' : t('refresh') || 'Refresh'}
                    </button>
                    <button
                        onClick={() => alert('Export functionality coming soon!')}
                        className="px-4 py-2 bg-white border border-gray-200 text-jet rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                    >
                        <Download className="h-4 w-4 text-gray-400" />
                        {t('export')}
                    </button>
                    <Link
                        href="/merchant/sales"
                        className="px-4 py-2 bg-gold text-onyx rounded-lg hover:bg-gold/90 transition-colors flex items-center gap-2 text-sm font-bold shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        {t('newSale')}
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <KpiCard
                    title={t('todaySales')}
                    value={loading ? "..." : `${stats?.todaySales.toLocaleString()} RWF`}
                    change={loading ? "..." : `${stats?.todayTransactionCount} ${t('txns')}`}
                    trend="up"
                    icon={DollarSign}
                    color="gold"
                />
                <KpiCard
                    title={t('vatPayable')}
                    value={loading ? "..." : `${stats?.todayVat.toLocaleString()} RWF`}
                    change={t('vatRevenue')}
                    trend="up"
                    icon={FileText}
                    color="blue"
                />
                <KpiCard
                    title={t('lowStock')}
                    value={loading ? "..." : stats?.lowStockCount.toString() || "0"}
                    change={loading ? "..." : `${stats?.lowStockCount} ${t('critical')}`}
                    trend={stats?.lowStockCount && stats.lowStockCount > 0 ? "down" : "up"}
                    icon={Package}
                    color={stats?.lowStockCount && stats.lowStockCount > 0 ? "red" : "green"}
                />
                {role !== 'CASHIER' && (
                    <>
                        <KpiCard
                            title={t('outstandingDebt')}
                            value={loading ? "..." : `${stats?.totalDebt.toLocaleString()} RWF`}
                            change={t('totalDue')}
                            trend="down"
                            icon={Users}
                            color="red"
                        />
                        <KpiCard
                            title={t('profitMargin')}
                            value={loading ? "..." : `${stats?.yieldRate.toFixed(1)}%`}
                            change={loading ? "..." : `${stats?.todayProfit.toLocaleString()} RWF`}
                            trend={stats?.todayProfit && stats.todayProfit >= 0 ? "up" : "down"}
                            icon={TrendingUp}
                            color={stats?.todayProfit && stats.todayProfit >= 0 ? "green" : "red"}
                        />
                    </>
                )}
            </div>

            {/* Tax Liability Monitor */}
            {role !== 'CASHIER' && <TaxLiabilityCard />}

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-jet mb-4">{t('quickActions')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/merchant/sales"
                        className="group p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gold/50 transition-all duration-200 flex flex-col items-center gap-3"
                    >
                        <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-bold text-jet">{t('recordSale')}</span>
                    </Link>
                    {role !== 'CASHIER' && (
                        <Link
                            href="/merchant/inventory"
                            className="group p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col items-center gap-3"
                        >
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Package className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-bold text-jet">{t('addStock')}</span>
                        </Link>
                    )}
                    <Link
                        href="/merchant/crm"
                        className="group p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 flex flex-col items-center gap-3"
                    >
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Bell className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-bold text-jet">{t('sendReminder')}</span>
                    </Link>
                    {role !== 'CASHIER' && (
                        <Link
                            href="/merchant/reports"
                            className="group p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 flex flex-col items-center gap-3"
                        >
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Eye className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-bold text-jet">{t('viewReports')}</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card className="p-0 overflow-hidden border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h2 className="text-lg font-bold text-jet">{t('recentTransactions')}</h2>
                        <Link
                            href="/merchant/sales/history"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
                        >
                            {t('viewAll')} <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100 bg-white max-h-[350px] overflow-y-auto">
                        {loading ? (
                            <p className="text-center text-gray-500 py-8">{t('loading')}</p>
                        ) : recentTransactions.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">{t('noTransactions')}</p>
                        ) : (
                            recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
                                            {(transaction.customer?.name || 'W')[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-jet text-sm">{transaction.customer?.name || t('walkInCustomer')}</p>
                                            <p className="text-xs text-gray-500">{formatTimeAgo(transaction.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-jet text-sm">{Number(transaction.total).toLocaleString()} RWF</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${transaction.payment_method === 'Cash' ? 'bg-green-100 text-green-700' :
                                                transaction.payment_method === 'MoMo' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {transaction.payment_method}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Low Stock Alerts */}
                <Card className="p-0 overflow-hidden border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h2 className="text-lg font-bold text-jet">{t('lowStockAlerts')}</h2>
                        {lowStockItems.length > 0 && (
                            <span className="text-xs bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-bold">
                                {lowStockItems.length} {t('items')}
                            </span>
                        )}
                    </div>
                    <div className="divide-y divide-gray-100 bg-white max-h-[350px] overflow-y-auto">
                        {loading ? (
                            <p className="text-center text-gray-500 py-8">{t('checkingStock')}</p>
                        ) : lowStockItems.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Package className="h-6 w-6" />
                                </div>
                                <p className="text-gray-900 font-medium">{t('healthyStock')}</p>
                                <p className="text-xs text-gray-500 mt-1">All items are well stocked</p>
                            </div>
                        ) : (
                            lowStockItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.critical ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                        <div>
                                            <p className="font-medium text-jet text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500">Min: {item.min} {item.unit}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-sm ${item.critical ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {item.stock} {item.unit}
                                        </p>
                                        <Link
                                            href="/merchant/inventory"
                                            className="text-xs text-blue-600 hover:underline font-medium"
                                        >
                                            {t('restock')}
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
