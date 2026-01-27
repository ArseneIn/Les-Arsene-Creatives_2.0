import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

const StudentResults: React.FC = () => {
    const location = useLocation();
    const { wpm, accuracy } = location.state || { wpm: 0, accuracy: 0 };

    // Redirect if accessed directly without data (optional, but good UX)
    if (!location.state) {
        return <Navigate to="/test" replace />;
    }

    // Simple logic for feedback
    const isGoalMet = wpm >= 40 && accuracy >= 90;

    return (
        <div className="max-w-[960px] mx-auto py-10 px-6">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h1 className="text-secondary dark:text-white tracking-tight text-[40px] font-bold leading-tight pb-2">Trial Results</h1>
                <p className="text-secondary/60 dark:text-white/60 text-base font-normal">1-Minute Standardized Test • {new Date().toLocaleDateString()}</p>
            </div>

            {/* Performance Status Banner */}
            <div className="mb-8 @container">
                <div className={`flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border p-5 md:flex-row md:items-center ${isGoalMet ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full flex items-center justify-center ${isGoalMet ? 'bg-emerald-500/20 text-emerald-600' : 'bg-yellow-500/20 text-yellow-600'}`}>
                            <span className="material-symbols-outlined font-bold">{isGoalMet ? 'workspace_premium' : 'trending_up'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className={`text-lg font-bold leading-tight ${isGoalMet ? 'text-emerald-700 dark:text-emerald-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
                                {isGoalMet ? 'Goal Met!' : 'Keep Practicing!'}
                            </p>
                            <p className="text-secondary/80 dark:text-white/70 text-sm font-normal">
                                {isGoalMet
                                    ? "Outstanding performance! You've met the speed and accuracy requirements."
                                    : "You're doing great! Focus on accuracy first, then speed will follow."}
                            </p>
                        </div>
                    </div>
                    <Link to="/" className="text-sm font-bold leading-normal tracking-[0.015em] flex items-center gap-2 text-primary hover:underline">
                        Return to Dashboard
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </Link>
                </div>
            </div>

            {/* Hero Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-2 rounded-xl p-8 border border-primary/20 bg-white dark:bg-background-dark shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-xl">speed</span>
                        <p className="text-secondary/60 dark:text-white/50 text-sm font-medium uppercase tracking-wider">Net WPM</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-secondary dark:text-white tracking-tight text-6xl font-bold leading-tight">{wpm}</p>
                        <p className="text-primary text-lg font-semibold">WPM</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-8 border border-primary/20 bg-white dark:bg-background-dark shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-xl">target</span>
                        <p className="text-secondary/60 dark:text-white/50 text-sm font-medium uppercase tracking-wider">Accuracy %</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-secondary dark:text-white tracking-tight text-6xl font-bold leading-tight">{accuracy}</p>
                        <p className="text-primary text-lg font-semibold">%</p>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                <Link to="/test" className="w-full sm:w-auto px-8 py-3 rounded-lg border-2 border-secondary text-secondary font-bold hover:bg-secondary/5 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">refresh</span>
                    Try Again
                </Link>
                <Link to="/" className="w-full sm:w-auto px-10 py-3 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">done_all</span>
                    Finish Session
                </Link>
            </div>
        </div>
    );
};

export default StudentResults;
