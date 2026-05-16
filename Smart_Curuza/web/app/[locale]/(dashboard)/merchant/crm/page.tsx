'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Search, Plus, Phone, Mail, MapPin, MoreVertical, MessageSquare } from 'lucide-react';
import AddCustomerModal from '@/components/AddCustomerModal';
import DebtRepaymentModal from '@/components/DebtRepaymentModal';

interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    total_debt: number;
    loyalty_points: number;
    lifetime_value?: number;
}

export default function CRMPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [repaymentModal, setRepaymentModal] = useState<{ show: boolean, customer: Customer | null }>({ show: false, customer: null });

    useEffect(() => {
        fetchCustomers();
        fetchMerchantProfile();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setRole(user.role);
        }
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
            setCustomers([...customers, newCustomer]);
            setShowAddModal(false);
        } catch (error) {
            console.error('Error creating customer:', error);
            alert('Failed to create customer');
        }
    };

    const [merchantProfile, setMerchantProfile] = useState<any>(null);

    const fetchMerchantProfile = async () => {
        try {
            const data = await api.get('/merchants/profile');
            setMerchantProfile(data);
        } catch (error) {
            console.error('Error fetching merchant profile:', error);
        }
    };

    const handleSendReminder = async (customer: Customer) => {
        if (!confirm(`Send SMS reminder to ${customer.name}?`)) return;

        try {
            const shopName = merchantProfile?.business_name || 'Smart Curuza Shop';
            await api.post(`/client-management/remind/${customer.id}`, { shopName });
            alert(`Reminder sent to ${customer.name}`);
        } catch (error) {
            console.error('Error sending reminder:', error);
            alert('Failed to send reminder');
        }
    };

    const handleRepayment = async (amount: number) => {
        if (!repaymentModal.customer) return;
        try {
            await api.post(`/client-management/customers/${repaymentModal.customer.id}/repay`, { amount });
            setRepaymentModal({ show: false, customer: null });
            fetchCustomers();
        } catch (error) {
            console.error('Error processing repayment:', error);
            alert('Failed to process repayment');
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-jet font-heading">Customer Management</h1>
                    <p className="text-jet-700 mt-1">Manage your customers and track their debts</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-gradient-gold text-onyx rounded-lg shadow-gold hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                >
                    <Plus className="h-4 w-4" />
                    Add Customer
                </button>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search customers by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                    />
                </div>
                {role !== 'CASHIER' && (
                    <div className="bg-surface p-4 rounded-lg border border-platinum-600 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-jet-700">Total Outstanding Debt</p>
                            <p className="text-2xl font-bold text-danger font-heading">
                                {customers.reduce((sum, c) => sum + Number(c.total_debt), 0).toLocaleString()} RWF
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Customer List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-12 bg-surface rounded-xl border border-platinum-600">
                    <div className="w-16 h-16 bg-platinum-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-jet-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-jet">No customers found</h3>
                    <p className="text-jet-700">Try adjusting your search or add a new customer.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCustomers.map(customer => (
                        <div key={customer.id} className="bg-surface rounded-xl border border-platinum-600 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center text-onyx font-bold text-xl">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-jet text-lg">{customer.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-jet-700">
                                                <Phone className="h-3 w-3" />
                                                {customer.phone}
                                            </div>
                                        </div>
                                    </div>
                                    {Number(customer.total_debt) > 0 ? (
                                        <span className="px-2 py-1 bg-danger/10 text-danger text-[10px] font-bold rounded uppercase">Owes Money</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-success/10 text-success text-[10px] font-bold rounded uppercase">Cleared</span>
                                    )}
                                </div>

                                <div className="bg-platinum-800/50 rounded-lg p-3 flex justify-between mb-4 border border-platinum-600/50">
                                    <div>
                                        <p className="text-[10px] text-jet-700 uppercase font-bold mb-1">Lifetime Value</p>
                                        <p className="text-sm font-bold text-jet">
                                            {(customer.lifetime_value || 0).toLocaleString()} <span className="text-[10px] opacity-60">RWF</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-jet-700 uppercase font-bold mb-1">Debt</p>
                                        <p className={`text-sm font-bold ${Number(customer.total_debt) > 0 ? 'text-danger' : 'text-success'}`}>
                                            {Number(customer.total_debt).toLocaleString()} <span className="text-[10px] opacity-60">RWF</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-4">
                                    {customer.email && (
                                        <div className="flex items-center gap-2 text-sm text-jet-700">
                                            <Mail className="h-4 w-4" />
                                            {customer.email}
                                        </div>
                                    )}
                                    {customer.address && (
                                        <div className="flex items-center gap-2 text-sm text-jet-700">
                                            <MapPin className="h-4 w-4" />
                                            {customer.address}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <a 
                                        href={`tel:${customer.phone}`}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gold text-onyx py-2 rounded-lg font-bold text-xs hover:bg-gold/90 transition-all"
                                    >
                                        <Phone className="h-3 w-3" />
                                        Call
                                    </a>
                                    {Number(customer.total_debt) > 0 && (
                                        <button
                                            onClick={() => setRepaymentModal({ show: true, customer })}
                                            className="px-4 py-2 bg-success text-white rounded-lg text-xs font-bold hover:bg-success/90 transition-all"
                                        >
                                            REPAY
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleSendReminder(customer)}
                                        className="p-2 text-jet-700 hover:bg-platinum-800 rounded-lg transition-all"
                                        title="Send Reminder"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <AddCustomerModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddCustomer}
                />
            )}

            {repaymentModal.show && repaymentModal.customer && (
                <DebtRepaymentModal
                    customerName={repaymentModal.customer.name}
                    currentDebt={Number(repaymentModal.customer.total_debt)}
                    onClose={() => setRepaymentModal({ show: false, customer: null })}
                    onConfirm={handleRepayment}
                />
            )}
        </div>
    );
}
