"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, mockUsers, getUserWithRole } from "@/data/users";

interface AuthContextType {
    user: User | undefined;
    isLoading: boolean;
    login: (userId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for existing session
        const storedUserId = localStorage.getItem("ishurihub_user_id");
        if (storedUserId) {
            const foundUser = getUserWithRole(storedUserId);
            setUser(foundUser);
        } else {
            // Default to Head Teacher for demo if no session
            const defaultUser = getUserWithRole('u1');
            setUser(defaultUser);
        }
        setIsLoading(false);
    }, []);

    const login = (userId: string) => {
        const foundUser = getUserWithRole(userId);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem("ishurihub_user_id", userId);
        }
    };

    const logout = () => {
        setUser(undefined);
        localStorage.removeItem("ishurihub_user_id");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
