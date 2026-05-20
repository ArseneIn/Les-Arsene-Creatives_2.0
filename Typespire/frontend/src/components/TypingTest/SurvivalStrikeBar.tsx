import React from 'react';

interface SurvivalStrikeBarProps {
    strikes: number; // 0, 1, 2, or 3 (3 = game over)
    maxStrikes?: number;
}

export const SurvivalStrikeBar: React.FC<SurvivalStrikeBarProps> = ({ strikes, maxStrikes = 3 }) => {
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Strikes</span>
            <div className="flex items-center gap-2">
                {Array.from({ length: maxStrikes }).map((_, i) => {
                    const isHit = i < strikes;
                    return (
                        <div
                            key={i}
                            className={`
                                relative w-9 h-9 rounded-lg border-2 flex items-center justify-center
                                transition-all duration-300
                                ${isHit
                                    ? 'bg-red-500/15 border-red-500 text-red-500 shadow-[0_0_12px_2px_rgba(239,68,68,0.3)]'
                                    : 'bg-white/5 border-white/20 text-white/30'
                                }
                                ${isHit && i === strikes - 1 ? 'scale-110 animate-[shake_0.3s_ease-in-out]' : ''}
                            `}
                        >
                            {isHit ? (
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <span className="text-lg font-mono font-light">—</span>
                            )}
                        </div>
                    );
                })}
            </div>
            {strikes >= maxStrikes && (
                <span className="text-red-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                    ⚠ Terminal
                </span>
            )}
        </div>
    );
};
