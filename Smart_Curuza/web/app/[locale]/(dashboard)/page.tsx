'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const currentLocale = window.location.pathname.split('/')[1] || 'en';

                if (user.role === 'SUPERADMIN') {
                    router.replace(`/${currentLocale}/admin`);
                } else if (user.role === 'MERCHANT' || user.role === 'CASHIER') {
                    router.replace(`/${currentLocale}/merchant`);
                } else {
                    router.replace(`/${currentLocale}/login`);
                }
            } catch (e) {
                const currentLocale = window.location.pathname.split('/')[1] || 'en';
                router.replace(`/${currentLocale}/login`);
            }
        } else {
            const currentLocale = window.location.pathname.split('/')[1] || 'en';
            router.replace(`/${currentLocale}/login`);
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
    );
}
