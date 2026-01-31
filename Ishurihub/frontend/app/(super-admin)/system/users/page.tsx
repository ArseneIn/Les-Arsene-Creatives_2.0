"use client";

import SuperAdminSidebar from "@/components/SuperAdminSidebar";

export default function SystemUsersPage() {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <SuperAdminSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">User Management</h1>
                <p className="text-slate-600 dark:text-slate-400">Manage all users across the platform.</p>
                {/* Add user table here later */}
            </main>
        </div>
    );
}
