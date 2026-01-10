'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Check if path contains /login or /register, regardless of locale
        const isPublicPath = pathname.includes('/login') || pathname.includes('/register');
        const currentLocale = pathname.split('/')[1] || 'en';

        if (!token && !isPublicPath) {
            router.replace(`/${currentLocale}/login`);
        } else {
            setAuthorized(true);
        }
    }, [router, pathname]);

    if (!authorized) {
        return <div className="min-h-screen flex items-center justify-center bg-platinum">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>;
    }

    return <>{children}</>;
}
