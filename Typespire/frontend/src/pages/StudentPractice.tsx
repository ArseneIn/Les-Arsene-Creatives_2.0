import React from 'react';
import { Link } from 'react-router-dom';

interface PracticeModule {
    id: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    icon: string;
}

const MODULES: PracticeModule[] = [
    {
        id: 'home-row',
        title: 'Home Row Mastery',
        description: 'Focus on the core keys (ASDF JKL;) to build a solid foundation.',
        difficulty: 'Beginner',
        duration: '1 min',
        icon: 'keyboard'
    },
    {
        id: 'common-words',
        title: 'Top 100 Common Words',
        description: 'Practice the most frequently used words in the English language.',
        difficulty: 'Beginner',
        duration: '1 min',
        icon: 'text_fields'
    },
    {
        id: 'capitalization',
        title: 'Shift Key & Capitals',
        description: 'Master the shift key for proper capitalization without slowing down.',
        difficulty: 'Intermediate',
        duration: '2 min',
        icon: 'keyboard_capslock'
    },
    {
        id: 'punctuation',
        title: 'Punctuation Precision',
        description: 'Navigate periods, commas, and quotes with ease.',
        difficulty: 'Intermediate',
        duration: '2 min',
        icon: 'format_quote'
    },
    {
        id: 'numbers',
        title: 'Number Row',
        description: 'Reach for the top row numbers without looking down.',
        difficulty: 'Advanced',
        duration: '3 min',
        icon: 'pin'
    },
    {
        id: 'code-snippets',
        title: 'Code Syntax (JS/TS)',
        description: 'Practice typing brackets, braces, and common coding keywords.',
        difficulty: 'Advanced',
        duration: '5 min',
        icon: 'code'
    }
];

const StudentPractice: React.FC = () => {
    return (
        <div className="w-full py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center">
            <div className="max-w-[1200px] w-full flex flex-col gap-8">
                {/* Header */}
                <header className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                        Practice Arena
                    </h1>
                    <p className="text-slate-500 dark:text-[#929bc9] text-base font-normal">
                        Select a specialized training module below to hone specific keyboard coordination.
                    </p>
                </header>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MODULES.map((module) => (
                        <Link
                            key={module.id}
                            to={`/test?mode=practice&moduleId=${module.id}`}
                            className="group flex flex-col gap-5 p-6 rounded-2xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5 hover-scale active-scale transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
                            
                            <div className="flex justify-between items-start relative z-10">
                                <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#323b67] text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm shadow-black/5">
                                    <span className="material-symbols-outlined text-2xl flex items-center justify-center">{module.icon}</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                                    module.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20' :
                                    module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-500/20' :
                                    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20'
                                }`}>
                                    {module.difficulty}
                                </span>
                            </div>

                            <div className="relative z-10 flex-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300 tracking-tight">
                                    {module.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-[#929bc9] leading-relaxed font-normal">
                                    {module.description}
                                </p>
                            </div>

                            <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-[#323b67]/40 flex items-center justify-between text-xs font-bold text-slate-400 dark:text-[#636b95]">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">timer</span>
                                    <span>{module.duration}</span>
                                </div>
                                <span className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex items-center gap-0.5">
                                    <span>Train Now</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentPractice;
