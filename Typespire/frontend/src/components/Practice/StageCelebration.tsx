import React, { useEffect, useState } from 'react';

interface StageCelebrationProps {
    stageName: string;
    wpm: number;
    accuracy: number;
    nextStageId: string | null;
    isCapstone?: boolean;   // capstone pass → eligible for Level 1 Tests
    isLevel1Pass?: boolean; // level 1 test pass → eligible for Level 2 Tests
    onContinue: () => void;
    onViewResults: () => void;
}

type Piece = {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    color: string;
    shape: 'circle' | 'square' | 'diamond';
    rotation: number;
};

const COLORS = ['#33B974', '#094A71', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

const generatePieces = (count = 80): Piece[] =>
    Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2.5 + Math.random() * 2,
        size: 6 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: (['circle', 'square', 'diamond'] as const)[Math.floor(Math.random() * 3)],
        rotation: Math.random() * 360,
    }));

const StageCelebration: React.FC<StageCelebrationProps> = ({
    stageName, wpm, accuracy, nextStageId,
    isCapstone = false, isLevel1Pass = false,
    onContinue, onViewResults,
}) => {
    const [pieces] = useState<Piece[]>(generatePieces);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Slight delay so CSS transition fires
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    const shapeClass = (shape: Piece['shape']) => {
        if (shape === 'circle') return 'rounded-full';
        if (shape === 'diamond') return 'rotate-45';
        return 'rounded-sm';
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#061824]/95 backdrop-blur-md transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Confetti rain */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {pieces.map(p => (
                    <div
                        key={p.id}
                        className={`absolute ${shapeClass(p.shape)}`}
                        style={{
                            left: `${p.left}%`,
                            top: '-5%',
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            transform: `rotate(${p.rotation}deg)`,
                            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in infinite`,
                            opacity: 0.9,
                        }}
                    />
                ))}
            </div>

            {/* Modal card */}
            <div className={`relative z-10 bg-white dark:bg-[#0b1e2d] rounded-3xl shadow-2xl border border-[#33B974]/40 p-10 max-w-md w-full mx-4 text-center transition-all duration-500 ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}>
                {/* Trophy burst */}
                <div className="relative mx-auto mb-6 w-24 h-24">
                    <div className="absolute inset-0 rounded-full bg-[#33B974]/20 animate-ping" />
                    <div className="absolute inset-2 rounded-full bg-[#33B974]/10" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#33B974] to-[#094A71] flex items-center justify-center shadow-lg shadow-[#33B974]/30">
                        <span className="material-symbols-outlined text-5xl text-white">emoji_events</span>
                    </div>
                </div>

                {/* Milestone eligibility banner — Capstone */}
                {isCapstone && (
                    <div className="mb-5 rounded-2xl overflow-hidden border border-amber-400/40 shadow-lg shadow-amber-500/10">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-white text-lg">rocket_launch</span>
                            <span className="text-white font-black text-xs uppercase tracking-widest">Course Mastery Achieved!</span>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 px-5 py-4 text-left">
                            <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">🏅 You are now eligible for Level 1 Formal Tests!</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                                Head to the <strong>Tests Hub</strong> to take your first graded test assigned by your facilitator. Prove your typing skills under real evaluation conditions!
                            </p>
                            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                <span className="material-symbols-outlined text-xs">arrow_right_alt</span>
                                Go to Tests Hub after closing this screen
                            </div>
                        </div>
                    </div>
                )}

                {/* Milestone eligibility banner — Level 1 passed */}
                {isLevel1Pass && (
                    <div className="mb-5 rounded-2xl overflow-hidden border border-red-400/40 shadow-lg shadow-red-500/10">
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-white text-lg">workspace_premium</span>
                            <span className="text-white font-black text-xs uppercase tracking-widest">Level 1 Cleared!</span>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 px-5 py-4 text-left">
                            <p className="text-sm font-bold text-red-800 dark:text-red-300 mb-1">⚡ You are now eligible for Level 2 Survival Tests!</p>
                            <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
                                Level 2 is a faster, harder challenge with no backspace. Your facilitator can now assign you Level 2 sprint tests. Bring your best speed!
                            </p>
                            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                                <span className="material-symbols-outlined text-xs">arrow_right_alt</span>
                                Check Tests Hub for new Level 2 assignments
                            </div>
                        </div>
                    </div>
                )}

                {/* Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 ${
                    isCapstone
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : isLevel1Pass
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                }`}>
                    <span className="material-symbols-outlined text-sm">{isCapstone ? 'emoji_events' : isLevel1Pass ? 'workspace_premium' : 'star'}</span>
                    {isCapstone ? 'Course Complete!' : isLevel1Pass ? 'Level 1 Cleared!' : 'Stage Unlocked!'}
                </div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                    You crushed it! 🎉
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{stageName}</span> is now complete
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-2xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Speed</p>
                        <p className="text-3xl font-black text-[#33B974] font-mono">{wpm}</p>
                        <p className="text-[10px] text-slate-400 font-bold">WPM</p>
                    </div>
                    <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-2xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Accuracy</p>
                        <p className="text-3xl font-black text-[#094A71] dark:text-sky-400 font-mono">{accuracy}%</p>
                        <p className="text-[10px] text-slate-400 font-bold">Correct</p>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                    {isCapstone ? (
                        <button
                            onClick={onContinue}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 text-sm"
                        >
                            <span className="material-symbols-outlined text-base">quiz</span>
                            Go to Tests Hub
                        </button>
                    ) : nextStageId ? (
                        <button
                            onClick={onContinue}
                            className="w-full bg-[#33B974] hover:bg-[#33B974]/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#33B974]/25 flex items-center justify-center gap-2 text-sm"
                        >
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                            Continue to Next Stage
                        </button>
                    ) : (
                        <button
                            onClick={onContinue}
                            className="w-full bg-[#33B974] hover:bg-[#33B974]/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#33B974]/25 flex items-center justify-center gap-2 text-sm"
                        >
                            <span className="material-symbols-outlined text-base">school</span>
                            Back to Practice Arena
                        </button>
                    )}
                    <button
                        onClick={onViewResults}
                        className="w-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">analytics</span>
                        View Detailed Results
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes confettiFall {
                    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
                    80%  { opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default StageCelebration;
