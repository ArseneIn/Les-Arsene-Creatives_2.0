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
        <div className="layout-container flex flex-col items-center w-full py-8 px-4 md:px-8 lg:px-12">
            <div className="max-w-[1200px] w-full flex flex-col gap-8">
                {/* Header */}
                <header>
                    <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                        Practice Arena
                    </h1>
                    <p className="text-slate-500 dark:text-[#929bc9] text-base font-normal">
                        Select a module to hone specific skills.
                    </p>
                </header>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MODULES.map((module) => (
                        <Link
                            key={module.id}
                            to={`/test?mode=practice&moduleId=${module.id}`}
                            className="group flex flex-col gap-4 p-6 rounded-xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-lg bg-slate-100 dark:bg-[#323b67] text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">{module.icon}</span>
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${module.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                        module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                    }`}>
                                    {module.difficulty}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                                    {module.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-[#929bc9] leading-relaxed">
                                    {module.description}
                                </p>
                            </div>

                            <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-[#636b95]">
                                <span className="material-symbols-outlined text-sm">timer</span>
                                <span>{module.duration}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentPractice;
