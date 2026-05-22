import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TypingLoader from '../components/common/TypingLoader';

const StudentLayout: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
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
                fixed md:static inset-y-0 left-0 z-50 w-64 h-full border-r border-white/10 bg-[#094A71] flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary rounded-lg p-2 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined icon-filled text-xl">school</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold leading-none tracking-tight text-white">Typespire</h1>
                            <span className="text-xs text-secondary font-medium opacity-90">Student Portal</span>
                        </div>
                    </div>
                    <button
                        className="md:hidden text-white/60 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
                    <Link
                        to="/"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 group transition-all duration-200 ${isActive('/')
                            ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                            : 'text-white/90 hover:bg-white/10 hover:text-[#33B974] border-transparent hover:border-[#33B974]'
                            }`}
                    >
                        <span className={`material-symbols-outlined transition-colors ${isActive('/') ? 'text-[#33B974] icon-filled' : 'text-white/70 group-hover:text-[#33B974]'}`}>dashboard</span>
                        <p className="text-sm font-medium leading-normal">Dashboard</p>
                    </Link>
                    <Link
                        to="/tests"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 group transition-all duration-200 ${isActive('/tests')
                            ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                            : 'text-white/90 hover:bg-white/10 hover:text-[#33B974] border-transparent hover:border-[#33B974]'
                            }`}
                    >
                        <span className={`material-symbols-outlined transition-colors ${isActive('/tests') ? 'text-[#33B974] icon-filled' : 'text-white/70 group-hover:text-[#33B974]'}`}>quiz</span>
                        <p className="text-sm font-medium leading-normal">Tests</p>
                    </Link>
                    <Link
                        to="/practice"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 group transition-all duration-200 ${isActive('/practice')
                            ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                            : 'text-white/90 hover:bg-white/10 hover:text-[#33B974] border-transparent hover:border-[#33B974]'
                            }`}
                    >
                        <span className={`material-symbols-outlined transition-colors ${isActive('/practice') ? 'text-[#33B974] icon-filled' : 'text-white/70 group-hover:text-[#33B974]'}`}>keyboard</span>
                        <p className="text-sm font-medium leading-normal">Practice</p>
                    </Link>
                    <Link
                        to="/history"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 group transition-all duration-200 ${isActive('/history')
                            ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                            : 'text-white/90 hover:bg-white/10 hover:text-[#33B974] border-transparent hover:border-[#33B974]'
                            }`}
                    >
                        <span className={`material-symbols-outlined transition-colors ${isActive('/history') ? 'text-[#33B974] icon-filled' : 'text-white/70 group-hover:text-[#33B974]'}`}>history</span>
                        <p className="text-sm font-medium leading-normal">History</p>
                    </Link>
                    <Link
                        to="/results"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 group transition-all duration-200 ${isActive('/results')
                            ? 'bg-white/10 text-[#33B974] border-[#33B974]'
                            : 'text-white/90 hover:bg-white/10 hover:text-[#33B974] border-transparent hover:border-[#33B974]'
                            }`}
                    >
                        <span className={`material-symbols-outlined transition-colors ${isActive('/results') ? 'text-[#33B974] icon-filled' : 'text-white/70 group-hover:text-[#33B974]'}`}>emoji_events</span>
                        <p className="text-sm font-medium leading-normal">Results</p>
                    </Link>
                </nav>

                {/* Bottom Profile Section */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border border-white/10"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZkSKXQ6p812ruveY9CRkth1Agia_3BUKkC-yHBsap_klO7GEdemi-i7lElNzWx8RKRq_brGQsPYwJZTpaOZ2zhwlIhVIRXzp7N-NWIBz5Ukw3XvQxhQ3Yf9zSMff9tGUBACp6xmgJrAEUXppWAVq_pjIDFBkK1uLzkVareMHQfzO9vYDOoODHGLZnMfwax9VMiTWjiKq-31_pru2xSPlXMZ-Ss-jZ3TOlJIqdo7L5-pWgsnwAcBja8Bq0ZcBzNQI4iebNB1BoWVok")' }}
                        ></div>
                        <div className="flex flex-col">
                            <h1 className="text-white text-sm font-bold leading-normal tracking-wide">
                                {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Student'}
                            </h1>
                            <p className="text-white/60 text-xs font-normal">{user?.email || 'Loading...'}</p>
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
