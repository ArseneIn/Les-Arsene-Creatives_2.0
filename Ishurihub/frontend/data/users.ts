import { Role, SYSTEM_ROLES } from "./rbac";

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    roleId: string;
    customRole?: {
        id: string;
        name: string;
        permissions: string[];
    };
    role?: Role; // Populated at runtime or via helper
    schoolId: string;
    school?: {
        id: string;
        name: string;
        plan: string;
        features: string[];
    };
}

export const mockUsers: User[] = [
    {
        id: 'admin_1',
        name: 'Admin User',
        email: 'admin@ishurihub.rw',
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=000000&color=fff',
        roleId: 'super_admin',
        schoolId: 'system' // Special ID for platform level
    },
    {
        id: 'u1',
        name: 'Dr. Jean Claude',
        email: 'headteacher@ishurihub.rw',
        avatarUrl: 'https://ui-avatars.com/api/?name=Jean+Claude&background=random',
        roleId: 'school_admin',
        schoolId: '1'
    },
    {
        id: 'u2',
        name: 'Mr. Patrick',
        email: 'dean@ishurihub.rw',
        avatarUrl: 'https://ui-avatars.com/api/?name=Patrick+M&background=random',
        roleId: 'dean_studies',
        schoolId: '1'
    },
    {
        id: 'u3',
        name: 'Mme. Sarah',
        email: 'discipline@ishurihub.rw',
        avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+K&background=random',
        roleId: 'discipline_master',
        schoolId: '1'
    },
    {
        id: 'u4',
        name: 'Mr. Eric',
        email: 'library@ishurihub.rw',
        avatarUrl: 'https://ui-avatars.com/api/?name=Eric+N&background=random',
        roleId: 'library_manager',
        schoolId: '1'
    },
    {
        id: 'u5',
        name: 'Parent John',
        email: 'parent@gmail.com',
        avatarUrl: 'https://ui-avatars.com/api/?name=John+P&background=random',
        roleId: 'parent',
        schoolId: '1'
    }
];

export const getUserWithRole = (userId: string): User | undefined => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return undefined;

    const role = SYSTEM_ROLES.find(r => r.id === user.roleId);
    return { ...user, role };
};
