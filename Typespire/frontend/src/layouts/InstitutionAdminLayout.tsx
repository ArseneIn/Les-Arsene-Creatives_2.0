import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const InstitutionAdminLayout: React.FC = () => {
    return (
        <div className="bg-[#f8fcfa] text-[#0d1b17] antialiased min-h-screen font-sans">
            {/* TopNavBar */}
            <header className="sticky top-0 z-50 w-full border-b border-[#cfe7df] bg-white/90 backdrop-blur-md">
                <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#0d1b17] rounded-lg flex items-center justify-center text-white shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">keyboard</span>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-[#0d1b17] text-lg font-bold leading-none tracking-tight">Typespire Hub</h2>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Institution Admin</span>
                            </div>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/admin" className="text-gray-600 hover:text-[#0d1b17] text-sm font-bold transition-colors">Dashboard</Link>
                            <Link to="/admin/analytics" className="text-gray-600 hover:text-[#0d1b17] text-sm font-bold transition-colors">Analytics</Link>
                            <Link to="/admin/reports" className="text-gray-600 hover:text-[#0d1b17] text-sm font-bold transition-colors">Reports</Link>
                            <Link to="/admin/support" className="text-gray-600 hover:text-[#0d1b17] text-sm font-bold transition-colors">Support</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                            <input className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-[#0d1b17]/10 focus:border-[#0d1b17] outline-none transition-all" placeholder="Search accounts..." type="text" />
                        </div>
                        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-9 h-9 border-2 border-white shadow-sm"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnqzAOeX1XfN82EJ_uOk9P6n0niJbbsId9F7JIoiwjwzt_ZyxItvopzLPVLDjKcbJDRtMCf7PuvF6HlH8By-59-Zv4BsxHFEB8cUJcYkE6qgJ9aHLG-eeeBLP5gBVAAsJWEGz3CKY-yezTEfWBIyXIP6DEaVDZg_t6d30_4-8jbbC2cjgzAk1NFTKX5weqcxYbXPJublmpVMDxI8_FPKHVLHVR36z08OrF5rLT0nADAi4KWBLPQEiwvCgGZ3KvfJeEp1MOAHnglWJy')" }}
                            ></div>
                            <div className="hidden lg:block">
                                <p className="text-xs font-bold leading-none text-[#0d1b17]">Kepler Admin</p>
                                <p className="text-[10px] text-gray-500 font-medium">Institutional Manager</p>
                            </div>
                            <button className="ml-2 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Log Out">
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1280px] mx-auto px-6 py-8">
                <Outlet />
            </main>

            <footer className="max-w-[1280px] mx-auto px-6 py-12 border-t border-[#cfe7df] mt-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-50">
                        <span className="material-symbols-outlined text-xl">keyboard</span>
                        <p className="text-sm font-bold">Typespire © 2024</p>
                    </div>
                    <div className="flex gap-8">
                        <a className="text-sm text-gray-500 hover:text-[#0d1b17] font-medium" href="#">System Status</a>
                        <a className="text-sm text-gray-500 hover:text-[#0d1b17] font-medium" href="#">Privacy Policy</a>
                        <a className="text-sm text-gray-500 hover:text-[#0d1b17] font-medium" href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default InstitutionAdminLayout;
