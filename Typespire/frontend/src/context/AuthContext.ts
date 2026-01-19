import { createContext, useContext } from 'react';
import type { User } from '../types/auth';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string, institution?: string) => Promise<User>;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
