'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/data-table/PageHeader';
import { FilterBar } from '@/components/ui/data-table/FilterBar';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { Store, MapPin, Phone, Lock, Unlock, Search, Filter, Plus, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import RegisterMerchantModal from '@/components/admin/RegisterMerchantModal';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';

interface Merchant {
    id: string;
    business_name: string;
    owner: { name: string; email: string; phone: string };
    phone: string;
    address: string;
    subscription_status: 'ACTIVE' | 'INACTIVE' | 'TRIAL';
    lock_status: 'LOCKED' | 'UNLOCKED';
    last_payment_date: string;
}

export default function MerchantsPage() {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();
    const [search, setSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const router = useRouter();

    const fetchMerchants = async () => {
        try {
            const data = await api.get<Merchant[]>('/super-admin/merchants');
            setMerchants(data);
        } catch (error) {
            console.error('Failed to fetch merchants', error);
            showToast('Failed to load merchants', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchMerchants();
    }, []);

    const handleToggleLock = async (id: string) => {
        try {
            await api.post(`/super-admin/merchants/${id}/toggle-lock`, {});
            showToast('Device lock status updated', 'success');
            fetchMerchants();
        } catch (error) {
            console.error('Failed to toggle lock', error);
            showToast('Failed to update lock status', 'error');
        }
    };

    const filteredMerchants = merchants.filter(m => {
        const matchesSearch = m.business_name.toLowerCase().includes(search.toLowerCase()) ||
            (m.owner?.name || '').toLowerCase().includes(search.toLowerCase());

        const matchesStatus = activeFilters.status ? m.subscription_status === activeFilters.status : true;
        const matchesDevice = activeFilters.device ? m.lock_status === activeFilters.device : true;

        return matchesSearch && matchesStatus && matchesDevice;
    });

    const filterGroups = [
        {
            id: 'status',
            label: 'Account Status',
            options: [
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
                { label: 'Trial', value: 'TRIAL' },
            ],
        },
        {
            id: 'device',
            label: 'Device Lock',
            options: [
                { label: 'Unlocked', value: 'UNLOCKED' },
                { label: 'Locked', value: 'LOCKED' },
            ],
        },
    ];

    const columns = [
        {
            header: 'Merchant',
            accessorKey: 'name' as keyof Merchant,
            cell: (item: Merchant) => (
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                            <Store className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-jet">{item.business_name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-10">
                        {item.owner?.name || 'Unknown Owner'}
                    </div>
                </div>
            ),
        },
        {
            header: 'Contact',
            accessorKey: 'phone' as keyof Merchant,
            cell: (item: Merchant) => (
                <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-1.5 text-gray-400" />
                        {item.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1.5 text-gray-400" />
                        {item.address}
                    </div>
                </div>
            ),
        },
        {
            header: 'Subscription',
            accessorKey: 'subscription_status' as keyof Merchant,
            cell: (item: Merchant) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${item.subscription_status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' :
                        item.subscription_status === 'INACTIVE' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                    {item.subscription_status}
                </span>
            ),
        },
        {
            header: 'Device Lock',
            accessorKey: 'lock_status' as keyof Merchant,
            cell: (item: Merchant) => (
                <div className="flex items-center gap-2">
                    {item.lock_status === 'LOCKED' ? (
                        <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium">
                            <Lock className="h-3 w-3" /> Locked
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">
                            <Unlock className="h-3 w-3" /> Unlocked
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: 'Last Payment',
            accessorKey: 'last_payment_date' as keyof Merchant,
            cell: (item: Merchant) => <span suppressHydrationWarning className="text-sm font-mono text-gray-500">{item.last_payment_date ? new Date(item.last_payment_date).toLocaleDateString() : 'N/A'}</span>,
        },
        {
            header: 'Actions',
            accessorKey: 'id' as keyof Merchant,
            cell: (item: Merchant) => (
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <a
                        href={`/admin/merchants/${item.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                    >
                        Manage <ArrowRight className="h-3 w-3" />
                    </a>
                    <div className="h-4 w-px bg-gray-200" />
                    {item.lock_status === 'UNLOCKED' ? (
                        <button
                            onClick={() => handleToggleLock(item.id)}
                            className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                        >
                            Lock
                        </button>
                    ) : (
                        <button
                            onClick={() => handleToggleLock(item.id)}
                            className="text-xs text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors"
                        >
                            Unlock
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-platinum-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-jet font-heading">Merchant Management</h1>
                    <p className="text-gray-500 mt-1">Monitor and manage all registered businesses</p>
                </div>
                <button
                    onClick={() => setShowRegisterModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold text-onyx rounded-lg font-bold hover:bg-gold/90 transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5" />
                    Register Merchant
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Merchants</p>
                            <h3 className="text-2xl font-bold text-jet">{merchants.length}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Store className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Devices</p>
                            <h3 className="text-2xl font-bold text-jet">
                                {merchants.filter(m => m.lock_status === 'UNLOCKED').length}
                            </h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Unlock className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-red-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Locked Devices</p>
                            <h3 className="text-2xl font-bold text-jet">
                                {merchants.filter(m => m.lock_status === 'LOCKED').length}
                            </h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Lock className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6 border border-gray-200 shadow-sm">
                <FilterBar
                    onSearch={setSearch}
                    filterGroups={filterGroups}
                    activeFilters={activeFilters}
                    onFilterChange={(groupId, value) => setActiveFilters(prev => ({ ...prev, [groupId]: value }))}
                    onClearFilter={(groupId) => setActiveFilters(prev => {
                        const next = { ...prev };
                        delete next[groupId];
                        return next;
                    })}
                />

                <div className="mt-6">
                    <DataTable
                        data={filteredMerchants}
                        columns={columns}
                        onRowClick={(row: Merchant) => router.push(`/admin/merchants/${row.id}`)}
                    />
                </div>
            </Card>

            {showRegisterModal && (
                <RegisterMerchantModal
                    onClose={() => setShowRegisterModal(false)}
                    onSuccess={fetchMerchants}
                />
            )}
        </div>
    );
}
