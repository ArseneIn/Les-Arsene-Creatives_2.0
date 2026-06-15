import React, { useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';
import type { User, AuthResponse } from '../types/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sessionExpiredReason, setSessionExpiredReason] = useState<string | null>(null);

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    // Verify token and get user details (includes practiceProgress)
                    const response = await api.get('/auth/profile');
                    setUser(response.data);
                    setToken(storedToken);
                } catch (error) {
                    console.error('Failed to fetch user profile', error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();

        const handleUnauthorized = (e: Event) => {
            const reason = (e as CustomEvent<{ reason?: string }>).detail?.reason ?? null;
            if (reason) setSessionExpiredReason(reason);
            logout();
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email: string, password: string, institution?: string): Promise<User> => {
        try {
            const response = await api.post<AuthResponse>('/auth/login', { email, password, institution });
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(user);
            setSessionExpiredReason(null); // clear any previous reason
            return user;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const setSession = (accessToken: string, userData: User) => {
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
        setUser(userData);
        setSessionExpiredReason(null);
    };

    const clearSessionExpiredReason = () => setSessionExpiredReason(null);

    return (
        <AuthContext.Provider value={{
            user, token, login, setSession, logout,
            isLoading, isAuthenticated: !!user,
            sessionExpiredReason, clearSessionExpiredReason,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
