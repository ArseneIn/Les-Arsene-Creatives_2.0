import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProgress } from '../context/UserProgressContext';
import { useFacilitator } from '../context/FacilitatorContext';
import { useAuth } from '../context/AuthContext';

const StudentDashboard: React.FC = () => {
    const { stats, recentResults } = useUserProgress();
    const { assignments } = useFacilitator();
    const { user } = useAuth();

    const currentUserId = user?.id || '';
    const currentUserSectionId = user?.sectionId || '';

    // Get the latest active assignment for this student
    const latestAssignment = assignments.find(a =>
        a.status === 'Active' &&
        (
            (a.sectionId === currentUserSectionId) ||
            (a.studentIds && a.studentIds.includes(currentUserId))
        )
    );

    return (
        <div className="w-full py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center">
            <div className="max-w-[1200px] w-full flex flex-col gap-8">
                {/* Hero Banner Header */}
                <header className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 p-6 md:p-8 text-white shadow-xl glow-primary">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-y-12 translate-x-12 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider w-fit">
                                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                {stats.streakDays}-Day Streak!
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1 font-heading">
                                Welcome back, {user?.firstName || 'Student'}!
                            </h1>
                            <p className="text-emerald-100/90 text-sm md:text-base font-normal max-w-xl">
                                Your finger coordination is peaking today. Let's beat your personal target and climb to Level {stats.level + 1}!
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-black/15 backdrop-blur-md rounded-xl p-4 border border-white/15">
                            <span className="material-symbols-outlined text-yellow-400 text-4xl animate-pulse">workspace_premium</span>
                            <div>
                                <p className="text-xs text-emerald-200 uppercase tracking-widest font-bold">Current Standing</p>
                                <p className="text-2xl font-black font-heading">Level {stats.level}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Top Row: Action & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Test (Action Panel) */}
                    <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark p-6 md:p-8 shadow-md flex flex-col justify-center relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2.5">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${latestAssignment ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                                        {latestAssignment ? 'Active Assignment' : 'No Pending Work'}
                                    </span>
                                    {latestAssignment && (
                                        <span className="text-slate-400 dark:text-[#929bc9] text-xs font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">event</span>
                                            Due: {latestAssignment.dueDate}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1 font-heading">
                                    {latestAssignment ? latestAssignment.title : 'All caught up, ready for practice!'}
                                </h2>
                                <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base font-normal leading-relaxed max-w-xl">
                                    {latestAssignment
                                        ? "Complete this assignment to maintain your classes' typing standing and earn bonus skill points."
                                        : "Incredible effort! There are no assignments waiting for you. Head to the practice zone to boost your speed."}
                                </p>
                            </div>
                            <Link 
                                to={latestAssignment ? `/test?assignmentId=${latestAssignment.id}` : "/practice"} 
                                className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-white font-bold py-3.5 px-7 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover-scale active-scale font-heading"
                            >
                                <span className="material-symbols-outlined text-[20px]">{latestAssignment ? 'play_arrow' : 'keyboard'}</span>
                                <span>{latestAssignment ? 'Start Assignment' : 'Go to Practice'}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Goal Progress (Stats Gauge) */}
                    <div className="rounded-2xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark p-6 shadow-md flex flex-col items-center justify-center relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <h3 className="w-full text-left text-sm font-bold text-slate-500 dark:text-[#929bc9] mb-4 flex justify-between">
                            <span className="uppercase tracking-wider">GOAL PROGRESS</span>
                            <span className="text-xs bg-yellow-accent/15 text-yellow-600 dark:text-yellow-accent px-2 py-0.5 rounded-full font-bold">Level {stats.level}</span>
                        </h3>
                        {/* CSS/SVG Gauge */}
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                {/* Background Circle */}
                                <path className="text-slate-100 dark:text-[#323b67]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3.2"></path>
                                {/* Progress Circle */}
                                <path
                                    className="text-emerald-accent transition-all duration-1000 ease-out"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeDasharray={`${Math.min(100, (stats.currentWpm / stats.targetWpm) * 100)}, 100`}
                                    strokeLinecap="round"
                                    strokeWidth="3.2"
                                ></path>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight font-heading">{stats.currentWpm}</span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-widest mt-0.5">WPM</span>
                            </div>
                        </div>
                        <div className="w-full flex justify-between items-center mt-4 text-xs font-semibold">
                            <div className="flex flex-col">
                                <span className="text-slate-400 dark:text-[#929bc9] uppercase tracking-wider text-[10px]">Current</span>
                                <span className="text-slate-900 dark:text-white text-sm font-bold mt-0.5">{stats.currentWpm} wpm</span>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-200 dark:bg-[#323b67]"></div>
                            <div className="flex flex-col items-end">
                                <span className="text-slate-400 dark:text-[#929bc9] uppercase tracking-wider text-[10px]">Target</span>
                                <span className="text-emerald-accent text-sm font-bold mt-0.5">{stats.targetWpm} wpm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Row: Performance Chart */}
                <div className="rounded-2xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark p-6 md:p-8 shadow-md flex flex-col">
                    <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">Performance Trends</h3>
                            <p className="text-sm text-slate-500 dark:text-[#929bc9]">Last 30 Days Typing Activity</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#232948] px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-accent"></div>
                                <span className="text-xs font-semibold text-slate-600 dark:text-[#929bc9] uppercase">Speed (WPM)</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#232948] px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-accent"></div>
                                <span className="text-xs font-semibold text-slate-600 dark:text-[#929bc9] uppercase">Accuracy (%)</span>
                            </div>
                        </div>
                    </div>
                    {/* SVG Chart Simulation */}
                    <div className="relative w-full h-64 select-none">
                        {/* Y-axis labels (Left - WPM) */}
                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-bold text-slate-400 dark:text-[#636b95] pr-3 border-r border-slate-100 dark:border-[#323b67]">
                            <span>60 WPM</span>
                            <span>45 WPM</span>
                            <span>30 WPM</span>
                            <span>15 WPM</span>
                            <span>0 WPM</span>
                        </div>
                        {/* Y-axis labels (Right - Accuracy) */}
                        <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-[10px] font-bold text-slate-400 dark:text-[#636b95] pl-3 border-l border-slate-100 dark:border-[#323b67]">
                            <span>100% ACC</span>
                            <span>95% ACC</span>
                            <span>90% ACC</span>
                            <span>85% ACC</span>
                            <span>80% ACC</span>
                        </div>
                        {/* Chart Content */}
                        <div className="absolute left-14 right-14 top-2 bottom-6">
                            {/* Horizontal Grid Lines */}
                            <div className="w-full h-full flex flex-col justify-between">
                                <div className="w-full h-[1px] bg-slate-100 dark:bg-[#323b67]"></div>
                                <div className="w-full h-[1px] bg-slate-100 dark:bg-[#323b67] border-dashed border-t border-slate-200 dark:border-slate-700 opacity-20"></div>
                                <div className="w-full h-[1px] bg-slate-100 dark:bg-[#323b67]"></div>
                                <div className="w-full h-[1px] bg-slate-100 dark:bg-[#323b67] border-dashed border-t border-slate-200 dark:border-slate-700 opacity-20"></div>
                                <div className="w-full h-[1px] bg-slate-100 dark:bg-[#323b67]"></div>
                            </div>
                            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                {/* WPM Line (Yellow) */}
                                <defs>
                                    <linearGradient id="gradientWpm" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#eab308" stopOpacity="0.25"></stop>
                                        <stop offset="100%" stopColor="#eab308" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path className="drop-shadow-md" d="M0,80 L10,75 L20,78 L30,65 L40,60 L50,55 L60,58 L70,45 L80,40 L90,35 L100,30" fill="none" stroke="#eab308" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5"></path>
                                <path className="opacity-40" d="M0,80 L10,75 L20,78 L30,65 L40,60 L50,55 L60,58 L70,45 L80,40 L90,35 L100,30 V100 H0 Z" fill="url(#gradientWpm)" stroke="none"></path>
                                {/* Accuracy Line (Green) */}
                                <path className="opacity-80" d="M0,20 L10,15 L20,18 L30,12 L40,10 L50,15 L60,8 L70,5 L80,8 L90,3 L100,5" fill="none" stroke="#10b981" strokeDasharray="5 3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                                {/* Data Points */}
                                <circle cx="100" cy="30" fill="#eab308" r="3.5" stroke="#1c2136" strokeWidth="1.5"></circle>
                                <circle cx="100" cy="5" fill="#10b981" r="3.5" stroke="#1c2136" strokeWidth="1.5"></circle>
                            </svg>
                        </div>
                        {/* X-axis labels */}
                        <div className="absolute left-14 right-14 bottom-0 flex justify-between text-[10px] font-bold text-slate-400 dark:text-[#636b95] mt-2">
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
                <div className="rounded-2xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark p-6 md:p-8 shadow-md overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">Recent Activity</h3>
                        <Link to="/history" className="text-sm font-bold text-primary hover:text-emerald-500 transition-colors flex items-center gap-1">
                            <span>View All</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-[#323b67] pb-3">
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Date</th>
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Test Name</th>
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">WPM</th>
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Accuracy</th>
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Status</th>
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentResults.map((result) => (
                                    <tr key={result.id} className="group border-b border-slate-100 dark:border-[#323b67]/50 hover:bg-slate-50 dark:hover:bg-[#232948] transition-colors">
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">{result.date}</td>
                                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{result.testName}</td>
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-mono font-semibold">{result.wpm}</td>
                                        <td className={`py-4 px-4 font-bold font-mono ${result.accuracy >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                            {result.accuracy}%
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${result.status === 'Completed'
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
                                            <button className="text-slate-400 hover:text-primary transition-colors hover-scale active-scale">
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
