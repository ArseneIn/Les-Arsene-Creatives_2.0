'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, TrendingUp, DollarSign, ShoppingBag, Loader2, Download } from 'lucide-react';

interface DailyReport {
    date: string;
    revenue: number;
    profit: number;
    count: number;
}

import { useRouter } from 'next/navigation';

export default function ReportsPage() {
    const router = useRouter();
    const [data, setData] = useState<DailyReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // Last 30 days
        end: new Date().toISOString().split('T')[0]
    });
    const [staffData, setStaffData] = useState<{ name: string, count: number, total: number }[]>([]);
    const [categoryData, setCategoryData] = useState<{ name: string, total: number, count: number }[]>([]);
    const [productData, setProductData] = useState<{ name: string, total: number, count: number }[]>([]);
    const [expensesSummary, setExpensesSummary] = useState<{ total: number, byCategory: any }>({ total: 0, byCategory: {} });
    const [merchantProfile, setMerchantProfile] = useState<any>(null);

    useEffect(() => {
        // Check role
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === 'CASHIER') {
                    router.replace('/merchant'); // Redirect to dashboard
                    return;
                }
            } catch (e) {
                console.error('Failed to parse user', e);
            }
        }
        fetchMerchantProfile();
    }, []);

    useEffect(() => {
        fetchReport();
        fetchStaffReport();
        fetchExpensesSummary();
        fetchCategoryReport();
        fetchProductReport();
    }, [dateRange]);

    const fetchMerchantProfile = async () => {
        try {
            const data = await api.get('/merchants/profile');
            setMerchantProfile(data);
        } catch (error) {
            console.error('Error fetching merchant profile:', error);
        }
    };

    const fetchReport = async () => {
        setLoading(true);
        try {
            const reportData = await api.get<DailyReport[]>(`/sales/report?startDate=${dateRange.start}&endDate=${dateRange.end}`);
            setData(reportData);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaffReport = async () => {
        try {
            const data = await api.get<any[]>(`/sales/staff-report?startDate=${dateRange.start}&endDate=${dateRange.end}`);
            setStaffData(data);
        } catch (error) {
            console.error('Error fetching staff report:', error);
        }
    };

    const fetchCategoryReport = async () => {
        try {
            const data = await api.get<any[]>(`/sales/category-report?startDate=${dateRange.start}&endDate=${dateRange.end}`);
            setCategoryData(data);
        } catch (error) {
            console.error('Error fetching category report:', error);
        }
    };

    const fetchProductReport = async () => {
        try {
            const data = await api.get<any[]>(`/sales/product-report?startDate=${dateRange.start}&endDate=${dateRange.end}`);
            setProductData(data);
        } catch (error) {
            console.error('Error fetching product report:', error);
        }
    };

    const fetchExpensesSummary = async () => {
        try {
            const data = await api.get<any>(`/expenses/summary?startDate=${dateRange.start}&endDate=${dateRange.end}`);
            setExpensesSummary(data);
        } catch (error) {
            console.error('Error fetching expenses summary:', error);
        }
    };

    const totals = data.reduce((acc, curr) => ({
        revenue: acc.revenue + curr.revenue,
        profit: acc.profit + curr.profit,
        count: acc.count + curr.count
    }), { revenue: 0, profit: 0, count: 0 });

    const netProfit = totals.profit - expensesSummary.total;
    const margin = totals.revenue > 0 ? (netProfit / totals.revenue) * 100 : 0;

    const handleExport = () => {
        const headers = ['Date', 'Revenue', 'Profit', 'Count'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                row.date,
                row.revenue,
                row.profit,
                row.count
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `sales_report_${dateRange.start}_to_${dateRange.end}.csv`;
        link.click();
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-jet font-heading">Financial Reports</h1>
                    <p className="text-jet-700">Analyze your business performance and profitability</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-platinum-600 shadow-sm">
                        <Calendar className="h-4 w-4 text-jet-700" />
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="text-sm border-none focus:ring-0 text-jet"
                        />
                        <span className="text-jet-700">-</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="text-sm border-none focus:ring-0 text-jet"
                        />
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="bg-surface p-6 rounded-xl border border-platinum-600 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-sm text-jet-700 font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-jet font-heading mt-1">
                        {totals.revenue.toLocaleString()} RWF
                    </h3>
                </div>

                <div className="bg-surface p-6 rounded-xl border border-platinum-600 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                    <p className="text-sm text-jet-700 font-medium">Gross Profit</p>
                    <h3 className="text-2xl font-bold text-jet font-heading mt-1">
                        {totals.profit.toLocaleString()} RWF
                    </h3>
                </div>

                <div className="bg-surface p-6 rounded-xl border border-platinum-600 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <DollarSign className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                    <p className="text-sm text-jet-700 font-medium">Expenses</p>
                    <h3 className="text-2xl font-bold text-jet font-heading mt-1">
                        {expensesSummary.total.toLocaleString()} RWF
                    </h3>
                </div>

                <div className="bg-surface p-6 rounded-xl border border-platinum-600 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-sm text-jet-700 font-medium">Net Profit</p>
                    <h3 className="text-2xl font-bold text-jet font-heading mt-1">
                        {netProfit.toLocaleString()} RWF
                    </h3>
                </div>

                <div className="bg-surface p-6 rounded-xl border border-platinum-600 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-sm text-jet-700 font-medium">Net Margin</p>
                    <h3 className="text-2xl font-bold text-jet font-heading mt-1">
                        {margin.toFixed(1)}%
                    </h3>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-platinum-600 shadow-sm">
                    <h3 className="text-lg font-bold text-jet font-heading mb-6">Revenue vs Profit Trend</h3>
                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        stroke="#6B7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#6B7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value: number) => [`${value.toLocaleString()} RWF`, '']}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area type="monotone" dataKey="profit" name="Profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProfit)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-platinum-600 shadow-sm">
                    <h3 className="text-lg font-bold text-jet font-heading mb-6">Sales by Category</h3>
                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        stroke="#6B7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        width={100}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                        formatter={(value: number) => [`${value.toLocaleString()} RWF`, 'Revenue']}
                                    />
                                    <Bar dataKey="total" name="Revenue" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white p-6 rounded-xl border border-platinum-600 shadow-sm">
                    <h3 className="text-lg font-bold text-jet font-heading mb-4">Top Products</h3>
                    <div className="space-y-4">
                        {productData.slice(0, 5).map((product, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-platinum-200 rounded-full flex items-center justify-center text-xs font-bold text-jet">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-jet">{product.name}</p>
                                        <p className="text-xs text-jet-700">{product.count} units sold</p>
                                    </div>
                                </div>
                                <p className="font-bold text-jet">{product.total.toLocaleString()} RWF</p>
                            </div>
                        ))}
                        {productData.length === 0 && <p className="text-center py-4 text-jet-500">No product data available.</p>}
                    </div>
                </div>

                {/* Sales by Staff */}
                <div className="bg-white p-6 rounded-xl border border-platinum-600 shadow-sm">
                    <h3 className="text-lg font-bold text-jet font-heading mb-4">Sales by Staff</h3>
                    <div className="space-y-4">
                        {staffData.map((staff, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-platinum-200 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="h-4 w-4 text-jet" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-jet">{staff.name}</p>
                                        <p className="text-xs text-jet-700">{staff.count} transactions</p>
                                    </div>
                                </div>
                                <p className="font-bold text-jet">{staff.total.toLocaleString()} RWF</p>
                            </div>
                        ))}
                        {staffData.length === 0 && <p className="text-center py-4 text-jet-500">No staff data available.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
