"use client";

import SuperAdminSidebar from "@/components/SuperAdminSidebar";

export default function SystemOverviewPage() {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <SuperAdminSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">System Overview</h1>
                <p className="text-slate-600 dark:text-slate-400">Welcome to the Super Admin Dashboard. This is the overview page.</p>
                {/* Add statistics cards here later */}
            </main>
        </div>
    );
}
