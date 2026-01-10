import React, { useState } from 'react';
import { X, Download, Calendar } from 'lucide-react';
import { api } from '@/lib/api';

interface ExportSalesModalProps {
    onClose: () => void;
}

export default function ExportSalesModal({ onClose }: ExportSalesModalProps) {
    const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ summary: any[], details: any[] }>(`/sales/export?period=${period}`);
            const data = response.details; // Use detailed transactions

            // Convert to CSV
            const headers = ['Transaction ID', 'Date', 'Customer', 'Items', 'Total (RWF)', 'Cost (RWF)', 'Profit (RWF)', 'VAT (RWF)', 'Payment Method', 'Status'];
            const csvContent = [
                headers.join(','),
                ...data.map(row => [
                    `"${row.id}"`,
                    `"${new Date(row.date).toLocaleString()}"`,
                    `"${row.customer}"`,
                    `"${row.items}"`,
                    row.total,
                    row.cost,
                    row.profit,
                    row.vat,
                    `"${row.paymentMethod}"`,
                    `"${row.status}"`
                ].join(','))
            ].join('\n');

            // Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `sales_detailed_${period}_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            onClose();
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface w-full max-w-md rounded-xl shadow-lg flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-platinum-600 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-jet font-heading">Export Sales Report</h2>
                    <button onClick={onClose} className="text-jet-600 hover:text-red-500 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <p className="text-jet-700">Select the time period for your sales report:</p>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => setPeriod('weekly')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${period === 'weekly'
                                    ? 'border-gold bg-gold/10 text-jet'
                                    : 'border-platinum-600 hover:border-gold/50 text-jet-600'
                                }`}
                        >
                            <Calendar className="h-6 w-6" />
                            <span className="font-medium">Weekly</span>
                        </button>
                        <button
                            onClick={() => setPeriod('monthly')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${period === 'monthly'
                                    ? 'border-gold bg-gold/10 text-jet'
                                    : 'border-platinum-600 hover:border-gold/50 text-jet-600'
                                }`}
                        >
                            <Calendar className="h-6 w-6" />
                            <span className="font-medium">Monthly</span>
                        </button>
                        <button
                            onClick={() => setPeriod('yearly')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${period === 'yearly'
                                    ? 'border-gold bg-gold/10 text-jet'
                                    : 'border-platinum-600 hover:border-gold/50 text-jet-600'
                                }`}
                        >
                            <Calendar className="h-6 w-6" />
                            <span className="font-medium">Yearly</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-platinum-600 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-jet-600 hover:bg-platinum-100 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="px-4 py-2 bg-gold text-onyx rounded-lg font-bold hover:bg-gold/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Download className="h-4 w-4" />
                                Export CSV
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
