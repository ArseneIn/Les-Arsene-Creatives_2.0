import React, { useState } from 'react';
import { api } from '@/lib/api';
import { MoreVertical, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

interface Merchant {
    id: string;
    business_name: string;
    device_id: string;
    subscription_status: 'ACTIVE' | 'INACTIVE' | 'TRIAL';
    subscription_expiry: string;
    last_payment_date: string;
    created_at: string;
}

interface MerchantsTableProps {
    merchants: Merchant[];
    onUpdate: () => void;
}

export default function MerchantsTable({ merchants, onUpdate }: MerchantsTableProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleSubscriptionAction = async (id: string, action: 'activate' | 'deactivate' | 'extend') => {
        setLoadingId(id);
        try {
            let status = 'ACTIVE';
            let expiryDate = undefined;

            if (action === 'deactivate') status = 'INACTIVE';
            if (action === 'extend') {
                status = 'ACTIVE';
                const currentExpiry = merchants.find(m => m.id === id)?.subscription_expiry;
                const date = currentExpiry ? new Date(currentExpiry) : new Date();
                date.setFullYear(date.getFullYear() + 1);
                expiryDate = date.toISOString();
            }

            await api.post(`/super-admin/merchants/${id}/subscription`, { status, expiryDate });
            onUpdate();
        } catch (error) {
            console.error('Error updating subscription:', error);
            alert('Failed to update subscription');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-platinum-600 overflow-hidden">
            <div className="p-6 border-b border-platinum-600">
                <h3 className="text-lg font-bold text-jet font-heading">Registered Merchants</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-platinum-50 border-b border-platinum-600">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-jet-700 uppercase tracking-wider">Business Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-jet-700 uppercase tracking-wider">Device ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-jet-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-jet-700 uppercase tracking-wider">Expiry</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-jet-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-platinum-600">
                        {merchants.map((merchant) => (
                            <tr key={merchant.id} className="hover:bg-platinum-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-jet">{merchant.business_name}</div>
                                    <div suppressHydrationWarning className="text-xs text-jet-700">Joined {new Date(merchant.created_at).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-jet font-mono bg-platinum-200 px-2 py-1 rounded inline-block">
                                        {merchant.device_id}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${merchant.subscription_status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                        merchant.subscription_status === 'TRIAL' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {merchant.subscription_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-jet-700">
                                    {merchant.subscription_expiry ? (
                                        <div suppressHydrationWarning className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(merchant.subscription_expiry).toLocaleDateString()}
                                        </div>
                                    ) : (
                                        <span className="text-jet-500 italic">No expiry set</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        {merchant.subscription_status !== 'ACTIVE' && (
                                            <button
                                                onClick={() => handleSubscriptionAction(merchant.id, 'activate')}
                                                disabled={loadingId === merchant.id}
                                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                            >
                                                Activate
                                            </button>
                                        )}
                                        {merchant.subscription_status === 'ACTIVE' && (
                                            <button
                                                onClick={() => handleSubscriptionAction(merchant.id, 'extend')}
                                                disabled={loadingId === merchant.id}
                                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                            >
                                                Extend (+1yr)
                                            </button>
                                        )}
                                        {merchant.subscription_status !== 'INACTIVE' && (
                                            <button
                                                onClick={() => handleSubscriptionAction(merchant.id, 'deactivate')}
                                                disabled={loadingId === merchant.id}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                Deactivate
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
