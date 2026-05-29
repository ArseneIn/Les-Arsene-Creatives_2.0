import React, { useMemo, useEffect, useState } from 'react';
import { useInstitution } from '../context/InstitutionContext';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import {
    ChevronRight,
    UserPlus,
    Users,
    TrendingUp,
    Folder,
    Zap,
    Target,
    PlusCircle,
    BarChart2,
    BookOpen,
    Settings,
    Activity,
    Calendar,
    School
} from 'lucide-react';

// --- Types ---
interface DashboardStats {
    totalFacilitators: number;
    activeIntakes: number;
    avgWpm: number;
    avgAccuracy: number;
}

interface TestResult {
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

// Custom Tooltip for Charts
interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                <p className="font-bold text-gray-800 text-xs mb-1.5">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || '#094A71' }}></div>
                        <span className="text-gray-500 capitalize">{entry.name}:</span>
                        <span className="font-bold text-gray-800">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const InstitutionAdminDashboard: React.FC = () => {
    const { intakes, settings } = useInstitution();
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalFacilitators: 0,
        activeIntakes: 0,
        avgWpm: 0,
        avgAccuracy: 0
    });
    const [recentResults, setRecentResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [institutionName, setInstitutionName] = useState<string>('');

    useEffect(() => {
        if (user?.institutionId) {
            fetchDashboardData(user.institutionId);
        }
    }, [user?.institutionId]);

    const fetchDashboardData = async (institutionId: string) => {
        try {
            const [statsRes, resultsRes, instRes] = await Promise.all([
                api.get<DashboardStats>(`/institution/${institutionId}/stats`),
                api.get<TestResult[]>(`/test-result/institution/${institutionId}`),
                api.get<{ name: string }>(`/institution/${institutionId}`)
            ]);

            setStats(statsRes.data);
            setInstitutionName(instRes.data?.name || 'Your School');

            // Sort results by date descending (newest first)
            const sortedResults = (resultsRes.data || [])
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setRecentResults(sortedResults);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate dynamic stats from context intakes
    const totalSections = useMemo(() => {
        return intakes.reduce((sum, intake) => sum + (intake.sections?.length || 0), 0);
    }, [intakes]);

    const totalStudents = useMemo(() => {
        return intakes.reduce((sum, intake) => {
            const sectionsCount = intake.sections?.reduce((sSum, s) => sSum + (s.students?.length || 0), 0) || 0;
            return sum + sectionsCount;
        }, 0);
    }, [intakes]);

    // Cohort dynamic performance calculation based on actual test results
    const cohortPerformanceData = useMemo(() => {
        const cohortMap: Record<string, { totalWpm: number; count: number }> = {};
        recentResults.forEach(r => {
            const cohortName = r.user.section?.intake?.name || 'General';
            if (!cohortMap[cohortName]) {
                cohortMap[cohortName] = { totalWpm: 0, count: 0 };
            }
            cohortMap[cohortName].totalWpm += r.wpm;
            cohortMap[cohortName].count += 1;
        });

        return Object.entries(cohortMap).map(([name, data]) => ({
            name,
            avgWpm: Math.round(data.totalWpm / data.count),
            target: settings.level1Wpm || 30
        })).slice(0, 5); // top 5 cohorts for clean rendering
    }, [recentResults, settings.level1Wpm]);

    // Skill distribution calculation
    const skillDistribution = useMemo(() => {
        let beginner = 0;
        let intermediate = 0;
        let advanced = 0;

        recentResults.forEach(r => {
            if (r.wpm < 30) beginner++;
            else if (r.wpm < 50) intermediate++;
            else advanced++;
        });

        const total = beginner + intermediate + advanced;
        if (total === 0) return [];

        return [
            { name: 'Beginner (<30 WPM)', value: beginner, color: '#F59E0B' },
            { name: 'Intermediate (30-50 WPM)', value: '#094A71' },
            { name: 'Advanced (50+ WPM)', value: '#33B974' }
        ].filter(d => d.value > 0);
    }, [recentResults]);

    const shortcuts = [
        {
            title: 'Intakes',
            icon: <Calendar className="w-4 h-4" />,
            link: '/admin/intakes',
            accent: 'border-blue-200 text-blue-600 bg-blue-50/50'
        },
        {
            title: 'Facilitators',
            icon: <UserPlus className="w-4 h-4" />,
            link: '/admin/facilitators',
            accent: 'border-emerald-200 text-emerald-600 bg-emerald-50/50'
        },
        {
            title: 'Analytics',
            icon: <BarChart2 className="w-4 h-4" />,
            link: '/admin/analytics',
            accent: 'border-indigo-200 text-indigo-600 bg-indigo-50/50'
        },
        {
            title: 'Class Tests',
            icon: <BookOpen className="w-4 h-4" />,
            link: '/admin/tests',
            accent: 'border-amber-200 text-amber-600 bg-amber-50/50'
        },
        {
            title: 'Student Logs',
            icon: <Activity className="w-4 h-4" />,
            link: '/admin/performance',
            accent: 'border-pink-200 text-pink-600 bg-pink-50/50'
        },
        {
            title: 'Settings',
            icon: <Settings className="w-4 h-4" />,
            link: '/admin/settings',
            accent: 'border-slate-300 text-slate-700 bg-slate-100'
        }
    ];

    if (loading) {
        return (
            <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[400px]">
                <Activity className="w-8 h-8 text-[#094A71] animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading command center...</p>
            </div>
        );
    }

    return (
        <>
            {/* Top Bar / Header */}
            <header className="flex-none mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>Institutions</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="font-medium text-gray-700">Dashboard</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-[#061824] text-3xl font-black leading-tight tracking-tight">Institution Hub</h2>
                            {institutionName && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#094A71]/10 text-[#094A71] text-xs font-black uppercase tracking-wider border border-[#094A71]/15">
                                    <School className="w-3.5 h-3.5" />
                                    {institutionName}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1: Total Facilitators */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Active Staff</p>
                            <h3 className="text-[#061824] text-4xl font-black">{stats.totalFacilitators}</h3>
                        </div>
                        <div className="p-2 bg-[#094A71]/10 rounded-lg text-[#094A71] group-hover:bg-[#094A71]/20 transition-colors">
                            <Users className="w-5 h-5 shrink-0" />
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-medium">Assigned to cohorts</p>
                </div>

                {/* Card 2: Enrollment Summary */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Enrollment</p>
                            <h3 className="text-[#061824] text-4xl font-black">{totalStudents}</h3>
                        </div>
                        <div className="p-2 bg-[#33B974]/10 rounded-lg text-[#33B974] group-hover:bg-[#33B974]/20 transition-colors">
                            <Activity className="w-5 h-5 shrink-0" />
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-medium">Across {totalSections} active classes</p>
                </div>

                {/* Card 3: Avg School WPM */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Avg. School WPM</p>
                            <h3 className="text-[#061824] text-4xl font-black">{stats.avgWpm}</h3>
                        </div>
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 group-hover:bg-indigo-500/20 transition-colors">
                            <Zap className="w-5 h-5 shrink-0 animate-pulse" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#33B974]">
                        <TrendingUp className="w-4 h-4" />
                        <span>High proficiency speed</span>
                    </div>
                </div>

                {/* Card 4: Avg Accuracy */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Avg. Accuracy</p>
                            <h3 className="text-[#061824] text-4xl font-black">{stats.avgAccuracy}%</h3>
                        </div>
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                            <Target className="w-5 h-5 shrink-0" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <span>Typing precision standard</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Shortcuts Bar */}
            <div className="mb-8">
                <h3 className="text-[#061824] text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Navigation Commands</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {shortcuts.map((shortcut) => (
                        <Link
                            key={shortcut.title}
                            to={shortcut.link}
                            className="bg-white rounded-xl p-3 border border-gray-150 shadow-sm hover:shadow-md hover:border-[#094A71]/35 transition-all duration-200 flex items-center gap-3 cursor-pointer group h-14"
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${shortcut.accent}`}>
                                {shortcut.icon}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-black text-xs text-[#061824] truncate group-hover:text-[#094A71] transition-colors">{shortcut.title}</h4>
                                <span className="text-[10px] text-slate-400 font-bold block leading-none mt-0.5">Open View</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Dynamic Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Cohort Performance Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-[#061824] text-lg font-black tracking-tight">Cohort Performance Summary</h3>
                        <p className="text-gray-500 text-xs mt-0.5">Average WPM calculated across recent student attempts by cohort.</p>
                    </div>
                    <div className="h-56 w-full mt-4">
                        {cohortPerformanceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cohortPerformanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                                    <Bar dataKey="avgWpm" name="Average Speed" fill="#094A71" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="target" name="Speed Target" fill="#33B974" radius={[4, 4, 0, 0]} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '12px', fontWeight: 'bold' }} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">No cohort test data available yet.</div>
                        )}
                    </div>
                </div>

                {/* Skill Levels Pie Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-[#061824] text-lg font-black tracking-tight">Student Skill Breakdown</h3>
                        <p className="text-gray-500 text-xs mt-0.5">Proportional distribution based on completed test speeds.</p>
                    </div>
                    
                    <div className="h-44 w-full relative mt-3 flex-1 min-h-[140px]">
                        {skillDistribution.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={skillDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={65}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {skillDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <span className="block text-xl font-black text-slate-800">{recentResults.length}</span>
                                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Attempts</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">No skill levels mapped.</div>
                        )}
                    </div>

                    {skillDistribution.length > 0 && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-slate-50">
                            {skillDistribution.map((entry) => (
                                <div key={entry.name} className="flex items-center justify-between text-xs font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                        <span className="text-slate-500">{entry.name}</span>
                                    </div>
                                    <span className="text-slate-800">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Live activity & Cohort breakdown grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* School Activity Feed */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div>
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-[#061824] text-lg font-black tracking-tight">Recent School Activity Feed</h3>
                                <p className="text-gray-500 text-xs mt-0.5">Real-time completed student test attempts across all classes.</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-500/15">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                Live Feed
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                                        <th className="px-6 py-3.5">Student</th>
                                        <th className="px-6 py-3.5">Cohort & Section</th>
                                        <th className="px-6 py-3.5">Test Title</th>
                                        <th className="px-6 py-3.5 text-right">Speed</th>
                                        <th className="px-6 py-3.5 text-right">Accuracy</th>
                                        <th className="px-6 py-3.5 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentResults.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No student typing activities recorded yet.</td>
                                        </tr>
                                    ) : (
                                        recentResults.slice(0, 5).map((result) => {
                                            const intakeName = result.user.section?.intake?.name || 'Unassigned';
                                            const sectionName = result.user.section?.name || 'Unassigned';
                                            const isLevel2 = (result.test?.title || result.assignment?.title || '').toLowerCase().includes('level 2');
                                            const speedTarget = isLevel2 ? 50 : 30;
                                            const passed = result.wpm >= speedTarget && result.accuracy >= 92;

                                            return (
                                                <tr key={result.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-[#094A71]/5 flex items-center justify-center font-black text-[#094A71] border border-[#094A71]/15">
                                                                {result.user.firstName?.[0] || 'S'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-[#061824]">{result.user.firstName} {result.user.lastName}</p>
                                                                <p className="text-xs text-slate-400">@{result.user.username}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 font-semibold text-xs">
                                                        {intakeName} • {sectionName}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 font-bold text-xs truncate max-w-[150px]" title={result.test?.title || result.assignment?.title || 'Practice Stage'}>
                                                        {result.test?.title || result.assignment?.title || 'Practice Stage'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="font-black text-[#094A71] text-sm">{result.wpm}</span>
                                                        <span className="text-[9px] text-slate-400 uppercase font-black ml-0.5">wpm</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-xs text-slate-600">
                                                        {Math.round(result.accuracy)}%
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                            passed
                                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                                        }`}>
                                                            {passed ? 'Passed' : 'Practicing'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {recentResults.length > 5 && (
                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                            <Link to="/admin/analytics" className="text-xs font-black text-[#094A71] hover:underline flex items-center justify-center gap-1">
                                View All Comprehensive Typing Attempts
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar Cohort Summary widget */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-[#061824] text-lg font-black tracking-tight mb-1">Cohort Summary</h3>
                        <p className="text-xs text-gray-500 mb-6">Structural overview of your school's current groups.</p>
                        
                        <div className="space-y-4">
                            {intakes.length === 0 ? (
                                <div className="text-center py-6 text-gray-400 text-sm">No active cohorts defined.</div>
                            ) : (
                                intakes.slice(0, 3).map(intake => {
                                    const studentCount = intake.sections.reduce((sum, s) => sum + s.students.length, 0);
                                    return (
                                        <div key={intake.id} className="p-4 rounded-xl border border-gray-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-sm text-[#061824]">{intake.name}</span>
                                                <span className="px-2 py-0.5 bg-[#094A71]/10 text-[#094A71] rounded-full text-[9px] font-black uppercase">
                                                    {intake.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{intake.sections.length} Classes</span>
                                                <span className="font-bold text-slate-700">{studentCount} Students</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Overall Benchmarks</h4>
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-slate-500">Level 1 Required Target</span>
                                <span className="font-black text-slate-700">{settings.level1Wpm} WPM</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-slate-500">Level 2 Required Target</span>
                                <span className="font-black text-slate-700">{settings.level2Wpm} WPM</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-slate-500">Required Precision Target</span>
                                <span className="font-black text-slate-700">{settings.requiredAccuracy}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InstitutionAdminDashboard;
