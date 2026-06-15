export type UserRole = 'PLATFORM_ADMIN' | 'INSTITUTION_ADMIN' | 'FACILITATOR' | 'STUDENT';

export const UserRole = {
    PLATFORM_ADMIN: 'PLATFORM_ADMIN' as UserRole,
    INSTITUTION_ADMIN: 'INSTITUTION_ADMIN' as UserRole,
    FACILITATOR: 'FACILITATOR' as UserRole,
    STUDENT: 'STUDENT' as UserRole,
};

import type { Institution } from './institution';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
    institutionId?: string;
    sectionId?: string;
    institution?: Institution;
    practiceProgress?: any;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
