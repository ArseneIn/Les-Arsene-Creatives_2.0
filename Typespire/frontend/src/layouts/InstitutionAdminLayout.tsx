import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const InstitutionAdminLayout: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-navy-blue text-white flex flex-col h-full flex-shrink-0 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-admin-primary rounded-lg p-2 flex items-center justify-center">
                                <span className="material-symbols-outlined text-navy-blue text-2xl">keyboard</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Typespire</h1>
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Institution Admin</p>
                            </div>
                        </div>
                        <button
                            className="lg:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <nav className="space-y-1">
                        <Link
                            to="/admin"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/admin')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                            to="/admin/intakes"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/admin/intakes')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">calendar_month</span>
                            <span className="font-medium">Intakes & Sections</span>
                        </Link>
                        <Link
                            to="/admin/facilitators"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/admin/facilitators')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">group</span>
                            <span className="font-medium">Facilitators</span>
                        </Link>
                        <Link
                            to="/admin/analytics"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/admin/analytics')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">analytics</span>
                            <span className="font-medium">Analytics</span>
                        </Link>
                        <Link
                            to="/admin/reports"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/admin/reports')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">description</span>
                            <span className="font-medium">Reports</span>
                        </Link>
                        <Link
                            to="/admin/settings"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/admin/settings')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">settings</span>
                            <span className="font-medium">Settings</span>
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-6 space-y-4">
                    <div className="flex items-center gap-3 p-2">
                        <div
                            className="size-10 rounded-full bg-center bg-cover border-2 border-admin-primary/50"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnqzAOeX1XfN82EJ_uOk9P6n0niJbbsId9F7JIoiwjwzt_ZyxItvopzLPVLDjKcbJDRtMCf7PuvF6HlH8By-59-Zv4BsxHFEB8cUJcYkE6qgJ9aHLG-eeeBLP5gBVAAsJWEGz3CKY-yezTEfWBIyXIP6DEaVDZg_t6d30_4-8jbbC2cjgzAk1NFTKX5weqcxYbXPJublmpVMDxI8_FPKHVLHVR36z08OrF5rLT0nADAi4KWBLPQEiwvCgGZ3KvfJeEp1MOAHnglWJy')" }}
                        ></div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate">Kepler Admin</p>
                            <p className="text-xs text-slate-400 truncate">admin@kepler.edu</p>
                        </div>
                        <button className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white">logout</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
                {/* Mobile Header Toggle */}
                <div className="lg:hidden p-4 bg-white dark:bg-navy-blue border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">Typespire Admin</span>
                </div>
                <Outlet />
            </main>
        </div>
    );
};

export default InstitutionAdminLayout;

