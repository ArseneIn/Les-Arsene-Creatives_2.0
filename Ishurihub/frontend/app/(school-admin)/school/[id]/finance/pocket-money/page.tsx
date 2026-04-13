"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface PocketMoneyAccount {
    id: string;
    studentId: string;
    student: { id: string; name: string; grade: string; avatarUrl?: string; studentId: string };
    balance: number;
    currency: string;
    dailySpendingLimit: number;
    isActive: boolean;
}

interface Transaction {
    id: string;
    studentId: string;
    type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    description: string;
    paymentMethod: string;
    createdAt: string;
}

interface Summary {
    totalBalance: number;
    totalAccounts: number;
    activeAccounts: number;
    totalDeposits: number;
    totalWithdrawals: number;
}

type ModalMode = null | 'deposit' | 'withdraw';

export default function PocketMoneyPage() {
    const params = useParams();
    const schoolId = params.id as string;

    const [accounts, setAccounts] = useState<PocketMoneyAccount[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal state
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedAccount, setSelectedAccount] = useState<PocketMoneyAccount | null>(null);
    const [modalAmount, setModalAmount] = useState('');
    const [modalDesc, setModalDesc] = useState('');
    const [modalMethod, setModalMethod] = useState('Cash');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState('');

    // Tabs
    const [activeTab, setActiveTab] = useState<'wallets' | 'transactions'>('wallets');

    const fetchData = useCallback(async () => {
        if (!schoolId) return;
        setIsLoading(true);
        try {
            const [accountsRes, transactionsRes, summaryRes] = await Promise.all([
                api.get('/pocket-money/accounts', { params: { schoolId } }),
                api.get('/pocket-money/transactions', { params: { schoolId } }),
                api.get('/pocket-money/summary', { params: { schoolId } }),
            ]);
            setAccounts(accountsRes.data);
            setTransactions(transactionsRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error('Failed to fetch pocket money data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => { void fetchData(); }, [fetchData]);

    const openModal = (account: PocketMoneyAccount, mode: ModalMode) => {
        setSelectedAccount(account);
        setModalMode(mode);
        setModalAmount('');
        setModalDesc('');
        setModalMethod('Cash');
        setModalError('');
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedAccount(null);
        setModalError('');
    };

    const handleTransaction = async () => {
        if (!selectedAccount || !modalAmount || parseFloat(modalAmount) <= 0) {
            setModalError('Please enter a valid amount');
            return;
        }
        setIsSubmitting(true);
        setModalError('');
        try {
            const endpoint = modalMode === 'deposit' ? '/pocket-money/deposit' : '/pocket-money/withdraw';
            await api.post(endpoint, {
                studentId: selectedAccount.studentId,
                amount: parseFloat(modalAmount),
                description: modalDesc || undefined,
                paymentMethod: modalMethod,
                schoolId,
            });
            await fetchData();
            closeModal();
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            setModalError(axiosError?.response?.data?.message || 'Transaction failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredAccounts = accounts.filter((a) =>
        a.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.student?.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        a.student?.grade?.toLowerCase().includes(search.toLowerCase())
    );

    const formatCurrency = (amount: number, currency = 'RWF') =>
        `${currency} ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

    const typeConfig = {
        deposit: { label: 'Deposit', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: 'add_circle', sign: '+' },
        withdrawal: { label: 'Withdrawal', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: 'remove_circle', sign: '-' },
        payment: { label: 'Payment', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: 'shopping_cart', sign: '-' },
        refund: { label: 'Refund', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: 'undo', sign: '+' },
    };

    const summaryCards = [
        { label: 'Total Balance Held', value: summary ? formatCurrency(summary.totalBalance) : '—', icon: 'account_balance_wallet', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        { label: 'Active Wallets', value: summary ? `${summary.activeAccounts} / ${summary.totalAccounts}` : '—', icon: 'people', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Total Deposits', value: summary ? formatCurrency(summary.totalDeposits) : '—', icon: 'trending_up', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Total Withdrawals', value: summary ? formatCurrency(summary.totalWithdrawals) : '—', icon: 'trending_down', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pocket Money</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">Manage student wallets, deposits, and spending.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map(({ label, value, icon, color, bg }) => (
                    <div key={label} className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                            <span className={`material-symbols-outlined text-[22px] ${color}`}>{icon}</span>
                        </div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{value}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
                {(['wallets', 'transactions'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                            activeTab === tab
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                    >
                        {tab === 'wallets' ? '💳 Wallets' : '📋 Transactions'}
                    </button>
                ))}
            </div>

            {/* Wallets Tab */}
            {activeTab === 'wallets' && (
                <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>
                        <span className="text-sm text-gray-500">{filteredAccounts.length} wallets</span>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center text-gray-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto mb-2" />
                            Loading wallets...
                        </div>
                    ) : filteredAccounts.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">account_balance_wallet</span>
                            No wallets found. Wallets are auto-created on first deposit.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <th className="px-5 py-3.5">Student</th>
                                        <th className="px-5 py-3.5">Grade</th>
                                        <th className="px-5 py-3.5">Balance</th>
                                        <th className="px-5 py-3.5">Daily Limit</th>
                                        <th className="px-5 py-3.5">Status</th>
                                        <th className="px-5 py-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                    {filteredAccounts.map((account) => (
                                        <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                        {account.student?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{account.student?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-gray-400">{account.student?.studentId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{account.student?.grade}</td>
                                            <td className="px-5 py-4">
                                                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {formatCurrency(account.balance, account.currency)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-500">
                                                {account.dailySpendingLimit > 0
                                                    ? formatCurrency(account.dailySpendingLimit, account.currency)
                                                    : <span className="text-gray-300">No limit</span>}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    account.isActive
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                                }`}>
                                                    {account.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openModal(account, 'deposit')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[14px]">add</span>
                                                        Deposit
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(account, 'withdraw')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[14px]">remove</span>
                                                        Withdraw
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Last 100 transactions across all student wallets</p>
                    </div>
                    {transactions.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">receipt_long</span>
                            No transactions recorded yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {transactions.map((tx) => {
                                const cfg = typeConfig[tx.type] || typeConfig.deposit;
                                return (
                                    <div key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                                            <span className={`material-symbols-outlined text-[18px] ${cfg.text}`}>{cfg.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{tx.description || cfg.label}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {tx.paymentMethod} · {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className={`font-semibold text-sm ${cfg.text}`}>
                                                {cfg.sign} RWF {Number(tx.amount).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-400">Bal: RWF {Number(tx.balanceAfter).toLocaleString()}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Deposit / Withdraw Modal */}
            {modalMode && selectedAccount && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                    {modalMode === 'deposit' ? '💰 Deposit Funds' : '💸 Withdraw Funds'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {selectedAccount.student?.name} · Bal: {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                                </p>
                            </div>
                            <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined text-gray-400">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount (RWF)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={modalAmount}
                                    onChange={(e) => setModalAmount(e.target.value)}
                                    placeholder="e.g. 5000"
                                    className="w-full px-4 py-2.5 text-lg font-bold rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Payment Method</label>
                                <select
                                    value={modalMethod}
                                    onChange={(e) => setModalMethod(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {['Cash', 'Mobile Money', 'NFC Card', 'Bank Transfer'].map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description (optional)</label>
                                <input
                                    type="text"
                                    value={modalDesc}
                                    onChange={(e) => setModalDesc(e.target.value)}
                                    placeholder="e.g. Canteen purchase, Weekly allowance..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {modalError && (
                                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {modalError}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTransaction}
                                disabled={isSubmitting}
                                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-all ${
                                    modalMode === 'deposit'
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                } disabled:opacity-60 disabled:cursor-not-allowed`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                        Processing...
                                    </span>
                                ) : (
                                    `Confirm ${modalMode === 'deposit' ? 'Deposit' : 'Withdrawal'}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
