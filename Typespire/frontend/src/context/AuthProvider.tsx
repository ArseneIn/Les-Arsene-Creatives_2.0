import React, { useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';
import type { User, AuthResponse } from '../types/auth';
import { AuthContext } from './AuthContext';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sessionExpiredReason, setSessionExpiredReason] = useState<string | null>(null);

    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(15);
    const [isCompromised, setIsCompromised] = useState<boolean>(false);

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // SSE connection listener for session updates
    useEffect(() => {
        if (!token) return;

        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        // Connect to NestJS SSE endpoint with token query param
        const eventSource = new EventSource(`${apiBase}/auth/sse?token=${encodeURIComponent(token)}`);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'session_invalidated') {
                    setCountdown(15);
                    setIsSecurityModalOpen(true);
                } else if (data.type === 'session_compromised') {
                    logout();
                    setIsCompromised(true);
                }
            } catch (err) {
                console.error('Failed to parse SSE message:', err);
            }
        };

        eventSource.onerror = (err) => {
            console.error('SSE Error:', err);
        };

        return () => {
            eventSource.close();
        };
    }, [token]);

    // Countdown interval hook
    useEffect(() => {
        if (!isSecurityModalOpen) return;

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleConfirmLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSecurityModalOpen]);

    const handleConfirmLogout = () => {
        setIsSecurityModalOpen(false);
        logout();
    };

    const handleReportCompromise = async () => {
        setIsSecurityModalOpen(false);
        if (token) {
            try {
                await api.post('/auth/report-compromise', { token });
            } catch (err) {
                console.error('Failed to report compromise:', err);
            }
        }
        logout();
        setIsCompromised(true);
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

            {/* Countdown Invalidation Modal */}
            {isSecurityModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-955/75 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative overflow-hidden transform animate-in zoom-in-95 duration-300">
                        {/* Red Accent Blur */}
                        <div className="absolute top-[-20%] right-[-20%] w-[250px] h-[250px] bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="w-14 h-14 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldAlert className="w-7 h-7" />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">Security Alert</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                            We detected a new login to your account from another device or browser session.
                        </p>

                        <div className="flex items-center gap-3 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 mb-6">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center font-bold text-lg animate-pulse flex-shrink-0">
                                {countdown}
                            </div>
                            <span className="text-sm font-medium">Logging out in {countdown} seconds...</span>
                        </div>

                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Was this login you?</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleConfirmLogout}
                                className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-all text-sm text-center cursor-pointer"
                            >
                                Yes, it was me
                            </button>
                            <button
                                onClick={handleReportCompromise}
                                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 text-sm text-center cursor-pointer"
                            >
                                No, secure account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Compromised Lockout Screen */}
            {isCompromised && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-10 w-full max-w-lg shadow-2xl relative overflow-hidden text-center transform animate-in zoom-in-95 duration-300">
                        {/* Accents */}
                        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="mx-auto w-16 h-16 bg-emerald-950/50 border border-emerald-900/50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-8 h-8" />
                        </div>

                        <h3 className="text-3xl font-bold text-white mb-4 tracking-tight font-display">Account Secured!</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md mx-auto">
                            All active sessions have been terminated. We have sent a secure password reset link to your registered email.
                        </p>

                        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 mb-8 text-left max-w-md mx-auto space-y-3">
                            <div className="flex items-center gap-3 text-slate-300 text-xs">
                                <ShieldCheck className="text-emerald-500 w-4 h-4" />
                                <span>All other active sessions terminated immediately</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300 text-xs">
                                <ShieldCheck className="text-emerald-500 w-4 h-4" />
                                <span>Temporary account lock enabled</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300 text-xs">
                                <ShieldCheck className="text-emerald-500 w-4 h-4" />
                                <span>Password reset instructions sent via email</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsCompromised(false)}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/30 text-sm inline-flex items-center gap-2 cursor-pointer"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
};
