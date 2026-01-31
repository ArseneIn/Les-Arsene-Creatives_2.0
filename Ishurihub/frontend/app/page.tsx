"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function RootPage() {
    const { user, isLoading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.push('/login');
        } else {
            // Redirect based on role
            if (user.roleId === 'super_admin') {
                router.push('/system/dashboard'); // Or wherever super admin goes
            } else {
                router.push(`/school/${user.schoolId}/dashboard`);
            }
        }
    }, [user, isLoading, router]);

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
            <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading Ishuri Hub...</p>
            </div>
        </div>
    );
}
