import Link from 'next/link';
import { LayoutDashboard, Package, Users, Settings, LogOut, ShoppingCart, BarChart3, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const MerchantSidebar = () => {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                // Try to get from local storage first to avoid flicker
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    setRole(user.role);
                }

                // Verify with API
                const user = await api.get<any>('/auth/profile');
                setRole(user.role);
                localStorage.setItem('user', JSON.stringify(user));
            } catch (error) {
                console.error('Failed to fetch user role', error);
            }
        };
        fetchRole();
    }, []);

    const isCashier = role === 'CASHIER';

    return (
        <div className="hidden md:flex flex-col w-64 bg-jet border-r border-jet-600 h-full">
            <div className="flex items-center justify-center h-16 border-b border-jet-600">
                <span className="text-2xl font-bold text-gradient-gold">My Shop</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-2">
                    <Link href="/merchant" className="flex items-center px-4 py-2 text-platinum-800 hover:bg-jet-600 hover:text-gold rounded-md transition-all duration-200">
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Overview
                    </Link>
                    <Link href="/merchant/inventory" className="flex items-center px-4 py-2 text-platinum-800 hover:bg-jet-600 hover:text-gold rounded-md transition-all duration-200">
                        <Package className="mr-3 h-5 w-5" />
                        Inventory & Yield
                    </Link>
                    <Link href="/merchant/crm" className="flex items-center px-4 py-2 text-platinum-800 hover:bg-jet-600 hover:text-gold rounded-md transition-all duration-200">
                        <Users className="mr-3 h-5 w-5" />
                        CRM & Debt
                    </Link>
                    <Link href="/merchant/sales" className="flex items-center px-4 py-2 text-platinum-800 hover:bg-jet-600 hover:text-gold rounded-md transition-all duration-200">
                        <ShoppingCart className="mr-3 h-5 w-5" />
                        POS (New Sale)
                    </Link>
                    <Link href="/merchant/sales/history" className="flex items-center px-4 py-2 text-platinum-800 hover:bg-jet-600 hover:text-gold rounded-md transition-all duration-200">
                        <ShoppingCart className="mr-3 h-5 w-5" />
                        Sales History
                    </Link>

                    {!isCashier && (
                        <>
                            <Link href="/merchant/expenses" className="flex items-center px-4 py-2 text-platinum-800 hover:bg-jet-600 hover:text-gold rounded-md transition-all duration-200">
                                <DollarSign className="mr-3 h-5 w-5" />
                                Expenses
                            </Link>
                            <Link href="/merchant/reports" className="flex items-center px-4 py-2 text-platinum-800 hover:bg-jet-600 hover:text-gold rounded-md transition-all duration-200">
                                <BarChart3 className="mr-3 h-5 w-5" />
                                Reports & Analytics
                            </Link>
                        </>
                    )}
                </nav>
            </div>
            <div className="p-4 border-t border-jet-600">
                {!isCashier && (
                    <Link href="/merchant/settings" className="flex items-center w-full px-4 py-2 text-platinum-800 hover:bg-jet-600 hover:text-gold rounded-md transition-all duration-200">
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                    </Link>
                )}
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        window.location.href = '/login';
                    }}
                    className="flex items-center w-full px-4 py-2 mt-2 text-danger hover:bg-red-900/20 rounded-md transition-all duration-200"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default MerchantSidebar;
