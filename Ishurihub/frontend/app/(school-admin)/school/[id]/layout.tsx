"use client";
import Sidebar from "@/components/Sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import api from "@/lib/api";

export default function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = React.use(params);
    const { user, isLoading } = useAuthContext();
    const router = useRouter();
    const [logoUrl, setLogoUrl] = React.useState<string | undefined>(undefined);

    // Fetch school details to get the logo
    useEffect(() => {
        const fetchSchool = async () => {
            // Avoid fetching if system (super admin view)
            if (id === 'system') return;
            try {
                const res = await api.get(`/schools/${id}`);
                setLogoUrl(res.data.logoUrl);
            } catch (err) {
                console.error("Failed to fetch school logo", err);
            }
        };

        if (id) {
            fetchSchool();
        }
    }, [id]);

    useEffect(() => {
        if (!isLoading) {
            // Checks:
            // 1. Must be logged in
            // 2. If Super Admin -> Allow access to any school
            // 3. If School Admin -> Must match their schoolId
            if (!user) {
                router.push("/login"); // Or maybe back to unauthorized
                return;
            }

            if (user.roleId === 'super_admin') {
                return; // Valid
            }

            if (user.schoolId !== id) {
                // If trying to access another school's dashboard
                if (user.schoolId === 'system') {
                    // Fallback for system users without super admin role (unlikely)
                    router.push("/");
                } else {
                    // Redirect to their own dashboard
                    router.push(`/school/${user.schoolId}/dashboard`);
                }
            }
        }
    }, [user, isLoading, id, router]);


    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
    }

    // Optional: Hide content if unauthorized to prevent flash? 
    // Ideally we return null here if not authorized, but the useEffect handles the redirect.
    // To be safer:
    if (!user) return null;
    if (user.roleId !== 'super_admin' && user.schoolId !== id) return null;

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-[#0d111b] dark:text-white font-sans">
            <Sidebar schoolId={id} logoUrl={logoUrl} />
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
