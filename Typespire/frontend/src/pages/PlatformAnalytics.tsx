import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const PlatformAnalytics: React.FC = () => {
    // Mock Data
    const growthData = [
        { name: 'Jan', institutions: 40, students: 2400 },
        { name: 'Feb', institutions: 45, students: 3200 },
        { name: 'Mar', institutions: 55, students: 5000 },
        { name: 'Apr', institutions: 70, students: 8500 },
        { name: 'May', institutions: 90, students: 12000 },
        { name: 'Jun', institutions: 110, students: 18000 },
        { name: 'Jul', institutions: 128, students: 24000 },
    ];

    const usageData = [
        { name: 'Mon', tests: 4000 },
        { name: 'Tue', tests: 3000 },
        { name: 'Wed', tests: 2000 },
        { name: 'Thu', tests: 2780 },
        { name: 'Fri', tests: 1890 },
        { name: 'Sat', tests: 2390 },
        { name: 'Sun', tests: 3490 },
    ];

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Global Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Platform-wide performance and growth metrics.</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm font-medium">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                    <button className="bg-admin-primary text-navy-blue px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">$124,500</h3>
                    <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-sm">trending_up</span> +12.5%
                    </span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Users</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">48.2k</h3>
                    <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-sm">trending_up</span> +8.1%
                    </span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tests Taken</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">1.2M</h3>
                    <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-sm">trending_up</span> +24%
                    </span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg. WPM</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">42</h3>
                    <span className="text-slate-400 text-xs font-bold flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-sm">remove</span> Stable
                    </span>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Growth Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Platform Growth</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#39E079" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#39E079" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="students" stroke="#39E079" fillOpacity={1} fill="url(#colorStudents)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Usage Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Daily Test Volume</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={usageData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="tests" fill="#0f172a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformAnalytics;
