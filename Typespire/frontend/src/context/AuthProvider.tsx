import React, { useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';
import type { User, AuthResponse } from '../types/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
                    // Verify token and get user details
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
    }, []);

    const login = async (email: string, password: string, institution?: string): Promise<User> => {
        try {
            const response = await api.post<AuthResponse>('/auth/login', { email, password, institution });
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(user);
            return user;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
