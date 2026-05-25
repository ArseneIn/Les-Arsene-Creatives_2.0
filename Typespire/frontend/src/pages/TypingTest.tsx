import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useUserProgress } from '../context/UserProgressContext';
import { useAuth } from '../context/AuthContext';
import { useFacilitator } from '../context/FacilitatorContext';
import { TypingArea } from '../components/TypingTest/TypingArea';
import { PracticeTypingArea } from '../components/TypingTest/PracticeTypingArea';
import { SurvivalStrikeBar } from '../components/TypingTest/SurvivalStrikeBar';
import { PRACTICE_STAGES_MAP, PRACTICE_STAGES } from '../data/practiceModules';

// ─── Level 2 complex mixed-case passage ──────────────────────────────────────
const LEVEL2_TEXT = "The Quick brown fox ran past Mary Johnson's garden, leaving 12 footprints before sunset. Alice said Hello to Dr. Kim every single Monday. In 2024, Real Madrid won the Champions League again. James wrote: Dear Friend, Thank you for everything. Sarah visited Paris, London, and Tokyo in one summer. The river runs North, past Oak Street and into the Sea.";

// ─── Level 1 default passage ─────────────────────────────────────────────────
const LEVEL1_TEXT = "The rapid development of digital communication has transformed how we share information. Mastering the keyboard is a fundamental skill for academic and professional success. Students who practice consistently achieve both speed and precision, giving them a critical advantage in every field they pursue. Accuracy builds the foundation; speed follows with dedication and daily effort.";

const TypingTest: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { saveResult, isStagePassed, getBenchmark, updateKeyStats, stats } = useUserProgress();
    const { user } = useAuth();
    const { submitTestResult, assignments } = useFacilitator();
    const navigate = useNavigate();

    const stageId     = searchParams.get('stageId');
    const assignmentId = searchParams.get('assignmentId');
    const testLevel   = (searchParams.get('level') as '1' | '2') ?? '1';
    const customText  = searchParams.get('customText');
    const mode        = searchParams.get('mode') ?? 'test'; // 'practice' | 'test' | 'drill' | 'random'
    const customTitle = searchParams.get('title');

    // Practice and personalized drill modes are untimed
    const isPractice = mode === 'practice' || mode === 'drill';

    // ── Security check: Must pass Stage capstone for formal tests ────────────────
    useEffect(() => {
        if (!isPractice && !isStagePassed('stage-capstone')) {
            navigate('/practice', { replace: true });
        }
    }, [isPractice, isStagePassed, navigate]);

    const [randomSprintText, setRandomSprintText] = useState('');

    useEffect(() => {
        if (mode === 'random' && !randomSprintText) {
            const baseText = testLevel === '2' ? LEVEL2_TEXT : LEVEL1_TEXT;
            const words = baseText.split(/\s+/).filter(w => w.length > 0);
            for (let i = words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [words[i], words[j]] = [words[j], words[i]];
            }
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRandomSprintText(words.join(' '));
        }
    }, [mode, testLevel, randomSprintText]);

    // ── Resolve test configuration ─────────────────────────────────────────
    const testConfig = useMemo(() => {
        // Facilitator-assigned test
        if (assignmentId) {
            const assignment = assignments.find(a => a.id === assignmentId);
            if (assignment) {
                return {
                    text: assignment.text ?? LEVEL1_TEXT,
                    duration: assignment.duration ?? 120,
                    title: assignment.title ?? 'Assigned Test',
                    level: (assignment.level ?? 1) as 1 | 2,
                    stageId: undefined,
                };
            }
        }

        // Randomised 1-Minute Sprint
        if (mode === 'random') {
            return {
                text: randomSprintText,
                duration: 60,
                title: customTitle || `Level ${testLevel} Random Sprint`,
                level: (testLevel === '2' ? 2 : 1) as 1 | 2,
                stageId: undefined
            };
        }

        // Level 2 survival test (fallback for older links)
        if (testLevel === '2') {
            return { text: LEVEL2_TEXT, duration: 60, title: 'Level 2 — Survival Speedrun', level: 2 as const, stageId: undefined };
        }

        // Personalized drill from custom text
        if (customText) {
            const level = (stats?.level >= 2 ? 2 : 1) as 1 | 2;
            return { text: decodeURIComponent(customText), duration: 60, title: 'Personalized Key Drill', level, stageId: undefined };
        }

        // Progressive practice stage
        if (stageId && PRACTICE_STAGES_MAP[stageId]) {
            // Use 'any' cast to allow for graceful fallback if HMR caches the old interface
            const stage = PRACTICE_STAGES_MAP[stageId] as any;
            const level = (stats?.level >= 2 ? 2 : 1) as 1 | 2;
            
            // Fallback to old 'practiceText' or an error message if the browser failed to hot-reload the data module
            const text = typeof stage.generateText === 'function' 
                ? stage.generateText() 
                : (stage.practiceText || "Please do a Hard Refresh (Ctrl+Shift+R) to load the new curriculum data.");
                
            return { text, duration: stage.duration, title: stage.title, level, stageId, practiceType: stage.practiceType || 'words' };
        }

        // Default Level 1 standard test
        return { text: LEVEL1_TEXT, duration: 120, title: 'Level 1 — Standard Proficiency Test', level: 1 as const, stageId: undefined };
    }, [stageId, assignmentId, testLevel, customText, assignments, mode, customTitle, stats?.level, randomSprintText]);

    const isLevel2 = testConfig.level === 2;
    // ── Format Text (Practice Only) ─────────────────────────
    const formattedTargetText = useMemo(() => {
        if (!isPractice) return testConfig.text;
        // The curriculum generator now handles formatting. We simply ensure it's clean and space-separated.
        const words = testConfig.text.split(/\s+/).filter(w => w.length > 0);
        return words.join(' ');
    }, [testConfig.text, isPractice]);

    // ── Benchmark for pass/fail feedback ──────────────────────────────────
    const benchmark = useMemo(() => {
        if (testConfig.stageId) return getBenchmark(testConfig.stageId);
        if (isLevel2) return { wpm: 50, accuracy: 92 };
        return { wpm: 50, accuracy: 90 };
    }, [testConfig, isLevel2, getBenchmark]);

    // ── Level 2 strike system ──────────────────────────────────────────────
    const [terminated, setTerminated] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const MAX_STRIKES = 3;

    type ConfettiPiece = { id: number; left: string; top: string; backgroundColor: string; animationDelay: string; animationDuration: string; };
    const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (showConfetti && confettiPieces.length === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setConfettiPieces(Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                backgroundColor: ['#33B974', '#094A71', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
            })));
        }
    }, [showConfetti, confettiPieces.length]);

    // ── Typing engine ──────────────────────────────────────────────────────
    const {
        started, timeLeft, userInput, wpm, accuracy, isFinished,
        strugglingKeys, startTest, handleInputChange, lastErrorIndex
    } = useTypingEngine({
        targetText: formattedTargetText,
        duration: (testConfig as any).duration ?? 120,
        untimed: isPractice || (testConfig as any).duration === 0,
        strict: (testConfig as any).practiceType === 'letters' || (testConfig as any).practiceType === 'falling',
        onFinish: (results) => {
            // Build per-key stats for heatmap
            const keyBreakdown: Record<string, { hits: number; misses: number }> = {};
            for (let i = 0; i < userInput.length; i++) {
                const expected = formattedTargetText[i];
                if (!expected) continue;
                const key = expected.toLowerCase();
                if (!keyBreakdown[key]) keyBreakdown[key] = { hits: 0, misses: 0 };
                if (userInput[i] === expected) keyBreakdown[key].hits++;
                else keyBreakdown[key].misses++;
            }
            updateKeyStats(keyBreakdown);

            saveResult({
                testName: testConfig.title,
                wpm: results.wpm,
                accuracy: results.accuracy,
                duration: testConfig.duration,
                strugglingKeys: results.strugglingKeys,
                stageId: testConfig.stageId,
                testLevel: testConfig.level,
            });

            if (user?.id) submitTestResult(user.id, results.wpm, results.accuracy);

            // Victory confetti for Level 2 pass
            if (isLevel2 && results.wpm >= benchmark.wpm && results.accuracy >= benchmark.accuracy) {
                setShowConfetti(true);
            }
        }
    });

    // ── Level 2: detect new errors → add strikes ──────────────────────────
    const currentErrors = useMemo(() => {
        let count = 0;
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] !== testConfig.text[i]) count++;
        }
        return count;
    }, [userInput, testConfig.text]);

    // Derived strikes
    const strikes = isLevel2 ? Math.min(currentErrors, MAX_STRIKES) : 0;
    // ── Input handler ───────────────────────────────────────────
    const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleInputChange(e);
    }, [handleInputChange]);

    // ── Countdown overlay ──────────────────────────────────────────────────
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const handleStart = () => {
        setTerminated(false);
        setShowConfetti(false);
        setIsCountingDown(true);
        setCountdown(3);
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(interval); setIsCountingDown(false); startTest(); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds: number) => ({
        mins: Math.floor(seconds / 60).toString().padStart(2, '0'),
        secs: (seconds % 60).toString().padStart(2, '0'),
    });
    const { mins, secs } = formatTime(timeLeft);

    const passed = wpm >= benchmark.wpm && accuracy >= benchmark.accuracy;

    const currentStageIndex = testConfig.stageId ? PRACTICE_STAGES.findIndex(s => s.id === testConfig.stageId) : -1;
    const nextStageId = (currentStageIndex >= 0 && currentStageIndex < PRACTICE_STAGES.length - 1) ? PRACTICE_STAGES[currentStageIndex + 1].id : null;

    return (
        <div className={`text-[#0e1a13] dark:text-white transition-colors duration-200 min-h-screen font-sans relative overflow-hidden`}>
            {/* Background */}
            <div className="fixed inset-0 -z-30 bg-background-light dark:bg-background-dark transition-colors duration-200" />

            {/* ── START OVERLAY ── */}
            {!started && !isFinished && !isCountingDown && !terminated && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#0b1e2d] p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-white/10 relative overflow-hidden">
                        {/* Level badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${
                            isLevel2 ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : isPractice ? 'bg-[#33B974]/10 text-[#33B974] border border-[#33B974]/20'
                            : 'bg-[#094A71]/10 text-[#094A71] border border-[#094A71]/20'
                        }`}>
                            <span className="material-symbols-outlined text-sm">{isLevel2 ? 'flash_on' : isPractice ? 'school' : 'quiz'}</span>
                            {isLevel2 ? 'Level 2 — Survival Speedrun' : isPractice ? 'Practice Mode' : 'Level 1 — Standard Test'}
                        </div>

                        <div className={`inline-flex h-20 w-20 items-center justify-center rounded-full mb-5 ${
                            isLevel2 ? 'bg-red-500/10 text-red-500'
                            : isPractice ? 'bg-[#33B974]/10 text-[#33B974]'
                            : 'bg-[#094A71]/10 text-[#094A71]'
                        }`}>
                            <span className="material-symbols-outlined text-5xl">{isLevel2 ? 'emergency' : isPractice ? 'keyboard' : 'quiz'}</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-[#061824] dark:text-white">{testConfig.title}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                            {isPractice ? (
                                <span className="inline-flex items-center gap-1.5 text-[#33B974] font-semibold">
                                    <span className="material-symbols-outlined text-base">all_inclusive</span>
                                    No time limit — complete at your own pace
                                </span>
                            ) : (
                                <>
                                    <strong className="text-gray-700 dark:text-gray-200">{testConfig.duration}s</strong>
                                    {' '}· Goal: <strong className="text-gray-700 dark:text-gray-200">{benchmark.wpm} WPM</strong> / <strong className="text-gray-700 dark:text-gray-200">{benchmark.accuracy}%</strong> accuracy
                                </>
                            )}
                        </p>

                        {isPractice && (
                            <div className="bg-[#33B974]/5 border border-[#33B974]/20 rounded-xl p-4 mb-6 text-left">
                                <p className="text-xs font-bold text-[#33B974] uppercase tracking-wider mb-1.5">🎯 How Practice Works</p>
                                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                    <li>• Each letter appears in its own box — <strong>type them one by one</strong></li>
                                    <li>• <strong>Green</strong> = correct · <strong>Red</strong> = mistake · <strong>Glowing blue</strong> = next key</li>
                                    <li>• No timer pressure — focus on accuracy first, speed will follow</li>
                                    <li>• Complete all characters to finish and unlock the next stage</li>
                                </ul>
                            </div>
                        )}

                        {isLevel2 && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-6 text-left">
                                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1.5">⚠ Survival Rules</p>
                                <ul className="text-xs text-red-500 dark:text-red-400 space-y-1">
                                    <li>• <strong>No backspace</strong> — every keystroke is final</li>
                                    <li>• <strong>3 errors max</strong> — the test terminates on your 3rd mistake</li>
                                    <li>• <strong>60-second timer</strong> — type as fast and clean as possible</li>
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={handleStart}
                            className={`w-full font-bold py-4 rounded-xl text-lg transition-all shadow-lg mb-3 ${isLevel2 ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20' : 'bg-[#33B974] hover:bg-[#33B974]/90 text-white shadow-[#33B974]/20'}`}
                        >
                            {mode === 'practice' ? 'Start Practice' : isLevel2 ? '⚡ Begin Survival Test' : 'Start Test'}
                        </button>
                        <button onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
                            ← Go back
                        </button>
                        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{testConfig.title}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── COUNTDOWN OVERLAY ── */}
            {isCountingDown && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/90 backdrop-blur-md">
                    <div className={`text-9xl font-bold animate-bounce ${isLevel2 ? 'text-red-400' : 'text-[#33B974]'}`}>{countdown}</div>
                </div>
            )}

            {/* ── TERMINATED (Level 2 failure) ── */}
            {terminated && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/90 backdrop-blur-md">
                    <div className="bg-[#0b1e2d] p-10 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-red-500/30 animate-in fade-in zoom-in duration-300">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
                            <span className="material-symbols-outlined text-5xl">report</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-white">Session Terminated</h2>
                        <p className="text-red-400 mb-6 text-sm">3 strikes reached. Your attempt has ended.</p>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <p className="text-xs text-gray-500">WPM</p>
                                <p className="text-2xl font-bold text-white font-mono">{wpm}</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg">
                                <p className="text-xs text-gray-500">Accuracy</p>
                                <p className="text-2xl font-bold text-white font-mono">{accuracy}%</p>
                            </div>
                        </div>
                        <button onClick={handleStart} className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 rounded-xl mb-3 transition-all">
                            ⚡ Try Again
                        </button>
                        <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                            Back to Practice
                        </button>
                    </div>
                </div>
            )}

            {/* ── FINISHED OVERLAY ── */}
            {isFinished && !terminated && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/90 backdrop-blur-md">
                    {/* Confetti for Level 2 victory */}
                    {showConfetti && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {confettiPieces.map((piece) => (
                                <div
                                    key={piece.id}
                                    className="absolute w-2 h-2 rounded-sm animate-bounce"
                                    style={{
                                        left: piece.left,
                                        top: piece.top,
                                        backgroundColor: piece.backgroundColor,
                                        animationDelay: piece.animationDelay,
                                        animationDuration: piece.animationDuration,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <div className={`bg-white dark:bg-[#0b1e2d] p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border animate-in fade-in zoom-in duration-300 ${passed ? (isLevel2 ? 'border-yellow-500/30' : 'border-[#33B974]/20') : 'border-red-500/20'}`}>
                        <div className={`inline-flex h-20 w-20 items-center justify-center rounded-full mb-4 ${passed ? (isLevel2 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#33B974]/10 text-[#33B974]') : 'bg-red-500/10 text-red-500'}`}>
                            <span className="material-symbols-outlined text-5xl">
                                {passed ? (isLevel2 ? 'workspace_premium' : 'flag') : 'replay'}
                            </span>
                        </div>

                        {passed && isLevel2 && (
                            <div className="text-yellow-500 font-bold text-sm mb-2 uppercase tracking-wider">🏆 Level 2 Master!</div>
                        )}
                        <h2 className="text-3xl font-bold mb-1 text-[#061824] dark:text-white">
                            {(assignmentId || stageId) 
                                ? (passed ? 'Test Passed!' : 'Not Quite There') 
                                : `${wpm} WPM!`}
                        </h2>
                        <p className="text-gray-400 text-sm mb-5">
                            {(assignmentId || stageId)
                                ? (passed
                                    ? (testConfig.stageId ? 'Next stage unlocked! Keep going.' : 'Excellent performance!')
                                    : `Goal was ${benchmark.wpm} WPM / ${benchmark.accuracy}% accuracy`)
                                : "Great effort! Here is what you achieved."}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <p className="text-xs text-gray-400 mb-1">WPM</p>
                                <p className={`text-3xl font-bold font-mono ${wpm >= benchmark.wpm ? 'text-[#33B974]' : 'text-red-400'}`}>{wpm}</p>
                                <p className="text-[10px] text-gray-400">Goal: {benchmark.wpm}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <p className="text-xs text-gray-400 mb-1">Accuracy</p>
                                <p className={`text-3xl font-bold font-mono ${accuracy >= benchmark.accuracy ? 'text-[#33B974]' : 'text-red-400'}`}>{accuracy}%</p>
                                <p className="text-[10px] text-gray-400">Goal: {benchmark.accuracy}%</p>
                            </div>
                        </div>

                        {Object.keys(strugglingKeys).length > 0 && (
                            <div className="mb-5 text-left">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Keys to practice</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(strugglingKeys).sort(([, a], [, b]) => b - a).slice(0, 5).map(([key, count]) => (
                                        <div key={key} className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 px-2.5 py-1.5 rounded-lg">
                                            <span className="text-sm font-bold text-red-600 dark:text-red-400 font-mono">{key === ' ' ? 'Space' : key}</span>
                                            <span className="text-[10px] text-red-400">{count}×</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            {passed && nextStageId && (
                                <button
                                    onClick={() => window.location.href = `/test?mode=practice&stageId=${nextStageId}`}
                                    className="w-full bg-[#33B974] hover:bg-[#33B974]/90 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(51,185,116,0.25)] flex items-center justify-center gap-2"
                                >
                                    <span>Continue to Next Stage</span>
                                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                                </button>
                            )}
                            <Link
                                to="/results"
                                state={{ wpm, accuracy, strugglingKeys, passed, benchmark }}
                                className="w-full bg-[#094A71] hover:bg-[#094A71]/90 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-base">analytics</span>
                                View Detailed Results
                            </Link>
                            <button onClick={handleStart} className="w-full border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm">
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MAIN TEST UI ── */}
            <div className="relative flex min-h-screen flex-col">
                {/* Navbar */}
                <header className={`flex items-center justify-between border-b px-10 py-3 text-white shadow-md ${isLevel2 ? 'bg-[#1a0808] border-red-900/40' : 'bg-[#094A71] border-[#094A71]/40'}`}>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className={`rounded-lg p-2 flex items-center justify-center transition-colors ${isLevel2 ? 'bg-red-500/20 group-hover:bg-red-500/30' : 'bg-[#33B974]/20 group-hover:bg-[#33B974]/30'}`}>
                                <span className="material-symbols-outlined text-white text-2xl">keyboard</span>
                            </div>
                        </Link>
                        <h2 className="text-xl font-bold text-white">Typespire</h2>
                        <div className="h-6 w-px bg-white/20 mx-2" />
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isLevel2 ? 'bg-red-500/20 text-red-300'
                            : isPractice ? 'bg-[#33B974]/20 text-[#33B974]'
                            : 'bg-white/15 text-white'
                        }`}>
                            {isLevel2 ? '⚡ Survival Mode' : isPractice ? '🎯 Practice' : '📚 Standard Test'}
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        {isLevel2 && started && !isFinished && (
                            <SurvivalStrikeBar strikes={strikes} maxStrikes={MAX_STRIKES} />
                        )}
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">{user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Student'}</p>
                            <p className="text-[10px] text-white/50 uppercase">{user?.email ?? ''}</p>
                        </div>
                        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm ${isLevel2 ? 'border-red-400 bg-red-400/20 text-red-300' : 'border-[#33B974] bg-[#33B974]/20 text-[#33B974]'}`}>
                            {user?.firstName?.[0] ?? 'S'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-12 flex flex-col items-center">
                    {/* Title + Timer */}
                    <div className="w-full flex justify-between items-center mb-10">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className={`h-2.5 w-2.5 rounded-full ${started ? (isLevel2 ? 'bg-red-400 animate-pulse' : 'bg-[#33B974] animate-pulse') : 'bg-gray-300'}`} />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    {started ? 'In Progress' : 'Ready to Start'}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-[#061824] dark:text-white">{testConfig.title}</h2>
                        </div>

                        <div className="flex items-center gap-8">
                            {isPractice ? (
                                /* Practice: no clock, just a relaxed cue */
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#33B974]/10 text-[#33B974] font-bold text-sm">
                                        <span className="material-symbols-outlined text-lg">all_inclusive</span>
                                        <span>No Time Limit</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 text-right">Take your time — finish the text at your own pace</span>
                                </div>
                            ) : (
                                <div className="flex items-baseline gap-1 font-mono">
                                    <span className={`text-6xl font-light tracking-tighter ${timeLeft <= 10 && started ? 'text-red-400 animate-pulse' : 'text-[#061824] dark:text-white'}`}>{mins}</span>
                                    <span className="text-2xl text-gray-300 dark:text-gray-600">:</span>
                                    <span className={`text-6xl font-light tracking-tighter ${timeLeft <= 10 && started ? 'text-red-400 animate-pulse' : 'text-[#061824] dark:text-white'}`}>{secs}</span>
                                </div>
                            )}
                            <button
                                onClick={handleStart}
                                className={`group p-4 rounded-full bg-gray-50 dark:bg-white/5 hover:text-white text-gray-400 transition-all duration-300 shadow-sm ${isLevel2 ? 'hover:bg-red-500' : 'hover:bg-[#33B974]'}`}
                                title="Restart"
                            >
                                <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-500">refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Live stats hidden as per request. Only final results will be visible. */}

                    <div className="w-full mb-8">
                        {isPractice ? (
                            <PracticeTypingArea
                                targetText={formattedTargetText}
                                userInput={userInput}
                                started={started && !terminated}
                                isFinished={isFinished || terminated}
                                onInputChange={handleInput}
                                elapsedSeconds={timeLeft} // counts up in untimed mode
                                mode={(testConfig as any).practiceType || 'words'}
                                lastErrorIndex={lastErrorIndex}
                            />
                        ) : (
                            <TypingArea
                                targetText={formattedTargetText}
                                userInput={userInput}
                                started={started && !terminated}
                                isFinished={isFinished || terminated}
                                onInputChange={handleInput}
                            />
                        )}
                    </div>

                    {/* Footer hints */}
                    <div className="w-full flex justify-between items-center text-gray-400 text-sm mt-auto px-4">
                        <div className="flex gap-6">
                            {isLevel2 && (
                                <div className="flex items-center gap-2 text-red-400 font-bold">
                                    <span className="material-symbols-outlined text-lg">block</span>
                                    <span className="text-xs uppercase tracking-wider">Backspace Disabled</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-[#33B974]">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                <span className="text-xs uppercase tracking-wider">System Ready</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400">
                            Goal: <strong className="text-gray-600 dark:text-gray-300">{benchmark.wpm} WPM</strong> / <strong className="text-gray-600 dark:text-gray-300">{benchmark.accuracy}%</strong>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TypingTest;
