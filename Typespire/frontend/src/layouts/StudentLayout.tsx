import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TypingLoader from '../components/common/TypingLoader';

const StudentLayout: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsNavigating(true);
        const timer = setTimeout(() => setIsNavigating(false), 1500); //show loader for 1.5s
        return () => clearTimeout(timer);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 h-full border-r border-white/10 bg-[#094A71] flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-20' : 'w-64'}
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary rounded-lg p-2 flex items-center justify-center text-white shrink-0">
                            <span className="material-symbols-outlined icon-filled text-xl">school</span>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col transition-opacity duration-300">
                                <h1 className="text-lg font-bold leading-none tracking-tight text-white">Typespire</h1>
                                <span className="text-xs text-secondary font-medium opacity-90">Student Portal</span>
                            </div>
                        )}
                    </div>
                    <button
                        className="md:hidden text-white/60 hover:text-white absolute top-6 right-4"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="relative">
                    {/* Collapse Toggle Button (Desktop only) */}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex absolute -right-[14px] top-4 bg-[#094A71] border border-white/10 rounded-full p-1 text-white hover:text-secondary z-50 shadow-md items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-sm">{isCollapsed ? 'chevron_right' : 'chevron_left'}</span>
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
                    <Link
                        to="/"
                        onClick={() => setIsSidebarOpen(false)}
                        title={isCollapsed ? "Dashboard" : undefined}
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg border-l-4 group transition-all duration-200 ${isActive('/')
                            ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                            : 'text-white/90 hover:bg-white/10 hover:text-[#33B974] border-transparent hover:border-[#33B974]'
                            }`}
                    >
                        <span className={`material-symbols-outlined shrink-0 transition-colors ${isActive('/') ? 'text-[#33B974] icon-filled' : 'text-white/70 group-hover:text-[#33B974]'}`}>dashboard</span>
                        {!isCollapsed && <p className="text-sm font-medium leading-normal truncate">Dashboard</p>}
                    </Link>
                    <Link
                        to="/practice"
                        onClick={() => setIsSidebarOpen(false)}
                        title={isCollapsed ? "Practice" : undefined}
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg border-l-4 group transition-all duration-200 ${isActive('/practice')
                            ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                            : 'text-white/90 hover:bg-white/10 hover:text-[#33B974] border-transparent hover:border-[#33B974]'
                            }`}
                    >
                        <span className={`material-symbols-outlined shrink-0 transition-colors ${isActive('/practice') ? 'text-[#33B974] icon-filled' : 'text-white/70 group-hover:text-[#33B974]'}`}>keyboard</span>
                        {!isCollapsed && <p className="text-sm font-medium leading-normal truncate">Practice</p>}
                    </Link>
                    <Link
                        to="/tests"
                        onClick={() => setIsSidebarOpen(false)}
                        title={isCollapsed ? "Tests" : undefined}
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg border-l-4 group transition-all duration-200 ${isActive('/tests')
                            ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                            : 'text-white/90 hover:bg-white/10 hover:text-[#33B974] border-transparent hover:border-[#33B974]'
                            }`}
                    >
                        <span className={`material-symbols-outlined shrink-0 transition-colors ${isActive('/tests') ? 'text-[#33B974] icon-filled' : 'text-white/70 group-hover:text-[#33B974]'}`}>quiz</span>
                        {!isCollapsed && <p className="text-sm font-medium leading-normal truncate">Tests</p>}
                    </Link>
                    <Link
                        to="/history"
                        onClick={() => setIsSidebarOpen(false)}
                        title={isCollapsed ? "History" : undefined}
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg border-l-4 group transition-all duration-200 ${isActive('/history')
                            ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                            : 'text-white/90 hover:bg-white/10 hover:text-[#33B974] border-transparent hover:border-[#33B974]'
                            }`}
                    >
                        <span className={`material-symbols-outlined shrink-0 transition-colors ${isActive('/history') ? 'text-[#33B974] icon-filled' : 'text-white/70 group-hover:text-[#33B974]'}`}>history</span>
                        {!isCollapsed && <p className="text-sm font-medium leading-normal truncate">History</p>}
                    </Link>
                    <Link
                        to="/results"
                        onClick={() => setIsSidebarOpen(false)}
                        title={isCollapsed ? "Results" : undefined}
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg border-l-4 group transition-all duration-200 ${isActive('/results')
                            ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                            : 'text-white/90 hover:bg-white/10 hover:text-[#33B974] border-transparent hover:border-[#33B974]'
                            }`}
                    >
                        <span className={`material-symbols-outlined shrink-0 transition-colors ${isActive('/results') ? 'text-[#33B974] icon-filled' : 'text-white/70 group-hover:text-[#33B974]'}`}>emoji_events</span>
                        {!isCollapsed && <p className="text-sm font-medium leading-normal truncate">Results</p>}
                    </Link>
                </nav>

                {/* Bottom Profile Section */}
                <div className={`p-4 border-t border-white/10 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-4`}>
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 shrink-0 border border-white/10"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZkSKXQ6p812ruveY9CRkth1Agia_3BUKkC-yHBsap_klO7GEdemi-i7lElNzWx8RKRq_brGQsPYwJZTpaOZ2zhwlIhVIRXzp7N-NWIBz5Ukw3XvQxhQ3Yf9zSMff9tGUBACp6xmgJrAEUXppWAVq_pjIDFBkK1uLzkVareMHQfzO9vYDOoODHGLZnMfwax9VMiTWjiKq-31_pru2xSPlXMZ-Ss-jZ3TOlJIqdo7L5-pWgsnwAcBja8Bq0ZcBzNQI4iebNB1BoWVok")' }}
                        ></div>
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden transition-opacity duration-300">
                                <h1 className="text-white text-sm font-bold leading-normal tracking-wide truncate">
                                    {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Student'}
                                </h1>
                                <p className="text-white/60 text-xs font-normal truncate">{user?.email || 'Loading...'}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        title={isCollapsed ? "Log Out" : undefined}
                        className={`w-full flex items-center justify-center ${isCollapsed ? 'px-0 py-2' : 'gap-2 h-10 px-4'} rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10`}
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        {!isCollapsed && <span>Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
                {/* Mobile Header Toggle */}
                <div className="md:hidden p-4 bg-white dark:bg-[#094A71] border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">Typespire Student</span>
                </div>
                {isNavigating ? (
                    <div className="flex-1 flex items-center justify-center">
                        <TypingLoader />
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

export default StudentLayout;
