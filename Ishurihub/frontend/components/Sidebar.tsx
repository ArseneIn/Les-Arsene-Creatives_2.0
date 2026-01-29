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

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside className="flex w-72 flex-col bg-gradient-to-b from-primary-900 to-primary-950 h-full shadow-2xl z-20 transition-all flex-shrink-0 relative overflow-hidden">
            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none"></div>

            {/* Header / Logo */}
            <div className="relative flex items-center gap-3 px-6 py-8 z-10">
                <div className="flex items-center justify-center bg-white/10 rounded-xl size-10 shadow-inner ring-1 ring-white/20 backdrop-blur-md">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>school</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-lg font-heading font-bold leading-tight tracking-tight">IshuriHub</h1>
                    <p className="text-primary-200 text-xs font-medium uppercase tracking-wider">Admin Portal</p>
                </div>
            </div>

            {/* Scrollable Navigation */}
            <div className="relative flex-1 overflow-y-auto px-4 py-2 custom-scrollbar z-10">
                <nav className="flex flex-col gap-1.5">
                    {sidebarItems.map((item, index) => {
                        // Check main item permission
                        if (item.permission && !hasPermission(item.permission)) return null;

                        // Handle Sub-items (Accordion)
                        if (item.subItems) {
                            // Filter visible sub-items
                            const visibleSubItems = item.subItems.filter(sub => !sub.permission || hasPermission(sub.permission));
                            if (visibleSubItems.length === 0) return null;

                            return (
                                <details key={index} className="group/accordion rounded-lg open:bg-white/5 transition-colors">
                                    <summary className="flex cursor-pointer items-center justify-between gap-2 px-3 py-3 rounded-lg text-primary-100 hover:bg-white/10 hover:text-white transition-all list-none outline-none">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{item.icon}</span>
                                            <span className="text-sm font-medium leading-normal">{item.label}</span>
                                        </div>
                                        <span className="material-symbols-outlined transition-transform duration-200 group-open/accordion:rotate-180" style={{ fontSize: '20px' }}>expand_more</span>
                                    </summary>
                                    <div className="flex flex-col gap-1 pl-11 pr-2 pb-2 mt-1">
                                        {visibleSubItems.map((subItem, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                href={subItem.href}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(subItem.href)
                                                        ? "text-white bg-white/10"
                                                        : "text-primary-200 hover:text-white hover:bg-white/10"
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
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive(item.href)
                                        ? "bg-white/10 text-white shadow-lg shadow-black/5 ring-1 ring-white/20 backdrop-blur-md"
                                        : "text-primary-100 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{item.icon}</span>
                                <span className="text-sm font-medium leading-normal">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="relative p-4 border-t border-white/10 bg-primary-950/50 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.2)] z-10">
                {/* Profile Card */}
                {user && (
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group/profile">
                        <div className="relative">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white/20"
                                style={{ backgroundImage: `url('${user.avatarUrl}')` }}
                            >
                            </div>
                            <div className="absolute bottom-0 right-0 size-3 bg-green-400 rounded-full border-2 border-primary-900"></div>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <p className="text-white text-sm font-semibold truncate group-hover/profile:text-white transition-colors">{user.name}</p>
                            <p className="text-primary-200 text-xs truncate">{user.role?.name || 'User'}</p>
                        </div>
                        <button onClick={logout} className="text-primary-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
