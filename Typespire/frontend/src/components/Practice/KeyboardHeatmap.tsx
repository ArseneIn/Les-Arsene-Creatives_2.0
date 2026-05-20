import React, { useState } from 'react';

interface KeyboardHeatmapProps {
    getKeyAccuracy: (key: string) => number | null;
    keyStats: Record<string, { attempts: number; hits: number; misses: number }>;
}

// Full QWERTY layout definition
const KEYBOARD_ROWS = [
    ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
    ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
    ['CapsLock','a','s','d','f','g','h','j','k','l',';',"'",'Enter'],
    ['Shift','z','x','c','v','b','n','m',',','.','/','RShift'],
    ['Space'],
];

const KEY_LABEL: Record<string, string> = {
    'Backspace': '⌫',
    'Tab': '↹',
    'CapsLock': '⇪ Caps',
    'Enter': '↵ Enter',
    'Shift': '⇧ Shift',
    'RShift': '⇧ Shift',
    'Space': 'Space',
};

const KEY_WIDTHS: Record<string, string> = {
    'Backspace': 'min-w-[72px]',
    'Tab': 'min-w-[56px]',
    'CapsLock': 'min-w-[68px]',
    'Enter': 'min-w-[72px]',
    'Shift': 'min-w-[88px]',
    'RShift': 'min-w-[88px]',
    'Space': 'flex-1',
};

function getKeyColor(accuracy: number | null, hasData: boolean): string {
    if (!hasData || accuracy === null) return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    if (accuracy >= 95) return 'bg-[#33B974]/15 text-[#33B974] border-[#33B974]/30 dark:bg-[#33B974]/10';
    if (accuracy >= 85) return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    return 'bg-red-100 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
}

function getHeatGlow(accuracy: number | null, hasData: boolean): string {
    if (!hasData || accuracy === null) return '';
    if (accuracy >= 95) return 'shadow-[0_0_8px_2px_rgba(51,185,116,0.25)]';
    if (accuracy >= 85) return 'shadow-[0_0_8px_2px_rgba(245,158,11,0.2)]';
    return 'shadow-[0_0_8px_2px_rgba(239,68,68,0.25)]';
}

export const KeyboardHeatmap: React.FC<KeyboardHeatmapProps> = ({ getKeyAccuracy, keyStats }) => {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const coverageCount = Object.values(keyStats).filter(s => s.attempts >= 1).length;
    const totalKeys = 47; // approximate typeable keys
    const coveragePct = Math.round((coverageCount / totalKeys) * 100);
    const greenKeys = Object.entries(keyStats).filter(([k, s]) => {
        if (s.attempts < 5) return false;
        const acc = s.hits / s.attempts;
        return acc >= 0.95;
    }).length;

    const renderKey = (key: string, rowIndex: number, keyIndex: number) => {
        const lookupKey = key.toLowerCase() === 'space' ? ' ' : key.toLowerCase();
        const stat = keyStats[lookupKey];
        const hasData = !!stat && stat.attempts >= 1;
        const accuracy = getKeyAccuracy(lookupKey);
        const colorClass = getKeyColor(accuracy, hasData);
        const glowClass = getHeatGlow(accuracy, hasData);
        const widthClass = KEY_WIDTHS[key] ?? 'min-w-[40px]';
        const label = KEY_LABEL[key] ?? key.toUpperCase();
        const isHovered = hoveredKey === key;

        return (
            <div
                key={`${rowIndex}-${keyIndex}-${key}`}
                className={`
                    relative group flex items-center justify-center
                    h-10 px-2 rounded-lg border text-xs font-bold
                    cursor-default transition-all duration-200
                    ${widthClass} ${colorClass} ${glowClass}
                    ${isHovered ? 'scale-110 z-10' : 'hover:scale-105'}
                `}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(null)}
            >
                <span className="truncate">{label}</span>

                {/* Tooltip */}
                {isHovered && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                        <div className="bg-[#061824] text-white text-[10px] font-medium px-2.5 py-2 rounded-lg shadow-xl min-w-[100px] text-center whitespace-nowrap border border-white/10">
                            {hasData ? (
                                <>
                                    <div className="font-bold text-xs mb-0.5">
                                        {key === 'Space' ? 'Space Bar' : `Key "${key.toUpperCase()}"`}
                                    </div>
                                    <div className="text-[#33B974]">{accuracy}% accuracy</div>
                                    <div className="text-slate-400">{stat?.hits ?? 0} hits · {stat?.misses ?? 0} misses</div>
                                </>
                            ) : (
                                <>
                                    <div className="font-bold text-xs mb-0.5">
                                        {key === 'Space' ? 'Space Bar' : `Key "${key.toUpperCase()}"`}
                                    </div>
                                    <div className="text-slate-400 italic">Not practiced yet</div>
                                </>
                            )}
                        </div>
                        <div className="w-2 h-2 bg-[#061824] border-r border-b border-white/10 rotate-45 mx-auto -mt-1" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-[#0b1e2d] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-[#061824] dark:text-white font-bold text-base">Keyboard Heatmap</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Hover any key to see your stats</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-[#094A71] dark:text-[#33B974]">{coveragePct}%</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Coverage</div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-[10px] font-semibold text-gray-500">
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-sm bg-[#33B974]/15 border border-[#33B974]/30" />
                    Mastered (≥95%)
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-sm bg-amber-100 border border-amber-200" />
                    Developing (85–94%)
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-sm bg-red-100 border border-red-200" />
                    Needs Work (&lt;85%)
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-sm bg-slate-100 border border-slate-200" />
                    Untouched
                </span>
            </div>

            {/* Keyboard */}
            <div className="flex flex-col gap-1.5 overflow-x-auto pb-1">
                {KEYBOARD_ROWS.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1.5 justify-center">
                        {row.map((key, keyIndex) => renderKey(key, rowIndex, keyIndex))}
                    </div>
                ))}
            </div>

            {/* Summary bar */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-500">
                <span>{coverageCount} of {totalKeys} keys practiced</span>
                <span className="text-[#33B974] font-semibold">{greenKeys} keys mastered</span>
            </div>
        </div>
    );
};
