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

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']; // Modern vibrant palette
const LEVEL_COLORS = {
    level1: '#fbbf24', // Amber-400
    level2: '#60a5fa', // Blue-400
    passed: '#34d399'  // Emerald-400
};

const FacilitatorDashboard: React.FC = () => {
    // State for expanded accordion items (default all expanded for visibility)
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

    // Helper to calculate totals for a major
    const getMajorTotals = (major: MajorGroup) => {
        return major.intakes.reduce((acc, curr) => ({
            level1: acc.level1 + curr.level1,
            level2: acc.level2 + curr.level2,
            passed: acc.passed + curr.passed,
            total: acc.total + curr.total
        }), { level1: 0, level2: 0, passed: 0, total: 0 });
    };

    // Prepare Data for Charts
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

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
                    <p className="font-bold text-gray-800 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-gray-500 capitalize">{entry.name}:</span>
                            <span className="font-bold text-gray-800">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {/* Top Bar / Header */}
            <header className="flex-none p-6 md:px-10 md:py-6 bg-white border-b border-[#cfe7df]">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-[#0d1b17] text-2xl md:text-3xl font-bold leading-tight">Instructor Progress Snapshot</h2>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block w-64">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                                <input
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-facilitator-primary/20 focus:border-facilitator-primary outline-none transition-all"
                                    placeholder="Search intake or major..."
                                    type="text"
                                />
                            </div>
                            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                <span className="material-symbols-outlined icon-filled">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-[#f8fcfa]">
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Card 1: Total Students */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Students</p>
                                    <h3 className="text-[#0d1b17] text-4xl font-bold">382</h3>
                                </div>
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-gray-200 transition-colors">
                                    <span className="material-symbols-outlined icon-filled">group</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-green-600 z-10">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+12% vs last term</span>
                            </div>
                        </div>

                        {/* Card 2: Level 1 Active */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Level 1 Active</p>
                                    <h3 className="text-[#0d1b17] text-4xl font-bold">62</h3>
                                </div>
                                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 group-hover:bg-yellow-100 transition-colors">
                                    <span className="material-symbols-outlined icon-filled">keyboard</span>
                                </div>
                            </div>
                            <p className="text-yellow-600 text-xs font-medium">Beginner Typing</p>
                        </div>

                        {/* Card 3: Level 2 Active */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Level 2 Active</p>
                                    <h3 className="text-[#0d1b17] text-4xl font-bold">316</h3>
                                </div>
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                    <span className="material-symbols-outlined icon-filled">speed</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-medium">Advanced Typing</p>
                        </div>

                        {/* Card 4: Passed Threshold */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 border-l-4 border-l-green-500 group hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Passed Threshold</p>
                                    <h3 className="text-green-600 text-4xl font-bold">4</h3>
                                </div>
                                <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors">
                                    <span className="material-symbols-outlined icon-filled">emoji_events</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-medium">Avg 50+ WPM</p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Progress Chart */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                                <div>
                                    <h3 className="text-[#0d1b17] text-xl font-bold mb-2">Program Proficiency</h3>
                                    <p className="text-gray-500 text-sm max-w-md">
                                        Tracking student progression through proficiency levels.
                                        Monitor the transition from <span className="text-yellow-600 font-medium">Level 1</span> to <span className="text-green-600 font-medium">Passed</span> status.
                                    </p>
                                </div>

                                {/* Custom Key/Legend */}
                                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <span className="text-xs font-medium text-gray-600">Lvl 1</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                        <span className="text-xs font-medium text-gray-600">Lvl 2</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                        <span className="text-xs font-medium text-gray-600">Passed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reduced Height from h-80 to h-64 */}
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                                        <Bar dataKey="Level 1" stackId="a" fill={LEVEL_COLORS.level1} radius={[0, 0, 4, 4]} />
                                        <Bar dataKey="Level 2" stackId="a" fill={LEVEL_COLORS.level2} radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="Passed" stackId="a" fill={LEVEL_COLORS.passed} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Distribution Chart */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col">
                            <h3 className="text-[#0d1b17] text-xl font-bold mb-2">Enrollment Share</h3>
                            <p className="text-gray-500 text-sm mb-6">Total student distribution across active majors.</p>

                            {/* Reduced Min-Height from 250px to 200px */}
                            <div className="flex-1 min-h-[200px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="total"
                                            stroke="none"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text Overlay - Reduced font size */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <span className="block text-2xl font-bold text-gray-800">382</span>
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Students</span>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Legend for Pie - Reduced font weight */}
                            <div className="mt-6 space-y-3">
                                {chartData.map((entry, index) => (
                                    <div key={entry.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            <span className="font-medium text-gray-600">{entry.name}</span>
                                        </div>
                                        <span className="font-medium text-gray-800">{entry.total}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Program Breakdown Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-[#0d1b17] text-lg font-bold">Detailed Breakdown</h3>
                                <p className="text-gray-500 text-sm">Detailed student counts by Major and Intake period.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                    Filter
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22c55e] text-white text-sm font-bold hover:bg-[#16a34a] transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    Export
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0f253a] text-white text-xs uppercase tracking-wider font-bold">
                                        <th className="px-6 py-4 w-1/3">Major / Intake</th>
                                        <th className="px-6 py-4 text-center">Level 1</th>
                                        <th className="px-6 py-4 text-center">Level 2</th>
                                        <th className="px-6 py-4 text-center text-[#4ade80]">Passed</th>
                                        <th className="px-6 py-4 text-right">Grand Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {DASHBOARD_DATA.map((major) => {
                                        const isExpanded = expandedMajors[major.id];
                                        const totals = getMajorTotals(major);

                                        return (
                                            <React.Fragment key={major.id}>
                                                {/* Major Header Row */}
                                                <tr
                                                    className="bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors"
                                                    onClick={() => toggleMajor(major.id)}
                                                >
                                                    <td className="px-6 py-4 font-bold text-[#0d1b17] flex items-center gap-2">
                                                        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                            expand_more
                                                        </span>
                                                        {major.name}
                                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium border border-gray-200">
                                                            {major.intakes.length} Intakes
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                                                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                                                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                                                    <td className="px-6 py-4 text-right font-bold text-[#0d1b17]">{totals.total}</td>
                                                </tr>

                                                {/* Intake Rows (Expanded) */}
                                                {isExpanded && (
                                                    <>
                                                        {major.intakes.map((intake) => (
                                                            <tr key={intake.id} className="hover:bg-gray-50/30 transition-colors">
                                                                <td className="px-6 py-3 pl-14 text-gray-600">{intake.name}</td>
                                                                <td className="px-6 py-3 text-center text-gray-600 font-medium">{intake.level1 > 0 ? intake.level1 : '-'}</td>
                                                                <td className="px-6 py-3 text-center text-gray-600 font-medium">{intake.level2 > 0 ? intake.level2 : '-'}</td>
                                                                <td className="px-6 py-3 text-center font-bold text-[#22c55e]">{intake.passed > 0 ? intake.passed : '-'}</td>
                                                                <td className="px-6 py-3 text-right font-bold text-[#0d1b17]">{intake.total}</td>
                                                            </tr>
                                                        ))}
                                                        {/* Major Total Summary Row */}
                                                        <tr className="bg-[#f0fdf4]/50 border-t border-gray-100">
                                                            <td className="px-6 py-3 pl-14 font-bold text-[#16a34a]">{major.name} Total</td>
                                                            <td className="px-6 py-3 text-center font-bold text-[#0d1b17]">{totals.level1}</td>
                                                            <td className="px-6 py-3 text-center font-bold text-[#0d1b17]">{totals.level2}</td>
                                                            <td className="px-6 py-3 text-center font-bold text-[#16a34a]">{totals.passed}</td>
                                                            <td className="px-6 py-3 text-right font-bold text-[#0d1b17]">{totals.total}</td>
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

                </div>
                {/* Footer Space */}
                <div className="h-10"></div>
            </div>
        </>
    );
};

export default FacilitatorDashboard;
