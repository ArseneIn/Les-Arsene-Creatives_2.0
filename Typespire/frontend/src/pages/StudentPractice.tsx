import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '../context/UserProgressContext';
import { PRACTICE_STAGES } from '../data/practiceModules';
import { KeyboardHeatmap } from '../components/Practice/KeyboardHeatmap';
import { FunctionalKeyTutorial } from '../components/Practice/FunctionalKeyTutorial';

const StudentPractice: React.FC = () => {
    const navigate = useNavigate();
    const {
        isStageUnlocked, isStagePassed, stageResults, getBenchmark,
        keyStats, getKeyAccuracy, strugglingKeys, generatePersonalizedDrill,
    } = useUserProgress();

    const [showTutorial, setShowTutorial] = useState<string | null>(null);

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

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
                    {/* ── LEFT: Skill Tree ── */}
                    <div className="flex flex-col gap-3">
                        <h2 className="text-base font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#094A71] text-lg">route</span>
                            Learning Path
                        </h2>

                        {PRACTICE_STAGES.map((stage, index) => {
                            const unlocked = isStageUnlocked(stage.id);
                            const passed = isStagePassed(stage.id);
                            const result = stageResults[stage.id];
                            const benchmark = getBenchmark(stage.id);
                            const isActive = unlocked && !passed;
                            const prevStage = stage.unlockRequires
                                ? PRACTICE_STAGES.find(s => s.id === stage.unlockRequires)
                                : null;

                            return (
                                <div key={stage.id} className="flex items-stretch gap-4">
                                    {/* Timeline connector */}
                                    <div className="flex flex-col items-center gap-0 w-10 flex-shrink-0">
                                        <div className={`
                                            w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300
                                            ${passed ? 'bg-[#33B974] border-[#33B974] text-white shadow-[0_0_12px_rgba(51,185,116,0.4)]' :
                                              isActive ? 'bg-[#094A71] border-[#094A71] text-white shadow-[0_0_12px_rgba(9,74,113,0.4)] animate-pulse' :
                                              'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}
                                        `}>
                                            {passed
                                                ? <span className="material-symbols-outlined text-base">check</span>
                                                : unlocked
                                                    ? <span className="text-xs">{stage.stageNumber}</span>
                                                    : <span className="material-symbols-outlined text-base">lock</span>
                                            }
                                        </div>
                                        {index < PRACTICE_STAGES.length - 1 && (
                                            <div className={`w-0.5 flex-1 min-h-[12px] transition-colors duration-300 ${passed ? 'bg-[#33B974]/40' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                        )}
                                    </div>

                                    {/* Stage Card */}
                                    <div
                                        onClick={() => handleStageClick(stage.id)}
                                        className={`
                                            flex-1 mb-3 p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
                                            ${passed ? 'bg-[#33B974]/5 border-[#33B974]/20 dark:bg-[#33B974]/5 dark:border-[#33B974]/15' :
                                              isActive ? 'bg-[#094A71]/5 border-[#094A71]/25 dark:bg-[#094A71]/10 dark:border-[#094A71]/25 cursor-pointer hover:shadow-lg hover:shadow-[#094A71]/10 hover:-translate-y-0.5' :
                                              'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'}
                                        `}
                                    >
                                        {/* Active glow */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#094A71]/5 to-transparent pointer-events-none" />
                                        )}

                                        <div className="flex items-start justify-between gap-4 relative z-10">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`
                                                    p-2.5 rounded-xl flex-shrink-0
                                                    ${passed ? 'bg-[#33B974]/10 text-[#33B974]' :
                                                      isActive ? 'bg-[#094A71]/10 text-[#094A71]' :
                                                      'bg-slate-100 dark:bg-slate-800 text-slate-400'}
                                                `}>
                                                    <span className="material-symbols-outlined text-xl">{stage.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                            Stage {stage.stageNumber}
                                                        </span>
                                                        {stage.isFunctionalKey && (
                                                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#094A71]/10 text-[#094A71] dark:text-[#5aacdf] rounded-full">
                                                                Tutorial
                                                            </span>
                                                        )}
                                                        {passed && (
                                                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#33B974]/10 text-[#33B974] rounded-full">
                                                                ✓ Passed
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className={`font-bold text-sm mb-0.5 ${passed ? 'text-[#33B974]' : isActive ? 'text-[#061824] dark:text-white' : 'text-slate-400'}`}>
                                                        {stage.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{stage.description}</p>

                                                    {/* Key tags */}
                                                    {stage.keysTaught.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {stage.keysTaught.slice(0, 8).map(key => (
                                                                <span key={key} className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500">
                                                                    {key}
                                                                </span>
                                                            ))}
                                                            {stage.keysTaught.length > 8 && (
                                                                <span className="text-[9px] text-slate-400">+{stage.keysTaught.length - 8} more</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right side info */}
                                            <div className="flex-shrink-0 text-right">
                                                {passed && result ? (
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-[#33B974]">{result.bestWpm}</div>
                                                        <div className="text-[10px] text-gray-400">WPM best</div>
                                                        <div className="text-xs text-gray-400">{result.bestAccuracy}% acc</div>
                                                    </div>
                                                ) : isActive ? (
                                                    <div className="flex items-center gap-1 text-[#094A71] font-bold text-xs bg-[#094A71]/10 px-3 py-1.5 rounded-full">
                                                        <span>Train Now</span>
                                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                    </div>
                                                ) : !unlocked ? (
                                                    <div className="text-[10px] text-slate-400 max-w-[100px] text-right leading-tight">
                                                        Req: {benchmark.wpm} WPM<br />{benchmark.accuracy}% acc
                                                        {prevStage && <><br />in Stage {prevStage.stageNumber}</>}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        {/* Progress bar for active stage */}
                                        {result && !passed && (
                                            <div className="mt-3 pt-3 border-t border-[#094A71]/10 relative z-10">
                                                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                                    <span>Best: {result.bestWpm} WPM / {result.bestAccuracy}% acc</span>
                                                    <span>Goal: {benchmark.wpm} WPM / {benchmark.accuracy}%</span>
                                                </div>
                                                <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#094A71] rounded-full transition-all duration-700"
                                                        style={{ width: `${Math.min(100, Math.round((result.bestWpm / benchmark.wpm) * 100))}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── RIGHT: Heatmap + Smart Recommendations ── */}
                    <div className="flex flex-col gap-6">

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
