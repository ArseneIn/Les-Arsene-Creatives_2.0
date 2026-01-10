'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, Calendar, DollarSign, Tag, Pencil } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface Expense {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    created_at: string;
}

export default function ExpensesPage() {
    const { showToast } = useToast();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        category: 'Utilities',
        date: new Date().toISOString().split('T')[0]
    });
    const [merchantProfile, setMerchantProfile] = useState<any>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchMerchantProfile();
    }, []);

    useEffect(() => {
        if (merchantProfile) {
            fetchExpenses();
        }
    }, [merchantProfile, dateRange]);

    const fetchMerchantProfile = async () => {
        try {
            const data = await api.get('/merchants/profile');
            setMerchantProfile(data);
        } catch (error) {
            console.error('Error fetching merchant profile:', error);
        }
    };

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const data = await api.get<Expense[]>(`/expenses?merchantId=${merchantProfile.id}&startDate=${dateRange.start}&endDate=${dateRange.end}`);
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            showToast('Failed to fetch expenses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.patch(`/expenses/${editingId}`, {
                    ...newExpense,
                    amount: Number(newExpense.amount),
                });
                showToast('Expense updated successfully', 'success');
            } else {
                await api.post('/expenses', {
                    ...newExpense,
                    amount: Number(newExpense.amount),
                    merchant_id: merchantProfile.id
                });
                showToast('Expense added successfully', 'success');
            }

            setShowAddModal(false);
            setEditingId(null);
            setNewExpense({
                description: '',
                amount: '',
                category: 'Utilities',
                date: new Date().toISOString().split('T')[0]
            });
            fetchExpenses();
        } catch (error) {
            console.error('Error saving expense:', error);
            showToast('Failed to save expense', 'error');
        }
    };

    const handleEditExpense = (expense: Expense) => {
        setNewExpense({
            description: expense.description,
            amount: String(expense.amount),
            category: expense.category,
            date: new Date(expense.date).toISOString().split('T')[0]
        });
        setEditingId(expense.id);
        setShowAddModal(true);
    };

    const handleDeleteExpense = async (id: string) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            showToast('Expense deleted', 'success');
            fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
            showToast('Failed to delete expense', 'error');
        }
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-jet font-heading">Expenses</h1>
                    <p className="text-jet-700">Track your operational costs</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-platinum-600 shadow-sm">
                        <Calendar className="h-4 w-4 text-jet-700" />
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="text-sm border-none focus:ring-0 text-jet"
                        />
                        <span className="text-jet-700">-</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="text-sm border-none focus:ring-0 text-jet"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-gold text-onyx rounded-lg font-bold hover:bg-gold/90 transition-colors flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Expense
                    </button>
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-surface p-6 rounded-xl border border-platinum-600 shadow-sm w-full md:w-1/3">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-red-600" />
                    </div>
                </div>
                <p className="text-sm text-jet-700 font-medium">Total Expenses (Period)</p>
                <h3 className="text-2xl font-bold text-jet font-heading mt-1">
                    {totalExpenses.toLocaleString()} RWF
                </h3>
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-xl border border-platinum-600 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-platinum-100">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-jet-700">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-jet-700">Description</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-jet-700">Category</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-jet-700">Amount</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-jet-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8">Loading expenses...</td>
                            </tr>
                        ) : expenses.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-jet-500">No expenses recorded for this period.</td>
                            </tr>
                        ) : (
                            expenses.map(expense => (
                                <tr key={expense.id} className="border-b border-platinum-100 hover:bg-platinum-50">
                                    <td className="py-3 px-4 text-jet">{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-jet font-medium">{expense.description}</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-platinum-200 text-jet-700">
                                            <Tag className="h-3 w-3" />
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="text-right py-3 px-4 text-jet font-bold">{Number(expense.amount).toLocaleString()} RWF</td>
                                    <td className="text-right py-3 px-4">
                                        <button
                                            onClick={() => handleEditExpense(expense)}
                                            className="text-blue-500 hover:text-blue-700 p-1 mr-2"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteExpense(expense.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Expense Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-surface w-full max-w-md rounded-xl shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-jet mb-4">Record New Expense</h3>
                        <form onSubmit={handleAddExpense} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-jet mb-1">Description</label>
                                <input
                                    type="text"
                                    value={newExpense.description}
                                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                    placeholder="e.g. Shop Rent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-jet mb-1">Amount (RWF)</label>
                                <input
                                    type="number"
                                    value={newExpense.amount}
                                    onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    className="w-full px-4 py-2 border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-jet mb-1">Category</label>
                                <select
                                    value={newExpense.category}
                                    onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                >
                                    <option value="Utilities">Utilities (Water, Electricity)</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Salary">Salary</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Supplies">Supplies</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-jet mb-1">Date</label>
                                <input
                                    type="date"
                                    value={newExpense.date}
                                    onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-jet-600 hover:bg-platinum-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gold text-onyx rounded-lg font-bold hover:bg-gold/90"
                                >
                                    Save Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
