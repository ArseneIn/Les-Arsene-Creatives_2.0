import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const StudentLayout: React.FC = () => {
    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-full border-r border-[#323b67] bg-[#111422] flex-shrink-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary rounded-lg p-2 flex items-center justify-center text-[#111422]">
                        <span className="material-symbols-outlined icon-filled">school</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold leading-none tracking-tight text-white">Typespire</h1>
                        <span className="text-xs text-primary font-medium opacity-80">Student Portal</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border-l-4 border-primary transition-all">
                        <span className="material-symbols-outlined icon-filled">dashboard</span>
                        <p className="text-sm font-medium leading-normal">Dashboard</p>
                    </Link>
                    <Link to="/practice" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#929bc9] hover:bg-white/5 hover:text-white transition-colors duration-200 border-l-4 border-transparent">
                        <span className="material-symbols-outlined">keyboard</span>
                        <p className="text-sm font-medium leading-normal">Practice</p>
                    </Link>
                    <Link to="/history" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#929bc9] hover:bg-white/5 hover:text-white transition-colors duration-200 border-l-4 border-transparent">
                        <span className="material-symbols-outlined">history</span>
                        <p className="text-sm font-medium leading-normal">History</p>
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#929bc9] hover:bg-white/5 hover:text-white transition-colors duration-200 border-l-4 border-transparent">
                        <span className="material-symbols-outlined">settings</span>
                        <p className="text-sm font-medium leading-normal">Settings</p>
                    </Link>
                </nav>

                {/* Bottom Profile Section */}
                <div className="p-4 border-t border-[#323b67]">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border border-[#323b67]"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZkSKXQ6p812ruveY9CRkth1Agia_3BUKkC-yHBsap_klO7GEdemi-i7lElNzWx8RKRq_brGQsPYwJZTpaOZ2zhwlIhVIRXzp7N-NWIBz5Ukw3XvQxhQ3Yf9zSMff9tGUBACp6xmgJrAEUXppWAVq_pjIDFBkK1uLzkVareMHQfzO9vYDOoODHGLZnMfwax9VMiTWjiKq-31_pru2xSPlXMZ-Ss-jZ3TOlJIqdo7L5-pWgsnwAcBja8Bq0ZcBzNQI4iebNB1BoWVok")' }}
                        ></div>
                        <div className="flex flex-col">
                            <h1 className="text-white text-sm font-bold leading-normal tracking-wide">Alex Rivera</h1>
                            <p className="text-[#929bc9] text-xs font-normal">Student ID: 48291</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10">
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
                <Outlet />
            </main>
        </div>
    );
};

export default StudentLayout;
