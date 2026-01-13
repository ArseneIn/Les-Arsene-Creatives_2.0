import React from 'react';

const PlatformSettings: React.FC = () => {
    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Configure global platform parameters.</p>
                </div>
                <button className="bg-admin-primary text-navy-blue px-6 py-2 rounded-lg font-bold shadow-lg shadow-admin-primary/20">
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-admin-primary">tune</span>
                            General Configuration
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Platform Name</label>
                                <input type="text" defaultValue="Typespire" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Support Email</label>
                                <input type="email" defaultValue="support@typespire.com" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <div>
                                    <p className="font-bold">Maintenance Mode</p>
                                    <p className="text-xs text-slate-500">Disable access for all users except admins</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-admin-primary">security</span>
                            Security & Access
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Password Policy</label>
                                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                    <option>Standard (Min 8 chars)</option>
                                    <option>Strong (Min 12 chars, symbols)</option>
                                    <option>Strict (Rotation every 90 days)</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <div>
                                    <p className="font-bold">Two-Factor Authentication</p>
                                    <p className="text-xs text-slate-500">Enforce 2FA for all admin accounts</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Info */}
                <div className="space-y-6">
                    <div className="bg-navy-blue text-white p-6 rounded-xl">
                        <h3 className="text-lg font-bold mb-2">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Version</span>
                                <span className="font-mono">v2.4.0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Last Backup</span>
                                <span>2 hours ago</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Database</span>
                                <span className="text-emerald-400 font-bold">Healthy</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors">
                            Check for Updates
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;
