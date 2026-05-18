import React, { useState } from 'react';
import { useUserProgress } from '../context/UserProgressContext';

const StudentHistory: React.FC = () => {
    const { recentResults } = useUserProgress();
    const [filter, setFilter] = useState<'All' | 'Completed' | 'Incomplete'>('All');

    const filteredResults = filter === 'All'
        ? recentResults
        : recentResults.filter(r => r.status === filter);

    return (
        <div className="w-full py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center">
            <div className="max-w-[1200px] w-full flex flex-col gap-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-5">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                            Activity History
                        </h1>
                        <p className="text-slate-500 dark:text-[#929bc9] text-base font-normal">
                            Deep dive into your complete typing trials and skill evolution.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-slate-100 dark:bg-[#232948] p-1.5 rounded-xl self-start md:self-auto border border-slate-200/50 dark:border-slate-800/80 shadow-inner">
                        {(['All', 'Completed', 'Incomplete'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover-scale active-scale ${filter === tab
                                        ? 'bg-white dark:bg-card-dark text-primary shadow-md shadow-black/5 dark:shadow-black/20'
                                        : 'text-slate-500 dark:text-[#929bc9] hover:text-slate-800 dark:hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                {/* History Table Container */}
                <div className="rounded-2xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark shadow-md overflow-hidden flex flex-col">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[650px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-[#323b67] bg-slate-50/70 dark:bg-[#323b67]/25 pb-3">
                                    <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Date</th>
                                    <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Test Name</th>
                                    <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">WPM</th>
                                    <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Accuracy</th>
                                    <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredResults.length > 0 ? (
                                    filteredResults.map((result) => (
                                        <tr key={result.id} className="group border-b border-slate-100 dark:border-[#323b67]/45 hover:bg-slate-50 dark:hover:bg-[#232948] transition-colors last:border-0">
                                            <td className="py-4.5 px-6 text-slate-600 dark:text-slate-300 font-semibold">{result.date}</td>
                                            <td className="py-4.5 px-6 font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200">{result.testName}</td>
                                            <td className="py-4.5 px-6 text-slate-700 dark:text-slate-200 font-mono font-bold text-base">{result.wpm}</td>
                                            <td className={`py-4.5 px-6 font-bold font-mono text-base ${result.accuracy >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                {result.accuracy}%
                                            </td>
                                            <td className="py-4.5 px-6">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${result.status === 'Completed'
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
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="p-4 bg-slate-100 dark:bg-[#323b67]/40 rounded-2xl text-slate-400 dark:text-[#929bc9] shadow-sm">
                                                    <span className="material-symbols-outlined text-4xl flex items-center justify-center">history_edu</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight mt-2">No Records Found</h3>
                                                <p className="text-slate-400 dark:text-[#929bc9] text-sm max-w-xs font-normal">
                                                    You haven't completed any typing sessions in this category yet.
                                                </p>
                                            </div>
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
