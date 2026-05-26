import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FileText, Search, Activity, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestResultData {
    id: string;
    wpm: number;
    accuracy: number;
    duration: number;
    createdAt: string;
    test: { title: string; difficulty: string };
    assignment: { title: string } | null;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        username: string;
        section: {
            name: string;
            intake: {
                name: string;
            };
        } | null;
    };
}

const StudentPerformance: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [results, setResults] = useState<TestResultData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Pre-fill search query if studentId is passed via URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const studentId = params.get('studentId');
        if (studentId) {
            setSearchQuery(studentId);
        }
    }, [location.search]);

    // Reset pagination on query or size changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, rowsPerPage]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                if (user?.institutionId) {
                    const res = await api.get(`/test-result/institution/${user.institutionId}`);
                    
                    // Deduplicate results to only keep the absolute latest attempt per student
                    const latestMap = new Map<string, TestResultData>();
                    
                    // Sort by createdAt descending to ensure we encounter the latest first
                    const sortedData = [...res.data].sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    
                    for (const r of sortedData) {
                        const compositeKey = r.user.id;
                        if (!latestMap.has(compositeKey)) {
                            latestMap.set(compositeKey, r);
                        }
                    }
                    
                    setResults(Array.from(latestMap.values()));
                }
            } catch (error) {
                console.error("Failed to fetch test results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [user?.institutionId]);

    const filteredResults = results.filter(r => {
        const q = searchQuery.toLowerCase();
        const fullName = `${r.user.firstName || ''} ${r.user.lastName || ''}`.toLowerCase();
        return (
            fullName.includes(q) ||
            (r.user.username && r.user.username.toLowerCase().includes(q)) ||
            r.user.id.toLowerCase().includes(q) ||
            (r.user.section?.name.toLowerCase().includes(q)) ||
            (r.user.section?.intake.name.toLowerCase().includes(q)) ||
            (r.test?.title.toLowerCase().includes(q))
        );
    });

    const totalPages = Math.ceil(filteredResults.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedResults = filteredResults.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto w-full bg-slate-50 dark:bg-[#061824] transition-colors duration-200">
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[#094A71] dark:text-[#33B974] text-3xl font-black leading-tight">Student Performance</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Review test results and track typing progress across the institution.</p>
                    </div>
                </div>
            </header>

            <div className="bg-white dark:bg-[#0A2536] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-200">
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-[#081e2b]">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#33B974]" />
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">All Test Results</h3>
                    </div>
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search student, intake, section..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#061824] border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-[#33B974] outline-none text-slate-700 dark:text-slate-200 transition-colors"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-[#081E2B] border-b border-slate-200 dark:border-white/10">
                            <tr>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-xs">Date</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-xs">Student Details</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-xs">Intake / Section</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-xs">Test</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-xs text-center">Score</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-xs text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">Loading results...</td>
                                </tr>
                            ) : paginatedResults.length > 0 ? (
                                paginatedResults.map((result) => (
                                    <tr key={result.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                                            {new Date(result.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#094A71]/10 dark:bg-[#33B974]/20 flex items-center justify-center text-[#094A71] dark:text-[#33B974]">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 dark:text-slate-200">{result.user.firstName} {result.user.lastName}</div>
                                                    <div className="text-xs text-slate-500 font-medium">ID: {result.user.id.substring(0, 8)} • {result.user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-slate-700 dark:text-slate-300 font-medium">{result.user.section?.intake?.name || 'N/A'}</div>
                                            <div className="text-xs text-slate-500">{result.user.section?.name || 'Unassigned'}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-slate-400" />
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{result.test?.title || result.assignment?.title || 'Unknown Test'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="bg-slate-100 dark:bg-[#061824] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                                                    <span className="text-[#094A71] dark:text-[#33B974] font-black">{result.wpm}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">WPM</span>
                                                </div>
                                                <div className="bg-slate-100 dark:bg-[#061824] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                                                    <span className="text-[#094A71] dark:text-[#33B974] font-black">{Math.round(result.accuracy)}%</span>
                                                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">ACC</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {(() => {
                                                const title = (result.test?.title || result.assignment?.title || '').toLowerCase();
                                                const passed = result.wpm >= 20 && result.accuracy >= 70;
                                                
                                                const isPractice = title.includes('practice') || title.includes('drill');
                                                
                                                let statusText = 'Level 1';
                                                let bgColor = 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300 border-slate-200 dark:border-white/10';

                                                if (isPractice) {
                                                    statusText = 'Practicing';
                                                    bgColor = 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20';
                                                } else if (title.includes('level 2')) {
                                                    if (passed) {
                                                        statusText = 'Passed';
                                                        bgColor = 'bg-[#33B974]/10 text-[#33B974] border-[#33B974]/20';
                                                    } else {
                                                        statusText = 'Level 2';
                                                        bgColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                                                    }
                                                } else if (title.includes('level 1')) {
                                                    if (passed) {
                                                        statusText = 'Level 2';
                                                        bgColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                                                    } else {
                                                        statusText = 'Level 1';
                                                        bgColor = 'bg-orange-500/10 text-orange-500 border-orange-500/20';
                                                    }
                                                } else {
                                                    // Fallback based on score
                                                    if (result.wpm >= 40 && result.accuracy >= 90) {
                                                        statusText = 'Passed';
                                                        bgColor = 'bg-[#33B974]/10 text-[#33B974] border-[#33B974]/20';
                                                    } else if (passed) {
                                                        statusText = 'Level 2';
                                                        bgColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                                                    } else {
                                                        statusText = 'Level 1';
                                                        bgColor = 'bg-orange-500/10 text-orange-500 border-orange-500/20';
                                                    }
                                                }

                                                return (
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${bgColor}`}>
                                                        {statusText}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Activity className="w-8 h-8 mb-3 opacity-50" />
                                            <p className="font-medium">No test results found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredResults.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-[#081e2b]">
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                            <span>
                                Showing {filteredResults.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredResults.length)} of {filteredResults.length} entries
                            </span>
                            <div className="flex items-center gap-2">
                                <span>Show</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                    className="px-2 py-1 bg-white dark:bg-[#061824] border border-slate-200 dark:border-white/10 rounded focus:ring-1 focus:ring-[#33B974] outline-none text-slate-700 dark:text-slate-200 font-bold"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 transition-colors bg-white dark:bg-[#061824]"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {(() => {
                                const pagesToShow = [];
                                const maxButtons = 5;
                                let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                                let end = Math.min(totalPages, start + maxButtons - 1);

                                if (end - start + 1 < maxButtons) {
                                    start = Math.max(1, end - maxButtons + 1);
                                }

                                for (let i = start; i <= end; i++) {
                                    pagesToShow.push(i);
                                }

                                return pagesToShow.map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                                            currentPage === page
                                                ? 'bg-[#33B974] text-white shadow-md shadow-[#33B974]/20 border border-[#33B974]'
                                                : 'border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 bg-white dark:bg-[#061824]'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ));
                            })()}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="p-2 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 transition-colors bg-white dark:bg-[#061824]"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPerformance;
