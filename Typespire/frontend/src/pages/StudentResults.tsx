import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

const StudentResults: React.FC = () => {
    const location = useLocation();
    const { wpm, accuracy } = location.state || { wpm: 0, accuracy: 0 };

    // Redirect if accessed directly without data
    if (!location.state) {
        return <Navigate to="/test" replace />;
    }

    const isGoalMet = wpm >= 40 && accuracy >= 90;

    return (
        <div className="w-full py-12 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="max-w-[720px] w-full flex flex-col gap-8">
                {/* Header Section */}
                <div className="text-center">
                    <span className="inline-flex items-center gap-1 bg-primary/15 text-primary text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20 mb-3">
                        <span className="material-symbols-outlined text-sm font-bold">assignment_turned_in</span>
                        Session Finished
                    </span>
                    <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl md:text-5xl font-black leading-tight">
                        Trial Results
                    </h1>
                    <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base font-normal mt-1.5">
                        1-Minute Standardized Test • {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Performance Status Banner */}
                <div className={`rounded-2xl border p-5 md:p-6 shadow-sm transition-all duration-300 ${
                    isGoalMet 
                        ? 'border-emerald-500/35 bg-emerald-500/5 dark:bg-emerald-500/10' 
                        : 'border-yellow-500/35 bg-yellow-500/5 dark:bg-yellow-500/10'
                }`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl flex items-center justify-center shadow-sm ${
                                isGoalMet ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                            }`}>
                                <span className="material-symbols-outlined text-3xl font-black">
                                    {isGoalMet ? 'workspace_premium' : 'trending_up'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className={`text-xl font-bold leading-tight ${isGoalMet ? 'text-emerald-700 dark:text-emerald-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
                                    {isGoalMet ? 'Goal Completed!' : 'Keep Practicing!'}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm font-normal leading-relaxed max-w-md">
                                    {isGoalMet
                                        ? "Outstanding performance! You've met the target threshold of 40 WPM with high accuracy."
                                        : "You're doing great! Keep working on accuracy first, and the speed will automatically follow."}
                                </p>
                            </div>
                        </div>
                        <Link to="/" className="text-sm font-bold flex items-center gap-1.5 text-primary hover:text-emerald-600 hover:translate-x-0.5 transition-all self-start md:self-auto shrink-0">
                            <span>Return Home</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </Link>
                    </div>
                </div>

                {/* Hero Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* WPM Card */}
                    <div className="flex flex-col gap-2 rounded-2xl p-8 border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
                        <div className="flex items-center gap-2 mb-2 relative z-10 text-slate-400 dark:text-[#929bc9]">
                            <span className="material-symbols-outlined text-primary text-xl">speed</span>
                            <p className="text-xs font-bold uppercase tracking-wider">Net Speed</p>
                        </div>
                        <div className="flex items-baseline gap-2 relative z-10">
                            <p className="text-slate-900 dark:text-white tracking-tight text-7xl font-black leading-none">{wpm}</p>
                            <p className="text-primary text-lg font-bold">WPM</p>
                        </div>
                    </div>

                    {/* Accuracy Card */}
                    <div className="flex flex-col gap-2 rounded-2xl p-8 border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-accent/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
                        <div className="flex items-center gap-2 mb-2 relative z-10 text-slate-400 dark:text-[#929bc9]">
                            <span className="material-symbols-outlined text-emerald-accent text-xl">target</span>
                            <p className="text-xs font-bold uppercase tracking-wider">Accuracy</p>
                        </div>
                        <div className="flex items-baseline gap-2 relative z-10">
                            <p className="text-slate-900 dark:text-white tracking-tight text-7xl font-black leading-none">{accuracy}</p>
                            <p className="text-emerald-accent text-lg font-bold">%</p>
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                    <Link to="/test" className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-300 dark:border-[#323b67] text-slate-700 dark:text-slate-200 bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all flex items-center justify-center gap-2 hover-scale active-scale">
                        <span className="material-symbols-outlined text-[20px]">refresh</span>
                        <span>Try Again</span>
                    </Link>
                    <Link to="/" className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 hover-scale active-scale glow-primary">
                        <span className="material-symbols-outlined text-[20px]">done_all</span>
                        <span>Finish Session</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentResults;
