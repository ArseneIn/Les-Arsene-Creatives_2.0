"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, mockUsers, getUserWithRole } from "@/data/users";
import { Permission } from "@/data/rbac";

interface AuthContextType {
    user: User | undefined;
    isLoading: boolean;
    login: (email: string) => string | null; // Returns redirect path or null if failed
    logout: () => void;
    checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for existing session
        const initAuth = () => {
            const storedUserId = localStorage.getItem("ishurihub_user_id");
            if (storedUserId) {
                const foundUser = getUserWithRole(storedUserId);
                setUser(foundUser);
            }
            setIsLoading(false);
        };

        // Use timeout to bypass synchronous state update warning and simulate async load
        const timer = setTimeout(initAuth, 100);
        return () => clearTimeout(timer);
    }, []);

    const login = (email: string): string | null => {
        // Simple mock login by email
        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser) {
            const userWithRole = getUserWithRole(foundUser.id);
            if (userWithRole) {
                setUser(userWithRole);
                localStorage.setItem("ishurihub_user_id", userWithRole.id);

                // Determine redirect path
                if (userWithRole.roleId === 'super_admin') {
                    return '/';
                } else {
                    return `/school/${userWithRole.schoolId}/dashboard`;
                }
            }
        }
        return null;
    };

    const logout = () => {
        setUser(undefined);
        localStorage.removeItem("ishurihub_user_id");
    };

    const checkPermission = (permission: string): boolean => {
        if (!user || !user.role) return false;
        // Super admins have implicit access to system level, but specific permissions are better
        return user.role.permissions.includes(permission as Permission);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkPermission }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
