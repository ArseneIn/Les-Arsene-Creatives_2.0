'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    React.useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role !== 'SUPERADMIN') {
                router.push('/login');
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
}
