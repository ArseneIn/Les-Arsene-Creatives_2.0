"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { syncManager } from '../lib/sync/SyncManager';

interface SyncContextType {
    isOffline: boolean;
    isSyncing: boolean;
    syncProgress: number;
    queueLength: number;
}

const SyncContext = createContext<SyncContextType>({
    isOffline: false,
    isSyncing: false,
    syncProgress: 0,
    queueLength: 0,
});

export const useSync = () => useContext(SyncContext);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOffline, setIsOffline] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [queueLength, setQueueLength] = useState(0);

    useEffect(() => {
        // Set initial state
        setIsOffline(!window.navigator.onLine);

        const handleOnline = () => {
            setIsOffline(false);
            syncManager.processQueue();
        };

        const handleOffline = () => {
            setIsOffline(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const unsubscribeSync = syncManager.subscribe((syncing, progress, qLength) => {
            setIsSyncing(syncing);
            setSyncProgress(progress);
            setQueueLength(qLength);
        });

        // Trigger an initial processQueue if we are online and have queued items
        if (window.navigator.onLine) {
            syncManager.processQueue();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            unsubscribeSync();
        };
    }, []);

    return (
        <SyncContext.Provider value={{ isOffline, isSyncing, syncProgress, queueLength }}>
            {children}
        </SyncContext.Provider>
    );
};
