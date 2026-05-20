import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Keyboard, Building2, BarChart, Receipt, ScrollText, Settings, LogOut } from 'lucide-react';

const PlatformAdminLayout: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#094A71] text-white flex flex-col h-full flex-shrink-0 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-secondary rounded-lg p-2 flex items-center justify-center text-white">
                                <Keyboard className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Typespire</h1>
                                <p className="text-xs text-secondary uppercase tracking-widest font-bold">Super Admin</p>
                            </div>
                        </div>
                        <button
                            className="lg:hidden text-white/60 hover:text-white"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <nav className="space-y-1">
                        <Link 
                            to="/super-admin" 
                            onClick={() => setIsSidebarOpen(false)} 
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 group ${isActive('/super-admin')
                                ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                                : 'text-white/90 hover:text-[#33B974] hover:bg-white/10 border-transparent hover:border-[#33B974]'
                                }`}
                        >
                            <Building2 className={`w-5 h-5 transition-colors ${isActive('/super-admin') ? 'text-[#33B974]' : 'text-white/70 group-hover:text-[#33B974]'}`} />
                            <span className="font-medium text-sm">Institutions</span>
                        </Link>
                        <Link 
                            to="/super-admin/analytics" 
                            onClick={() => setIsSidebarOpen(false)} 
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 group ${isActive('/super-admin/analytics')
                                ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                                : 'text-white/90 hover:text-[#33B974] hover:bg-white/10 border-transparent hover:border-[#33B974]'
                                }`}
                        >
                            <BarChart className={`w-5 h-5 transition-colors ${isActive('/super-admin/analytics') ? 'text-[#33B974]' : 'text-white/70 group-hover:text-[#33B974]'}`} />
                            <span className="font-medium text-sm">Global Analytics</span>
                        </Link>
                        <Link 
                            to="/super-admin/billing" 
                            onClick={() => setIsSidebarOpen(false)} 
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 group ${isActive('/super-admin/billing')
                                ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                                : 'text-white/90 hover:text-[#33B974] hover:bg-white/10 border-transparent hover:border-[#33B974]'
                                }`}
                        >
                            <Receipt className={`w-5 h-5 transition-colors ${isActive('/super-admin/billing') ? 'text-[#33B974]' : 'text-white/70 group-hover:text-[#33B974]'}`} />
                            <span className="font-medium text-sm">Billing & Plans</span>
                        </Link>
                        <Link 
                            to="/super-admin/logs" 
                            onClick={() => setIsSidebarOpen(false)} 
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 group ${isActive('/super-admin/logs')
                                ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                                : 'text-white/90 hover:text-[#33B974] hover:bg-white/10 border-transparent hover:border-[#33B974]'
                                }`}
                        >
                            <ScrollText className={`w-5 h-5 transition-colors ${isActive('/super-admin/logs') ? 'text-[#33B974]' : 'text-white/70 group-hover:text-[#33B974]'}`} />
                            <span className="font-medium text-sm">System Logs</span>
                        </Link>
                        <Link 
                            to="/super-admin/settings" 
                            onClick={() => setIsSidebarOpen(false)} 
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 group ${isActive('/super-admin/settings')
                                ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                                : 'text-white/90 hover:text-[#33B974] hover:bg-white/10 border-transparent hover:border-[#33B974]'
                                }`}
                        >
                            <Settings className={`w-5 h-5 transition-colors ${isActive('/super-admin/settings') ? 'text-[#33B974]' : 'text-white/70 group-hover:text-[#33B974]'}`} />
                            <span className="font-medium text-sm">Platform Settings</span>
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4 space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hidden lg:block">
                        <p className="text-xs text-white/60 mb-1.5 uppercase font-bold tracking-wider">Server Load</p>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-secondary h-full w-[42%]"></div>
                        </div>
                        <p className="text-[10px] text-white/60 mt-1.5 font-bold uppercase tracking-wider">Running optimally</p>
                    </div>
                    <div className="flex items-center gap-3 p-2">
                        <div className="size-10 rounded-full bg-secondary/20 border border-white/10 flex items-center justify-center text-secondary font-bold">
                            {user?.firstName?.[0] || 'P'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate text-white">
                                {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Platform Admin'}
                            </p>
                            <p className="text-xs text-white/60 truncate">{user?.email || 'Loading...'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
                {/* Mobile Header Toggle */}
                <div className="lg:hidden p-4 bg-white dark:bg-[#094A71] border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="font-bold text-lg text-slate-900 dark:text-white font-heading">Typespire Super Admin</span>
                </div>
                <div className="w-full flex-1 py-8 px-6 sm:px-8 md:px-10 lg:px-12 flex flex-col items-center">
                    <div className="max-w-[1280px] w-full flex flex-col gap-6">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PlatformAdminLayout;
