"use client";

import SuperAdminSidebar from "@/components/SuperAdminSidebar";

export default function SystemSettingsPage() {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <SuperAdminSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Platform Settings</h1>
                <p className="text-slate-600 dark:text-slate-400">Configure global system settings.</p>
                {/* Add settings form here later */}
            </main>
        </div>
    );
}
