import React, { useState } from 'react';
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
    Cell
} from 'recharts';

// --- Types for the new dashboard structure ---
interface IntakeStat {
    id: string;
    name: string;
    level1: number;
    level2: number;
    passed: number;
    total: number;
}

interface MajorGroup {
    id: string;
    name: string;
    intakes: IntakeStat[];
}

// --- Mock Data ---
const DASHBOARD_DATA: MajorGroup[] = [
    {
        id: 'bapm',
        name: 'BAPM',
        intakes: [
            { id: 'jan25', name: 'Jan 2025', level1: 30, level2: 91, passed: 4, total: 125 },
            { id: 'sept24', name: 'Sept 2024', level1: 5, level2: 28, passed: 0, total: 33 },
            { id: 'sept25', name: 'Sept 2025', level1: 9, level2: 47, passed: 0, total: 56 },
        ]
    },
    {
        id: 'bscba',
        name: 'BScBA',
        intakes: [
            { id: 'may24', name: 'May 2024', level1: 0, level2: 4, passed: 0, total: 4 },
            { id: 'jan25b', name: 'Jan 2025', level1: 0, level2: 10, passed: 0, total: 10 },
            { id: 'sept25b', name: 'Sept 2025', level1: 1, level2: 24, passed: 0, total: 25 },
        ]
    },
    {
        id: 'snhu',
        name: 'SNHU',
        intakes: [
            { id: 'may25', name: 'May 2025', level1: 17, level2: 112, passed: 0, total: 129 },
        ]
    }
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']; 
const LEVEL_COLORS = {
    level1: '#fbbf24', 
    level2: '#60a5fa', 
    passed: '#34d399'  
};

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
            <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-800 dark:text-white mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-slate-500 dark:text-[#929bc9] capitalize">{entry.name}:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const FacilitatorDashboard: React.FC = () => {
    const [expandedMajors, setExpandedMajors] = useState<Record<string, boolean>>({
        'bapm': true,
        'bscba': true,
        'snhu': true
    });

    const toggleMajor = (majorId: string) => {
        setExpandedMajors(prev => ({
            ...prev,
            [majorId]: !prev[majorId]
        }));
    };

    const getMajorTotals = (major: MajorGroup) => {
        return major.intakes.reduce((acc, curr) => ({
            level1: acc.level1 + curr.level1,
            level2: acc.level2 + curr.level2,
            passed: acc.passed + curr.passed,
            total: acc.total + curr.total
        }), { level1: 0, level2: 0, passed: 0, total: 0 });
    };

    const chartData = DASHBOARD_DATA.map(major => {
        const totals = getMajorTotals(major);
        return {
            name: major.name,
            'Level 1': totals.level1,
            'Level 2': totals.level2,
            'Passed': totals.passed,
            total: totals.total
        };
    });

    return (
        <>
            {/* Hero Banner Header - Perfect Aesthetic Connection to Student Portal */}
            <header className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 p-6 md:p-8 text-white shadow-xl glow-primary">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-y-12 translate-x-12 pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider w-fit">
                            <span className="material-symbols-outlined text-[14px]">analytics</span>
                            Instructor Snapshot
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1 font-heading">
                            Welcome back, Instructor!
                        </h1>
                        <p className="text-emerald-100/90 text-sm md:text-base font-normal max-w-xl">
                            Track student coordinates, intake levels, and progress parameters in real-time.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-black/15 backdrop-blur-md rounded-xl p-4 border border-white/15">
                        <span className="material-symbols-outlined text-yellow-400 text-4xl animate-pulse">groups</span>
                        <div>
                            <p className="text-xs text-emerald-200 uppercase tracking-widest font-bold">Total Supervised</p>
                            <p className="text-2xl font-black font-heading">382 Students</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Total Students */}
                <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-200 dark:border-[#323b67] shadow-sm flex flex-col justify-between h-36 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-lg pointer-events-none"></div>
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <p className="text-slate-400 dark:text-[#929bc9] text-xs font-bold uppercase tracking-wider mb-1">Total Students</p>
                            <h3 className="text-slate-900 dark:text-white text-4.5xl font-black tracking-tight font-heading">382</h3>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-[#323b67] rounded-xl text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                            <span className="material-symbols-outlined text-xl flex items-center justify-center">group</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 z-10 mt-2">
                        <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                        <span>+12% vs last term</span>
                    </div>
                </div>

                {/* Card 2: Level 1 Active */}
                <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-200 dark:border-[#323b67] shadow-sm flex flex-col justify-between h-36 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 dark:text-[#929bc9] text-xs font-bold uppercase tracking-wider mb-1">Level 1 Active</p>
                            <h3 className="text-slate-900 dark:text-white text-4.5xl font-black tracking-tight font-heading">62</h3>
                        </div>
                        <div className="p-3 bg-yellow-100/30 dark:bg-yellow-500/10 rounded-xl text-yellow-600 dark:text-yellow-400 shadow-sm">
                            <span className="material-symbols-outlined text-xl flex items-center justify-center">keyboard</span>
                        </div>
                    </div>
                    <p className="text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider mt-2">Beginner Typing</p>
                </div>

                {/* Card 3: Level 2 Active */}
                <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-200 dark:border-[#323b67] shadow-sm flex flex-col justify-between h-36 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 dark:text-[#929bc9] text-xs font-bold uppercase tracking-wider mb-1">Level 2 Active</p>
                            <h3 className="text-slate-900 dark:text-white text-4.5xl font-black tracking-tight font-heading">316</h3>
                        </div>
                        <div className="p-3 bg-blue-100/30 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm">
                            <span className="material-symbols-outlined text-xl flex items-center justify-center">speed</span>
                        </div>
                    </div>
                    <p className="text-slate-400 dark:text-[#929bc9] text-xs font-bold uppercase tracking-wider mt-2">Advanced Typing</p>
                </div>

                {/* Card 4: Passed Threshold */}
                <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-200 dark:border-[#323b67] shadow-sm flex flex-col justify-between h-36 border-l-4 border-l-emerald-500 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 dark:text-[#929bc9] text-xs font-bold uppercase tracking-wider mb-1">Passed Target</p>
                            <h3 className="text-emerald-600 dark:text-emerald-400 text-4.5xl font-black tracking-tight font-heading">4</h3>
                        </div>
                        <div className="p-3 bg-emerald-100/30 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <span className="material-symbols-outlined text-xl flex items-center justify-center">emoji_events</span>
                        </div>
                    </div>
                    <p className="text-slate-400 dark:text-[#929bc9] text-xs font-bold uppercase tracking-wider mt-2">Avg 50+ WPM</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Progress Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-card-dark rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-[#323b67] shadow-sm relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-slate-900 dark:text-white text-xl font-black tracking-tight mb-1 font-heading">Program Proficiency</h3>
                            <p className="text-slate-500 dark:text-[#929bc9] text-xs font-normal">
                                Student counts distributed by active progress standings.
                            </p>
                        </div>

                        {/* Custom Key/Legend */}
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#232948] px-4 py-2 rounded-lg border border-slate-200/50 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-[#929bc9] uppercase tracking-wider">Level 1</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-[#929bc9] uppercase tracking-wider">Level 2</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-[#929bc9] uppercase tracking-wider">Passed</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 w-full text-slate-900 dark:text-white select-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', opacity: 0.05 }} />
                                <Bar dataKey="Level 1" stackId="a" fill={LEVEL_COLORS.level1} radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Level 2" stackId="a" fill={LEVEL_COLORS.level2} radius={[0, 0, 0, 0]} />
                                <Bar dataKey="Passed" stackId="a" fill={LEVEL_COLORS.passed} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Share Chart */}
                <div className="bg-white dark:bg-card-dark rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-[#323b67] shadow-sm flex flex-col">
                    <h3 className="text-slate-900 dark:text-white text-xl font-black tracking-tight mb-1 font-heading">Enrollment Share</h3>
                    <p className="text-slate-500 dark:text-[#929bc9] text-xs font-normal mb-6">Active students distributed across programs.</p>

                    <div className="flex-1 min-h-[180px] relative select-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={5}
                                    dataKey="total"
                                    stroke="none"
                                >
                                    {chartData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Label Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="block text-2.5xl font-black text-slate-900 dark:text-white tracking-tight font-heading">382</span>
                                <span className="text-[10px] text-slate-400 dark:text-[#929bc9] uppercase tracking-widest font-black mt-0.5">Students</span>
                            </div>
                        </div>
                    </div>

                    {/* Custom Pie Legend */}
                    <div className="mt-6 space-y-3">
                        {chartData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center justify-between text-xs font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-slate-600 dark:text-[#929bc9] uppercase tracking-wider">{entry.name}</span>
                                </div>
                                <span className="text-slate-900 dark:text-white font-mono">{entry.total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Program Breakdown Table - Perfect styling connection to Student History */}
            <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-[#323b67]/45 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight font-heading">Detailed Breakdown</h3>
                        <p className="text-slate-500 dark:text-[#929bc9] text-xs font-normal">Detailed student standing count parameters.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 hover-scale active-scale transition-all">
                            <span className="material-symbols-outlined text-[18px]">filter_list</span>
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-emerald-600 hover-scale active-scale transition-all shadow-md shadow-primary/10">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-[#323b67] bg-slate-50/70 dark:bg-[#323b67]/25 pb-3">
                                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] w-1/3">Major / Intake</th>
                                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Level 1</th>
                                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Level 2</th>
                                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Passed</th>
                                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-right">Grand Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#323b67]/45 text-sm">
                            {DASHBOARD_DATA.map((major) => {
                                const isExpanded = expandedMajors[major.id];
                                const totals = getMajorTotals(major);

                                return (
                                    <React.Fragment key={major.id}>
                                        {/* Major Header Row */}
                                        <tr
                                            className="bg-slate-50/40 dark:bg-[#232948]/30 hover:bg-slate-50 dark:hover:bg-[#232948] cursor-pointer transition-colors"
                                            onClick={() => toggleMajor(major.id)}
                                        >
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <span className={`material-symbols-outlined text-slate-400 transition-transform duration-250 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    expand_more
                                                </span>
                                                <span>{major.name}</span>
                                                <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#323b67] text-slate-500 dark:text-[#929bc9] text-[10px] font-bold border border-slate-200/50 dark:border-[#323b67]/50 uppercase">
                                                    {major.intakes.length} Intakes
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-400 dark:text-[#636b95]">-</td>
                                            <td className="px-6 py-4 text-center text-slate-400 dark:text-[#636b95]">-</td>
                                            <td className="px-6 py-4 text-center text-slate-400 dark:text-[#636b95]">-</td>
                                            <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white font-mono">{totals.total}</td>
                                        </tr>

                                        {/* Intake Rows (Expanded) */}
                                        {isExpanded && (
                                            <>
                                                {major.intakes.map((intake) => (
                                                    <tr key={intake.id} className="hover:bg-slate-50/30 dark:hover:bg-[#232948]/20 transition-colors">
                                                        <td className="px-6 py-3.5 pl-14 text-slate-600 dark:text-slate-300 font-semibold">{intake.name}</td>
                                                        <td className="px-6 py-3.5 text-center text-slate-600 dark:text-slate-300 font-mono font-bold">{intake.level1 > 0 ? intake.level1 : '-'}</td>
                                                        <td className="px-6 py-3.5 text-center text-slate-600 dark:text-slate-300 font-mono font-bold">{intake.level2 > 0 ? intake.level2 : '-'}</td>
                                                        <td className="px-6 py-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400 font-mono">{intake.passed > 0 ? intake.passed : '-'}</td>
                                                        <td className="px-6 py-3.5 text-right font-bold text-slate-900 dark:text-white font-mono">{intake.total}</td>
                                                    </tr>
                                                ))}
                                                {/* Major Total Summary Row */}
                                                <tr className="bg-emerald-500/5 dark:bg-emerald-500/10 border-t border-slate-100 dark:border-[#323b67]/45">
                                                    <td className="px-6 py-3.5 pl-14 font-black text-emerald-700 dark:text-emerald-400 uppercase text-xs tracking-wider font-heading">{major.name} Total</td>
                                                    <td className="px-6 py-3.5 text-center font-black text-slate-900 dark:text-white font-mono">{totals.level1}</td>
                                                    <td className="px-6 py-3.5 text-center font-black text-slate-900 dark:text-white font-mono">{totals.level2}</td>
                                                    <td className="px-6 py-3.5 text-center font-black text-emerald-600 dark:text-emerald-400 font-mono">{totals.passed}</td>
                                                    <td className="px-6 py-3.5 text-right font-black text-slate-900 dark:text-white font-mono">{totals.total}</td>
                                                </tr>
                                            </>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default FacilitatorDashboard;
