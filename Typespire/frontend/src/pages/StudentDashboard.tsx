import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProgress } from '../context/UserProgressContext';
import { useFacilitator } from '../context/FacilitatorContext';

const StudentDashboard: React.FC = () => {
    const { stats, recentResults } = useUserProgress();
    const { assignments } = useFacilitator();

    // Mock current user ID for demonstration
    const currentUserId = '1';
    const currentUserSectionId = '10A';

    // Get the latest active assignment for this student
    const latestAssignment = assignments.find(a =>
        a.status === 'Active' &&
        (
            (a.sectionId === currentUserSectionId) ||
            (a.studentIds && a.studentIds.includes(currentUserId))
        )
    );

    return (
        <div className="layout-container flex flex-col items-center w-full py-8 px-4 md:px-8 lg:px-12">
            <div className="max-w-[1200px] w-full flex flex-col gap-8">
                {/* Page Heading */}
                <header className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                        Welcome back, Alex!
                    </h1>
                    <p className="text-slate-500 dark:text-[#929bc9] text-base font-normal">
                        Ready to continue your typing journey? You're on a {stats.streakDays}-day streak! 🔥
                    </p>
                </header>

                {/* Top Row: Action & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Test (Action Panel) */}
                    <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark p-6 shadow-sm flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded bg-primary/10 text-primary dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                                        {latestAssignment ? 'New Assignment' : 'No Active Assignments'}
                                    </span>
                                    {latestAssignment && <span className="text-slate-400 dark:text-[#929bc9] text-xs">Due: {latestAssignment.dueDate}</span>}
                                </div>
                                <h2 className="text-xl font-bold leading-tight">
                                    {latestAssignment ? latestAssignment.title : 'You are all caught up!'}
                                </h2>
                                <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base font-light leading-relaxed max-w-xl">
                                    {latestAssignment
                                        ? "Complete this assignment to keep up with your class progress."
                                        : "Great job! You have no pending assignments. Feel free to practice on your own."}
                                </p>
                            </div>
                            {latestAssignment && (
                                <Link to="/test" className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-primary/25 active:scale-95">
                                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                                    <span>Start Assignment</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Goal Progress (Stats Gauge) */}
                    <div className="rounded-xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                        <h3 className="w-full text-left text-sm font-medium text-slate-500 dark:text-[#929bc9] mb-4 flex justify-between">
                            <span>Goal Progress</span>
                            <span className="text-xs bg-yellow-accent/10 text-yellow-accent px-2 py-0.5 rounded">Level {stats.level}</span>
                        </h3>
                        {/* CSS/SVG Gauge */}
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                {/* Background Circle */}
                                <path className="text-slate-100 dark:text-[#323b67]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3.8"></path>
                                {/* Progress Circle */}
                                <path
                                    className="text-yellow-accent transition-all duration-1000 ease-out"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeDasharray={`${Math.min(100, (stats.currentWpm / stats.targetWpm) * 100)}, 100`}
                                    strokeLinecap="round"
                                    strokeWidth="3.8"
                                ></path>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.currentWpm}</span>
                                <span className="text-xs font-medium text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">WPM</span>
                            </div>
                        </div>
                        <div className="w-full flex justify-between items-center mt-4 text-xs font-medium">
                            <div className="flex flex-col">
                                <span className="text-slate-400 dark:text-[#929bc9]">Current</span>
                                <span className="text-slate-900 dark:text-white text-sm">{stats.currentWpm} wpm</span>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-200 dark:bg-[#323b67]"></div>
                            <div className="flex flex-col items-end">
                                <span className="text-slate-400 dark:text-[#929bc9]">Target</span>
                                <span className="text-emerald-accent text-sm">{stats.targetWpm} wpm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Row: Performance Chart */}
                <div className="rounded-xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark p-6 shadow-sm flex flex-col">
                    <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance Trends</h3>
                            <p className="text-sm text-slate-500 dark:text-[#929bc9]">Last 30 Days Activity</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-accent"></div>
                                <span className="text-xs font-medium text-slate-500 dark:text-[#929bc9]">Speed (WPM)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-accent"></div>
                                <span className="text-xs font-medium text-slate-500 dark:text-[#929bc9]">Accuracy (%)</span>
                            </div>
                        </div>
                    </div>
                    {/* SVG Chart Simulation */}
                    <div className="relative w-full h-64 select-none">
                        {/* Y-axis labels (Left - WPM) */}
                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400 dark:text-[#636b95] pr-2 border-r border-slate-100 dark:border-[#323b67]">
                            <span>60</span>
                            <span>45</span>
                            <span>30</span>
                            <span>15</span>
                            <span>0</span>
                        </div>
                        {/* Y-axis labels (Right - Accuracy) */}
                        <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400 dark:text-[#636b95] pl-2 border-l border-slate-100 dark:border-[#323b67]">
                            <span>100%</span>
                            <span>95%</span>
                            <span>90%</span>
                            <span>85%</span>
                            <span>80%</span>
                        </div>
                        {/* Chart Content */}
                        <div className="absolute left-8 right-10 top-2 bottom-6">
                            {/* Horizontal Grid Lines */}
                            <div className="w-full h-full flex flex-col justify-between">
                                <div className="w-full h-[1px] bg-slate-100 dark:bg-[#323b67]"></div>
                                <div className="w-full h-[1px] bg-slate-100 dark:bg-[#323b67] border-dashed border-t border-slate-200 dark:border-slate-700 opacity-30"></div>
                                <div className="w-full h-[1px] bg-slate-100 dark:bg-[#323b67]"></div>
                                <div className="w-full h-[1px] bg-slate-100 dark:bg-[#323b67] border-dashed border-t border-slate-200 dark:border-slate-700 opacity-30"></div>
                                <div className="w-full h-[1px] bg-slate-100 dark:bg-[#323b67]"></div>
                            </div>
                            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                {/* WPM Line (Yellow) */}
                                <defs>
                                    <linearGradient id="gradientWpm" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#eab308" stopOpacity="0.3"></stop>
                                        <stop offset="100%" stopColor="#eab308" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path className="drop-shadow-md" d="M0,80 L10,75 L20,78 L30,65 L40,60 L50,55 L60,58 L70,45 L80,40 L90,35 L100,30" fill="none" stroke="#eab308" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                                <path className="opacity-40" d="M0,80 L10,75 L20,78 L30,65 L40,60 L50,55 L60,58 L70,45 L80,40 L90,35 L100,30 V100 H0 Z" fill="url(#gradientWpm)" stroke="none"></path>
                                {/* Accuracy Line (Green) */}
                                <path className="opacity-80" d="M0,20 L10,15 L20,18 L30,12 L40,10 L50,15 L60,8 L70,5 L80,8 L90,3 L100,5" fill="none" stroke="#10b981" strokeDasharray="4 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                {/* Data Points */}
                                <circle cx="100" cy="30" fill="#eab308" r="2" stroke="#1c2136" strokeWidth="1"></circle>
                                <circle cx="100" cy="5" fill="#10b981" r="2" stroke="#1c2136" strokeWidth="1"></circle>
                            </svg>
                        </div>
                        {/* X-axis labels */}
                        <div className="absolute left-8 right-10 bottom-0 flex justify-between text-[10px] text-slate-400 dark:text-[#636b95] mt-2">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Today</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Trial History */}
                <div className="rounded-xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark p-6 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                        <button className="text-sm font-medium text-primary hover:text-blue-400 transition-colors">View All</button>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-[#323b67]">
                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Date</th>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Test Name</th>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">WPM</th>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Accuracy</th>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Status</th>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentResults.map((result) => (
                                    <tr key={result.id} className="group border-b border-slate-100 dark:border-[#323b67]/50 hover:bg-slate-50 dark:hover:bg-[#232948] transition-colors">
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{result.date}</td>
                                        <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">{result.testName}</td>
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-mono">{result.wpm}</td>
                                        <td className={`py-4 px-4 font-bold font-mono ${result.accuracy >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                            {result.accuracy}%
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${result.status === 'Completed'
                                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-slate-100 dark:bg-[#323b67] text-slate-600 dark:text-slate-300'
                                                }`}>
                                                <span className="material-symbols-outlined text-[14px]">
                                                    {result.status === 'Completed' ? 'check_circle' : 'history'}
                                                </span>
                                                {result.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button className="text-slate-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
