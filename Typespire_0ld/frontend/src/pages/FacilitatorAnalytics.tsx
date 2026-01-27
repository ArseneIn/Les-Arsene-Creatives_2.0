import React from 'react';

const FacilitatorAnalytics: React.FC = () => {
    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 lg:px-10">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Class Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                    Monitor student progress and identify areas for improvement.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Avg. Class Speed</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">38</span>
                        <span className="text-lg font-medium text-slate-500 mb-1">WPM</span>
                    </div>
                    <div className="mt-4 flex items-center text-emerald-500 text-sm font-medium">
                        <span className="material-symbols-outlined text-lg mr-1">trending_up</span>
                        <span>+5% this week</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tests Submitted</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">450</span>
                    </div>
                    <div className="mt-4 flex items-center text-slate-400 text-sm font-medium">
                        <span className="material-symbols-outlined text-lg mr-1">today</span>
                        <span>Today</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Needs Attention</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">12</span>
                        <span className="text-lg font-medium text-slate-500 mb-1">Students</span>
                    </div>
                    <div className="mt-4 flex items-center text-red-500 text-sm font-medium">
                        <span className="material-symbols-outlined text-lg mr-1">warning</span>
                        <span>Below 20 WPM</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                    <span className="material-symbols-outlined text-4xl text-slate-400">monitoring</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Performance Charts</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
                    Detailed performance graphs for your classes will be available here.
                </p>
            </div>
        </div>
    );
};

export default FacilitatorAnalytics;
