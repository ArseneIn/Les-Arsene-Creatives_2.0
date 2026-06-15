import React, { useState, useEffect, useMemo } from 'react';
import { useFacilitator } from '../context/FacilitatorContext';
import api from '../api/axios';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';

interface TestResultDB {
    id: string;
    wpm: number;
    accuracy: number;
    duration: number;
    createdAt: string;
    userId: string;
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        username: string;
        email: string | null;
    };
    test?: {
        title: string;
        difficulty: string;
    } | null;
    assignment?: {
        title: string;
    } | null;
}

const FacilitatorAnalytics: React.FC = () => {
    const { students, sections } = useFacilitator();

    const [selectedSectionId, setSelectedSectionId] = useState<string>('All');
    const [testResults, setTestResults] = useState<TestResultDB[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch test results for selected section(s)
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                if (sections.length === 0) {
                    setTestResults([]);
                    setLoading(false);
                    return;
                }
                
                let resultsData: TestResultDB[] = [];
                if (selectedSectionId === 'All') {
                    const promises = sections.map(sec => api.get(`/test-result/section/${sec.id}`));
                    const responses = await Promise.all(promises);
                    responses.forEach(res => {
                        if (res.data) {
                            resultsData = [...resultsData, ...res.data];
                        }
                    });
                } else {
                    const res = await api.get(`/test-result/section/${selectedSectionId}`);
                    if (res.data) {
                        resultsData = res.data;
                    }
                }
                setTestResults(resultsData);
            } catch (err) {
                console.error("Failed to fetch section results", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [selectedSectionId, sections]);

    // Filter active students based on selection
    const activeSectionStudents = useMemo(() => {
        if (selectedSectionId === 'All') {
            return students;
        }
        return students.filter(s => s.sectionId === selectedSectionId);
    }, [students, selectedSectionId]);

    // Calculate actual aggregates from filtered students list
    const totalEnrolled = activeSectionStudents.length;
    const avgSpeed = activeSectionStudents.length > 0 
        ? Math.round(activeSectionStudents.reduce((sum, s) => sum + s.currentWpm, 0) / activeSectionStudents.length)
        : 0;

    // Students with speed below 20 WPM (needs attention)
    const needsAttentionCount = activeSectionStudents.filter(s => s.currentWpm < 20).length;

    // 1. Group results chronologically by date for the area chart
    const progressionChartData = useMemo(() => {
        if (!testResults || testResults.length === 0) return [];

        // Group by YYYY-MM-DD
        const groups: Record<string, { wpmSum: number; accuracySum: number; count: number }> = {};
        
        testResults.forEach(r => {
            const dateStr = new Date(r.createdAt).toISOString().split('T')[0];
            if (!groups[dateStr]) {
                groups[dateStr] = { wpmSum: 0, accuracySum: 0, count: 0 };
            }
            groups[dateStr].wpmSum += r.wpm;
            groups[dateStr].accuracySum += r.accuracy;
            groups[dateStr].count += 1;
        });

        // Convert, sort, and map
        return Object.entries(groups)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([dateStr, data]) => {
                const [, month, day] = dateStr.split('-');
                return {
                    date: `${month}/${day}`,
                    wpm: Math.round(data.wpmSum / data.count),
                    accuracy: Math.round(data.accuracySum / data.count),
                };
            });
    }, [testResults]);

    // 2. Speed ranges distribution
    const speedDistributionData = useMemo(() => {
        const studentBestWpm: Record<string, number> = {};
        
        activeSectionStudents.forEach(s => {
            studentBestWpm[s.id] = s.currentWpm; // Fallback
        });

        testResults.forEach(r => {
            if (studentBestWpm[r.userId] !== undefined) {
                studentBestWpm[r.userId] = Math.max(studentBestWpm[r.userId], r.wpm);
            }
        });

        const brackets = {
            '< 20 WPM': 0,
            '20-30 WPM': 0,
            '30-40 WPM': 0,
            '40-50 WPM': 0,
            '50+ WPM': 0,
        };

        Object.values(studentBestWpm).forEach(wpm => {
            if (wpm < 20) brackets['< 20 WPM']++;
            else if (wpm < 30) brackets['20-30 WPM']++;
            else if (wpm < 40) brackets['30-40 WPM']++;
            else if (wpm < 50) brackets['40-50 WPM']++;
            else brackets['50+ WPM']++;
        });

        return Object.entries(brackets).map(([range, count]) => ({
            range,
            students: count,
        }));
    }, [activeSectionStudents, testResults]);

    // 3. Accuracy brackets distribution
    const accuracyDistributionData = useMemo(() => {
        const studentBestAcc: Record<string, number> = {};
        
        activeSectionStudents.forEach(s => {
            studentBestAcc[s.id] = s.accuracy; // Fallback
        });

        testResults.forEach(r => {
            if (studentBestAcc[r.userId] !== undefined) {
                studentBestAcc[r.userId] = Math.max(studentBestAcc[r.userId], r.accuracy);
            }
        });

        const brackets = {
            'Below 80%': 0,
            '80% - 90%': 0,
            '90% - 95%': 0,
            '95% - 100%': 0,
        };

        Object.values(studentBestAcc).forEach(acc => {
            if (acc < 80) brackets['Below 80%']++;
            else if (acc < 90) brackets['80% - 90%']++;
            else if (acc < 95) brackets['90% - 95%']++;
            else brackets['95% - 100%']++;
        });

        const COLORS_MAP = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

        return Object.entries(brackets).map(([range, count], idx) => ({
            name: range,
            value: count,
            color: COLORS_MAP[idx],
        })).filter(item => item.value > 0);
    }, [activeSectionStudents, testResults]);

    // 4. Recent student activities
    const recentAttempts = useMemo(() => {
        return [...testResults]
            .reverse()
            .slice(0, 8)
            .map(r => {
                const name = r.user 
                    ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() || r.user.username
                    : 'Unknown Student';
                return {
                    id: r.id,
                    studentName: name,
                    testTitle: r.assignment?.title || r.test?.title || 'Practice Sprint',
                    wpm: r.wpm,
                    accuracy: r.accuracy,
                    date: new Date(r.createdAt).toLocaleDateString() + ' ' + new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
            });
    }, [testResults]);

    const activeSectionName = selectedSectionId === 'All' 
        ? 'All Sections' 
        : sections.find(s => s.id === selectedSectionId)?.name || 'Class Section';

    return (
        <>
            {/* Page Heading and Section Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex-1">
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight font-heading mb-2">Class Analytics</h1>
                    <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base font-normal max-w-2xl">
                        Monitor typing progress aggregates, speeds, and student segments assigned to your sections.
                    </p>
                </div>
                
                {sections.length > 0 && (
                    <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
                        <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Class Filter:</label>
                        <div className="relative">
                            <select
                                value={selectedSectionId}
                                onChange={e => setSelectedSectionId(e.target.value)}
                                className="appearance-none rounded-xl bg-white dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-2.5 pl-4 pr-10 text-sm font-semibold outline-none focus:border-primary/60 min-w-[180px] shadow-sm"
                            >
                                <option value="All">All Sections</option>
                                {sections.map(sec => (
                                    <option key={sec.id} value={sec.id}>{sec.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Avg Speed */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-lg pointer-events-none"></div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider mb-2">Avg. Class Speed</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white font-heading">{avgSpeed}</span>
                        <span className="text-sm font-bold text-slate-400 dark:text-[#636b95] mb-1">WPM</span>
                    </div>
                    <div className="mt-4 flex items-center text-slate-400 dark:text-[#929bc9] text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                        <span>Active class speed trend</span>
                    </div>
                </div>

                {/* Total Enrolled */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm relative overflow-hidden group">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider mb-2">Total Roster Enrolled</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white font-heading">{totalEnrolled}</span>
                        <span className="text-sm font-bold text-slate-400 dark:text-[#636b95] mb-1">Students</span>
                    </div>
                    <div className="mt-4 flex items-center text-slate-400 dark:text-[#929bc9] text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm mr-1">supervised_user_circle</span>
                        <span>Active in Kepler database</span>
                    </div>
                </div>

                {/* Needs Attention */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm relative overflow-hidden group border-l-4 border-l-amber-500">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider mb-2">Needs Attention</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white font-heading">{needsAttentionCount}</span>
                        <span className="text-sm font-bold text-slate-400 dark:text-[#636b95] mb-1">Students</span>
                    </div>
                    <div className="mt-4 flex items-center text-amber-600 dark:text-amber-400 text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm mr-1">warning</span>
                        <span>Below 20 WPM</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm">
                    <span className="material-symbols-outlined text-4xl animate-spin text-primary mb-3">sync</span>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Fetching detailed analytics...</p>
                </div>
            ) : testResults.length === 0 ? (
                /* Empty state */
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 text-slate-400">
                        <span className="material-symbols-outlined text-4xl">monitoring</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">Performance Charts</h3>
                    <p className="text-slate-500 dark:text-[#929bc9] text-center max-w-md text-sm leading-relaxed mb-6">
                        Detailed progression curves, speed timelines, and accuracy aggregates will render here once students in **{activeSectionName}** complete their first typing sessions.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-[#323b67]/30 text-xs font-bold text-slate-500 dark:text-[#929bc9] border border-slate-200/50 dark:border-slate-800/80">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Accuracy Tracing
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-[#323b67]/30 text-xs font-bold text-slate-500 dark:text-[#929bc9] border border-slate-200/50 dark:border-slate-800/80">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            WPM Progression
                        </div>
                    </div>
                </div>
            ) : (
                /* Dynamic analytics dashboard content! */
                <div className="flex flex-col gap-6 font-sans">
                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Chronological progression curves */}
                        <div className="lg:col-span-8 bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm p-6 flex flex-col min-h-[380px]">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">Performance Progression</h3>
                                    <p className="text-xs text-slate-400">Average Speed and Accuracy over time</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                        <span className="text-slate-500 dark:text-slate-400">WPM</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                        <span className="text-slate-500 dark:text-slate-400">Accuracy (%)</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 w-full h-[280px] min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={progressionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="chartWpmGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="chartAccGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#323b67" opacity={0.15} />
                                        <XAxis dataKey="date" stroke="#929bc9" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#929bc9" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'rgba(11, 30, 45, 0.95)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
                                            }}
                                            labelStyle={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}
                                        />
                                        <Area type="monotone" dataKey="wpm" name="Avg WPM" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#chartWpmGrad)" />
                                        <Area type="monotone" dataKey="accuracy" name="Avg Accuracy" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#chartAccGrad)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Speed Ranges Breakdown */}
                        <div className="lg:col-span-4 bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm p-6 flex flex-col justify-between min-h-[380px]">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading mb-1">Proficiency Spread</h3>
                                <p className="text-xs text-slate-400 mb-6">Distribution of student speeds (best attempts)</p>
                            </div>

                            <div className="flex-1 w-full h-[220px] min-h-[200px] mb-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={speedDistributionData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#323b67" opacity={0.1} />
                                        <XAxis dataKey="range" stroke="#929bc9" fontSize={9} fontWeight="bold" tickLine={false} axisLine={false} />
                                        <YAxis stroke="#929bc9" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                            contentStyle={{
                                                backgroundColor: 'rgba(11, 30, 45, 0.95)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px'
                                            }}
                                        />
                                        <Bar dataKey="students" fill="#094A71" radius={[6, 6, 0, 0]}>
                                            {speedDistributionData.map((_, index) => {
                                                const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981'];
                                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                            })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-4 font-heading">
                                <span>Speed Buckets</span>
                                <span className="text-slate-600 dark:text-slate-300">Total Enrolled: {totalEnrolled}</span>
                            </div>
                        </div>

                    </div>

                    {/* Lower Section: Pie Chart & Activity Feed */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Accuracy Pie Chart */}
                        <div className="lg:col-span-4 bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm p-6 flex flex-col min-h-[350px]">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading mb-1">Accuracy Profiles</h3>
                                <p className="text-xs text-slate-400 mb-4">Distribution of best student accuracies</p>
                            </div>

                            {accuracyDistributionData.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-semibold">No accuracy records yet</div>
                            ) : (
                                <>
                                    <div className="flex-1 w-full h-[180px] flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={accuracyDistributionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={70}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                >
                                                    {accuracyDistributionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(11, 30, 45, 0.95)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: '12px'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {accuracyDistributionData.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.name}</span>
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white font-mono">{item.value} {item.value === 1 ? 'student' : 'students'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Recent Activity Feed */}
                        <div className="lg:col-span-8 bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm p-6 flex flex-col min-h-[350px]">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading mb-1">Recent Test Sessions</h3>
                            <p className="text-xs text-slate-400 mb-4">Latest attempts log in this segment</p>
                            
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-[#323b67]/80 text-[10px] font-black uppercase text-slate-400">
                                            <th className="py-2.5 px-3">Student</th>
                                            <th className="py-2.5 px-3">Test/Assignment</th>
                                            <th className="py-2.5 px-3">Speed</th>
                                            <th className="py-2.5 px-3">Accuracy</th>
                                            <th className="py-2.5 px-3 text-right">Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                        {recentAttempts.map(attempt => (
                                            <tr key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-[#232948] transition-colors">
                                                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{attempt.studentName}</td>
                                                <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{attempt.testTitle}</td>
                                                <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{attempt.wpm} WPM</td>
                                                <td className={`py-3 px-3 font-mono font-bold ${attempt.accuracy >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{attempt.accuracy.toFixed(1)}%</td>
                                                <td className="py-3 px-3 text-right text-slate-400 font-normal font-mono">{attempt.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            
            <div className="h-20"></div>
        </>
    );
};

export default FacilitatorAnalytics;
