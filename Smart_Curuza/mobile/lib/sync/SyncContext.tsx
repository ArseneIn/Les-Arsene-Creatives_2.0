import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncManager } from './SyncManager';

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
    const [queueLength, setQueueLength] = useState(syncManager.getQueueLength());

    useEffect(() => {
        // Subscribe to network state changes
        const unsubscribeNet = NetInfo.addEventListener(state => {
            const offline = !(state.isConnected && state.isInternetReachable !== false);
            setIsOffline(offline);

            // If we just came back online, trigger a sync
            if (!offline) {
                syncManager.processQueue();
            }
        });

        // Subscribe to SyncManager state changes
        const unsubscribeSync = syncManager.subscribe((syncing, progress, qLength) => {
            setIsSyncing(syncing);
            setSyncProgress(progress);
            setQueueLength(qLength);
        });

        return () => {
            unsubscribeNet();
            unsubscribeSync();
        };
    }, []);

    return (
        <SyncContext.Provider value={{ isOffline, isSyncing, syncProgress, queueLength }}>
            {children}
        </SyncContext.Provider>
    );
};
