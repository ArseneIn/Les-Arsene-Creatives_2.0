import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFacilitator } from '../context/FacilitatorContext';
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

// Define standard colors for visual consistency
const COLORS = ['#33B974', '#094A71', '#8b5cf6', '#ec4899']; 
const LEVEL_COLORS = {
    level1: '#fbbf24', 
    level2: '#60a5fa', 
    passed: '#33B974'  
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
    const { user } = useAuth();
    const { students, sections } = useFacilitator();

    // Dynamic states for accordion collapse
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    
    // Filter State
    const [selectedSectionId, setSelectedSectionId] = useState<string>('All');

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    // Apply Filter
    const displayStudents = selectedSectionId === 'All' 
        ? students 
        : students.filter(s => s.sectionId === selectedSectionId);

    // Calculate dynamic aggregates in real-time from the filtered students list
    const totalStudentsCount = displayStudents.length;
    
    // Typing levels thresholds:
    // Level 1: < 40 WPM
    // Level 2: >= 40 and < 50 WPM
    // Passed: >= 50 WPM
    const level1Count = displayStudents.filter(s => s.currentWpm < 40).length; 
    const level2Count = displayStudents.filter(s => s.currentWpm >= 40 && s.currentWpm < 50).length;
    const passedCount = displayStudents.filter(s => s.currentWpm >= 50).length;

    // Group students by intake (major) to build dynamic chart data
    const intakeGroups: Record<string, typeof students> = {};
    displayStudents.forEach(s => {
        if (!intakeGroups[s.major]) {
            intakeGroups[s.major] = [];
        }
        intakeGroups[s.major].push(s);
    });

    const chartData = Object.entries(intakeGroups).map(([intakeName, list]) => {
        const l1 = list.filter(s => s.currentWpm < 40).length;
        const l2 = list.filter(s => s.currentWpm >= 40 && s.currentWpm < 50).length;
        const p = list.filter(s => s.currentWpm >= 50).length;

        return {
            name: intakeName,
            'Level 1': l1,
            'Level 2': l2,
            'Passed': p,
            total: list.length
        };
    });

    // If there is no data seeded yet, render a beautiful blank state
    if (sections.length === 0) {
        return (
            <>
                <header className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-secondary p-6 md:p-8 text-white shadow-xl glow-primary">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-y-12 translate-x-12 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider w-fit">
                                <span className="material-symbols-outlined text-[14px]">analytics</span>
                                Instructor Snapshot
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1 font-heading">
                                Welcome, {user?.firstName || 'Instructor'}!
                            </h1>
                            <p className="text-white/90 text-sm md:text-base font-normal max-w-xl">
                                You do not have any class sections assigned to you in the database yet.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm p-12 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 text-slate-400">
                        <span className="material-symbols-outlined text-5xl">supervised_user_circle</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">No Assigned Sections</h3>
                    <p className="text-slate-500 dark:text-[#929bc9] text-center max-w-md">
                        Please ask your Institution Administrator to assign you to a class section under their active Intakes. Once assigned, your student rosters and proficiency stats will render here automatically in real-time!
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Hero Banner Header - Dynamic greeting */}
            <header className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-secondary p-6 md:p-8 text-white shadow-xl glow-primary">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-y-12 translate-x-12 pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-secondary/20 rounded-full blur-xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider w-fit">
                            <span className="material-symbols-outlined text-[14px]">analytics</span>
                            Instructor Snapshot
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1 font-heading">
                            Welcome back, {user?.firstName || 'Instructor'}!
                        </h1>
                        <p className="text-white/90 text-sm md:text-base font-normal max-w-xl">
                            Track student coordinates, intake levels, and progress parameters in real-time.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-black/15 backdrop-blur-md rounded-xl p-4 border border-white/15">
                        <span className="material-symbols-outlined text-yellow-400 text-4xl animate-pulse">groups</span>
                        <div>
                            <p className="text-xs text-white/80 uppercase tracking-widest font-bold">Total Supervised</p>
                            <p className="text-2xl font-black font-heading">{totalStudentsCount} Students</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filter Row */}
            <div className="flex justify-end mt-6">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-500 dark:text-[#929bc9] uppercase tracking-wider">View Data For:</span>
                    <div className="relative">
                        <select 
                            value={selectedSectionId}
                            onChange={(e) => setSelectedSectionId(e.target.value)}
                            className="bg-white dark:bg-card-dark border border-slate-200 dark:border-[#323b67] text-slate-700 dark:text-white rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold outline-none focus:border-primary/60 shadow-sm appearance-none cursor-pointer min-w-[220px]"
                        >
                            <option value="All">All Assigned Sections</option>
                            {sections.map(sec => (
                                <option key={sec.id} value={sec.id}>
                                    {sec.intakeName ? `${sec.intakeName} - ` : ''}{sec.name}
                                </option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards Row - Bind to live database calculations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {/* Card 1: Total Students */}
                <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-200 dark:border-[#323b67] shadow-sm flex flex-col justify-between h-36 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-lg pointer-events-none"></div>
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <p className="text-slate-400 dark:text-[#929bc9] text-xs font-bold uppercase tracking-wider mb-1">Total Students</p>
                            <h3 className="text-slate-900 dark:text-white text-4.5xl font-black tracking-tight font-heading">{totalStudentsCount}</h3>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-[#323b67] rounded-xl text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                            <span className="material-symbols-outlined text-xl flex items-center justify-center">group</span>
                        </div>
                    </div>
                    <p className="text-slate-400 dark:text-[#929bc9] text-xs font-bold uppercase tracking-wider mt-2">Active in sections</p>
                </div>

                {/* Card 2: Level 1 Active */}
                <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-200 dark:border-[#323b67] shadow-sm flex flex-col justify-between h-36 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 dark:text-[#929bc9] text-xs font-bold uppercase tracking-wider mb-1">Level 1 Active</p>
                            <h3 className="text-slate-900 dark:text-white text-4.5xl font-black tracking-tight font-heading">{level1Count}</h3>
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
                            <h3 className="text-slate-900 dark:text-white text-4.5xl font-black tracking-tight font-heading">{level2Count}</h3>
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
                            <h3 className="text-emerald-600 dark:text-emerald-400 text-4.5xl font-black tracking-tight font-heading">{passedCount}</h3>
                        </div>
                        <div className="p-3 bg-emerald-100/30 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <span className="material-symbols-outlined text-xl flex items-center justify-center">emoji_events</span>
                        </div>
                    </div>
                    <p className="text-slate-400 dark:text-[#929bc9] text-xs font-bold uppercase tracking-wider mt-2">Avg 50+ WPM</p>
                </div>
            </div>

            {/* Charts Section - Dynamically binds to database outputs */}
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
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', opacity: 0.05 }} />
                                <Bar dataKey="Level 1" stackId="a" fill={LEVEL_COLORS.level1} radius={[4, 4, 4, 4]} />
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
                                <span className="block text-2.5xl font-black text-slate-900 dark:text-white tracking-tight font-heading">{totalStudentsCount}</span>
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

            {/* Detailed Roster Table - Binds sections to actual database rosters (Mary Jane, John Doe) */}
            <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-[#323b67]/45 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight font-heading">Class Roster & Directory</h3>
                        <p className="text-slate-500 dark:text-[#929bc9] text-xs font-normal">Manage class sections and expand to view live student performance coordinates.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-slate-200 text-xs font-bold hover:bg-slate-55 dark:hover:bg-slate-800 hover-scale active-scale transition-all">
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
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-[#323b67] bg-slate-50/70 dark:bg-[#323b67]/25 pb-3">
                                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] w-1/3">Intake / Section</th>
                                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Assigned Roster</th>
                                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Avg. Speed</th>
                                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Avg. Accuracy</th>
                                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-right">Roster Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#323b67]/45 text-sm">
                            {sections.map((section) => {
                                const isExpanded = !!expandedSections[section.id];
                                const sectionStudents = students.filter(s => s.sectionId === section.id);
                                const studentCount = sectionStudents.length;

                                const avgWpm = studentCount > 0
                                    ? Math.round(sectionStudents.reduce((sum, s) => sum + s.currentWpm, 0) / studentCount)
                                    : 0;

                                const avgAccuracy = studentCount > 0
                                    ? Math.round(sectionStudents.reduce((sum, s) => sum + s.accuracy, 0) / studentCount)
                                    : 0;

                                return (
                                    <React.Fragment key={section.id}>
                                        {/* Section Header Row */}
                                        <tr
                                            className="bg-slate-50/40 dark:bg-[#232948]/30 hover:bg-slate-50 dark:hover:bg-[#232948] cursor-pointer transition-colors"
                                            onClick={() => toggleSection(section.id)}
                                        >
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <span className={`material-symbols-outlined text-slate-400 transition-transform duration-250 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    expand_more
                                                </span>
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 dark:text-white font-bold">{section.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 dark:bg-[#323b67] text-slate-600 dark:text-[#929bc9] text-xs font-bold border border-slate-200/50 dark:border-[#323b67]/50 uppercase">
                                                    {studentCount} Students
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono font-bold text-slate-700 dark:text-slate-350">{avgWpm > 0 ? `${avgWpm} WPM` : '--'}</td>
                                            <td className="px-6 py-4 text-center font-mono font-bold text-slate-700 dark:text-slate-350">{avgAccuracy > 0 ? `${avgAccuracy}%` : '--'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>

                                        {/* Expanded Student Rows */}
                                        {isExpanded && (
                                            <>
                                                {/* Header for Nesting Roster */}
                                                <tr className="bg-slate-50/20 dark:bg-black/10">
                                                    <td colSpan={5} className="px-14 py-2 border-b border-slate-100 dark:border-slate-800">
                                                        <p className="text-[10px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest">Supervised Student Directory</p>
                                                    </td>
                                                </tr>

                                                {sectionStudents.map((student) => (
                                                    <tr key={student.id} className="hover:bg-slate-50/30 dark:hover:bg-[#232948]/20 transition-colors">
                                                        {/* Student Name Detail */}
                                                        <td className="px-6 py-3.5 pl-14 flex items-center gap-3">
                                                            <div className="size-8 rounded-full bg-primary/20 border border-[#323b67] flex items-center justify-center text-primary font-bold text-xs uppercase shadow-sm">
                                                                {student.name?.[0] || 'S'}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</span>
                                                                <span className="text-[10px] text-slate-400 dark:text-[#929bc9] font-medium lowercase">{student.email || student.username}</span>
                                                            </div>
                                                        </td>

                                                        {/* Student Section Label */}
                                                        <td className="px-6 py-3.5 text-center text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px]">
                                                            {section.name}
                                                        </td>

                                                        {/* Student Speed */}
                                                        <td className="px-6 py-3.5 text-center font-bold text-slate-700 dark:text-slate-350 font-mono">
                                                            {student.currentWpm > 0 ? `${student.currentWpm} WPM` : '--'}
                                                        </td>

                                                        {/* Student Accuracy */}
                                                        <td className="px-6 py-3.5 text-center font-bold text-slate-700 dark:text-slate-350 font-mono">
                                                            {student.accuracy > 0 ? `${student.accuracy}%` : '--'}
                                                        </td>

                                                        {/* Student Status */}
                                                        <td className="px-6 py-3.5 text-right font-bold">
                                                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded border shadow-sm ${
                                                                student.currentWpm === 0 
                                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10'
                                                                    : student.status === 'On Track'
                                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
                                                                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/10'
                                                            }`}>
                                                                {student.currentWpm === 0 ? 'No Runs Yet' : student.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {sectionStudents.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="px-14 py-6 text-center text-slate-400 dark:text-slate-500 font-medium">
                                                            No student records are currently enrolled in this section.
                                                        </td>
                                                    </tr>
                                                )}
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
