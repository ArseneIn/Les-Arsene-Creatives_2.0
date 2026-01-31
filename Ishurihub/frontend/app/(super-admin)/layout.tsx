"use client";
import React, { useEffect } from "react";
import SuperAdminSidebar from "@/components/SuperAdminSidebar";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import SuperAdminHeader from "@/components/SuperAdminHeader";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login");
            } else if (user.roleId !== 'super_admin') {
                // If logged in but not super admin, redirect to their school dashboard for specific school admins, or unauthorized
                if (user.schoolId && user.schoolId !== 'system') {
                    router.push(`/school/${user.schoolId}/dashboard`);
                } else {
                    router.push("/login"); // Fallback
                }
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Don't render if not authorized (prevents flash of content)
    if (!user || user.roleId !== 'super_admin') {
        return null;
    }



    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#0f172a] text-[#0d111b] dark:text-white font-sans">
            <SuperAdminSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <SuperAdminHeader />
                {children}
            </main>
        </div>
    );
}
