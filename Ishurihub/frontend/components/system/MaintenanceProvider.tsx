"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { useAuthContext } from '@/context/AuthContext';

interface MaintenanceContextType {
    isMaintenanceMode: boolean;
    maintenanceStartsAt: string | null;
    isBlocking: boolean;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const useMaintenance = () => {
    const context = useContext(MaintenanceContext);
    if (!context) {
        throw new Error('useMaintenance must be used within a MaintenanceProvider');
    }
    return context;
};

interface MaintenanceEvent extends CustomEvent {
    detail: {
        isMaintenance?: boolean;
        startsAt?: string;
    }
}

export const MaintenanceProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuthContext();
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [maintenanceStartsAt, setMaintenanceStartsAt] = useState<string | null>(null);
    const [isBlocking, setIsBlocking] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        const handleMaintenanceEvent = (event: Event) => {
            const maintenanceEvent = event as MaintenanceEvent;
            const { isMaintenance, startsAt } = maintenanceEvent.detail;

            // Never block on login/portal pages
            const onAuthPage = window.location.pathname === '/login' ||
                window.location.pathname.startsWith('/portal') ||
                window.location.pathname.startsWith('/forgot-password');
            if (onAuthPage) return;
            
            if (isMaintenance) {
                setIsMaintenanceMode(true);
                if (user?.roleId !== 'super_admin') {
                    setIsBlocking(true);
                }
            }

            if (startsAt && !isMaintenanceMode) {
                setMaintenanceStartsAt(startsAt);
                const startTime = new Date(startsAt).getTime();
                const now = new Date().getTime();
                const diff = Math.floor((startTime - now) / 1000);
                
                if (diff > 0) {
                    setCountdown(diff);
                } else if (user?.roleId !== 'super_admin') {
                    setIsBlocking(true);
                }
            }
        };

        window.addEventListener('maintenance-status-changed', handleMaintenanceEvent);

        return () => {
            window.removeEventListener('maintenance-status-changed', handleMaintenanceEvent);
        };
    }, [user, isMaintenanceMode]);

    // Countdown logic
    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev !== null && prev <= 1) {
                        clearInterval(timer);
                        if (user?.roleId !== 'super_admin') {
                            setIsBlocking(true);
                        }
                        return 0;
                    }
                    return prev !== null ? prev - 1 : null;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown, user]);

    if (!isMounted) return <>{children}</>;


    // Allow bypassing maintenance on any login/portal page so users can authenticate
    const isAuthPage = typeof window !== 'undefined' && (
        window.location.pathname === '/login' ||
        window.location.pathname.startsWith('/portal') ||
        window.location.pathname.startsWith('/forgot-password')
    );
    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <MaintenanceContext.Provider value={{ isMaintenanceMode, maintenanceStartsAt, isBlocking }}>
            {isBlocking ? (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900 overflow-hidden select-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50"></div>
                    <div className="relative max-w-lg w-full p-8 text-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-heading font-black text-white mb-4">Under Maintenance</h1>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            IshuriHub is currently undergoing scheduled maintenance to improve your experience. We&apos;ll be back online shortly.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 text-sm text-slate-300">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                            Updates in progress
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {countdown !== null && countdown > 0 && countdown < 300 && (
                        <div className="fixed top-0 inset-x-0 z-[9999] bg-amber-600 text-white py-2 px-4 flex items-center justify-center gap-4 animate-in slide-in-from-top duration-500">
                            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="font-bold">System maintenance starting in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}. Please save your work!</span>
                        </div>
                    )}
                    {children}
                </>
            )}
        </MaintenanceContext.Provider>
    );
};
