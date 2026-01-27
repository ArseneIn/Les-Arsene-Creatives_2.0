import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { Keyboard, Building2, BarChart, Receipt, ScrollText, Settings, LogOut } from 'lucide-react';

const PlatformAdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-navy-blue text-white flex flex-col h-full flex-shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-admin-primary rounded-lg p-2 flex items-center justify-center">
                            <Keyboard className="text-navy-blue w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Typespire</h1>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        <Link to="/super-admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-admin-primary/10 text-admin-primary border-l-4 border-admin-primary">
                            <Building2 className="w-6 h-6" />
                            <span className="font-medium">Institutions</span>
                        </Link>
                        <Link to="/super-admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-l-4 border-transparent">
                            <BarChart className="w-6 h-6" />
                            <span className="font-medium">Global Analytics</span>
                        </Link>
                        <Link to="/super-admin/billing" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-l-4 border-transparent">
                            <Receipt className="w-6 h-6" />
                            <span className="font-medium">Billing & Plans</span>
                        </Link>
                        <Link to="/super-admin/logs" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-l-4 border-transparent">
                            <ScrollText className="w-6 h-6" />
                            <span className="font-medium">System Logs</span>
                        </Link>
                        <Link to="/super-admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-l-4 border-transparent">
                            <Settings className="w-6 h-6" />
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
                        <div className="size-10 rounded-full bg-admin-primary/20 border-2 border-admin-primary/50 flex items-center justify-center text-admin-primary font-bold">
                            {user?.firstName?.[0] || 'P'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate">
                                {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Platform Admin'}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{user?.email || 'Loading...'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 cursor-pointer hover:text-white"
                        >
                            <LogOut className="w-6 h-6" />
                        </button>
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
