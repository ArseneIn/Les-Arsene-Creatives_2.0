import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '../context/UserProgressContext';
import { PRACTICE_STAGES, PRACTICE_MODULES } from '../data/practiceModules';
import { KeyboardHeatmap } from '../components/Practice/KeyboardHeatmap';
import { FunctionalKeyTutorial } from '../components/Practice/FunctionalKeyTutorial';

const StudentPractice: React.FC = () => {
    const navigate = useNavigate();
    const {
        isStageUnlocked, isStagePassed, stageResults, getBenchmark,
        keyStats, getKeyAccuracy, strugglingKeys, generatePersonalizedDrill,
    } = useUserProgress();

    const [showTutorial, setShowTutorial] = useState<string | null>(null);
    const [expandedModule, setExpandedModule] = useState<string>(PRACTICE_MODULES[0]?.id || '');

    const handleStageClick = (stageId: string) => {
        const stage = PRACTICE_STAGES.find(s => s.id === stageId);
        if (!stage || !isStageUnlocked(stageId)) return;
        if (stage.isFunctionalKey) {
            setShowTutorial(stageId);
        } else {
            navigate(`/test?mode=practice&stageId=${stageId}`);
        }
    };

    const handleTutorialComplete = (stageId: string) => {
        setShowTutorial(null);
        navigate(`/test?mode=practice&stageId=${stageId}`);
    };

    const topThreeStrugglingKeys = strugglingKeys.slice(0, 3);

    const tutorialStage = showTutorial ? PRACTICE_STAGES.find(s => s.id === showTutorial) : null;

    return (
        <div className="w-full py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center">
            {/* Functional Key Tutorial Modal */}
            {tutorialStage && (
                <FunctionalKeyTutorial
                    stage={tutorialStage}
                    onComplete={() => handleTutorialComplete(tutorialStage.id)}
                    onSkip={() => {
                        setShowTutorial(null);
                        navigate(`/test?mode=practice&stageId=${tutorialStage.id}`);
                    }}
                />
            )}

            <div className="max-w-[1400px] w-full flex flex-col gap-8">
                {/* Header */}
                <header className="flex flex-col gap-1 border-b border-slate-200 dark:border-slate-800 pb-5">
                    <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-1">
                        <span className="material-symbols-outlined text-sm text-[#33B974]">school</span>
                        <span>Practice Arena</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                        Keyboard Mastery Path
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
                        A progressive 12-stage journey from your first key press to full keyboard fluency. Complete each stage to unlock the next.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_500px] gap-8">
                    {/* ── LEFT: Skill Tree ── */}
                    <div className="flex flex-col gap-3">
                        <h2 className="text-base font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#094A71] text-lg">route</span>
                            Learning Path
                        </h2>

                        {PRACTICE_MODULES.map((mod, mIndex) => {
                            const isExpanded = expandedModule === mod.id;
                            
                            // Check if module is fully locked (first stage locked)
                            const firstStageLocked = !isStageUnlocked(mod.subLevels[0].id);
                            
                            // Calculate module progress
                            const passedCount = mod.subLevels.filter(s => isStagePassed(s.id)).length;
                            const progressPercent = Math.round((passedCount / mod.subLevels.length) * 100);

                            return (
                                <div key={mod.id} className="flex flex-col mb-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    {/* Module Header (Click to expand) */}
                                    <div 
                                        onClick={() => !firstStageLocked && setExpandedModule(isExpanded ? '' : mod.id)}
                                        className={`p-5 flex items-center justify-between transition-colors ${firstStageLocked ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${firstStageLocked ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : progressPercent === 100 ? 'bg-[#33B974]/10 text-[#33B974]' : 'bg-[#094A71]/10 text-[#094A71]'}`}>
                                                <span className="material-symbols-outlined text-2xl">{firstStageLocked ? 'lock' : mod.icon}</span>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Module {mod.moduleNumber}</div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{mod.title}</h3>
                                            </div>
                                        </div>
                                        
                                        {!firstStageLocked && (
                                            <div className="flex items-center gap-6">
                                                <div className="hidden sm:block text-right">
                                                    <div className="text-xs font-bold text-slate-500 mb-1">{progressPercent}% Completed</div>
                                                    <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#33B974] rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                                                    </div>
                                                </div>
                                                <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    expand_more
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded SubLevels */}
                                    {isExpanded && !firstStageLocked && (
                                        <div className="p-5 pt-0 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800">
                                            <div className="mt-5 flex flex-col gap-0">
                                                {mod.subLevels.map((stage, index) => {
                                                    const unlocked = isStageUnlocked(stage.id);
                                                    const passed = isStagePassed(stage.id);
                                                    const result = stageResults[stage.id];
                                                    const benchmark = getBenchmark(stage.id);
                                                    const isActive = unlocked && !passed;

                                                    return (
                                                        <div key={stage.id} className="flex items-stretch gap-4 relative">
                                                            {/* Timeline connector */}
                                                            <div className="flex flex-col items-center gap-0 w-8 flex-shrink-0 relative z-10">
                                                                <div className={`
                                                                    w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 bg-white dark:bg-slate-900
                                                                    ${passed ? 'border-[#33B974] text-[#33B974]' :
                                                                    isActive ? 'border-[#094A71] text-[#094A71] shadow-[0_0_8px_rgba(9,74,113,0.3)] animate-pulse' :
                                                                    'border-slate-200 dark:border-slate-700 text-slate-400'}
                                                                `}>
                                                                    {passed ? <span className="material-symbols-outlined text-sm">check</span> : unlocked ? stage.stageNumber.split('.')[1] : <span className="material-symbols-outlined text-sm">lock</span>}
                                                                </div>
                                                                {index < mod.subLevels.length - 1 && (
                                                                    <div className={`w-0.5 flex-1 min-h-[20px] transition-colors duration-300 ${passed ? 'bg-[#33B974]/40' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                                                )}
                                                            </div>

                                                            {/* Stage Card */}
                                                            <div
                                                                onClick={() => handleStageClick(stage.id)}
                                                                className={`
                                                                    flex-1 mb-4 p-4 rounded-xl border transition-all duration-300 relative overflow-hidden bg-white dark:bg-slate-800
                                                                    ${passed ? 'border-[#33B974]/20' :
                                                                    isActive ? 'border-[#094A71]/30 cursor-pointer shadow-md hover:-translate-y-0.5' :
                                                                    'border-slate-100 dark:border-slate-700 opacity-60 cursor-not-allowed'}
                                                                `}
                                                            >
                                                                <div className="flex items-start justify-between gap-4">
                                                                    <div className="flex items-start gap-3 flex-1">
                                                                        <div className={`
                                                                            p-2 rounded-lg flex-shrink-0
                                                                            ${passed ? 'bg-[#33B974]/10 text-[#33B974]' :
                                                                            isActive ? 'bg-[#094A71]/10 text-[#094A71]' :
                                                                            'bg-slate-100 dark:bg-slate-700 text-slate-400'}
                                                                        `}>
                                                                            <span className="material-symbols-outlined text-lg">{stage.icon}</span>
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <h3 className={`font-bold text-sm mb-1 ${passed ? 'text-[#33B974]' : isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                                                                {stage.title}
                                                                            </h3>
                                                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-1">{stage.description}</p>
                                                                            
                                                                            {/* Key tags */}
                                                                            {stage.keysTaught.length > 0 && (
                                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                                    {stage.keysTaught.slice(0, 5).map(key => (
                                                                                        <span key={key} className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300">
                                                                                            {key.toUpperCase()}
                                                                                        </span>
                                                                                    ))}
                                                                                    {stage.keysTaught.length > 5 && (
                                                                                        <span className="text-[10px] text-slate-400">+{stage.keysTaught.length - 5}</span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-shrink-0 text-right flex flex-col justify-center">
                                                                        {passed && result ? (
                                                                            <>
                                                                                <div className="text-sm font-bold text-[#33B974]">{result.bestWpm} WPM</div>
                                                                                <div className="text-[10px] text-slate-400">{result.bestAccuracy}% acc</div>
                                                                            </>
                                                                        ) : isActive ? (
                                                                            <div className="text-xs font-bold text-[#094A71] bg-[#094A71]/10 px-2 py-1 rounded">Train</div>
                                                                        ) : !unlocked ? (
                                                                            <div className="text-[10px] text-slate-400 text-right leading-tight">Req: {benchmark.wpm} WPM</div>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── RIGHT: Heatmap + Smart Recommendations ── */}
                    <div className="flex flex-col gap-6">
                        {/* Keyboard Heatmap */}
                        <div className="bg-white dark:bg-[#0b1e2d] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-6 self-start">
                                <span className="material-symbols-outlined text-[#094A71] dark:text-[#5aacdf]">grid_on</span>
                                <h3 className="font-bold text-[#061824] dark:text-white text-base">Key Proficiency</h3>
                            </div>
                            <KeyboardHeatmap keyStats={keyStats} />
                        </div>

                        {/* Smart Recommendations */}
                        <div className="bg-white dark:bg-[#0b1e2d] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-[#33B974]">psychology</span>
                                <h3 className="font-bold text-[#061824] dark:text-white text-base">Smart Coach</h3>
                            </div>

                            {topThreeStrugglingKeys.length > 0 ? (
                                <>
                                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                        Based on your sessions, these keys need more attention:
                                    </p>
                                    <div className="flex flex-col gap-2 mb-5">
                                        {topThreeStrugglingKeys.map((key, i) => {
                                            const stat = keyStats[key];
                                            const acc = stat ? Math.round((stat.hits / stat.attempts) * 100) : 0;
                                            return (
                                                <div key={key} className="flex items-center gap-3">
                                                    <div className={`
                                                        w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm border
                                                        ${i === 0 ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400' :
                                                          i === 1 ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' :
                                                          'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-500/10 dark:border-yellow-500/20 dark:text-yellow-400'}
                                                    `}>
                                                        {key === ' ' ? '⎵' : key.toUpperCase()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-xs mb-0.5">
                                                            <span className="font-medium text-gray-600 dark:text-gray-400">Key "{key === ' ' ? 'Space' : key.toUpperCase()}"</span>
                                                            <span className={`font-bold ${acc < 85 ? 'text-red-500' : acc < 95 ? 'text-amber-500' : 'text-[#33B974]'}`}>{acc}%</span>
                                                        </div>
                                                        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${acc < 85 ? 'bg-red-400' : acc < 95 ? 'bg-amber-400' : 'bg-[#33B974]'}`}
                                                                style={{ width: `${acc}%` }}
                                                            />
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 mt-0.5">{stat?.misses ?? 0} misses recorded</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/test?mode=drill&customText=${encodeURIComponent(generatePersonalizedDrill())}`)}
                                        className="w-full bg-[#33B974] hover:bg-[#33B974]/90 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(51,185,116,0.25)] hover:shadow-[0_6px_20px_rgba(51,185,116,0.35)] flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-base">flash_on</span>
                                        Quick Drill (Personalized)
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2 block">bar_chart</span>
                                    <p className="text-sm text-gray-400">Complete a few practice sessions to get personalized key recommendations.</p>
                                </div>
                            )}
                        </div>

                        {/* Keyboard Heatmap */}
                        <KeyboardHeatmap
                            getKeyAccuracy={getKeyAccuracy}
                            keyStats={keyStats}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPractice;
