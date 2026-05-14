import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';
import { ApiClient } from '../api_client';

interface User {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    role: string;
    merchantId?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        console.error('useAuth failed: context is null');
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    console.log('AuthProvider rendering');
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const loadSession = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('auth_token');
                const storedUser = await SecureStore.getItemAsync('auth_user');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to load session', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSession();

        // Register global 401 handler
        ApiClient.onUnauthorized(() => {
            console.log('AuthContext: Received 401, logging out...');
            logout();
        });
    }, []);

    useEffect(() => {
        if (isLoading) return;

        // Check if current segments include auth-related pages
        const isAuthPage = segments.some(s => s === 'login' || s === 'register');
        
        if (!user && !isAuthPage) {
            // Redirect to login if not authenticated
            router.replace('/login');
        } else if (user && isAuthPage) {
            // Redirect to home if authenticated and trying to access auth pages
            router.replace('/');
        }
    }, [user, segments, isLoading]);

    const login = async (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        await SecureStore.setItemAsync('auth_token', newToken);
        await SecureStore.setItemAsync('auth_user', JSON.stringify(newUser));
        router.replace('/');
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('auth_user');
        ApiClient.clearCache(); 
        
        // Only redirect if we're not already on the login page
        if (!segments.includes('login')) {
            router.replace('/login');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
