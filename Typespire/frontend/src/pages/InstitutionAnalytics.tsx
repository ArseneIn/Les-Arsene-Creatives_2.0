import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
    TrendingUp, 
    Users, 
    Award, 
    Activity,
    RefreshCw
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';

interface TestResultData {
    id: string;
    wpm: number;
    accuracy: number;
    duration: number;
    createdAt: string;
    test: { title: string; difficulty: string } | null;
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

const COLORS = ['#6366F1', '#F59E0B', '#3B82F6', '#10B981'];

const InstitutionAnalytics: React.FC = () => {
    const { user } = useAuth();
    const [results, setResults] = useState<TestResultData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            if (user?.institutionId) {
                const res = await api.get(`/test-result/institution/${user.institutionId}`);
                setResults(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch analytics data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.institutionId]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    // --- Dynamic Metrics ---
    const metrics = useMemo(() => {
        if (!results.length) {
            return { avgWpm: 0, avgAccuracy: 0, totalTests: 0, activeStudents: 0 };
        }
        const totalWpm = results.reduce((acc, r) => acc + r.wpm, 0);
        const totalAcc = results.reduce((acc, r) => acc + r.accuracy, 0);
        const uniqueStudents = new Set(results.map(r => r.user.id));

        return {
            avgWpm: Math.round(totalWpm / results.length),
            avgAccuracy: Math.round(totalAcc / results.length),
            totalTests: results.length,
            activeStudents: uniqueStudents.size
        };
    }, [results]);

    // --- Chart 1: WPM Trend Over Time (Grouped by Date) ---
    const trendData = useMemo(() => {
        if (!results.length) return [];
        
        // Group by day (YYYY-MM-DD)
        const groups: Record<string, { totalWpm: number; count: number }> = {};
        
        // Sort results by date ascending first
        const sortedResults = [...results].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        sortedResults.forEach(r => {
            const dateStr = new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (!groups[dateStr]) {
                groups[dateStr] = { totalWpm: 0, count: 0 };
            }
            groups[dateStr].totalWpm += r.wpm;
            groups[dateStr].count += 1;
        });

        return Object.entries(groups).map(([date, data]) => ({
            date,
            wpm: Math.round(data.totalWpm / data.count)
        })).slice(-10); // Keep last 10 days of activity
    }, [results]);

    // --- Chart 2: Intake Performance ---
    const intakePerformanceData = useMemo(() => {
        if (!results.length) return [];

        const intakeGroups: Record<string, { totalWpm: number; count: number }> = {};

        results.forEach(r => {
            const intakeName = r.user.section?.intake?.name || 'Unassigned';
            if (!intakeGroups[intakeName]) {
                intakeGroups[intakeName] = { totalWpm: 0, count: 0 };
            }
            intakeGroups[intakeName].totalWpm += r.wpm;
            intakeGroups[intakeName].count += 1;
        });

        return Object.entries(intakeGroups).map(([name, data]) => ({
            name,
            wpm: Math.round(data.totalWpm / data.count)
        }));
    }, [results]);

    // --- Chart 3: Student Level Distribution ---
    // Calculates the highest level achieved by each student
    const levelDistribution = useMemo(() => {
        if (!results.length) return [];

        const studentStatusMap: Record<string, string> = {};

        results.forEach(r => {
            const studentId = r.user.id;
            const title = (r.test?.title || r.assignment?.title || '').toLowerCase();
            const passed = r.wpm >= 20 && r.accuracy >= 70;
            const isPractice = title.includes('practice') || title.includes('drill');

            let currentStatus = 'Practicing';
            if (!isPractice) {
                if (title.includes('level 2') && passed) {
                    currentStatus = 'Passed';
                } else if ((title.includes('level 1') && passed) || title.includes('level 2')) {
                    currentStatus = 'Level 2';
                } else {
                    currentStatus = 'Level 1';
                }
            }

            // Prioritize higher status
            const statusPriority: Record<string, number> = {
                'Practicing': 0,
                'Level 1': 1,
                'Level 2': 2,
                'Passed': 3
            };

            const existingStatus = studentStatusMap[studentId] || 'Practicing';
            if (statusPriority[currentStatus] > statusPriority[existingStatus]) {
                studentStatusMap[studentId] = currentStatus;
            } else if (!studentStatusMap[studentId]) {
                studentStatusMap[studentId] = existingStatus;
            }
        });

        const statusCounts: Record<string, number> = {
            'Practicing': 0,
            'Level 1': 0,
            'Level 2': 0,
            'Passed': 0
        };

        Object.values(studentStatusMap).forEach(status => {
            statusCounts[status]++;
        });

        return Object.entries(statusCounts).map(([name, value]) => ({
            name,
            value
        })).filter(item => item.value > 0);
    }, [results]);

    // --- Top Performers (Best WPM) ---
    const topPerformers = useMemo(() => {
        if (!results.length) return [];

        // Get unique users with their absolute best score
        const bestScoresMap: Record<string, TestResultData> = {};

        results.forEach(r => {
            const studentId = r.user.id;
            if (!bestScoresMap[studentId] || r.wpm > bestScoresMap[studentId].wpm) {
                bestScoresMap[studentId] = r;
            }
        });

        return Object.values(bestScoresMap)
            .sort((a, b) => b.wpm - a.wpm)
            .slice(0, 5);
    }, [results]);

    if (loading) {
        return (
            <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[500px]">
                <RefreshCw className="w-8 h-8 text-[#33B974] animate-spin mb-4" />
                <p className="text-slate-500 font-medium dark:text-slate-400">Loading comprehensive analytics...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 lg:px-8 bg-slate-50 dark:bg-[#061824] transition-colors duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Analytics Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
                        Real-time student progress tracking, intake benchmarks, and overall statistics.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#0A2536] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#081E2B] transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh Analytics
                </button>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* WPM Card */}
                <div className="bg-white dark:bg-[#0A2536] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 rounded-bl-2xl">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Avg. Typing Speed</h3>
                    <div className="flex items-end gap-1.5 mt-2">
                        <span className="text-4xl font-black text-slate-800 dark:text-white">{metrics.avgWpm}</span>
                        <span className="text-sm font-bold text-slate-400 mb-1.5">WPM</span>
                    </div>
                    <div className="mt-3 text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <span>Institution Avg</span>
                    </div>
                </div>

                {/* Accuracy Card */}
                <div className="bg-white dark:bg-[#0A2536] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-blue-500/10 rounded-bl-2xl">
                        <Award className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Avg. Accuracy</h3>
                    <div className="flex items-end gap-1 mt-2">
                        <span className="text-4xl font-black text-slate-800 dark:text-white">{metrics.avgAccuracy}%</span>
                    </div>
                    <div className="mt-3 text-xs font-bold text-blue-500 flex items-center gap-1">
                        <span>Typing Precision</span>
                    </div>
                </div>

                {/* Total Tests Card */}
                <div className="bg-white dark:bg-[#0A2536] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-indigo-500/10 rounded-bl-2xl">
                        <Activity className="w-5 h-5 text-indigo-500" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Total Tests Completed</h3>
                    <div className="flex items-end gap-1 mt-2">
                        <span className="text-4xl font-black text-slate-800 dark:text-white">{metrics.totalTests}</span>
                        <span className="text-sm font-bold text-slate-400 mb-1.5">Completed</span>
                    </div>
                    <div className="mt-3 text-xs font-bold text-indigo-500 flex items-center gap-1">
                        <span>All attempts tracked</span>
                    </div>
                </div>

                {/* Active Students Card */}
                <div className="bg-white dark:bg-[#0A2536] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-amber-500/10 rounded-bl-2xl">
                        <Users className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Active Students</h3>
                    <div className="flex items-end gap-1 mt-2">
                        <span className="text-4xl font-black text-slate-800 dark:text-white">{metrics.activeStudents}</span>
                        <span className="text-sm font-bold text-slate-400 mb-1.5">Students</span>
                    </div>
                    <div className="mt-3 text-xs font-bold text-amber-500 flex items-center gap-1">
                        <span>Taken at least one test</span>
                    </div>
                </div>
            </div>

            {/* Main Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* WPM Trend Chart */}
                <div className="bg-white dark:bg-[#0A2536] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Typing Speed Trend</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Average WPM progress over the last 10 days of testing</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#33B974" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#33B974" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0A2536', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="wpm" name="Avg WPM" stroke="#33B974" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">No test data available for trend.</div>
                        )}
                    </div>
                </div>

                {/* Intake Performance Chart */}
                <div className="bg-white dark:bg-[#0A2536] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Performance by Intake</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Average typing speed comparison across Intakes</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        {intakePerformanceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={intakePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0A2536', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} />
                                    <Bar dataKey="wpm" name="Avg WPM" fill="#6366F1" radius={[8, 8, 0, 0]}>
                                        {intakePerformanceData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">No intake data available.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lower Grid: Student level distribution & Top performers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Level Distribution Pie Chart */}
                <div className="bg-white dark:bg-[#0A2536] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm lg:col-span-1">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">Student Progress Breakdown</h3>
                    <p className="text-xs text-slate-400 mb-6">Distribution of active students across curriculum milestones</p>
                    <div className="h-64 w-full flex flex-col justify-between">
                        {levelDistribution.length > 0 ? (
                            <>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={levelDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {levelDistribution.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#0A2536', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                                    {levelDistribution.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-1.5 text-xs font-bold">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-slate-500 dark:text-slate-300">{entry.name} ({entry.value})</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">No milestone data found.</div>
                        )}
                    </div>
                </div>

                {/* Top Performers Table */}
                <div className="bg-white dark:bg-[#0A2536] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Top Typists</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Top performing students ranked by their absolute best WPM</p>
                        </div>
                        <Award className="w-6 h-6 text-[#33B974]" />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-white/5 pb-3">
                                    <th className="py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rank</th>
                                    <th className="py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Student</th>
                                    <th className="py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Intake / Section</th>
                                    <th className="py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Best WPM</th>
                                    <th className="py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Accuracy</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {topPerformers.length > 0 ? (
                                    topPerformers.map((result, index) => (
                                        <tr key={result.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="py-3.5 font-black text-slate-400 dark:text-slate-500">
                                                {index === 0 ? '🏆 1st' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : `${index + 1}th`}
                                            </td>
                                            <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                                                {result.user.firstName} {result.user.lastName}
                                            </td>
                                            <td className="py-3.5 text-slate-500">
                                                {result.user.section?.intake?.name || 'N/A'} • {result.user.section?.name || 'Unassigned'}
                                            </td>
                                            <td className="py-3.5 text-right font-black text-emerald-500 text-base">
                                                {result.wpm} <span className="text-[10px] text-slate-400 font-bold uppercase">wpm</span>
                                            </td>
                                            <td className="py-3.5 text-right font-bold text-slate-700 dark:text-slate-300">
                                                {Math.round(result.accuracy)}%
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400">No student records found to rank.</td>
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

export default InstitutionAnalytics;
