"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/data/users";
import { Permission, SYSTEM_ROLES } from "@/data/rbac";
import api from "@/lib/api";

interface AuthContextType {
    user: User | undefined;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<string | null>; // Returns redirect path or null if failed
    logout: () => void;
    checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("ishurihub_token");
            if (token) {
                try {
                    // Verify token and get user details
                    // For now, we decode or fetch profile. Let's assume we fetch profile.
                    // const response = await api.get('/auth/profile'); 
                    // setUser(response.data);

                    // Fallback: If we don't have a profile endpoint yet, we might store user in localstorage too (less secure but ok for v1 transition)
                    const storedUser = localStorage.getItem("ishurihub_user");
                    if (storedUser) {
                        const parsedUser = JSON.parse(storedUser);
                        // Hydrate role
                        if (parsedUser.customRole) {
                            parsedUser.role = {
                                id: parsedUser.customRole.id,
                                name: parsedUser.customRole.name,
                                description: 'Custom Role',
                                isSystem: false,
                                permissions: parsedUser.customRole.permissions as Permission[]
                            };
                        } else if (!parsedUser.role && parsedUser.roleId) {
                            parsedUser.role = SYSTEM_ROLES.find(r => r.id === parsedUser.roleId);
                        }
                        setUser(parsedUser);
                    }
                } catch (error) {
                    console.error("Auth initialization failed", error);
                    localStorage.removeItem("ishurihub_token");
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password?: string): Promise<string | null> => {
        try {
            // TODO: Update Login Component to pass password
            const response = await api.post('/auth/login', { email, password: password || 'password123' }); // Default password for dev transition
            const { access_token, user } = response.data;

            // Hydrate role
            let role;
            if (user.customRole) {
                role = {
                    id: user.customRole.id,
                    name: user.customRole.name,
                    description: 'Custom Role',
                    isSystem: false,
                    permissions: user.customRole.permissions as Permission[]
                };
            } else {
                role = SYSTEM_ROLES.find((r: any) => r.id === user.roleId);
            }

            const fullUser = {
                ...user,
                role
            };

            localStorage.setItem("ishurihub_token", access_token);
            localStorage.setItem("ishurihub_user", JSON.stringify(fullUser));
            setUser(fullUser);

            // Determine redirect path
            if (user.roleId === 'super_admin') {
                return '/';
            } else {
                return `/school/${user.schoolId}/dashboard`;
            }
        } catch (error) {
            console.error("Login failed", error);
            return null;
        }
    };

    const logout = () => {
        setUser(undefined);
        localStorage.removeItem("ishurihub_token");
        localStorage.removeItem("ishurihub_user");
        window.location.href = '/login';
    };

    const checkPermission = (permission: string): boolean => {
        if (!user || !user.role) return false;
        if (user.role.id === 'super_admin') return true;
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
