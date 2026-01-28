import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside className="flex w-72 flex-col bg-primary h-full shadow-xl z-20 transition-all flex-shrink-0">
            {/* Header / Logo */}
            <div className="flex items-center gap-3 px-6 py-8">
                <div className="flex items-center justify-center bg-white/10 rounded-xl size-10 shadow-inner ring-1 ring-white/20">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>school</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-lg font-bold leading-tight tracking-tight">IshuriHub</h1>
                    <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Admin Portal</p>
                </div>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                <nav className="flex flex-col gap-1.5">
                    {/* Dashboard (Active State) */}
                    <Link href="/school-dashboard" className="group flex items-center gap-3 px-3 py-3 rounded-lg bg-white/20 text-white shadow-sm ring-1 ring-white/10 transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>dashboard</span>
                        <span className="text-sm font-medium leading-normal">Dashboard</span>
                    </Link>

                    {/* Academic Admin (Accordion) */}
                    <details className="group/accordion rounded-lg open:bg-white/5 transition-colors">
                        <summary className="flex cursor-pointer items-center justify-between gap-2 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-all list-none outline-none">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>school</span>
                                <span className="text-sm font-medium leading-normal">Academic Admin</span>
                            </div>
                            <span className="material-symbols-outlined transition-transform duration-200 group-open/accordion:rotate-180" style={{ fontSize: '20px' }}>expand_more</span>
                        </summary>
                        <div className="flex flex-col gap-1 pl-11 pr-2 pb-2 mt-1">
                            <Link href="/school-dashboard/timetable" className="flex items-center gap-2 px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
                                Timetable
                            </Link>
                            <Link href="/school-dashboard/teachers" className="flex items-center gap-2 px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_apron</span>
                                Teachers
                            </Link>
                            <Link href="/school-dashboard/students" className="flex items-center gap-2 px-3 py-2 rounded-md text-blue-200 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>groups</span>
                                Students
                            </Link>
                        </div>
                    </details>

                    {/* Attendance (New) */}
                    <Link href="/attendance" className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>co_present</span>
                        <span className="text-sm font-medium leading-normal">Attendance Scan</span>
                    </Link>

                    {/* Finance */}
                    <Link href="/school-dashboard/finance" className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>payments</span>
                        <span className="text-sm font-medium leading-normal">Finance</span>
                    </Link>

                    {/* Library */}
                    <Link href="/school-dashboard/library" className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>local_library</span>
                        <span className="text-sm font-medium leading-normal">Library</span>
                    </Link>

                    {/* System & Compliance */}
                    <Link href="/school-dashboard/system" className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>verified_user</span>
                        <span className="text-sm font-medium leading-normal">System & Compliance</span>
                    </Link>
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-primary shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]">
                {/* Role Switcher */}
                <div className="mb-4">
                    <label className="block text-blue-200 text-xs font-medium mb-1.5 ml-1">View as</label>
                    <div className="relative group/select">
                        <select className="appearance-none w-full bg-white/10 border border-white/20 text-white rounded-lg py-2.5 pl-10 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer hover:bg-white/20 transition-colors">
                            <option className="bg-white text-gray-900" value="admin">Administrator</option>
                            <option className="bg-white text-gray-900" value="teacher">Teacher</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-blue-200">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>swap_horiz</span>
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-blue-200">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>expand_more</span>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group/profile">
                    <div className="relative">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white/20" data-alt="Portrait of a professional administrator" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQTrshfoao6N8RNmZVE7lHNteQnY7pRT4LRBqaKjQnWdKkF5SuE06QA_fnSmZLh3fK6FuGAOnKgtULyFTNRGoa0ZQpLxq5v8IaVnSWRq7tmVv4ubEf91lilIfXLzJ6iqA92_zd3PoJtxiIvfTFuZd8wj8tk9xsK9SS9fXreqNRpOrNkfD95_F8R-q7dZb7Ra5dup40BMvJB7ON6hZd0hX6sLuaSK0w2QSxhGbZJVDF2243nkNMhqlUldRAcY24_FRCbdDtptzLanI5")' }}>
                        </div>
                        <div className="absolute bottom-0 right-0 size-3 bg-green-400 rounded-full border-2 border-primary"></div>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold truncate group-hover/profile:text-white transition-colors">Jane Doe</p>
                        <p className="text-blue-200 text-xs truncate">Super Admin</p>
                    </div>
                    <Link href="/login" className="text-blue-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
