"use client";

export const dynamic = 'force-dynamic';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/system/LoadingScreen";
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

    return <LoadingScreen />;
}
