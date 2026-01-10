import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface TaxStatus {
    turnoverYTD: number;
    threshold: number;
    status: 'SAFE' | 'WARNING' | 'LIABLE';
    warningMessage: string;
}

export default function TaxLiabilityCard() {
    const [taxStatus, setTaxStatus] = useState<TaxStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // Assuming the backend extracts merchantId from the token or we pass it if needed
                // For now, let's assume we need to pass it, similar to ExpensesPage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                // Ideally, we should get the merchant ID properly.
                // If the user is a merchant, their ID is in the profile.
                const profile = await api.get<any>('/merchants/profile');

                const data = await api.get<TaxStatus>(`/tax/liability-status?merchantId=${profile.id}`);
                setTaxStatus(data);
            } catch (error) {
                console.error('Error fetching tax status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl border border-platinum-600 shadow-sm animate-pulse">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-6 bg-platinum-200 rounded w-1/3"></div>
                    <div className="h-5 w-5 bg-platinum-200 rounded-full"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-platinum-200 rounded w-full"></div>
                    <div className="h-2 bg-platinum-200 rounded-full"></div>
                    <div className="h-10 bg-platinum-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (!taxStatus) return null;

    const percentage = Math.min((taxStatus.turnoverYTD / taxStatus.threshold) * 100, 100);

    let colorClass = 'bg-success';
    let icon = <CheckCircle className="h-5 w-5 text-success" />;
    let cardBgClass = 'bg-gold-900 border-gold-800 text-jet';
    let mutedTextClass = 'text-jet-500';

    if (taxStatus.status === 'WARNING') {
        colorClass = 'bg-onyx';
        icon = <AlertTriangle className="h-5 w-5 text-onyx" />;
        cardBgClass = 'bg-gradient-gold shadow-gold border-transparent text-onyx';
        mutedTextClass = 'text-onyx/70';
    } else if (taxStatus.status === 'LIABLE') {
        colorClass = 'bg-white';
        icon = <AlertTriangle className="h-5 w-5 text-white" />;
        cardBgClass = 'bg-red-500 text-white border-red-600';
        mutedTextClass = 'text-white/80';
    }

    return (
        <div className={`p-6 rounded-xl border shadow-sm ${cardBgClass}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    Tax Liability Monitor
                    <div className="group relative">
                        <Info className={`h-4 w-4 cursor-help ${mutedTextClass}`} />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-jet text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Tracks your taxable turnover against the Rwanda VAT registration threshold (20M RWF/year).
                        </div>
                    </div>
                </h3>
                {icon}
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className={mutedTextClass}>Taxable Turnover (YTD)</span>
                        <span className="font-bold">{taxStatus.turnoverYTD.toLocaleString()} RWF</span>
                    </div>
                    <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${colorClass} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <div className={`flex justify-between text-xs mt-1 ${mutedTextClass}`}>
                        <span>0 RWF</span>
                        <span>Threshold: {taxStatus.threshold.toLocaleString()} RWF</span>
                    </div>
                </div>

                <div className={`p-3 rounded-lg text-sm ${taxStatus.status === 'SAFE' ? 'bg-green-100 text-green-800' :
                    taxStatus.status === 'WARNING' ? 'bg-white/30 text-onyx backdrop-blur-sm' :
                        'bg-white/20 text-white backdrop-blur-sm'
                    }`}>
                    {taxStatus.warningMessage}
                </div>
            </div>
        </div>
    );
}
