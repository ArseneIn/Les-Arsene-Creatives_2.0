import Link from 'next/link';

export default function SuperAdminSidebar() {
    return (
        <aside className="flex w-72 flex-col bg-gradient-to-b from-slate-900 to-slate-950 h-full shadow-2xl z-20 transition-all flex-shrink-0 relative overflow-hidden">
            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none"></div>

            {/* Header / Logo */}
            <div className="relative flex items-center gap-3 px-6 py-8 z-10">
                <div className="flex items-center justify-center bg-white/10 rounded-xl size-10 shadow-inner ring-1 ring-white/20 backdrop-blur-md">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>admin_panel_settings</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-lg font-heading font-bold leading-tight tracking-tight">IshuriHub</h1>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Super Admin</p>
                </div>
            </div>

            {/* Scrollable Navigation */}
            <div className="relative flex-1 overflow-y-auto px-4 py-2 custom-scrollbar z-10">
                <nav className="flex flex-col gap-1.5">
                    {/* Overview */}
                    <Link href="/system" className="group flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>dashboard</span>
                        <span className="text-sm font-medium leading-normal">Overview</span>
                    </Link>

                    {/* Schools */}
                    <Link href="/system/dashboard" className="group flex items-center gap-3 px-3 py-3 rounded-lg bg-white/10 text-white shadow-lg shadow-black/5 ring-1 ring-white/20 backdrop-blur-md transition-all hover:bg-white/20">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>domain</span>
                        <span className="text-sm font-medium leading-normal">Institutions</span>
                    </Link>

                    {/* Users */}
                    <Link href="/system/users" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>group</span>
                        <span className="text-sm font-medium leading-normal">Users</span>
                    </Link>

                    {/* Finance */}
                    <Link href="/system/finance" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>payments</span>
                        <span className="text-sm font-medium leading-normal">Finance</span>
                    </Link>

                    {/* Support */}
                    <Link href="/system/support" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>support_agent</span>
                        <span className="text-sm font-medium leading-normal">Support</span>
                    </Link>

                    {/* Reports */}
                    <Link href="/system/reports" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>analytics</span>
                        <span className="text-sm font-medium leading-normal">Reports</span>
                    </Link>

                    {/* Settings */}
                    <Link href="/system/settings" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>settings</span>
                        <span className="text-sm font-medium leading-normal">Settings</span>
                    </Link>
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="relative p-4 border-t border-white/10 bg-slate-950/50 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.2)] z-10">
                {/* Profile Card */}
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group/profile">
                    <div className="relative">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white/20" data-alt="Portrait of super admin" style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Super+Admin&background=random")' }}>
                        </div>
                        <div className="absolute bottom-0 right-0 size-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
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
