import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Typespire</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/" className="block py-2 px-4 rounded hover:bg-white/10 transition-colors">
                        Dashboard
                    </Link>
                    <Link to="/practice" className="block py-2 px-4 rounded hover:bg-white/10 transition-colors">
                        Practice
                    </Link>
                    <Link to="/history" className="block py-2 px-4 rounded hover:bg-white/10 transition-colors">
                        History
                    </Link>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <span className="font-bold">S</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Student</p>
                            <p className="text-xs text-gray-300">Kepler College</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-600 transition-colors">
                            Start Test
                        </button>
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
