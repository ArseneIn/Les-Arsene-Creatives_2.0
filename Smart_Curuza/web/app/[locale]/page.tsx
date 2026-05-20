'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LandingPage from '@/components/landing/LandingPage';

export default function HomePage() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'en';
    const t = useTranslations('Landing');

    // Redirect logged-in users to their dashboard instantly
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (token && userStr && userStr !== 'undefined') {
            try {
                const user = JSON.parse(userStr);
                // Decide route based on role
                if (user.role === 'SUPERADMIN') {
                    router.replace(`/${locale}/admin`);
                } else {
                    router.replace(`/${locale}/merchant`);
                }
            } catch (_) { /* ignore parsing errors */ }
        }
    }, [router, locale]);

    return <LandingPage t={t} locale={locale} />;
}
