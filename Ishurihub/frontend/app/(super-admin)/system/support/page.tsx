"use client";

import SuperAdminSidebar from "@/components/SuperAdminSidebar";

export default function SystemSupportPage() {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <SuperAdminSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Support Tickets</h1>
                <p className="text-slate-600 dark:text-slate-400">View and manage support tickets from schools.</p>
                {/* Add ticket list here later */}
            </main>
        </div>
    );
}
