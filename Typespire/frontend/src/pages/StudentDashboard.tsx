import React, { useMemo, useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { useUserProgress } from '../context/UserProgressContext';
import { useFacilitator } from '../context/FacilitatorContext';
import { useAuth } from '../context/AuthContext';

const StudentDashboard: React.FC = () => {
    const { stats, recentResults } = useUserProgress();
    const { assignments } = useFacilitator();
    const { user } = useAuth();

    const currentUserId = user?.id || '';
    const currentUserSectionId = user?.sectionId || '';

    const [sectionInfo, setSectionInfo] = useState<{ sectionName: string, intakeName: string } | null>(null);

    // Live countdowns: map of assignmentId -> seconds remaining
    const [countdowns, setCountdowns] = useState<Record<string, number>>({});

    useEffect(() => {
        if (currentUserSectionId) {
            api.get(`/section/${currentUserSectionId}`).then(res => {
                if (res.data) {
                    setSectionInfo({
                        sectionName: res.data.name,
                        intakeName: res.data.intake?.name || 'Unknown Intake'
                    });
                }
            }).catch(console.error);
        }
    }, [currentUserSectionId]);

    // All active assignments for this student — memoised to avoid infinite re-render
    const studentAssignments = useMemo(() => assignments.filter(a =>
        a.status === 'Active' &&
        (
            (a.sectionId === currentUserSectionId) ||
            (a.studentIds && a.studentIds.includes(currentUserId))
        )
    ), [assignments, currentUserSectionId, currentUserId]);

    // Initialise countdowns from dueDateISO
    useEffect(() => {
        const initial: Record<string, number> = {};
        for (const a of studentAssignments) {
            if (a.dueDateISO) {
                const diff = Math.floor((new Date(a.dueDateISO).getTime() - Date.now()) / 1000);
                initial[a.id] = diff;
            }
        }
        setCountdowns(initial);
    }, [studentAssignments]);

    // Tick every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdowns(prev => {
                const next = { ...prev };
                for (const id in next) { next[id] = next[id] - 1; }
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const latestAssignment = studentAssignments[0] ?? null;

    // Map recent results to chart data
    const chartData = useMemo(() => {
        if (!recentResults || recentResults.length === 0) {
            // Mock empty state if no data yet
            return [
                { name: 'Mon', wpm: 0, accuracy: 0 },
                { name: 'Tue', wpm: 0, accuracy: 0 },
                { name: 'Wed', wpm: 0, accuracy: 0 },
            ];
        }
        
        // Reverse to show chronological order (left to right)
        return [...recentResults].reverse().slice(-14).map((result, idx) => {
            return {
                name: `Trial ${idx + 1}`,
                wpm: result.wpm,
                accuracy: result.accuracy
            };
        });
    }, [recentResults]);

    return (
        <div className="w-full py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center">
            <div className="max-w-[1200px] w-full flex flex-col gap-8">
                {/* Hero Banner Header */}
                <header className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-secondary p-6 md:p-8 text-white shadow-xl glow-primary">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-y-12 translate-x-12 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-secondary/20 rounded-full blur-xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider w-fit">
                                    <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                    {stats.streakDays}-Day Streak!
                                </span>
                                {sectionInfo && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider w-fit" title="Your assigned cohort and section (Read-only)">
                                        <span className="material-symbols-outlined text-[14px]">school</span>
                                        {sectionInfo.intakeName} • {sectionInfo.sectionName}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1 font-heading">
                                Welcome back, {user?.firstName || 'Student'}!
                            </h1>
                            <p className="text-white/90 text-sm md:text-base font-normal max-w-xl">
                                Your finger coordination is peaking today. Let's beat your personal target and climb to Level {stats.level + 1}!
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-black/15 backdrop-blur-md rounded-xl p-4 border border-white/15">
                            <span className="material-symbols-outlined text-yellow-400 text-4xl animate-pulse">workspace_premium</span>
                            <div>
                                <p className="text-xs text-white/80 uppercase tracking-widest font-bold">Current Standing</p>
                                <p className="text-2xl font-black font-heading">Level {stats.level}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── Assigned Tests Section ── */}
                {studentAssignments.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#094A71] text-lg">assignment</span>
                                Assigned Tests
                                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#094A71] text-white text-[10px] font-black">
                                    {studentAssignments.length}
                                </span>
                            </h2>
                            <Link to="/practice" className="text-xs text-[#33B974] font-bold hover:underline">Go to Practice →</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {studentAssignments.map(assignment => {
                                const isLevel2 = assignment.level === 2;
                                const secsLeft = countdowns[assignment.id] ?? null;
                                // Only lock if dueDateISO exists and time has passed
                                const isExpired = assignment.dueDateISO
                                    ? new Date(assignment.dueDateISO).getTime() < Date.now()
                                    : false;

                                const formatCountdown = (secs: number) => {
                                    if (secs <= 0) return 'Expired';
                                    const d = Math.floor(secs / 86400);
                                    const h = Math.floor((secs % 86400) / 3600);
                                    const m = Math.floor((secs % 3600) / 60);
                                    const s = secs % 60;
                                    if (d > 0) return `${d}d ${h}h left`;
                                    if (h > 0) return `${h}h ${m}m left`;
                                    if (m > 0) return `${m}m ${s}s left`;
                                    return `${s}s left`;
                                };

                                const urgency = secsLeft !== null && secsLeft <= 300 && secsLeft > 0; // Last 5 mins

                                return (
                                    <div
                                        key={assignment.id}
                                        className={`relative rounded-2xl border p-5 overflow-hidden flex items-start justify-between gap-4 ${
                                            isExpired
                                                ? 'bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/30 opacity-80'
                                                : isLevel2
                                                    ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20'
                                                    : 'bg-[#094A71]/5 dark:bg-[#094A71]/10 border-[#094A71]/20'
                                        }`}
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-30" style={{ background: isExpired ? '#f43f5e' : isLevel2 ? '#ef4444' : '#094A71' }} />
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                                                isExpired ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-500' :
                                                isLevel2 ? 'bg-red-100 dark:bg-red-500/15 text-red-500' : 'bg-[#094A71]/10 text-[#094A71]'
                                            }`}>
                                                <span className="material-symbols-outlined text-xl">{isExpired ? 'lock' : isLevel2 ? 'flash_on' : 'school'}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                        isExpired ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400' :
                                                        isLevel2 ? 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-[#094A71]/10 text-[#094A71]'
                                                    }`}>
                                                        {isExpired ? '🔒 Missing' : isLevel2 ? '⚡ Level 2 — Survival' : '📚 Level 1 — Standard'}
                                                    </span>
                                                    {/* Countdown timer */}
                                                    {secsLeft !== null && !isExpired && (
                                                        <span className={`text-[9px] font-bold flex items-center gap-0.5 ${
                                                            urgency ? 'text-rose-500 animate-pulse' : 'text-gray-400'
                                                        }`}>
                                                            <span className="material-symbols-outlined text-[11px]">timer</span>
                                                            {formatCountdown(secsLeft)}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-sm text-[#061824] dark:text-white truncate mb-0.5">{assignment.title}</h3>
                                                <p className="text-xs text-gray-400">
                                                    {isExpired
                                                        ? <span className="text-rose-500 font-semibold">This test has closed. Marked as missing.</span>
                                                        : <>Assigned by: <span className="font-medium text-gray-500">{assignment.facilitatorName ?? 'Facilitator'}</span></>
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        {isExpired ? (
                                            <span className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-rose-100 dark:bg-rose-500/15 text-rose-500 cursor-not-allowed">
                                                <span className="material-symbols-outlined text-sm">block</span>
                                                Missing
                                            </span>
                                        ) : (
                                            <Link
                                                to={`/test?assignmentId=${assignment.id}&level=${assignment.level ?? 1}`}
                                                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                                                    isLevel2
                                                        ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20 shadow-md'
                                                        : 'bg-[#094A71] hover:bg-[#094A71]/90 text-white shadow-[#094A71]/20 shadow-md'
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-sm">play_arrow</span>
                                                Take Test
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

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
                            {/* Recharts Performance Graph */}
                    <div className="w-full h-64 mt-4 select-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#33B974" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#33B974" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#323b67" opacity={0.2} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#929bc9', fontSize: 10, fontWeight: 'bold' }} 
                                    dy={10} 
                                />
                                <YAxis 
                                    yAxisId="left"
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#929bc9', fontSize: 10, fontWeight: 'bold' }} 
                                />
                                <YAxis 
                                    yAxisId="right" 
                                    orientation="right" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#929bc9', fontSize: 10, fontWeight: 'bold' }} 
                                    domain={[0, 100]}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="wpm" name="Speed (WPM)" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" />
                                <Area yAxisId="right" type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#33B974" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>             </div>
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
