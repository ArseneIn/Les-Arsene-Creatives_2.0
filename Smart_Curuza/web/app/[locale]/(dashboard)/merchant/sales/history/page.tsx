'use client';

import React, { useState, useEffect } from 'react';
import { FilterBar } from '@/components/ui/data-table/FilterBar';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { PageHeader } from '@/components/ui/data-table/PageHeader';
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import SaleDetailsModal from '@/components/SaleDetailsModal';
import ExportSalesModal from '@/components/ExportSalesModal';

interface SaleRecord {
    id: string;
    created_at: string;
    customer?: { name: string };
    items: any[];
    total: number;
    payment_method: 'Cash' | 'Mobile Money' | 'Credit';
    sync_status: 'Completed' | 'Pending' | 'Failed';
    profit?: number;
}

export default function SalesHistoryPage() {
    const [sales, setSales] = useState<SaleRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const data = await api.get<SaleRecord[]>('/sales');

            // Calculate Profit for each sale
            const enrichedData = data.map(sale => {
                let totalCost = 0;

                if (sale.items && Array.isArray(sale.items)) {
                    sale.items.forEach((item: any) => {
                        if (item.batches && Array.isArray(item.batches)) {
                            item.batches.forEach((batch: any) => {
                                totalCost += Number(batch.quantity) * Number(batch.costPrice);
                            });
                        } else {
                            // Fallback if no batch info (legacy sales), assume 0 cost or estimate?
                            // For now, 0 cost means 100% profit (or we could try to find current cost)
                        }
                    });
                }

                return {
                    ...sale,
                    profit: Number(sale.total) - totalCost
                };
            });

            setSales(enrichedData);
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterGroups = [
        {
            id: 'status',
            label: 'Status',
            options: [
                { label: 'Completed', value: 'Completed' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Failed', value: 'Failed' },
            ],
        },
        {
            id: 'payment',
            label: 'Payment Method',
            options: [
                { label: 'Cash', value: 'Cash' },
                { label: 'Mobile Money', value: 'Mobile Money' },
                { label: 'Credit', value: 'Credit' },
            ],
        },
    ];

    const filteredData = sales.filter(sale => {
        const customerName = sale.customer?.name || 'Walk-in Customer';
        const matchesSearch = customerName.toLowerCase().includes(search.toLowerCase()) ||
            sale.id.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = activeFilters.status ? sale.sync_status === activeFilters.status : true;
        const matchesPayment = activeFilters.payment ? sale.payment_method === activeFilters.payment : true;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    const columns = [
        {
            header: 'Date & Time',
            accessorKey: 'created_at' as keyof SaleRecord,
            cell: (item: SaleRecord) => <span className="text-sm">{new Date(item.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>,
        },
        {
            header: 'Customer',
            accessorKey: 'customer' as keyof SaleRecord,
            cell: (item: SaleRecord) => <span className="font-medium text-jet">{item.customer?.name || 'Walk-in Customer'}</span>,
        },
        {
            header: 'Products',
            accessorKey: 'items' as keyof SaleRecord,
            cell: (item: SaleRecord) => {
                if (!item.items || item.items.length === 0) return <span className="text-gray-400 italic">No items</span>;

                const firstTwo = item.items.slice(0, 2).map((i: any) => i.name).join(', ');
                const remaining = item.items.length - 2;

                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-jet truncate max-w-[200px]" title={item.items.map((i: any) => i.name).join(', ')}>
                            {firstTwo}
                        </span>
                        {remaining > 0 && (
                            <span className="text-xs text-gray-500">+{remaining} more</span>
                        )}
                    </div>
                );
            },
        },
        {
            header: 'Total Amount',
            accessorKey: 'total' as keyof SaleRecord,
            cell: (item: SaleRecord) => <span className="font-bold text-jet">{Number(item.total).toLocaleString()} RWF</span>,
        },
        {
            header: 'Payment',
            accessorKey: 'payment_method' as keyof SaleRecord,
            cell: (item: SaleRecord) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${item.payment_method === 'Mobile Money' ? 'bg-yellow-100 text-yellow-800' :
                    item.payment_method === 'Credit' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                    {item.payment_method}
                </span>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'sync_status' as keyof SaleRecord,
            cell: (item: SaleRecord) => (
                <div className="flex items-center gap-1">
                    {item.sync_status === 'Completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {item.sync_status === 'Pending' && <Clock className="h-4 w-4 text-orange-500" />}
                    {item.sync_status === 'Failed' && <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">{item.sync_status || 'Completed'}</span>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <PageHeader
                title="Sales History"
                onExport={() => setShowExportModal(true)}
            />

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

            <DataTable
                data={filteredData}
                columns={columns}
                loading={loading}
                initialPageSize={10}
                onRowClick={(item) => setSelectedSale(item)}
            />

            {selectedSale && (
                <SaleDetailsModal
                    sale={selectedSale}
                    onClose={() => setSelectedSale(null)}
                />
            )}

            {showExportModal && (
                <ExportSalesModal
                    onClose={() => setShowExportModal(false)}
                />
            )}
        </div>
    );
}
