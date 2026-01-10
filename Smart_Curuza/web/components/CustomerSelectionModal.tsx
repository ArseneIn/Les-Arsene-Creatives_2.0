import React, { useState, useEffect } from 'react';
import { Search, X, User, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import AddCustomerModal from './AddCustomerModal';

interface Customer {
    id: string;
    name: string;
    phone: string;
    total_debt: number;
}

interface CustomerSelectionModalProps {
    onClose: () => void;
    onSelect: (customer: Customer) => void;
}

export default function CustomerSelectionModal({ onClose, onSelect }: CustomerSelectionModalProps) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await api.get<Customer[]>('/client-management/customers');
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCustomer = async (customerData: any) => {
        try {
            const newCustomer = await api.post<Customer>('/client-management/customers', {
                ...customerData,
                total_debt: 0,
                loyalty_points: 0,
            });
            // Automatically select the new customer
            onSelect(newCustomer);
        } catch (error) {
            console.error('Error creating customer:', error);
            alert('Failed to create customer');
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface w-full max-w-md rounded-xl shadow-lg p-6 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-jet font-heading">Select Customer</h2>
                    <button onClick={onClose} className="text-jet-700 hover:text-jet">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="relative mb-4 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-3 py-2 bg-platinum-700 text-jet rounded-lg hover:bg-platinum-600 transition-colors flex items-center justify-center"
                        title="Add New Customer"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-jet-700 mb-2">No customers found.</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="text-gold font-medium hover:underline"
                            >
                                Add New Customer
                            </button>
                        </div>
                    ) : (
                        filteredCustomers.map(customer => (
                            <button
                                key={customer.id}
                                onClick={() => onSelect(customer)}
                                className="w-full text-left p-3 rounded-lg hover:bg-platinum-800 transition-colors flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-platinum-700 rounded-full flex items-center justify-center text-jet font-bold group-hover:bg-gold group-hover:text-onyx transition-colors">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-jet">{customer.name}</p>
                                        <p className="text-sm text-jet-700">{customer.phone}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-jet-700">Debt</p>
                                    <p className={`text-sm font-semibold ${Number(customer.total_debt) > 0 ? 'text-danger' : 'text-success'}`}>
                                        {Number(customer.total_debt).toLocaleString()}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {showAddModal && (
                <AddCustomerModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddCustomer}
                />
            )}
        </div>
    );
}
