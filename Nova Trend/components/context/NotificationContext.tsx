import React, { createContext, useContext, useState, useCallback } from 'react';

export interface NotificationLog {
    id: string;
    type: string;
    message: string;
    timestamp: string;
}

interface NotificationContextType {
    logs: NotificationLog[];
    addLog: (type: string, message: string) => void;
    clearLogs: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<NotificationLog[]>([]);

    const addLog = useCallback((type: string, message: string) => {
        const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            message,
            timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setLogs(prev => [newLog, ...prev].slice(0, 5)); // Keep last 5 logs

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            setLogs(prev => prev.filter(l => l.id !== newLog.id));
        }, 5000);
    }, []);

    const clearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    return (
        <NotificationContext.Provider value={{ logs, addLog, clearLogs }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
