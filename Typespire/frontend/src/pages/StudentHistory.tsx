import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '../context/UserProgressContext';
import type { TestResult } from '../context/UserProgressContext';
import { useAuth } from '../context/AuthContext';
import { useFacilitator } from '../context/FacilitatorContext';

type DisplayStatus = 'All' | 'Completed' | 'Missed';
type DisplayResult = Omit<TestResult, 'status'> & { status: 'Completed' | 'Missed' };

const StudentHistory: React.FC = () => {
    const { recentResults, getBenchmark } = useUserProgress();
    const { user } = useAuth();
    const { assignments } = useFacilitator();
    const navigate = useNavigate();
    
    const [filter, setFilter] = useState<DisplayStatus>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [now] = useState(() => Date.now());
    const itemsPerPage = 10;

    const currentUserId = user?.id || '';
    const currentUserSectionId = user?.sectionId || '';

    const allHistory = useMemo(() => {
        const highestResultsMap = new Map<string, DisplayResult>();
        const finalResults: DisplayResult[] = [];

        recentResults.forEach(r => {
            const mapped: DisplayResult = { ...r, status: (r.status === 'Completed' ? 'Completed' : 'Missed') as 'Completed' | 'Missed' };
            if (r.assignmentId) {
                const existing = highestResultsMap.get(r.assignmentId);
                if (!existing || mapped.wpm > existing.wpm) {
                    highestResultsMap.set(r.assignmentId, mapped);
                }
            } else {
                finalResults.push(mapped);
            }
        });

        highestResultsMap.forEach(r => finalResults.push(r));

        const hasPassedLevel1 = recentResults.some(r => {
            if (r.testLevel !== 1) return false;
            const targetWpm = r.wpmRequirement ?? 50;
            const targetAcc = r.accuracyRequirement ?? 90;
            return r.wpm >= targetWpm && r.accuracy >= targetAcc;
        });

        const systemLevel = hasPassedLevel1 ? 2 : 1;

        const allAssigned = assignments.filter(a =>
            a.status === 'Active' &&
            ((a.sectionId === currentUserSectionId) || (a.studentIds && a.studentIds.includes(currentUserId))) &&
            a.level === systemLevel
        );

        allAssigned.forEach(a => {
            const isExpired = a.dueDateISO ? new Date(a.dueDateISO).getTime() < now : false;
            const attemptsMade = recentResults.filter(r => r.assignmentId === a.id).length;
            
            if (isExpired && attemptsMade === 0) {
                finalResults.push({
                    id: a.id,
                    date: a.dueDate || 'Past',
                    testName: a.title,
                    wpm: 0,
                    accuracy: 0,
                    duration: a.duration || 60,
                    status: 'Missed',
                    assignmentId: a.id
                });
            }
        });

        // Sort by date descending
        return finalResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [recentResults, assignments, currentUserId, currentUserSectionId, now]);

    const filteredResults = useMemo(() => {
        return filter === 'All' ? allHistory : allHistory.filter(r => r.status === filter);
    }, [filter, allHistory]);

    const totalPages = Math.ceil(filteredResults.length / itemsPerPage) || 1;
    const paginatedResults = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredResults.slice(start, start + itemsPerPage);
    }, [filteredResults, currentPage]);

    const handleFilterChange = (newFilter: DisplayStatus) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

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
                        {(['All', 'Completed', 'Missed'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleFilterChange(tab)}
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
                                    <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {paginatedResults.length > 0 ? (
                                    paginatedResults.map((result) => (
                                        <tr key={result.id} className="group border-b border-slate-100 dark:border-[#323b67]/45 hover:bg-slate-50 dark:hover:bg-[#232948] transition-colors last:border-0">
                                            <td className="py-4.5 px-6 text-slate-600 dark:text-slate-300 font-semibold">{result.date}</td>
                                            <td className="py-4.5 px-6 font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200">{result.testName}</td>
                                            <td className="py-4.5 px-6 text-slate-700 dark:text-slate-200 font-mono font-bold text-base">{result.status === 'Missed' ? '-' : result.wpm}</td>
                                            <td className={`py-4.5 px-6 font-bold font-mono text-base ${result.accuracy >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                {result.status === 'Missed' ? '-' : `${result.accuracy}%`}
                                            </td>
                                            <td className="py-4.5 px-6">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${result.status === 'Completed'
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                        : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {result.status === 'Completed' ? 'check_circle' : 'block'}
                                                    </span>
                                                    {result.status}
                                                </span>
                                            </td>
                                            <td className="py-4.5 px-6 text-right">
                                                {result.status === 'Completed' ? (
                                                    <button
                                                        onClick={() => {
                                                            const isL2 = result.testLevel === 2;
                                                            const bm = result.stageId 
                                                                ? getBenchmark(result.stageId) 
                                                                : { wpm: 50, accuracy: isL2 ? 92 : 90 };
                                                            const isPassed = result.wpm >= bm.wpm && result.accuracy >= bm.accuracy;
                                                            
                                                            navigate('/results', {
                                                                state: {
                                                                    wpm: result.wpm,
                                                                    accuracy: result.accuracy,
                                                                    passed: isPassed,
                                                                    benchmark: bm,
                                                                    strugglingKeys: result.strugglingKeys || {},
                                                                    stageId: result.stageId,
                                                                    testTitle: result.testName,
                                                                    assignmentId: result.assignmentId,
                                                                }
                                                            });
                                                        }}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-emerald-600 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                        View
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400 dark:text-slate-600 font-bold">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
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
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-[#323b67] bg-slate-50 dark:bg-[#1a1f37]">
                            <div className="text-sm text-slate-500 dark:text-[#929bc9]">
                                Showing <span className="font-bold text-slate-700 dark:text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-slate-700 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredResults.length)}</span> of <span className="font-bold text-slate-700 dark:text-white">{filteredResults.length}</span> results
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232948] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_left</span> Prev
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232948] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold flex items-center gap-1"
                                >
                                    Next <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentHistory;
