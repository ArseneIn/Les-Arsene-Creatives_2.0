import React, { useMemo } from 'react';
import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useUserProgress } from '../context/UserProgressContext';

interface ResultsState {
    wpm: number;
    accuracy: number;
    passed: boolean;
    benchmark: { wpm: number; accuracy: number };
    strugglingKeys?: Record<string, number>;
    stageId?: string;
    stageName?: string;
    nextStageId?: string | null;
    isPractice?: boolean;
    isLevel2?: boolean;
    prevBestWpm?: number;
    isNewStagePassed?: boolean;
    keyBreakdown?: Record<string, { hits: number; misses: number }>;
    assignmentId?: string;
    testTitle?: string;
}

// Mini accuracy bar for a key
const KeyBar: React.FC<{ label: string; hits: number; misses: number }> = ({ label, hits, misses }) => {
    const total = hits + misses;
    if (total === 0) return null;
    const acc = Math.round((hits / total) * 100);
    const color = acc >= 95 ? 'bg-emerald-400' : acc >= 80 ? 'bg-amber-400' : 'bg-red-400';
    return (
        <div className="flex flex-col items-center gap-1.5 w-12">
            <div className="w-full h-20 bg-slate-100 dark:bg-slate-700 rounded-lg relative overflow-hidden flex items-end">
                <div
                    className={`w-full ${color} rounded-b-lg transition-all`}
                    style={{ height: `${acc}%` }}
                />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                {label === ' ' ? '⎵' : label}
            </span>
            <span className={`text-[9px] font-bold ${acc >= 95 ? 'text-emerald-500' : acc >= 80 ? 'text-amber-500' : 'text-red-500'}`}>
                {acc}%
            </span>
        </div>
    );
};

const StudentResults: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { keyStats } = useUserProgress();

    const state = location.state as ResultsState | null;

    if (!state) return <Navigate to="/test" replace />;

    const {
        wpm, accuracy, stageId, stageName, nextStageId,
        isPractice, isLevel2, prevBestWpm = 0,
        isNewStagePassed, keyBreakdown = {},
        assignmentId, testTitle, strugglingKeys,
    } = state;

    const benchmark = state.benchmark || { wpm: 40, accuracy: 90 };
    const passed = typeof state.passed === 'boolean' ? state.passed : (wpm >= benchmark.wpm && accuracy >= benchmark.accuracy);

    const wpmDelta = wpm - prevBestWpm;
    const isImprovement = wpmDelta > 0 && prevBestWpm > 0;
    const isFirstAttempt = prevBestWpm === 0;

    // Top struggling keys from this session
    const sessionStrugglingKeys = useMemo(() => {
        return Object.entries(strugglingKeys ?? {})
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([key, count]) => ({ key, count }));
    }, [strugglingKeys]);

    // Key breakdown entries (sorted by accuracy ascending — worst first)
    const keyBreakdownEntries = useMemo(() => {
        return Object.entries(keyBreakdown)
            .filter(([, v]) => v.hits + v.misses > 0)
            .sort(([, a], [, b]) => {
                const accA = a.hits / (a.hits + a.misses);
                const accB = b.hits / (b.hits + b.misses);
                return accA - accB; // worst first
            })
            .slice(0, 12);
    }, [keyBreakdown]);

    const modeLabel = isLevel2 ? '⚡ Level 2 — Survival' : isPractice ? '🎯 Practice Stage' : assignmentId ? '📋 Assignment' : '🏁 Sprint Test';
    const modeColor = isLevel2 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : isPractice ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';

    return (
        <div className="w-full min-h-screen py-10 px-4 sm:px-6 md:px-8 flex flex-col items-center">
            <div className="max-w-[900px] w-full flex flex-col gap-6">

                {/* ── Header ── */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${modeColor} border-current/20 mb-2`}>
                            {modeLabel}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            {testTitle ?? stageName ?? 'Test Results'}
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <Link to="/" className="text-sm font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span>
                        Dashboard
                    </Link>
                </div>

                {/* ── New Stage Banner ── */}
                {isNewStagePassed && (
                    <div className="relative rounded-2xl bg-gradient-to-r from-[#33B974] to-[#094A71] p-5 text-white shadow-lg shadow-[#33B974]/20 overflow-hidden">
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
                            <span className="material-symbols-outlined text-9xl">emoji_events</span>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <span className="material-symbols-outlined text-3xl">emoji_events</span>
                            </div>
                            <div>
                                <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Achievement Unlocked</p>
                                <h2 className="text-xl font-black">{stageName} — Passed!</h2>
                                <p className="text-white/80 text-sm">{nextStageId ? 'Next stage is now unlocked. Keep going!' : 'You\'ve completed all stages! Amazing!'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Assignment Submitted Banner ── */}
                {assignmentId && (
                    <div className={`rounded-xl border p-4 flex items-center gap-3 ${passed ? 'border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : 'border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20'}`}>
                        <div className={`p-2 rounded-lg ${passed ? 'bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600' : 'bg-amber-100 dark:bg-amber-800/50 text-amber-600'}`}>
                            <span className="material-symbols-outlined text-xl">{passed ? 'assignment_turned_in' : 'assignment_late'}</span>
                        </div>
                        <div>
                            <p className={`font-bold text-sm ${passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                {passed ? 'Assignment Submitted & Passed ✓' : 'Assignment Submitted — Below Target'}
                            </p>
                            <p className="text-xs text-slate-500">Your result has been recorded and sent to your facilitator.</p>
                        </div>
                    </div>
                )}

                {/* ── Main Stats Row ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* WPM */}
                    <div className="col-span-1 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full blur-xl" />
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Speed</p>
                        <p className={`text-5xl font-black font-mono ${wpm >= benchmark.wpm ? 'text-amber-500' : 'text-red-400'}`}>{wpm}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">WPM</p>
                        <p className="text-[10px] text-slate-400 mt-2">Goal: <span className="font-bold text-slate-600 dark:text-slate-300">{benchmark.wpm} WPM</span></p>
                    </div>

                    {/* Accuracy */}
                    <div className="col-span-1 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl" />
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Accuracy</p>
                        <p className={`text-5xl font-black font-mono ${accuracy >= benchmark.accuracy ? 'text-emerald-500' : 'text-red-400'}`}>{accuracy}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">%</p>
                        <p className="text-[10px] text-slate-400 mt-2">Goal: <span className="font-bold text-slate-600 dark:text-slate-300">{benchmark.accuracy}%</span></p>
                    </div>

                    {/* Result */}
                    <div className={`col-span-1 rounded-2xl border p-5 shadow-sm flex flex-col justify-between ${passed ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'}`}>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Result</p>
                        <div>
                            <span className={`material-symbols-outlined text-4xl ${passed ? 'text-emerald-500' : 'text-red-400'}`}>
                                {passed ? 'check_circle' : 'cancel'}
                            </span>
                            <p className={`text-lg font-black mt-2 ${passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {passed ? 'Passed!' : 'Not Yet'}
                            </p>
                        </div>
                    </div>

                    {/* vs. Previous */}
                    <div className="col-span-1 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">vs. Previous</p>
                        {isFirstAttempt ? (
                            <div>
                                <span className="material-symbols-outlined text-4xl text-blue-400">star</span>
                                <p className="text-sm font-black text-blue-500 mt-2">First Try!</p>
                            </div>
                        ) : (
                            <div>
                                <span className={`material-symbols-outlined text-4xl ${isImprovement ? 'text-emerald-500' : 'text-amber-400'}`}>
                                    {isImprovement ? 'trending_up' : 'trending_flat'}
                                </span>
                                <p className={`text-lg font-black mt-2 font-mono ${isImprovement ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {isImprovement ? `+${wpmDelta}` : wpmDelta === 0 ? '±0' : `${wpmDelta}`} WPM
                                </p>
                                <p className="text-[10px] text-slate-400">Best was {prevBestWpm} WPM</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Per-Key Breakdown ── */}
                {keyBreakdownEntries.length > 0 && (
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="material-symbols-outlined text-[#094A71] dark:text-sky-400">grid_on</span>
                            <h3 className="font-bold text-base text-slate-800 dark:text-white">Key Accuracy Breakdown</h3>
                            <span className="text-xs text-slate-400 ml-1">— this session</span>
                        </div>
                        <div className="flex flex-wrap gap-4 items-end">
                            {keyBreakdownEntries.map(([key, val]) => (
                                <KeyBar key={key} label={key} hits={val.hits} misses={val.misses} />
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-4">Bar height = accuracy. Red = needs work, Amber = improving, Green = solid.</p>
                    </div>
                )}

                {/* ── Struggling Keys ── */}
                {sessionStrugglingKeys.length > 0 && (
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500">keyboard_hide</span>
                                <h3 className="font-bold text-base text-slate-800 dark:text-white">Keys That Need Work</h3>
                            </div>
                            <button
                                onClick={() => navigate(`/test?mode=drill&customText=${encodeURIComponent(
                                    Object.keys(sessionStrugglingKeys.reduce((a, { key }) => ({ ...a, [key]: true }), {})).join(' ').repeat(8)
                                )}`)}
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#33B974]/10 text-[#33B974] hover:bg-[#33B974]/20 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">flash_on</span>
                                Drill These Keys
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {sessionStrugglingKeys.map(({ key, count }) => (
                                <div key={key} className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl px-3 py-2">
                                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-800/50 flex items-center justify-center font-mono font-black text-red-600 dark:text-red-400 text-sm">
                                        {key === ' ' ? '⎵' : key.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-red-600 dark:text-red-400">{count} miss{count !== 1 ? 'es' : ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Actions ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {nextStageId && passed && isPractice && (
                        <Link
                            to={`/test?mode=practice&stageId=${nextStageId}`}
                            className="flex items-center justify-center gap-2 bg-[#33B974] hover:bg-[#33B974]/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#33B974]/20 text-sm"
                        >
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                            Next Stage
                        </Link>
                    )}
                    {assignmentId && !passed && (
                        <Link
                            to={`/test?assignmentId=${assignmentId}`}
                            className="flex items-center justify-center gap-2 bg-[#094A71] hover:bg-[#094A71]/90 text-white font-bold py-3.5 rounded-xl transition-all text-sm"
                        >
                            <span className="material-symbols-outlined text-base">replay</span>
                            Retry Assignment
                        </Link>
                    )}
                    <Link
                        to="/practice"
                        className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                    >
                        <span className="material-symbols-outlined text-base">school</span>
                        Practice Arena
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                    >
                        <span className="material-symbols-outlined text-base">home</span>
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentResults;
