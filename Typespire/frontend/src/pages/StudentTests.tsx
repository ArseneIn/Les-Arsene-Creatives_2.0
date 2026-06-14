import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFacilitator } from '../context/FacilitatorContext';
import { useUserProgress } from '../context/UserProgressContext';

export const StudentTests: React.FC = () => {
    const { user } = useAuth();
    const { assignments } = useFacilitator();
    const { recentResults, isStagePassed } = useUserProgress();
    const navigate = useNavigate();
    const [now] = React.useState(() => Date.now());

    const currentUserId = user?.id || '';
    const currentUserSectionId = user?.sectionId || '';

    const systemLevel = isStagePassed('stage-capstone') ? 2 : 1;

    // 1. Assigned Tests
    const allAssignedTests = useMemo(() => assignments.filter(a =>
        a.status === 'Active' &&
        ((a.sectionId === currentUserSectionId) || (a.studentIds && a.studentIds.includes(currentUserId)))
    ), [assignments, currentUserSectionId, currentUserId]);



    // 2. Randomised Tests for current level
    const randomisedTests = useMemo(() => {
        const levelName = systemLevel === 2 ? "Level 2 — Survival" : "Level 1 — Standard";
        const icon = systemLevel === 2 ? "flash_on" : "school";
        
        // Base random names
        const allPossibleNames = [
            "Speed Sprint Alpha",
            "Accuracy Challenge Beta",
            "Endurance Test Gamma",
            "Reflex Check Delta",
            "Focus Sprint Omega"
        ];
        
        // Exclude names already assigned
        const assignedTitles = allAssignedTests.map(a => a.title);
        const availableNames = allPossibleNames.filter(name => !assignedTitles.includes(name || ''));
        
        // Pick 3 random tests (or less if not enough)
        const selected = availableNames.slice(0, 3);
        
        return selected.map(title => ({
            title,
            level: systemLevel,
            levelName,
            icon,
            duration: '1 minute'
        }));
    }, [systemLevel, allAssignedTests]);

    return (
        <div className="w-full py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center">
            <div className="max-w-[1200px] w-full flex flex-col gap-10">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading mb-2">Tests Hub</h1>
                    <p className="text-slate-500 dark:text-slate-400">Complete tests from your facilitator or take randomized 1-minute sprints to improve your metrics.</p>
                </div>

                {!isStagePassed('stage-capstone') ? (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <span className="material-symbols-outlined text-5xl text-red-500 mb-4">lock</span>
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Tests Hub Locked</h2>
                        <p className="text-red-500 dark:text-red-300 max-w-lg mb-6">
                            You must complete all 12 stages of the <strong>Learning Path</strong> in the Practice Arena before you can access formal tests and 1-minute sprints.
                        </p>
                        <div className="flex flex-col items-center gap-3">
                            <button
                                onClick={() => navigate('/practice')}
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">school</span>
                                Go to Practice Arena
                            </button>
                            
                            <button
                                onClick={() => {
                                    const localKey = `typespire_progress_${user?.id || ''}`;
                                    const raw = localStorage.getItem(localKey);
                                    const parsed = raw ? JSON.parse(raw) : {};
                                    
                                    if (!parsed.stageResults) parsed.stageResults = {};
                                    parsed.stageResults['stage-capstone'] = {
                                        stageId: 'stage-capstone',
                                        bestWpm: 45,
                                        bestAccuracy: 98,
                                        attempts: 1,
                                        passed: true
                                    };
                                    
                                    if (!parsed.stats) parsed.stats = { level: 1, currentWpm: 0, targetWpm: 50, streakDays: 0 };
                                    parsed.stats.level = 2;
                                    
                                    localStorage.setItem(localKey, JSON.stringify(parsed));
                                    window.location.reload();
                                }}
                                className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1 mt-2 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                <span className="material-symbols-outlined text-[14px]">construction</span>
                                [Dev Sandbox] Instant Unlock Tests Hub
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Assigned Tests Section */}
                        <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[#094A71] text-xl">assignment</span>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Facilitator Assigned Tests</h2>
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#094A71]/10 text-[#094A71] text-xs font-bold">
                            {allAssignedTests.filter(a => {
                                const attemptsMade = recentResults.filter(r => r.assignmentId === a.id).length;
                                const isExpired = a.dueDateISO ? new Date(a.dueDateISO).getTime() < now : false;
                                return attemptsMade < (a.maxAttempts || 1) && !isExpired;
                            }).length} Pending
                        </span>
                    </div>

                    {allAssignedTests.length === 0 ? (
                        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-[#323b67] rounded-xl p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3">check_circle</span>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">All caught up!</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">You have no active tests assigned by your facilitator.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {allAssignedTests.map(assignment => {
                                const isLevel2 = assignment.level === 2;
                                const attemptsMade = recentResults.filter(r => r.assignmentId === assignment.id).length;
                                const maxAttempts = assignment.maxAttempts || 1;
                                const isCompleted = attemptsMade >= maxAttempts;
                                const isExpired = assignment.dueDateISO ? new Date(assignment.dueDateISO).getTime() < now : false;

                                // Highest performance metric
                                const assignmentResults = recentResults.filter(r => r.assignmentId === assignment.id);
                                const bestResult = assignmentResults.length > 0
                                    ? assignmentResults.reduce((best, curr) => curr.wpm > best.wpm ? curr : best, assignmentResults[0])
                                    : null;

                                return (
                                    <div key={assignment.id} className={`relative rounded-xl border p-5 overflow-hidden flex flex-col gap-4 transition-all hover:shadow-lg ${
                                        isCompleted 
                                            ? 'bg-emerald-50/40 dark:bg-emerald-500/5 border-emerald-200/50 dark:border-emerald-500/10 opacity-90'
                                            : isExpired
                                                ? 'bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/30 opacity-80'
                                                : isLevel2
                                                    ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20'
                                                    : 'bg-[#094A71]/5 dark:bg-[#094A71]/10 border-[#094A71]/20'
                                    }`}>
                                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-30" style={{ background: isCompleted ? '#10b981' : isExpired ? '#f43f5e' : isLevel2 ? '#ef4444' : '#094A71' }} />
                                        
                                        <div className="flex items-start justify-between relative z-10">
                                            <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                                                isCompleted ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-500' :
                                                isExpired ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-500' :
                                                isLevel2 ? 'bg-red-100 dark:bg-red-500/15 text-red-500' : 'bg-[#094A71]/10 text-[#094A71]'
                                            }`}>
                                                <span className="material-symbols-outlined text-xl">{isCompleted ? 'check_circle' : isExpired ? 'lock' : isLevel2 ? 'flash_on' : 'assignment_ind'}</span>
                                            </div>
                                            {assignment.dueDate && (
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isExpired ? 'text-rose-500' : 'text-slate-400'}`}>
                                                    {isExpired ? 'Expired' : `Due ${assignment.dueDate}`}
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative z-10 flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                                                    isCompleted ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                                                    isExpired ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400' :
                                                    isLevel2 ? 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-[#094A71]/10 text-[#094A71]'
                                                }`}>
                                                    {isCompleted ? '✓ Completed' : isExpired ? '🔒 Missing' : isLevel2 ? 'Level 2' : 'Level 1'}
                                                </span>
                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                                                    isCompleted 
                                                        ? 'bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                                        : 'bg-primary/10 text-primary border border-primary/20'
                                                }`}>
                                                    {maxAttempts > 1 
                                                        ? `Attempt ${attemptsMade}/${maxAttempts}` 
                                                        : `1 Attempt Allowed`}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 leading-tight">{assignment.title}</h3>
                                            {attemptsMade > 0 && bestResult && (
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
                                                    <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                                                    Best: {bestResult.wpm} WPM ({bestResult.accuracy}% Acc)
                                                </p>
                                            )}
                                        </div>
                                        {isCompleted ? (
                                            <button 
                                                disabled
                                                className="w-full py-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-sm font-bold cursor-default relative z-10 flex items-center justify-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-sm font-black">done_all</span>
                                                Completed
                                            </button>
                                        ) : isExpired ? (
                                            <button 
                                                disabled
                                                className="w-full py-2.5 rounded-lg bg-rose-100 dark:bg-rose-500/10 text-rose-500 border border-rose-500/10 text-sm font-bold cursor-not-allowed relative z-10 flex items-center justify-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-sm font-black">block</span>
                                                Expired
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => navigate(`/test?assignmentId=${assignment.id}`)}
                                                className="w-full py-2.5 rounded-lg bg-[#094A71] hover:bg-[#061824] dark:hover:bg-[#33B974] text-white text-sm font-bold transition-colors relative z-10"
                                            >
                                                {attemptsMade > 0 ? 'Retake Test' : 'Start Test'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>



                {/* Randomised Tests Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[#33B974] text-xl">shuffle</span>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">1-Minute Sprints</h2>
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#33B974]/10 text-[#33B974] text-xs font-bold">
                            Level {systemLevel}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {randomisedTests.map((test, idx) => (
                            <div key={idx} className="relative rounded-xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark p-5 overflow-hidden flex flex-col gap-4 transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20" style={{ background: '#33B974' }} />
                                
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="p-2.5 rounded-xl bg-[#33B974]/10 text-[#33B974]">
                                        <span className="material-symbols-outlined text-xl">{test.icon}</span>
                                    </div>
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-[14px]">timer</span>
                                        {test.duration}
                                    </span>
                                </div>
                                <div className="relative z-10">
                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block bg-slate-100 dark:bg-[#323b67] text-slate-500 dark:text-slate-400">
                                        {test.levelName}
                                    </span>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 leading-tight">{test.title}</h3>
                                </div>
                                <button 
                                    onClick={() => navigate(`/test?mode=random&level=${test.level}&title=${encodeURIComponent(test.title)}`)}
                                    className="mt-auto w-full py-2.5 rounded-lg border-2 border-[#33B974] text-[#33B974] hover:bg-[#33B974] hover:text-white text-sm font-bold transition-colors relative z-10"
                                >
                                    Start Sprint
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
                </>
                )}
            </div>
        </div>
    );
};

export default StudentTests;
