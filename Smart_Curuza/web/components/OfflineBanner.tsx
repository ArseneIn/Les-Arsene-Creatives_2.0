"use client";

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useSync } from './SyncProvider';

export default function OfflineBanner() {
    const { isOffline, isSyncing, syncProgress } = useSync();

    if (!isOffline && !isSyncing) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-4 pointer-events-none">
            {isOffline ? (
                <div className="flex items-center px-4 py-3 bg-red-500 text-white rounded-lg shadow-lg pointer-events-auto">
                    <WifiOff size={18} className="mr-2" />
                    <span className="text-sm font-semibold">
                        You are offline. Changes will be saved locally.
                    </span>
                </div>
            ) : isSyncing ? (
                <div className="flex flex-col w-80 px-4 py-3 bg-yellow-400 text-slate-900 rounded-lg shadow-lg pointer-events-auto">
                    <div className="flex items-center mb-2">
                        <RefreshCw size={18} className="mr-2 animate-spin" />
                        <span className="text-sm font-bold">
                            Syncing data... {syncProgress}%
                        </span>
                    </div>
                    <div className="w-full bg-yellow-500/30 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className="bg-slate-900 h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${syncProgress}%` }}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
