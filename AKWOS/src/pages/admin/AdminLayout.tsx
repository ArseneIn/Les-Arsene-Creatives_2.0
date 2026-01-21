import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const token = localStorage.getItem('akwos_admin_token');

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate, token]);

    // Prevent flashing of protected content
    if (!token) return null;

    const handleLogout = () => {
        localStorage.removeItem('akwos_admin_token');
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Overview' },
        { path: '/admin/resources', icon: 'folder_open', label: 'Resource Manager' },
        { path: '/admin/news', icon: 'newspaper', label: 'News & Updates' },
        { path: '/admin/partners', icon: 'handshake', label: 'Partners' },
        { path: '/admin/team', icon: 'groups', label: 'Team & Leadership' },
        { path: '/admin/stories', icon: 'stars', label: 'Impact Stories' }, // Added Stories link
        { path: '/admin/settings', icon: 'settings', label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-display relative">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 md:relative md:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={`${import.meta.env.BASE_URL}images/logo-transparent.png`} className="h-8 w-auto" alt="Logo" />
                        <span className="font-bold text-gray-800 dark:text-white">CMS Portal</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)} // Close on mobile navigation
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-primary'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col h-screen">
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="font-bold text-lg text-gray-800 dark:text-white truncate">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:inline">Admin User</span>
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-gray-800">
                            AD
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
