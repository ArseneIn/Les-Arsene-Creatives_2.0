import { Permission } from "@/data/rbac";

export interface SidebarItem {
    label: string;
    icon: string;
    href: string;
    permission?: Permission;
    subItems?: SidebarItem[];
    feature?: string;
}

const ADMIN_SIDEBAR: SidebarItem[] = [
    {
        label: 'Dashboard',
        icon: 'dashboard',
        href: '/dashboard'
    },
    {
        label: 'Academic Admin',
        icon: 'school',
        href: '#',
        permission: 'academic.view_grades',
        subItems: [
            { label: 'Classes', icon: 'meeting_room', href: '/classes', permission: 'academic.view_grades' },
            { label: 'Timetable', icon: 'calendar_month', href: '/timetable', permission: 'academic.manage_timetable', feature: 'timetable' },
            { label: 'Teachers', icon: 'person_apron', href: '/teachers', permission: 'academic.manage_timetable' },
            { label: 'Students', icon: 'groups', href: '/students', permission: 'student.view' },
        ]
    },
    {
        label: 'Attendance Scan',
        icon: 'co_present',
        href: '/attendance',
        permission: 'student.edit',
        feature: 'attendance'
    },
    {
        label: 'Events',
        icon: 'event',
        href: '/dashboard/events',
        permission: 'event.view',
        feature: 'events'
    },
    {
        label: 'Discipline',
        icon: 'gavel',
        href: '/discipline',
        permission: 'discipline.view',
        feature: 'discipline'
    },
    {
        label: 'Finance',
        icon: 'payments',
        href: '/finance',
        permission: 'finance.view',
        feature: 'finance'
    },
    {
        label: 'Library',
        icon: 'local_library',
        href: '/library',
        permission: 'library.view',
        feature: 'library'
    },
    {
        label: 'System & Compliance',
        icon: 'verified_user',
        href: '/system',
        permission: 'system.view_logs'
    }
];

const TEACHER_SIDEBAR: SidebarItem[] = [
    {
        label: 'Dashboard',
        icon: 'dashboard',
        href: '/teacher/dashboard'
    },
    {
        label: 'My Classes',
        icon: 'class',
        href: '/teacher/dashboard', // Or specific classes route if needed
    },
    {
        label: 'Events',
        icon: 'event',
        href: '/dashboard/events',
        permission: 'event.view',
        feature: 'events'
    },
    {
        label: 'Library',
        icon: 'local_library',
        href: '/library',
        permission: 'library.view',
        feature: 'library'
    }
];

const STUDENT_SIDEBAR: SidebarItem[] = [
    {
        label: 'Dashboard',
        icon: 'dashboard',
        href: '/student/dashboard'
    },
    {
        label: 'Holiday Packages',
        icon: 'local_library',
        href: '/student/dashboard', // It's on the dashboard, but we can direct them there or to a specific list
        feature: 'holiday-lms'
    },
    {
        label: 'My Grades',
        icon: 'grade',
        href: '/student/grades',
    },
    {
        label: 'Timetable',
        icon: 'calendar_month',
        href: '/student/timetable',
        feature: 'timetable'
    },
    {
        label: 'Events',
        icon: 'event',
        href: '/dashboard/events',
        feature: 'events'
    }
];

const PARENT_SIDEBAR: SidebarItem[] = [
    {
        label: 'Dashboard',
        icon: 'dashboard',
        href: '/parent/dashboard'
    },
    {
        label: 'My Children',
        icon: 'family_restroom',
        href: '/parent/children',
    },
    {
        label: 'Finance',
        icon: 'payments',
        href: '/parent/finance',
        feature: 'finance'
    },
    {
        label: 'Events',
        icon: 'event',
        href: '/dashboard/events',
        feature: 'events'
    }
];

export function getSidebarItems(roleId: string, baseUrl: string, enabledFeatures: string[] = []): SidebarItem[] {
    let items: SidebarItem[] = [];

    switch (roleId) {
        case 'teacher':
        case 'Teacher': // Handle potential casing
            items = TEACHER_SIDEBAR;
            break;
        case 'student':
        case 'Student':
            items = STUDENT_SIDEBAR;
            break;
        case 'parent':
        case 'Parent':
            items = PARENT_SIDEBAR;
            break;
        default:
            items = ADMIN_SIDEBAR;
            break;
    }

    // Filter by features OR super_admin bypass
    const filterByFeature = (item: SidebarItem) => {
        if (roleId === 'super_admin') return true;
        if (!item.feature) return true;
        return enabledFeatures.includes(item.feature);
    };

    const filteredItems = items
        .filter(filterByFeature)
        .map(item => ({
            ...item,
            subItems: item.subItems?.filter(filterByFeature)
        }))
        .filter(item => {
            // If item has subItems, but all were filtered out, should we hide it?
            // Only if it's a placeholder (href='#')
            if (item.subItems && item.subItems.length === 0 && item.href === '#') {
                return false;
            }
            return true;
        });

    // Prefix URLs with baseUrl
    return filteredItems.map(item => ({
        ...item,
        href: item.href.startsWith('#') ? '#' : `${baseUrl}${item.href}`,
        subItems: item.subItems?.map(sub => ({
            ...sub,
            href: sub.href.startsWith('#') ? '#' : `${baseUrl}${sub.href}`
        }))
    }));
}

export function getPortalName(roleId: string): string {
    switch (roleId) {
        case 'teacher':
        case 'Teacher':
            return 'Teacher Portal';
        case 'student':
        case 'Student':
            return 'Student Portal';
        case 'parent':
        case 'Parent':
            return 'Parent Portal';
        default:
            return 'Admin Portal';
    }
}
