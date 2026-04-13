"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthContext } from '@/context/AuthContext';

interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    description: string;
    paymentMethod: string;
    createdAt: string;
}

interface WalletAccount {
    id: string;
    balance: number;
    currency: string;
    dailySpendingLimit: number;
    isActive: boolean;
}

const typeConfig = {
    deposit: { label: 'Deposit', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: 'add_circle', sign: '+' },
    withdrawal: { label: 'Withdrawal', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: 'remove_circle', sign: '-' },
    payment: { label: 'Payment', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: 'shopping_cart', sign: '-' },
    refund: { label: 'Refund', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: 'undo', sign: '+' },
};

export default function StudentPocketMoneyPage() {
    const params = useParams();
    const schoolId = params.id as string;
    const { user } = useAuthContext();

    const [account, setAccount] = useState<WalletAccount | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const studentRecordId = (user as { studentRecordId?: string })?.studentRecordId;
            if (!studentRecordId) {
                setError('Student record not linked. Please contact your administrator.');
                setIsLoading(false);
                return;
            }
            try {
                const res = await api.get(`/pocket-money/student/${studentRecordId}`);
                setAccount(res.data.account);
                setTransactions(res.data.transactions || []);
            } catch {
                setError('Unable to load your wallet. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const formatCurrency = (amount: number, currency = 'RWF') =>
        `${currency} ${Number(amount).toLocaleString()}`;

    const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount), 0);
    const totalSpent = transactions.filter(t => t.type !== 'deposit' && t.type !== 'refund').reduce((s, t) => s + Number(t.amount), 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Loading your wallet...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="max-w-md mx-auto text-center py-16">
                    <span className="material-symbols-outlined text-6xl text-gray-300 block mb-4">account_balance_wallet</span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Wallet Unavailable</h2>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    const balance = account ? Number(account.balance) : 0;
    const balancePct = Math.min(100, (balance / Math.max(totalDeposits, 1)) * 100);

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">Your pocket money balance and spending history.</p>
            </div>

            {/* Balance Hero */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/30">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl" />
                <div className="relative z-10">
                    <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-2">Current Balance</p>
                    <h2 className="text-5xl font-black tracking-tight mb-1">{formatCurrency(balance, account?.currency)}</h2>
                    <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                        <div className="h-2 rounded-full bg-white transition-all" style={{ width: `${balancePct}%` }} />
                    </div>
                    <p className="text-indigo-200 text-xs mt-2 font-medium">
                        {account?.dailySpendingLimit && account.dailySpendingLimit > 0
                            ? `Daily limit: ${formatCurrency(account.dailySpendingLimit, account.currency)}`
                            : 'No daily spending limit set'}
                    </p>
                </div>
                <span className="material-symbols-outlined absolute bottom-4 right-6 text-[80px] text-white/10">account_balance_wallet</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[22px] text-emerald-600 dark:text-emerald-400">trending_up</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalDeposits, account?.currency)}</div>
                    <div className="text-sm text-gray-500 mt-0.5">Total Received</div>
                </div>
                <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[22px] text-red-600 dark:text-red-400">trending_down</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalSpent, account?.currency)}</div>
                    <div className="text-sm text-gray-500 mt-0.5">Total Spent</div>
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Transaction History</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} recorded</p>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">receipt_long</span>
                        <p className="font-medium">No transactions yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Transactions will appear here once your wallet is funded.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {transactions.map((tx) => {
                            const cfg = typeConfig[tx.type] || typeConfig.deposit;
                            return (
                                <div key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                                        <span className={`material-symbols-outlined text-[20px] ${cfg.text}`}>{cfg.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{tx.description || cfg.label}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {tx.paymentMethod} · {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className={`font-bold text-sm ${cfg.text}`}>
                                            {cfg.sign} {formatCurrency(tx.amount, account?.currency)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">Bal: {formatCurrency(tx.balanceAfter, account?.currency)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
