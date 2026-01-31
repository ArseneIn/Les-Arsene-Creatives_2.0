"use client";

import { useAuth } from "./useAuth";
import { Permission } from "@/data/rbac";

export function usePermission() {
    const { user } = useAuth();

    const hasPermission = (permission: Permission): boolean => {
        if (!user || !user.role) return false;
        if (user.role.id === 'super_admin') return true; // God Mode
        return user.role.permissions.includes(permission);
    };

    const hasAnyPermission = (permissions: Permission[]): boolean => {
        if (!user || !user.role) return false;
        if (user.role.id === 'super_admin') return true;
        return permissions.some(p => user.role!.permissions.includes(p));
    };

    const hasAllPermissions = (permissions: Permission[]): boolean => {
        if (!user || !user.role) return false;
        if (user.role.id === 'super_admin') return true;
        return permissions.every(p => user.role!.permissions.includes(p));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        role: user?.role
    };
}
