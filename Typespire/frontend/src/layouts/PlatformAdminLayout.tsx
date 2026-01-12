import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const PlatformAdminLayout: React.FC = () => {
    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-navy-blue text-white flex flex-col h-full flex-shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-admin-primary rounded-lg p-2 flex items-center justify-center">
                            <span className="material-symbols-outlined text-navy-blue text-2xl">keyboard</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Typespire</h1>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        <Link to="/super-admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-admin-primary/10 text-admin-primary border-l-4 border-admin-primary">
                            <span className="material-symbols-outlined">corporate_fare</span>
                            <span className="font-medium">Institutions</span>
                        </Link>
                        <Link to="/super-admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-l-4 border-transparent">
                            <span className="material-symbols-outlined">analytics</span>
                            <span className="font-medium">Global Analytics</span>
                        </Link>
                        <Link to="/super-admin/billing" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-l-4 border-transparent">
                            <span className="material-symbols-outlined">receipt_long</span>
                            <span className="font-medium">Billing & Plans</span>
                        </Link>
                        <Link to="/super-admin/logs" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-l-4 border-transparent">
                            <span className="material-symbols-outlined">history_edu</span>
                            <span className="font-medium">System Logs</span>
                        </Link>
                        <Link to="/super-admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-l-4 border-transparent">
                            <span className="material-symbols-outlined">settings</span>
                            <span className="font-medium">Platform Settings</span>
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-6 space-y-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <p className="text-xs text-slate-400 mb-2 uppercase font-bold">Server Load</p>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-admin-primary h-full w-[42%]"></div>
                        </div>
                        <p className="text-xs text-slate-300 mt-2">Running optimally</p>
                    </div>
                    <div className="flex items-center gap-3 p-2">
                        <div
                            className="size-10 rounded-full bg-center bg-cover border-2 border-admin-primary/50"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUZ5TwRRqDZut38NcPVmugcjfvYMhx72OUmBECzCHrO5EzqfVBWtKMj14N1CrfwbJ46TP1_eIxSHKpPtxQepoRtjWgDLm68CGLqWxltYQHXWvloMJtNTcA4oYQLZ8l6ou8yOip4RvWFJOVKgR8hbJAvo5J95hlcCLjuqmkHFMMSE5oiA6lRejvfIXFzMhgBKCKgIFt4vGcip6WqQW1y57RrTYvOWO7yP8al8esAWcjxbIeGR3RHySrdVAhDcL8p2Yo03ZNFPSQOoUU')" }}
                        ></div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate">Alex Chen</p>
                            <p className="text-xs text-slate-400 truncate">Global Controller</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white">logout</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
                <Outlet />
            </main>
        </div>
    );
};

export default PlatformAdminLayout;
