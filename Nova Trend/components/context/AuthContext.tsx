import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNotification } from './NotificationContext';
import { supabase, isSupabaseConfigured } from '../../lib/api';
import { AdminRole } from '../../types';

interface UserProfile {
    id: string;
    name?: string;
    full_name?: string;
    role_type?: AdminRole | 'customer';
    [key: string]: any;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isClientAuthenticated: boolean;
    clientName: string;
    userProfile: UserProfile | null;
    login: (role: 'admin' | 'client', profile: any) => void;
    logout: () => void;
    isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAdmin') === 'true');
    const [isClientAuthenticated, setIsClientAuthenticated] = useState(() => localStorage.getItem('isClient') === 'true');
    const [clientName, setClientName] = useState(() => localStorage.getItem('clientName') || 'Guest User');

    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : null;
    });

    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            // Security Check: Only attempt handshake if keys are present
            if (!isSupabaseConfigured) {
                setIsInitializing(false);
                return;
            }

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (!session && !localStorage.getItem('isAdmin') && !localStorage.getItem('isClient')) {
                    logout();
                }
            } catch (err) {
                console.debug('Handshake bypassed or failed silently.');
            } finally {
                setTimeout(() => setIsInitializing(false), 800);
            }
        };
        checkSession();
    }, []);

    const { addLog } = useNotification();

    const login = (role: 'admin' | 'client', profile: any) => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isClient');

        const name = profile?.name || profile?.full_name || 'Guest';
        localStorage.setItem('userProfile', JSON.stringify(profile));
        setUserProfile(profile);

        if (role === 'admin') {
            localStorage.setItem('isAdmin', 'true');
            setIsAuthenticated(true);
            setIsClientAuthenticated(false);
            addLog('Auth', `Admin Login: ${name}`);
        } else {
            localStorage.setItem('isClient', 'true');
            localStorage.setItem('clientName', name);
            setClientName(name);
            setIsClientAuthenticated(true);
            setIsAuthenticated(false);
            addLog('Auth', `Client Login: ${name}`);
        }
    };

    const logout = () => {
        addLog('Auth', `Logout: ${clientName}`);
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isClient');
        localStorage.removeItem('clientName');
        localStorage.removeItem('userProfile');
        setIsAuthenticated(false);
        setIsClientAuthenticated(false);
        setUserProfile(null);
        setClientName('Guest User');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isClientAuthenticated,
            clientName,
            userProfile,
            login,
            logout,
            isInitializing
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
