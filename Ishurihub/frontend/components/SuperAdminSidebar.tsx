import Link from 'next/link';

export default function SuperAdminSidebar() {
    return (
        <aside className="flex w-72 flex-col bg-[#1e293b] h-full shadow-xl z-20 transition-all flex-shrink-0">
            {/* Header / Logo */}
            <div className="flex items-center gap-3 px-6 py-8">
                <div className="flex items-center justify-center bg-white/10 rounded-xl size-10 shadow-inner ring-1 ring-white/20">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>admin_panel_settings</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-lg font-bold leading-tight tracking-tight">IshuriHub</h1>
                    <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Super Admin</p>
                </div>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                <nav className="flex flex-col gap-1.5">
                    {/* Dashboard (Active State) */}
                    <Link href="/" className="group flex items-center gap-3 px-3 py-3 rounded-lg bg-white/20 text-white shadow-sm ring-1 ring-white/10 transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>domain</span>
                        <span className="text-sm font-medium leading-normal">Institutions</span>
                    </Link>

                    {/* Analytics */}
                    <Link href="/analytics" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>analytics</span>
                        <span className="text-sm font-medium leading-normal">Global Analytics</span>
                    </Link>

                    {/* Settings */}
                    <Link href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>settings</span>
                        <span className="text-sm font-medium leading-normal">Platform Settings</span>
                    </Link>
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-[#0f172a] shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]">
                {/* Profile Card */}
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group/profile">
                    <div className="relative">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white/20" data-alt="Portrait of super admin" style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Super+Admin&background=random")' }}>
                        </div>
                        <div className="absolute bottom-0 right-0 size-3 bg-green-400 rounded-full border-2 border-[#1e293b]"></div>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold truncate group-hover/profile:text-white transition-colors">Les Arsene</p>
                        <p className="text-slate-400 text-xs truncate">Platform Owner</p>
                    </div>
                    <Link href="/login" className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
