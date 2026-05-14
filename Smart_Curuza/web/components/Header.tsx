'use client';

import { Bell, User, Wifi, WifiOff } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import NotificationDropdown from './NotificationDropdown';
import { useTranslations } from 'next-intl';
import { useSync } from './SyncProvider';

const Header = () => {
    const t = useTranslations('Header');
    const { isOffline } = useSync();
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const [shopName, setShopName] = useState<string>("");
    const [location, setLocation] = useState<string>("");

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const parsedUser = JSON.parse(userStr);
                setUser(parsedUser);

                if (parsedUser.role === 'MERCHANT' || parsedUser.role === 'CASHIER') {
                    // Use shop name from user object if available, otherwise fetch
                    if (parsedUser.shopName) {
                        setShopName(parsedUser.shopName);
                    }
                    fetchProfile();
                }
            } catch (e) {
                console.error('Failed to parse user');
            }
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const profile = await api.get<any>('/merchants/profile');
            if (profile) {
                const name = profile.business_name || "";
                setShopName(name);
                setLocation(profile.address || "");

                // Sync back to localStorage if needed
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.shopName !== name) {
                        user.shopName = name;
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch shop profile", error);
        }
    };

    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <header className="relative z-20 flex items-center justify-between px-8 py-4 mx-6 mt-4 bg-[#2a2e34]/95 backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl">
            <div className="flex items-center gap-4">
                {(user?.role === 'MERCHANT' || user?.role === 'CASHIER') ? (
                    <>
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-yellow-500/20">
                            {shopName ? shopName.substring(0, 2).toUpperCase() : '...'}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">{shopName || t('loading')}</h2>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isOffline ? 'bg-orange-400' : 'bg-green-500'}`}></span>
                                {location || '...'}
                            </p>
                        </div>
                    </>
                ) : (
                    <h2 className="text-xl font-bold text-white">{t('controlTower')}</h2>
                )}
            </div>
            <div className="flex items-center space-x-6">
                {(user?.role === 'MERCHANT' || user?.role === 'CASHIER') && (
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500"
                        style={isOffline ? {
                            background: 'rgba(239,68,68,0.12)',
                            borderColor: 'rgba(239,68,68,0.3)',
                        } : {
                            background: 'rgba(34,197,94,0.1)',
                            borderColor: 'rgba(34,197,94,0.2)',
                        }}
                    >
                        {isOffline ? (
                            <>
                                <WifiOff className="w-3.5 h-3.5 text-red-400" />
                                <span className="text-sm font-medium text-red-400">{t('offline')}</span>
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            </>
                        ) : (
                            <>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-green-400">{t('online')}</span>
                            </>
                        )}
                    </div>
                )}

                <LanguageSwitcher />

                <NotificationDropdown />

                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-white">{user?.name || t('user')}</p>
                        <p className="text-xs text-gray-400 font-medium">{user?.role || 'User'}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-300 font-bold border border-white/10 shadow-sm group-hover:bg-white/10 transition-colors">
                        {getInitials(user?.name || '')}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
