import React, { useState } from 'react';
import { useUserProgress } from '../context/UserProgressContext';

const StudentHistory: React.FC = () => {
    const { recentResults } = useUserProgress();
    const [filter, setFilter] = useState<'All' | 'Completed' | 'Incomplete'>('All');

    const filteredResults = filter === 'All'
        ? recentResults
        : recentResults.filter(r => r.status === filter);

    return (
        <div className="layout-container flex flex-col items-center w-full py-8 px-4 md:px-8 lg:px-12">
            <div className="max-w-[1200px] w-full flex flex-col gap-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                            Activity History
                        </h1>
                        <p className="text-slate-500 dark:text-[#929bc9] text-base font-normal">
                            Track your progress over time.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-slate-100 dark:bg-[#323b67] p-1 rounded-lg self-start md:self-auto">
                        {(['All', 'Completed', 'Incomplete'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === tab
                                        ? 'bg-white dark:bg-card-dark text-primary shadow-sm'
                                        : 'text-slate-500 dark:text-[#929bc9] hover:text-slate-700 dark:hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                {/* History Table */}
                <div className="rounded-xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark shadow-sm overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-[#323b67] bg-slate-50/50 dark:bg-[#323b67]/20">
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Date</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Test Name</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">WPM</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Accuracy</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredResults.length > 0 ? (
                                    filteredResults.map((result) => (
                                        <tr key={result.id} className="group border-b border-slate-100 dark:border-[#323b67]/50 hover:bg-slate-50 dark:hover:bg-[#232948] transition-colors last:border-0">
                                            <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">{result.date}</td>
                                            <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{result.testName}</td>
                                            <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono text-base">{result.wpm}</td>
                                            <td className={`py-4 px-6 font-bold font-mono text-base ${result.accuracy >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                {result.accuracy}%
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${result.status === 'Completed'
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                        : 'bg-slate-100 dark:bg-[#323b67] text-slate-600 dark:text-slate-300'
                                                    }`}>
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {result.status === 'Completed' ? 'check_circle' : 'history'}
                                                    </span>
                                                    {result.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-[#929bc9]">
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">history_edu</span>
                                            <p>No records found for this filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentHistory;
