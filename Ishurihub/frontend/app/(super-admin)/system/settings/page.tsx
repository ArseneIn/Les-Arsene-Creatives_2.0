"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";

export default function SystemSettingsPage() {
    const [platformName, setPlatformName] = useState('IshuriHub');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState('');
    const [maintenanceStartsAt, setMaintenanceStartsAt] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/system-settings');
            const data = response.data;
            setPlatformName(data.platformName);
            setMaintenanceMode(data.isMaintenanceMode);
            setMaintenanceMessage(data.maintenanceMessage || '');
            if (data.maintenanceStartsAt) {
                // Formatting for datetime-local input
                const date = new Date(data.maintenanceStartsAt);
                const offset = date.getTimezoneOffset() * 60000;
                const localISODate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
                setMaintenanceStartsAt(localISODate);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
            setMessage({ type: 'error', text: 'Failed to load system settings. Please check your connection.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            await api.patch('/system-settings', {
                platformName,
                isMaintenanceMode: maintenanceMode,
                maintenanceMessage,
                maintenanceStartsAt: maintenanceStartsAt ? new Date(maintenanceStartsAt).toISOString() : null
            });
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            console.error("Failed to update settings", error);
            setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>;
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-6">Platform Settings</h1>

            <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                        }`}>
                        {message.type === 'success' ? (
                            <span className="material-symbols-outlined">check_circle</span>
                        ) : (
                            <span className="material-symbols-outlined">error</span>
                        )}
                        {message.text}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Platform Name</label>
                    <input
                        type="text"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl mb-6">
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Live Maintenance Mode</h4>
                        <p className="text-sm text-slate-500">Block all users immediately.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Scheduled Maintenance (Countdown)</label>
                        <input
                            type="datetime-local"
                            value={maintenanceStartsAt}
                            onChange={(e) => setMaintenanceStartsAt(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                        <p className="mt-1 text-xs text-slate-500">Setting this will show a graceful warning to users before closing access.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Maintenance Message</label>
                        <textarea
                            value={maintenanceMessage}
                            onChange={(e) => setMaintenanceMessage(e.target.value)}
                            placeholder="We are currently upgrading our servers..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                        />
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : null}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
