import React from 'react';
import { useFacilitator } from '../context/FacilitatorContext';

const FacilitatorAnalytics: React.FC = () => {
    const { students, sections } = useFacilitator();

    // Calculate actual aggregates from live students in database
    const totalEnrolled = students.length;
    const avgSpeed = students.length > 0 
        ? Math.round(students.reduce((sum, s) => sum + s.currentWpm, 0) / students.length)
        : 0;

    // Students with speed below 20 WPM (needs attention)
    // For beginners with 0 runs, let's see how many need attention
    const needsAttentionCount = students.filter(s => s.currentWpm < 20).length;

    return (
        <>
            {/* Page Heading */}
            <div className="mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight font-heading mb-2">Class Analytics</h1>
                <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base font-normal max-w-2xl">
                    Monitor typing progress aggregates, speeds, and student segments assigned to your sections.
                </p>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Avg Speed */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-lg pointer-events-none"></div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider mb-2">Avg. Class Speed</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white font-heading">{avgSpeed}</span>
                        <span className="text-sm font-bold text-slate-400 dark:text-[#636b95] mb-1">WPM</span>
                    </div>
                    <div className="mt-4 flex items-center text-slate-400 dark:text-[#929bc9] text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                        <span>0% this week</span>
                    </div>
                </div>

                {/* Total Enrolled */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm relative overflow-hidden group">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider mb-2">Total Roster Enrolled</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white font-heading">{totalEnrolled}</span>
                        <span className="text-sm font-bold text-slate-400 dark:text-[#636b95] mb-1">Students</span>
                    </div>
                    <div className="mt-4 flex items-center text-slate-400 dark:text-[#929bc9] text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm mr-1">supervised_user_circle</span>
                        <span>Active in Kepler database</span>
                    </div>
                </div>

                {/* Needs Attention */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm relative overflow-hidden group border-l-4 border-l-amber-500">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider mb-2">Needs Attention</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white font-heading">{needsAttentionCount}</span>
                        <span className="text-sm font-bold text-slate-400 dark:text-[#636b95] mb-1">Students</span>
                    </div>
                    <div className="mt-4 flex items-center text-amber-600 dark:text-amber-400 text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm mr-1">warning</span>
                        <span>Below 20 WPM</span>
                    </div>
                </div>
            </div>

            {/* Performance Charts Area - Beautiful Dynamic Blank State */}
            <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px]">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 text-slate-400">
                    <span className="material-symbols-outlined text-4xl">monitoring</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">Performance Charts</h3>
                <p className="text-slate-500 dark:text-[#929bc9] text-center max-w-md text-sm leading-relaxed mb-6">
                    Detailed progression curves, speed timelines, and accuracy aggregates will render here once students in **{sections[0]?.name || 'your class sections'}** complete their first typing sessions.
                </p>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-[#323b67]/30 text-xs font-bold text-slate-500 dark:text-[#929bc9] border border-slate-200/50 dark:border-slate-800/80">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Accuracy Tracing
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-[#323b67]/30 text-xs font-bold text-slate-500 dark:text-[#929bc9] border border-slate-200/50 dark:border-slate-800/80">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        WPM Progression
                    </div>
                </div>
            </div>
            <div className="h-20"></div>
        </>
    );
};

export default FacilitatorAnalytics;
