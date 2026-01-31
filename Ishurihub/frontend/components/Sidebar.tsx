"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { Permission } from '@/data/rbac';

interface SidebarProps {
    schoolId: string;
}

interface SidebarItem {
    label: string;
    icon: string;
    href: string;
    permission?: Permission;
    subItems?: SidebarItem[];
}

export default function Sidebar({ schoolId }: SidebarProps) {
    const baseUrl = `/school/${schoolId}`;
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { hasPermission } = usePermission();

    const sidebarItems: SidebarItem[] = [
        {
            label: 'Dashboard',
            icon: 'dashboard',
            href: `${baseUrl}/dashboard`
        },
        {
            label: 'Academic Admin',
            icon: 'school',
            href: '#',
            permission: 'academic.view_grades', // Base permission to see the group
            subItems: [
                { label: 'Timetable', icon: 'calendar_month', href: `${baseUrl}/timetable`, permission: 'academic.manage_timetable' },
                { label: 'Teachers', icon: 'person_apron', href: `${baseUrl}/teachers`, permission: 'academic.manage_timetable' },
                { label: 'Students', icon: 'groups', href: `${baseUrl}/students`, permission: 'student.view' },
            ]
        },
        {
            label: 'Attendance Scan',
            icon: 'co_present',
            href: `${baseUrl}/attendance`,
            permission: 'student.edit' // Proxy for staff access
        },
        {
            label: 'Discipline',
            icon: 'gavel',
            href: `${baseUrl}/discipline`,
            permission: 'discipline.view'
        },
        {
            label: 'Finance',
            icon: 'payments',
            href: `${baseUrl}/finance`,
            permission: 'finance.view'
        },
        {
            label: 'Library',
            icon: 'local_library',
            href: `${baseUrl}/library`,
            permission: 'library.view'
        },
        {
            label: 'System & Compliance',
            icon: 'verified_user',
            href: `${baseUrl}/system`,
            permission: 'system.view_logs'
        }
    ];

    const isActive = (href: string) => {
        if (href === '#' || href === baseUrl) return false;
        return pathname === href || pathname.startsWith(href + '/');
    };

    const isGroupActive = (item: SidebarItem) => {
        if (!item.subItems) return false;
        return item.subItems.some(sub => isActive(sub.href));
    };

    return (
        <aside className="flex w-72 flex-col bg-[#1e293b] dark:bg-[#0f172a] h-full shadow-xl z-20 transition-all flex-shrink-0 relative overflow-hidden border-r border-gray-800">
            {/* Header / Logo */}
            <div className="relative flex items-center gap-3 px-6 py-8 z-10 border-b border-gray-800">
                <div className="flex items-center justify-center bg-primary rounded-xl size-10 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>school</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-lg font-heading font-bold leading-tight tracking-tight">IshuriHub</h1>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Admin Portal</p>
                </div>
            </div>

            {/* Scrollable Navigation */}
            <div className="relative flex-1 overflow-y-auto px-4 py-6 custom-scrollbar z-10 space-y-1">
                <nav className="flex flex-col gap-1">
                    {sidebarItems.map((item, index) => {
                        if (item.permission && !hasPermission(item.permission)) return null;

                        // Handle Sub-items (Accordion)
                        if (item.subItems) {
                            const visibleSubItems = item.subItems.filter(sub => !sub.permission || hasPermission(sub.permission));
                            if (visibleSubItems.length === 0) return null;
                            const isOpen = isGroupActive(item);

                            return (
                                <details key={index} className="group/accordion rounded-lg" open={isOpen}>
                                    <summary className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-3 rounded-lg transition-all list-none outline-none ${isOpen ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{item.icon}</span>
                                            <span className="text-sm font-medium leading-normal">{item.label}</span>
                                        </div>
                                        <span className="material-symbols-outlined transition-transform duration-200 group-open/accordion:rotate-180 text-gray-500" style={{ fontSize: '20px' }}>expand_more</span>
                                    </summary>
                                    <div className="flex flex-col gap-1 pl-4 pr-2 pb-2 mt-1 border-l-2 border-gray-700 ml-5">
                                        {visibleSubItems.map((subItem, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                href={subItem.href}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(subItem.href)
                                                    ? "text-primary bg-primary/10"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{subItem.icon}</span>
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                </details>
                            );
                        }

                        // Handle Standard Link
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${active
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{item.icon}</span>
                                <span className="text-sm font-medium leading-normal">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="relative p-4 border-t border-gray-800 bg-[#151e2d] z-10">
                {user && (
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group/profile">
                        <div className="relative">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-gray-700 group-hover/profile:ring-gray-600"
                                style={{ backgroundImage: `url('${user.avatarUrl}')` }}
                            >
                            </div>
                            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#151e2d]"></div>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-gray-400 text-xs truncate">{user.role?.name || 'User'}</p>
                        </div>
                        <button onClick={logout} className="text-gray-400 hover:text-red-400 p-1.5 rounded-md hover:bg-white/5 transition-colors" title="Logout">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
