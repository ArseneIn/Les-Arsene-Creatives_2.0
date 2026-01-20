import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('akwos_admin_token');
        if (!token) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('akwos_admin_token');
        navigate('/admin');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Overview' },
        { path: '/admin/resources', icon: 'folder_open', label: 'Resource Manager' },
        { path: '/admin/news', icon: 'newspaper', label: 'News & Updates' },
        { path: '/admin/partners', icon: 'handshake', label: 'Partners' },
        { path: '/admin/settings', icon: 'settings', label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-display">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                    <img src="/images/logo-transparent.png" className="h-8 w-auto" alt="Logo" />
                    <span className="font-bold text-gray-800 dark:text-white">CMS Portal</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
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
            <main className="flex-1 overflow-auto">
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-8">
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Admin User</span>
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                            AD
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
