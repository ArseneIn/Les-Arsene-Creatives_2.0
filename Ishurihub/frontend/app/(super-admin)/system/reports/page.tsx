"use client";

import React from "react";

export default function SystemReportsPage() {
    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-6">System Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary/50 cursor-pointer transition-all">
                    <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">School Growth Report</h3>
                    <p className="text-sm text-slate-500">Monthly breakdown of new school registrations and churn.</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary/50 cursor-pointer transition-all">
                    <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined text-2xl">trending_up</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Financial Audits</h3>
                    <p className="text-sm text-slate-500">Detailed logs of all transaction history for accounting.</p>
                </div>
            </div>
        </div>
    );
}
