import React from 'react';

const InstitutionAnalytics: React.FC = () => {
    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 lg:px-10">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                    Detailed insights into student performance and institution growth.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Avg. Typing Speed</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">42</span>
                        <span className="text-lg font-medium text-slate-500 mb-1">WPM</span>
                    </div>
                    <div className="mt-4 flex items-center text-emerald-500 text-sm font-medium">
                        <span className="material-symbols-outlined text-lg mr-1">trending_up</span>
                        <span>+12% from last month</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Active Students</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">1,240</span>
                    </div>
                    <div className="mt-4 flex items-center text-emerald-500 text-sm font-medium">
                        <span className="material-symbols-outlined text-lg mr-1">group_add</span>
                        <span>+56 new this week</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tests Completed</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">15.4k</span>
                    </div>
                    <div className="mt-4 flex items-center text-slate-400 text-sm font-medium">
                        <span className="material-symbols-outlined text-lg mr-1">schedule</span>
                        <span>Last 30 days</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                    <span className="material-symbols-outlined text-4xl text-slate-400">bar_chart</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Detailed Charts Coming Soon</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
                    We are building comprehensive visualization tools to help you track progress over time.
                </p>
            </div>
        </div>
    );
};

export default InstitutionAnalytics;
