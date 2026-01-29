"use client";

import { useState } from "react";
import { mockTransactions, financeStats, Transaction } from "@/data/finance";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function FinancePage() {
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const params = useParams();
    const schoolId = params.id as string;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(amount);
    };

    return (
        <div className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 pb-4">
                    <Link href={`/school/${schoolId}/dashboard`} className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium hover:text-primary">Home</Link>
                    <span className="text-[#4c4c9a] dark:text-gray-600 text-sm font-medium">/</span>
                    <span className="text-black dark:text-white text-sm font-bold">Financial Overview</span>
                </div>

                {/* PageHeading */}
                <div className="flex flex-wrap justify-between items-end gap-3 pb-6">
                    <div className="flex min-w-72 flex-col gap-1">
                        <h1 className="text-black dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Finance & Fees</h1>
                        <p className="text-[#4c4c9a] dark:text-gray-400 text-base font-normal">Monitor revenue, track fee payments, and manage expenses.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex min-w-[120px] items-center justify-center rounded-lg h-11 px-5 bg-white border border-[#cfcfe7] dark:bg-white/5 dark:border-white/10 text-black dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
                            <span className="material-symbols-outlined text-[18px] mr-2">print</span>
                            Report
                        </button>
                        <button className="flex min-w-[140px] items-center justify-center rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all">
                            <span className="material-symbols-outlined text-[18px] mr-2">add_card</span>
                            Record Payment
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#cfcfe7] dark:border-white/10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl text-green-600">payments</span>
                        </div>
                        <p className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-black dark:text-white">{formatCurrency(financeStats.totalRevenue)}</h3>
                        <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            +12% vs last term
                        </p>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#cfcfe7] dark:border-white/10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl text-red-600">pending_actions</span>
                        </div>
                        <p className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium mb-1">Outstanding Fees</p>
                        <h3 className="text-3xl font-bold text-black dark:text-white">{formatCurrency(financeStats.outstandingFees)}</h3>
                        <p className="text-red-500 text-xs font-bold mt-2">Needs attention</p>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#cfcfe7] dark:border-white/10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl text-blue-600">account_balance</span>
                        </div>
                        <p className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium mb-1">Net Income</p>
                        <h3 className="text-3xl font-bold text-black dark:text-white">{formatCurrency(financeStats.netIncome)}</h3>
                        <p className="text-[#4c4c9a] dark:text-gray-500 text-xs mt-2">After expenses</p>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white dark:bg-white/5 rounded-xl border border-[#cfcfe7] dark:border-white/10 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#cfcfe7] dark:border-white/10 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-black dark:text-white">Recent Transactions</h3>
                        <button className="text-primary text-sm font-bold hover:underline">View All</button>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8f8fc] dark:bg-white/5 border-b border-[#cfcfe7] dark:border-white/10">
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#cfcfe7] dark:divide-white/10">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono text-xs text-[#4c4c9a] dark:text-gray-400">{txn.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-black dark:text-white text-sm font-bold">{txn.studentName}</p>
                                            <p className="text-[#4c4c9a] dark:text-gray-500 text-xs">{txn.studentId}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-black dark:text-white text-sm">{txn.type}</span>
                                        <p className="text-[#4c4c9a] dark:text-gray-500 text-xs">{txn.method}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-black dark:text-white text-sm font-bold">{formatCurrency(txn.amount)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[#4c4c9a] dark:text-gray-400 text-sm">{txn.date}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${txn.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                            txn.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                            }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
