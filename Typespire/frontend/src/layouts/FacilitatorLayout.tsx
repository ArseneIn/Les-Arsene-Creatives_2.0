import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const FacilitatorLayout: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-facilitator-bg-dark text-[#0d1b17] h-screen overflow-hidden flex flex-col md:flex-row font-display">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-facilitator-bg-dark text-white flex flex-col h-auto md:h-full flex-shrink-0 transition-all duration-300">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-facilitator-primary rounded-lg p-2 flex items-center justify-center text-facilitator-bg-dark">
                        <span className="material-symbols-outlined icon-filled">keyboard</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold leading-none tracking-tight">Typespire</h1>
                        <span className="text-xs text-facilitator-primary font-medium opacity-80">Instructor Portal</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
                    <Link to="/facilitator" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-facilitator-primary/10 text-facilitator-primary border-l-4 border-facilitator-primary transition-all">
                        <span className="material-symbols-outlined icon-filled">dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    <Link to="/facilitator/launch" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                        <span className="material-symbols-outlined">add_circle</span>
                        <span className="text-sm font-medium">New Assignment</span>
                    </Link>
                    <Link to="/facilitator/classes" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                        <span className="material-symbols-outlined">class</span>
                        <span className="text-sm font-medium">Classes</span>
                    </Link>
                    <Link to="/facilitator/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                        <span className="material-symbols-outlined">bar_chart</span>
                        <span className="text-sm font-medium">Reports</span>
                    </Link>
                    <Link to="/facilitator/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="bg-gray-700 rounded-full w-10 h-10 bg-cover bg-center"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZCPCBTEZvawC1kZVLNd1i-KNLUNPPxyvHaT4pgKQ8rnu3RJz1TYy7La2rXxBstTpvR1K10TjemKic-tFtSgkmdkv-mYTXei4lidFc78RfbAIllFDPN3BBeqy-r-dWxrR9ZRncf7_z-GwgcPfvvcndGcXup395kUgLv1nQVoCHvJOUDEvhyhmkV8I11mBsxejwKEPNhr5pkiM7z7TGVTq3DaJ7lCqmO4kUOoUvd3N2Qc1rMsm2P7IkcDu7N4mtBzJ-ZBO-ylxu5scc')" }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">Prof. A. Kepler</p>
                            <p className="text-xs text-gray-400 truncate">Senior Facilitator</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10">
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fcfa]">
                <Outlet />
            </main>
        </div>
    );
};

export default FacilitatorLayout;
