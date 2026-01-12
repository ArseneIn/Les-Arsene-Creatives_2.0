import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const FacilitatorLayout: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-navy-blue text-white flex flex-col h-full flex-shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-admin-primary rounded-lg p-2 flex items-center justify-center">
                            <span className="material-symbols-outlined text-navy-blue text-2xl">keyboard</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Typespire</h1>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Facilitator</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        <Link
                            to="/facilitator"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/facilitator')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                            to="/facilitator/launch"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/facilitator/launch')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            <span className="font-medium">New Assignment</span>
                        </Link>
                        <Link
                            to="/facilitator/classes"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/facilitator/classes')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">class</span>
                            <span className="font-medium">Classes</span>
                        </Link>
                        <Link
                            to="/facilitator/analytics"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/facilitator/analytics')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">analytics</span>
                            <span className="font-medium">Analytics</span>
                        </Link>
                        <Link
                            to="/facilitator/reports"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/facilitator/reports')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">bar_chart</span>
                            <span className="font-medium">Reports</span>
                        </Link>
                        <Link
                            to="/facilitator/settings"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-4 ${isActive('/facilitator/settings')
                                ? 'bg-admin-primary/10 text-admin-primary border-admin-primary'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined">settings</span>
                            <span className="font-medium">Settings</span>
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-6 space-y-4">
                    <div className="flex items-center gap-3 p-2">
                        <div
                            className="size-10 rounded-full bg-center bg-cover border-2 border-admin-primary/50"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZCPCBTEZvawC1kZVLNd1i-KNLUNPPxyvHaT4pgKQ8rnu3RJz1TYy7La2rXxBstTpvR1K10TjemKic-tFtSgkmdkv-mYTXei4lidFc78RfbAIllFDPN3BBeqy-r-dWxrR9ZRncf7_z-GwgcPfvvcndGcXup395kUgLv1nQVoCHvJOUDEvhyhmkV8I11mBsxejwKEPNhr5pkiM7z7TGVTq3DaJ7lCqmO4kUOoUvd3N2Qc1rMsm2P7IkcDu7N4mtBzJ-ZBO-ylxu5scc')" }}
                        ></div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate">Prof. A. Kepler</p>
                            <p className="text-xs text-slate-400 truncate">Senior Facilitator</p>
                        </div>
                        <button className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white">logout</button>
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

export default FacilitatorLayout;

