import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FacilitatorLayout: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
                fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-[#323b67] bg-[#111422] text-white flex flex-col h-full flex-shrink-0 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary rounded-lg p-2 flex items-center justify-center text-[#111422]">
                                <span className="material-symbols-outlined text-2xl flex items-center justify-center">keyboard</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Typespire</h1>
                                <p className="text-xs text-primary uppercase tracking-widest font-bold">Facilitator</p>
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
                            to="/facilitator"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 ${isActive('/facilitator')
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'text-[#929bc9] hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="font-medium text-sm">Dashboard</span>
                        </Link>
                        <Link
                            to="/facilitator/launch"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 ${isActive('/facilitator/launch')
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'text-[#929bc9] hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            <span className="font-medium text-sm">New Assignment</span>
                        </Link>
                        <Link
                            to="/facilitator/classes"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 ${isActive('/facilitator/classes')
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'text-[#929bc9] hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">class</span>
                            <span className="font-medium text-sm">Classes</span>
                        </Link>
                        <Link
                            to="/facilitator/analytics"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 ${isActive('/facilitator/analytics')
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'text-[#929bc9] hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">analytics</span>
                            <span className="font-medium text-sm">Analytics</span>
                        </Link>
                        <Link
                            to="/facilitator/reports"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 ${isActive('/facilitator/reports')
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'text-[#929bc9] hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">bar_chart</span>
                            <span className="font-medium text-sm">Reports</span>
                        </Link>
                        <Link
                            to="/facilitator/settings"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-4 ${isActive('/facilitator/settings')
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'text-[#929bc9] hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">settings</span>
                            <span className="font-medium text-sm">Settings</span>
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t border-[#323b67] space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="h-10 w-10 rounded-full bg-center bg-cover border border-[#323b67]"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZCPCBTEZvawC1kZVLNd1i-KNLUNPPxyvHaT4pgKQ8rnu3RJz1TYy7La2rXxBstTpvR1K10TjemKic-tFtSgkmdkv-mYTXei4lidFc78RfbAIllFDPN3BBeqy-r-dWxrR9ZRncf7_z-GwgcPfvvcndGcXup395kUgLv1nQVoCHvJOUDEvhyhmkV8I11mBsxejwKEPNhr5pkiM7z7TGVTq3DaJ7lCqmO4kUOoUvd3N2Qc1rMsm2P7IkcDu7N4mtBzJ-ZBO-ylxu5scc')" }}
                        ></div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate text-white">
                                {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Facilitator'}
                            </p>
                            <p className="text-xs text-[#929bc9] truncate">{user?.email || 'Loading...'}</p>
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
                <div className="lg:hidden p-4 bg-white dark:bg-[#111422] border-b border-gray-200 dark:border-[#323b67] flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="font-bold text-lg text-slate-900 dark:text-white font-heading">Typespire Facilitator</span>
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

export default FacilitatorLayout;
