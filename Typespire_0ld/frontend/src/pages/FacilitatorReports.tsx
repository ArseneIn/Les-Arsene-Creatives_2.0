import React from 'react';

const FacilitatorReports: React.FC = () => {
    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 lg:px-10">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Class Reports</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                    Access and export detailed reports for your assigned classes.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-admin-primary/10 rounded-lg text-admin-primary">
                            <span className="material-symbols-outlined">assignment</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Class Performance Report</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Class</label>
                            <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-admin-primary focus:border-admin-primary">
                                <option>Class 1A - Intro to Typing</option>
                                <option>Class 2B - Advanced Speed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Report Period</label>
                            <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-admin-primary focus:border-admin-primary">
                                <option>Current Week</option>
                                <option>Last Month</option>
                                <option>Semester to Date</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <button className="w-full py-2.5 rounded-lg bg-admin-primary text-slate-900 font-bold hover:bg-admin-primary/90 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">download</span>
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined">history</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Past Reports</h2>
                    </div>

                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600 group">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined">table_chart</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Weekly Summary - Class 1A</p>
                                        <p className="text-xs text-slate-500">Generated 2 days ago</p>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-admin-primary transition-colors opacity-0 group-hover:opacity-100">
                                    <span className="material-symbols-outlined">download</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilitatorReports;
