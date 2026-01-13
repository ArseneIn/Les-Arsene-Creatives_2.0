import React from 'react';

const PlatformBilling: React.FC = () => {
    const plans = [
        { name: 'Starter', price: '$0', features: ['Up to 50 students', 'Basic Analytics', 'Email Support'], active: false },
        { name: 'Growth', price: '$199', features: ['Up to 500 students', 'Advanced Analytics', 'Priority Support', 'Custom Branding'], active: true },
        { name: 'Enterprise', price: 'Custom', features: ['Unlimited students', 'API Access', 'Dedicated Manager', 'SLA'], active: false },
    ];

    const transactions = [
        { id: 'INV-001', institution: 'Oxford Academy', date: 'Oct 24, 2023', amount: '$199.00', status: 'Paid' },
        { id: 'INV-002', institution: 'Cambridge High', date: 'Oct 23, 2023', amount: '$450.00', status: 'Paid' },
        { id: 'INV-003', institution: 'Tech Institute', date: 'Oct 22, 2023', amount: '$199.00', status: 'Pending' },
        { id: 'INV-004', institution: 'Global School', date: 'Oct 21, 2023', amount: '$899.00', status: 'Paid' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing & Plans</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage subscription plans and view revenue.</p>
                </div>
                <button className="bg-admin-primary text-navy-blue px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Create New Plan
                </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.name} className={`relative p-6 rounded-xl border ${plan.active ? 'border-admin-primary bg-admin-primary/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                        {plan.active && (
                            <span className="absolute top-4 right-4 px-2 py-1 bg-admin-primary text-navy-blue text-xs font-bold rounded-full">MOST POPULAR</span>
                        )}
                        <h3 className="text-lg font-bold">{plan.name}</h3>
                        <div className="mt-2 mb-6">
                            <span className="text-3xl font-bold">{plan.price}</span>
                            <span className="text-slate-500 text-sm">/month</span>
                        </div>
                        <ul className="space-y-3 mb-6">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Edit Plan
                        </button>
                    </div>
                ))}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold">Recent Transactions</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Invoice ID</th>
                            <th className="px-6 py-4">Institution</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-mono text-sm">{tx.id}</td>
                                <td className="px-6 py-4 font-medium">{tx.institution}</td>
                                <td className="px-6 py-4 text-slate-500">{tx.date}</td>
                                <td className="px-6 py-4 font-bold">{tx.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-admin-primary">
                                        <span className="material-symbols-outlined">download</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlatformBilling;
