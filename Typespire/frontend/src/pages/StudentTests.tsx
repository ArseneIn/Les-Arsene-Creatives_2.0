import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFacilitator } from '../context/FacilitatorContext';
import { useUserProgress } from '../context/UserProgressContext';

export const StudentTests: React.FC = () => {
    const { user } = useAuth();
    const { assignments } = useFacilitator();
    const { stats } = useUserProgress();
    const navigate = useNavigate();

    const currentUserId = user?.id || '';
    const currentUserSectionId = user?.sectionId || '';

    // 1. Assigned Tests
    const assignedTests = assignments.filter(a =>
        a.status === 'Active' &&
        ((a.sectionId === currentUserSectionId) || (a.studentIds && a.studentIds.includes(currentUserId)))
    );

    // 2. Randomised Tests for current level
    const randomisedTests = useMemo(() => {
        const level = stats.level >= 2 ? 2 : 1;
        const levelName = level === 2 ? "Level 2 — Survival" : "Level 1 — Standard";
        const icon = level === 2 ? "flash_on" : "school";
        
        // Base random names
        const allPossibleNames = [
            "Speed Sprint Alpha",
            "Accuracy Challenge Beta",
            "Endurance Test Gamma",
            "Reflex Check Delta",
            "Focus Sprint Omega"
        ];
        
        // Exclude names already assigned
        const assignedTitles = assignedTests.map(a => a.title);
        const availableNames = allPossibleNames.filter(name => !assignedTitles.includes(name || ''));
        
        // Pick 3 random tests (or less if not enough)
        const selected = availableNames.slice(0, 3);
        
        return selected.map(title => ({
            title,
            level,
            levelName,
            icon,
            duration: '1 minute'
        }));
    }, [stats.level, assignedTests]);

    return (
        <div className="w-full py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center">
            <div className="max-w-[1200px] w-full flex flex-col gap-10">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading mb-2">Tests Hub</h1>
                    <p className="text-slate-500 dark:text-slate-400">Complete assignments from your facilitator or take randomized 1-minute sprints to improve your metrics.</p>
                </div>

                {/* Assigned Tests Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[#094A71] text-xl">assignment</span>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Facilitator Assigned Tests</h2>
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#094A71]/10 text-[#094A71] text-xs font-bold">
                            {assignedTests.length} Pending
                        </span>
                    </div>

                    {assignedTests.length === 0 ? (
                        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-[#323b67] rounded-xl p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3">check_circle</span>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">All caught up!</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">You have no pending assignments from your facilitator.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {assignedTests.map(assignment => {
                                const isLevel2 = assignment.level === 2;
                                return (
                                    <div key={assignment.id} className={`relative rounded-xl border p-5 overflow-hidden flex flex-col gap-4 transition-all hover:shadow-lg ${
                                        isLevel2 ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20' : 'bg-[#094A71]/5 dark:bg-[#094A71]/10 border-[#094A71]/20'
                                    }`}>
                                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-30" style={{ background: isLevel2 ? '#ef4444' : '#094A71' }} />
                                        
                                        <div className="flex items-start justify-between relative z-10">
                                            <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                                                isLevel2 ? 'bg-red-100 dark:bg-red-500/15 text-red-500' : 'bg-[#094A71]/10 text-[#094A71]'
                                            }`}>
                                                <span className="material-symbols-outlined text-xl">{isLevel2 ? 'flash_on' : 'assignment_ind'}</span>
                                            </div>
                                            {assignment.dueDate && (
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due {assignment.dueDate}</span>
                                            )}
                                        </div>
                                        <div className="relative z-10">
                                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block ${
                                                isLevel2 ? 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-[#323b67] text-slate-500 dark:text-slate-400'
                                            }`}>
                                                {isLevel2 ? 'Level 2' : 'Level 1'}
                                            </span>
                                            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 leading-tight">{assignment.title}</h3>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/test?assignmentId=${assignment.id}`)}
                                            className="mt-auto w-full py-2.5 rounded-lg bg-[#094A71] hover:bg-[#061824] dark:hover:bg-[#33B974] text-white text-sm font-bold transition-colors relative z-10"
                                        >
                                            Start Test
                                        </button>
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
                            Level {stats.level}
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
            </div>
        </div>
    );
};

export default StudentTests;
