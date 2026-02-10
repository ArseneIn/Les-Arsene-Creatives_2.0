"use client";

import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
    const { user, token, isLoading, login, logout } = useAuthContext();

    return {
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout
    };
}
