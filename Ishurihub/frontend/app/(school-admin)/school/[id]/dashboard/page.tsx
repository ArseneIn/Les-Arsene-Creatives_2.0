"use client";
import SchoolAdminDashboard from "@/components/dashboards/SchoolAdminDashboard";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { user, isLoading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user && user.role) {
            const roleId = user.role.id;
            const roleName = user.role.name;
            const schoolId = user.schoolId;

            // Check for specific roles and redirect
            if (roleName === 'Teacher' || roleId === 'teacher') {
                router.replace(`/school/${schoolId}/teacher/dashboard`);
            } else if (roleName === 'Student' || roleId === 'student') {
                router.replace(`/school/${schoolId}/student/dashboard`);
            } else if (roleName === 'Parent' || roleId === 'parent') {
                router.replace(`/school/${schoolId}/parent/dashboard`);
            }
        }
    }, [user, isLoading, router]);


    if (isLoading) return null;

    return (
        <SchoolAdminDashboard />
    );
}
