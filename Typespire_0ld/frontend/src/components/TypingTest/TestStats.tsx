import React from 'react';

interface TestStatsProps {
    wpm: number;
    accuracy: number;
}

export const TestStats: React.FC<TestStatsProps> = ({ wpm, accuracy }) => {
    return (
        <div className="flex items-center gap-8 mb-8 bg-white/40 dark:bg-[#1a2e21]/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm w-fit">
            <div className="flex items-center gap-3 px-4">
                <div className="p-2 bg-admin-primary/10 rounded-lg text-admin-primary">
                    <span className="material-symbols-outlined text-xl">speed</span>
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">WPM</p>
                    <p className="text-2xl font-bold leading-none text-gray-900 dark:text-white">{wpm}</p>
                </div>
            </div>

            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex items-center gap-3 px-4">
                <div className="p-2 bg-admin-primary/10 rounded-lg text-admin-primary">
                    <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Accuracy</p>
                    <p className="text-2xl font-bold leading-none text-gray-900 dark:text-white">{accuracy}%</p>
                </div>
            </div>
        </div>
    );
};
