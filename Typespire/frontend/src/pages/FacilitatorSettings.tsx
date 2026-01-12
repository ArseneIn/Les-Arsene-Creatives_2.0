import React from 'react';

const FacilitatorSettings: React.FC = () => {
    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 lg:px-10">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                    Manage your profile and teaching preferences.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-admin-primary focus:border-admin-primary" type="text" defaultValue="Prof. A. Kepler" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                            <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-admin-primary focus:border-admin-primary" type="email" defaultValue="kepler@university.edu" />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button className="px-6 py-2 rounded-lg bg-admin-primary text-slate-900 font-bold hover:bg-admin-primary/90 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacilitatorSettings;
