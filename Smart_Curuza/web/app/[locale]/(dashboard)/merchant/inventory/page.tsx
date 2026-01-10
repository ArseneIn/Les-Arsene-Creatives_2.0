'use client';

import React, { useState, useEffect } from 'react';
import AddProductModal from '@/components/AddProductModal';
import BatchListModal from '@/components/BatchListModal';
import { FilterBar } from '@/components/ui/data-table/FilterBar';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { PageHeader } from '@/components/ui/data-table/PageHeader';
import { RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

interface Product {
    id: string;
    name: string;
    barcode: string;
    stock: number;
    price: number;
    batch?: string;
    merchant_id?: string;
    status?: 'active' | 'inactive';
    unit?: string;
    cost_price?: number;
    total_stock_value?: number;
    itemClsCd?: string;
    taxTyCd?: string;
    conversion_factor?: number;
    buying_unit?: string;
}

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [role, setRole] = useState<string | null>(null);

    // Batch Modal State
    const [selectedProductForBatches, setSelectedProductForBatches] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setRole(user.role);
        }
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await api.get<Product[]>('/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (newProduct: Partial<Product>) => {
        try {
            const savedProduct = await api.post<Product>('/products', newProduct);
            setProducts(prev => [...prev, savedProduct]);
            // Modal will close itself after animation
        } catch (error) {
            console.error('Error creating product:', error);
            throw error; // Re-throw to be caught by the modal's internal error handling
        }
    };

    const handleToggleStatus = async (product: Product) => {
        const newStatus = product.status === 'active' ? 'inactive' : 'active';
        try {
            // Optimistic update
            setProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, status: newStatus } : p
            ));

            await api.patch(`/products/${product.id}`, { status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
            // Revert on error
            setProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, status: product.status } : p
            ));
            alert('Failed to update status');
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.barcode && p.barcode.includes(search));

        const matchesStatus = activeFilters.status ? p.status === activeFilters.status : true;

        return matchesSearch && matchesStatus;
    });

    const filterGroups = [
        {
            id: 'status',
            label: 'Status',
            options: [
                { label: 'Active Products', value: 'active' },
                { label: 'Inactive Products', value: 'inactive' },
            ],
        },
        {
            id: 'inventory',
            label: 'Inventory',
            options: [
                { label: 'In Stock', value: 'in_stock' },
                { label: 'Low Stock', value: 'low_stock' },
                { label: 'Out of Stock', value: 'out_of_stock' },
            ],
        },
    ];

    const columns = [
        {
            header: 'Product Name',
            accessorKey: 'name' as keyof Product,
            cell: (item: Product) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                        {item.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-jet">{item.name}</span>
                </div>
            ),
        },
        {
            header: 'SKU / Barcode',
            accessorKey: 'barcode' as keyof Product,
            cell: (item: Product) => <span className="font-mono text-xs">{item.barcode || 'N/A'}</span>,
        },
        {
            header: 'Retail Price',
            accessorKey: 'price' as keyof Product,
            cell: (item: Product) => <span>{Number(item.price).toLocaleString()} RWF</span>,
        },
        {
            header: 'Total Value',
            accessorKey: 'total_stock_value' as keyof Product,
            cell: (item: Product) => (
                <span className="font-medium text-jet">
                    {item.total_stock_value ? item.total_stock_value.toLocaleString() : '0'} RWF
                </span>
            ),
        },
        {
            header: 'Available Stock',
            accessorKey: 'stock' as keyof Product,
            cell: (item: Product) => {
                const isBulk = item.conversion_factor && item.conversion_factor > 1;
                const bulkCount = isBulk ? Math.floor(item.stock / item.conversion_factor!) : 0;
                const remainder = isBulk ? item.stock % item.conversion_factor! : 0;

                return (
                    <div className="flex flex-col">
                        <span className={`${item.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                            {item.stock} {item.unit || 'pcs'}
                        </span>
                        {isBulk && (
                            <span className="text-xs text-gray-500">
                                ({bulkCount} {item.buying_unit || 'Box'}{remainder > 0 ? `, ${remainder} ${item.unit}` : ''})
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: 'Active?',
            accessorKey: 'status' as keyof Product,
            cell: (item: Product) => (
                <div
                    className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ${role !== 'CASHIER' ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    onClick={() => role !== 'CASHIER' && handleToggleStatus(item)}
                >
                    <input
                        type="checkbox"
                        name="toggle"
                        id={`toggle-${item.id}`}
                        checked={item.status === 'active'}
                        readOnly
                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-400"
                    />
                    <label
                        htmlFor={`toggle-${item.id}`}
                        className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${item.status === 'active' ? 'bg-green-400' : 'bg-gray-300'}`}
                    ></label>
                </div>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id' as keyof Product,
            cell: (item: Product) => (
                <div className="flex items-center gap-2">
                    {role !== 'CASHIER' && (
                        <button
                            onClick={() => setSelectedProductForBatches(item)}
                            className="px-3 py-1 text-xs font-medium text-jet bg-platinum-600 hover:bg-gold hover:text-onyx rounded transition-colors"
                        >
                            Batches
                        </button>
                    )}
                    <RefreshCw className="h-4 w-4 text-green-500 cursor-pointer" onClick={() => fetchProducts()} />
                </div>
            ),
        },
    ];

    const handleExport = () => {
        const headers = ['Name', 'Barcode', 'Price', 'Stock', 'Unit', 'Status'];
        const csvContent = [
            headers.join(','),
            ...products.map(p => [
                `"${p.name}"`,
                p.barcode || '',
                p.price,
                p.stock,
                p.unit || 'pcs',
                p.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const rows = text.split('\n').slice(1); // Skip header

            // This is a basic implementation. In a real app, you'd validate and send to backend.
            console.log('Importing rows:', rows.length);
            alert(`Parsed ${rows.length} products. Backend integration required for bulk import.`);
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-6">
            <PageHeader
                title="Products"
                actionLabel={role !== 'CASHIER' ? "Add Product" : undefined}
                onAdd={role !== 'CASHIER' ? () => setShowAddModal(true) : undefined}
                onExport={handleExport}
                onImport={() => document.getElementById('import-input')?.click()}
            />
            <input
                type="file"
                id="import-input"
                className="hidden"
                accept=".csv"
                onChange={handleImport}
            />

            {/* Inventory Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-surface p-4 rounded-xl border border-platinum-600 shadow-sm">
                    <p className="text-sm text-jet-700 font-medium">Total Inventory Value</p>
                    <p className="text-2xl font-bold text-jet font-heading mt-1">
                        {products.reduce((sum, p) => sum + (p.total_stock_value || 0), 0).toLocaleString()} RWF
                    </p>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-platinum-600 shadow-sm">
                    <p className="text-sm text-jet-700 font-medium">Total Products</p>
                    <p className="text-2xl font-bold text-jet font-heading mt-1">
                        {products.length}
                    </p>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-platinum-600 shadow-sm">
                    <p className="text-sm text-jet-700 font-medium">Low Stock Items</p>
                    <p className="text-2xl font-bold text-orange-600 font-heading mt-1">
                        {products.filter(p => p.stock < 10).length}
                    </p>
                </div>
            </div>

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
                data={filteredProducts}
                columns={columns}
                loading={loading}
            />

            {showAddModal && (
                <AddProductModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddProduct}
                />
            )}

            {selectedProductForBatches && (
                <BatchListModal
                    productId={selectedProductForBatches.id}
                    productName={selectedProductForBatches.name}
                    unit={selectedProductForBatches.unit || 'pcs'}
                    onClose={() => setSelectedProductForBatches(null)}
                    onUpdate={() => {
                        fetchProducts(); // Refresh product list to show updated stock
                    }}
                />
            )}
        </div>
    );
}
