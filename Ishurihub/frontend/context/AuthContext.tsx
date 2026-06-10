"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/data/users";
import { Permission, SYSTEM_ROLES } from "@/data/rbac";
import api from "@/lib/api";

interface AuthContextType {
    user: User | undefined;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<string | null>; // Returns redirect path or null if failed
    logout: () => void;
    checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("ishurihub_token");
            if (storedToken) {
                setToken(storedToken);
                try {
                    // Verify token and get user details
                    const response = await api.get('/auth/profile');
                    const fetchedUser = response.data;

                    // Hydrate role
                    if (fetchedUser.customRole) {
                        fetchedUser.role = {
                            id: fetchedUser.customRole.id,
                            name: fetchedUser.customRole.name,
                            description: 'Custom Role',
                            isSystem: false,
                            permissions: fetchedUser.customRole.permissions as Permission[]
                        };
                    } else if (fetchedUser.roleId) {
                        fetchedUser.role = SYSTEM_ROLES.find(r => r.id === fetchedUser.roleId);
                    }
                    setUser(fetchedUser);

                    // Keep storage synced
                    localStorage.setItem("ishurihub_user", JSON.stringify(fetchedUser));

                } catch {
                    console.warn("Auth initialization failed: Invalid or expired token");
                    localStorage.removeItem("ishurihub_token");
                    localStorage.removeItem("ishurihub_user");
                    setToken(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password?: string): Promise<string | null> => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user: loggedInUser } = response.data;

            // Hydrate role
            let role;
            if (loggedInUser.customRole) {
                role = {
                    id: loggedInUser.customRole.id,
                    name: loggedInUser.customRole.name,
                    description: 'Custom Role',
                    isSystem: false,
                    permissions: loggedInUser.customRole.permissions as Permission[]
                };
            } else {
                role = SYSTEM_ROLES.find((r) => r.id === loggedInUser.roleId);
            }

            const fullUser = {
                ...loggedInUser,
                role
            };

            localStorage.setItem("ishurihub_token", access_token);
            localStorage.setItem("ishurihub_user", JSON.stringify(fullUser));
            setToken(access_token);
            setUser(fullUser);

            // Determine redirect path
            if (loggedInUser.roleId === 'super_admin') {
                return '/';
            } else {
                return `/school/${loggedInUser.schoolId}/dashboard`;
            }
        } catch (error) {
            console.error("Login failed", error);
            return null;
        }
    };

    const logout = () => {
        setUser(undefined);
        setToken(null);
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
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, checkPermission }}>
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
