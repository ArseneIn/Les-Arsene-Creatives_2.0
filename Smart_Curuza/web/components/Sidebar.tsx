'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Store, Package, Users, Settings, LogOut, ShoppingCart, BarChart, FileText, CreditCard } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Sidebar = () => {
    const t = useTranslations('Sidebar');
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'en';
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setRole(user.role);
            } catch (e) {
                console.error('Failed to parse user from local storage');
            }
        }
    }, []);

    const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                className={`flex items-center px-4 py-3 mb-1 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 text-yellow-400 border-l-4 border-yellow-500'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
            >
                <Icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-yellow-400' : 'text-gray-500 group-hover:text-yellow-400'}`} />
                <span className="font-medium">{label}</span>
            </Link>
        );
    };

    const renderAdminLinks = () => (
        <>
            <NavItem href={`/${currentLocale}/admin`} icon={LayoutDashboard} label={t('dashboard')} />
            <NavItem href={`/${currentLocale}/admin/merchants`} icon={Store} label={t('merchants')} />
            <NavItem href={`/${currentLocale}/admin/users`} icon={Users} label={t('users')} />
            <NavItem href={`/${currentLocale}/admin/system`} icon={Package} label={t('systemHealth')} />
        </>
    );

    const renderMerchantLinks = () => (
        <>
            <NavItem href={`/${currentLocale}/merchant`} icon={LayoutDashboard} label={t('dashboard')} />
            <NavItem href={`/${currentLocale}/merchant/sales`} icon={ShoppingCart} label={t('pos')} />
            <NavItem href={`/${currentLocale}/merchant/sales/history`} icon={FileText} label={t('salesHistory')} />
            <NavItem href={`/${currentLocale}/merchant/inventory`} icon={Package} label={t('inventory')} />
            {role !== 'CASHIER' && (
                <>
                    <NavItem href={`/${currentLocale}/merchant/reports`} icon={BarChart} label={t('reports')} />
                    <NavItem href={`/${currentLocale}/merchant/expenses`} icon={CreditCard} label={t('expenses')} />
                    <NavItem href={`/${currentLocale}/merchant/crm`} icon={Users} label={t('crm')} />
                    <NavItem href={`/${currentLocale}/merchant/settings`} icon={Settings} label={t('settings')} />
                </>
            )}
        </>
    );

    return (
        <div className="hidden md:flex flex-col w-72 h-[calc(100vh-2rem)] m-4 bg-[#2a2e34]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
            <div className="flex items-center justify-center h-20 border-b border-white/10 bg-black/20">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                    Smart-Curuza
                </span>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto py-6 px-4 custom-scrollbar">
                <nav className="space-y-1">
                    {role === 'SUPERADMIN' ? renderAdminLinks() : renderMerchantLinks()}
                </nav>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
                <button
                    onClick={async () => {
                        try {
                            const { db } = await import('@/lib/db');
                            await db.clearDatabase();
                        } catch (e) {
                            console.error('Failed to clear local database', e);
                        }
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        window.location.href = '/login';
                    }}
                    className="flex items-center w-full px-4 py-3 mt-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span className="font-medium">{t('logout')}</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
