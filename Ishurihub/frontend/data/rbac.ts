export type Permission =
    // Students
    | 'student.view'
    | 'student.create'
    | 'student.edit'
    | 'student.delete'
    // Academics
    | 'academic.view_grades'
    | 'academic.edit_grades'
    | 'academic.manage_timetable'
    // Discipline
    | 'discipline.view'
    | 'discipline.log_incident'
    | 'discipline.manage_cards'
    // Finance
    | 'finance.view'
    | 'finance.manage_fees'
    // Library
    | 'library.view'
    | 'library.manage_books'
    | 'library.checkout'
    // System
    | 'system.manage_users'
    | 'system.manage_roles'
    | 'system.view_logs'
    | 'system.manage_institutions'
    // Events
    | 'event.view'
    | 'event.create'
    | 'event.manage';

export interface Role {
    id: string;
    name: string;
    description: string;
    isSystem: boolean; // System roles cannot be deleted/edited
    permissions: Permission[];
}

export const SYSTEM_ROLES: Role[] = [
    {
        id: 'super_admin',
        name: 'Super Admin',
        description: 'Platform owner with full access to all institutions.',
        isSystem: true,
        permissions: [
            'system.manage_institutions',
            'system.manage_users', 'system.manage_roles', 'system.view_logs'
        ]
    },
    {
        id: 'school_admin',
        name: 'School Admin',
        description: 'Full access to all school modules.',
        isSystem: true,
        permissions: [
            'student.view', 'student.create', 'student.edit', 'student.delete',
            'academic.view_grades', 'academic.edit_grades', 'academic.manage_timetable',
            'discipline.view', 'discipline.log_incident', 'discipline.manage_cards',
            'finance.view', 'finance.manage_fees',
            'library.view', 'library.manage_books', 'library.checkout',
            'system.manage_users', 'system.manage_roles', 'system.view_logs',
            'event.view', 'event.create', 'event.manage'
        ]
    },
    {
        id: 'dean_studies',
        name: 'Dean of Studies',
        description: 'Manages academic affairs, timetables, and grades.',
        isSystem: true,
        permissions: [
            'student.view', 'student.edit',
            'academic.view_grades', 'academic.edit_grades', 'academic.manage_timetable',
            'discipline.view'
        ]
    },
    {
        id: 'discipline_master',
        name: 'Discipline Master',
        description: 'Manages student behavior and card discipline points.',
        isSystem: true,
        permissions: [
            'student.view',
            'discipline.view', 'discipline.log_incident', 'discipline.manage_cards'
        ]
    },
    {
        id: 'library_manager',
        name: 'Library Manager',
        description: 'Manages library inventory and book loans.',
        isSystem: true,
        permissions: [
            'student.view',
            'library.view', 'library.manage_books', 'library.checkout'
        ]
    },
    {
        id: 'parent',
        name: 'Parent',
        description: 'View-only access to their child\'s records.',
        isSystem: true,
        permissions: [
            'student.view',
            'academic.view_grades',
            'discipline.view',
            'finance.view'
        ]
    },
    {
        id: 'student',
        name: 'Student',
        description: 'Access to holiday packages and personal academic metrics.',
        isSystem: true,
        permissions: [
            'student.view',
            'academic.view_grades',
            'event.view'
        ]
    }
];
