import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useUserProgress } from '../context/UserProgressContext';
import { useAuth } from '../context/AuthContext';
import { useFacilitator } from '../context/FacilitatorContext';
import { TypingArea } from '../components/TypingTest/TypingArea';
import { PracticeTypingArea } from '../components/TypingTest/PracticeTypingArea';
import { PRACTICE_STAGES_MAP, PRACTICE_STAGES, WORD_POOL } from '../data/practiceModules';
import { ADVANCED_WORD_POOL, generate10FastFingersText } from '../data/advancedWordPool';
import StageCelebration from '../components/Practice/StageCelebration';

// ─── Level 2 complex mixed-case passage ──────────────────────────────────────
const LEVEL2_TEXT = "The Quick brown fox ran past Mary Johnson's garden, leaving 12 footprints before sunset. Alice said Hello to Dr. Kim every single Monday. In 2024, Real Madrid won the Champions League again. James wrote: Dear Friend, Thank you for everything. Sarah visited Paris, London, and Tokyo in one summer. The river runs North, past Oak Street and into the Sea.";

// ─── Level 1 default passage ─────────────────────────────────────────────────
const LEVEL1_TEXT = "The rapid development of digital communication has transformed how we share information. Mastering the keyboard is a fundamental skill for academic and professional success. Students who practice consistently achieve both speed and precision, giving them a critical advantage in every field they pursue. Accuracy builds the foundation; speed follows with dedication and daily effort.";

interface TestConfig {
    text: string;
    duration: number;
    title: string;
    level: 1 | 2;
    stageId?: string;
    assignmentId?: string;
    testId?: string;
    practiceType?: string;
    wpmRequirement?: number;
    accuracyRequirement?: number;
    bypassLevel?: boolean;
}

interface PracticeStageType {
    id: string;
    title: string;
    generateText?: () => string;
    practiceText?: string;
    duration: number;
    practiceType?: string;
}

const TypingTest: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { saveResult, isStagePassed, getBenchmark, updateKeyStats, stats, stageResults, recentResults } = useUserProgress();
    const { user } = useAuth();
    const { submitTestResult, assignments, isAssignmentsLoaded } = useFacilitator();
    const navigate = useNavigate();

    const stageId     = searchParams.get('stageId');
    const assignmentId = searchParams.get('assignmentId');
    const testLevel   = (searchParams.get('level') as '1' | '2') ?? '1';
    const customText  = searchParams.get('customText');
    const mode        = searchParams.get('mode') ?? 'test'; // 'practice' | 'test' | 'drill' | 'random'
    const customTitle = searchParams.get('title');

    // Practice and personalized drill modes are untimed
    const isPractice = mode === 'practice' || mode === 'drill';

    // Calculate if attempts are exhausted
    const isAttemptsExhausted = useMemo(() => {
        if (!assignmentId) return false;
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) return false;
        
        const attemptsMade = recentResults.filter(r => r.assignmentId === assignmentId).length;
        const maxAttempts = assignment.maxAttempts || 1;
        return attemptsMade >= maxAttempts;
    }, [assignmentId, assignments, recentResults]);

    // ── Security check: Must pass Stage capstone for formal tests ────────────────
    useEffect(() => {
        if (isPractice) return;

        // If we have an assignmentId in the URL, wait until the assignments list is populated
        // and check if it requires bypassLevel.
        if (assignmentId) {
            if (!isAssignmentsLoaded) {
                return; // Wait for the assignments request to complete
            }
            const assignment = assignments.find(a => a.id === assignmentId);
            if (!assignment) {
                // If it's loaded and not found, redirect.
                navigate('/practice', { replace: true });
                return;
            }
            if (assignment.bypassLevel) {
                return; // Bypassed assignment: do not redirect!
            }
        }

        // If not practice, not bypassed, and capstone not passed, redirect.
        if (!isStagePassed('stage-capstone')) {
            navigate('/practice', { replace: true });
        }
    }, [isPractice, assignmentId, assignments, isAssignmentsLoaded, isStagePassed, navigate]);

    const [randomSprintText, setRandomSprintText] = useState('');

    useEffect(() => {
        if (mode === 'random' && !randomSprintText) {
            let generated = '';
            if (testLevel === '2') {
                generated = generate10FastFingersText(ADVANCED_WORD_POOL, 150);
            } else {
                generated = generate10FastFingersText(WORD_POOL, 150).toLowerCase();
            }
            const timer = setTimeout(() => {
                setRandomSprintText(generated);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [mode, testLevel, randomSprintText]);

    // ── Resolve test configuration ─────────────────────────────────────────
    const testConfig = useMemo((): TestConfig => {
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
                    assignmentId: assignment.id,
                    testId: assignment.testId || undefined,
                    wpmRequirement: assignment.wpmRequirement,
                    accuracyRequirement: assignment.accuracyRequirement,
                    bypassLevel: assignment.bypassLevel
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
                stageId: undefined,
                assignmentId: undefined,
                testId: undefined
            };
        }

        // Level 2 survival test (fallback for older links)
        if (testLevel === '2') {
            return { text: LEVEL2_TEXT, duration: 60, title: 'Level 2 — Survival Speedrun', level: 2 as const, stageId: undefined, assignmentId: undefined, testId: undefined };
        }

        // Personalized drill from custom text
        if (customText) {
            const level = (stats?.level >= 2 ? 2 : 1) as 1 | 2;
            return { text: decodeURIComponent(customText), duration: 60, title: 'Personalized Key Drill', level, stageId: undefined, assignmentId: undefined, testId: undefined };
        }

        // Progressive practice stage
        if (stageId && PRACTICE_STAGES_MAP[stageId]) {
            const stage = PRACTICE_STAGES_MAP[stageId] as unknown as PracticeStageType;
            const level = (stats?.level >= 2 ? 2 : 1) as 1 | 2;
            
            const text = typeof stage.generateText === 'function' 
                ? stage.generateText() 
                : (stage.practiceText || "Please do a Hard Refresh (Ctrl+Shift+R) to load the new curriculum data.");
                
            return { text, duration: stage.duration, title: stage.title, level, stageId, practiceType: stage.practiceType || 'words', assignmentId: undefined, testId: undefined };
        }

        // Default Level 1 standard test
        return { text: LEVEL1_TEXT, duration: 120, title: 'Level 1 — Standard Proficiency Test', level: 1 as const, stageId: undefined, assignmentId: undefined, testId: undefined };
    }, [stageId, assignmentId, testLevel, customText, assignments, mode, customTitle, stats?.level, randomSprintText]);

    const isLevel2 = testConfig.level === 2;
    const isCapstoneStage = testConfig.practiceType === 'timed_capstone';

    // ── Format Text (Practice Only) ─────────────────────────
    const formattedTargetText = useMemo(() => {
        if (!isPractice) return testConfig.text;
        // For timed capstone, preserve punctuation and sentence structure as-is
        if (isCapstoneStage) return testConfig.text.trim();
        // The curriculum generator now handles formatting. We simply ensure it's clean and space-separated.
        const words = testConfig.text.split(/\s+/).filter((w: string) => w.length > 0);
        return words.join(' ');
    }, [testConfig.text, isPractice, isCapstoneStage]);

    // ── Benchmark for pass/fail feedback ──────────────────────────────────
    const benchmark = useMemo(() => {
        if (testConfig.stageId) return getBenchmark(testConfig.stageId);
        const defaultWpm = 50;
        const defaultAcc = isLevel2 ? 92 : 90;
        return {
            wpm: testConfig.wpmRequirement ?? defaultWpm,
            accuracy: testConfig.accuracyRequirement ?? defaultAcc
        };
    }, [testConfig, isLevel2, getBenchmark]);

    // ── Confetti & Celebration states ─────────────────────────────────────────
    type ConfettiPiece = { id: number; left: string; top: string; backgroundColor: string; animationDelay: string; animationDuration: string; };
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
    const [showStageCelebration, setShowStageCelebration] = useState(false);
    const lastKeyBreakdown = useRef<Record<string, { hits: number; misses: number }>>({});
    const [keyBreakdownState, setKeyBreakdownState] = useState<Record<string, { hits: number; misses: number }>>({});
    const [finalResults, setFinalResults] = useState<{ wpm: number; accuracy: number; strugglingKeys: Record<string, number> } | null>(null);
    const prevBestWpm = testConfig.stageId ? (stageResults[testConfig.stageId]?.bestWpm ?? 0) : 0;
    const wasAlreadyPassed = testConfig.stageId ? (stageResults[testConfig.stageId]?.passed ?? false) : false;

    useEffect(() => {
        if (showConfetti && confettiPieces.length === 0) {
            const timer = setTimeout(() => {
                setConfettiPieces(Array.from({ length: 50 }).map((_, i) => ({
                    id: i,
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 20}%`,
                    backgroundColor: ['#33B974', '#094A71', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 4)],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                })));
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [showConfetti, confettiPieces.length]);

    // ── Typing engine ──────────────────────────────────────────────────────
    const {
        isActive, started, timeLeft, userInput, finalUserInput, wpm, accuracy, isFinished,
        strugglingKeys, startTest, handleInputChange, lastErrorIndex
    } = useTypingEngine({
        targetText: formattedTargetText,
        duration: testConfig.duration ?? 120,
        // Capstone is timed (1 min) even though it's a practice stage
        untimed: (isPractice && !isCapstoneStage) || testConfig.duration === 0,
        strict: testConfig.practiceType === 'letters' || testConfig.practiceType === 'falling',
        onFinish: (results) => {
            // Build per-key stats for heatmap using finalUserInput ref (avoids stale closure)
            const finalInput = finalUserInput.current;
            const keyBreakdown: Record<string, { hits: number; misses: number }> = {};
            for (let i = 0; i < finalInput.length; i++) {
                const expected = formattedTargetText[i];
                if (!expected) continue;
                const key = expected.toLowerCase();
                if (!keyBreakdown[key]) keyBreakdown[key] = { hits: 0, misses: 0 };
                if (finalInput[i] === expected) keyBreakdown[key].hits++;
                else keyBreakdown[key].misses++;
            }
            lastKeyBreakdown.current = keyBreakdown;
            setKeyBreakdownState(keyBreakdown);
            updateKeyStats(keyBreakdown);

            saveResult({
                testName: testConfig.title,
                wpm: results.wpm,
                accuracy: results.accuracy,
                duration: testConfig.duration,
                strugglingKeys: results.strugglingKeys,
                stageId: testConfig.stageId,
                testLevel: testConfig.level,
                assignmentId: testConfig.assignmentId,
                testId: testConfig.testId,
                wpmRequirement: benchmark.wpm,
                accuracyRequirement: benchmark.accuracy,
                bypassLevel: testConfig.bypassLevel,
            });

            // Capture final results into state for display (avoids stale closure issue)
            setFinalResults({ wpm: results.wpm, accuracy: results.accuracy, strugglingKeys: results.strugglingKeys });

            if (user?.id) submitTestResult(user.id, results.wpm, results.accuracy);

            // Victory confetti for Level 2 pass
            if (isLevel2 && results.wpm >= benchmark.wpm && results.accuracy >= benchmark.accuracy) {
                setShowConfetti(true);
            }

            // Stage celebration: newly passed a practice stage
            const isNewPass = testConfig.stageId && !wasAlreadyPassed &&
                results.wpm >= benchmark.wpm && results.accuracy >= benchmark.accuracy;

            if (isNewPass) {
                setShowStageCelebration(true);
            }
        }
    });

    // ── Input handler ───────────────────────────────────────────
    const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleInputChange(e);
    }, [handleInputChange]);

    // ── Countdown overlay ──────────────────────────────────────────────────
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const startTestRef = useRef(startTest);
    useEffect(() => {
        startTestRef.current = startTest;
    }, [startTest]);

    const handleStart = () => {
        setShowConfetti(false);
        setFinalResults(null);
        if (mode === 'random') {
            setRandomSprintText('');
        }
        setIsCountingDown(true);
        setCountdown(3);
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(interval); setIsCountingDown(false); startTestRef.current(); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds: number) => ({
        mins: Math.floor(seconds / 60).toString().padStart(2, '0'),
        secs: (seconds % 60).toString().padStart(2, '0'),
    });
    const { mins, secs } = formatTime(timeLeft);

    // ── ATTEMPT PROTECTION ──
    const isFormalAssignment = !isPractice && assignmentId;
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (started && !isFinished && isFormalAssignment) {
                e.preventDefault();
                e.returnValue = ''; // Required for Chrome to show native warning
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [started, isFinished, isFormalAssignment]);

    const attemptsMade = useMemo(() => recentResults.filter(r => r.assignmentId === assignmentId).length, [recentResults, assignmentId]);
    const maxAttempts = useMemo(() => assignments.find(a => a.id === assignmentId)?.maxAttempts || 1, [assignments, assignmentId]);
    const attemptsRemaining = Math.max(0, maxAttempts - attemptsMade - 1); // -1 because current active run counts

    // Use finalResults for display (guaranteed correct); fall back to live state during test
    const displayWpm = finalResults?.wpm ?? wpm;
    const displayAccuracy = finalResults?.accuracy ?? accuracy;
    const displayStrugglingKeys = finalResults?.strugglingKeys ?? strugglingKeys;
    const passed = displayWpm >= benchmark.wpm && displayAccuracy >= benchmark.accuracy;

    const currentStageIndex = testConfig.stageId ? PRACTICE_STAGES.findIndex(s => s.id === testConfig.stageId) : -1;
    const nextStageId = (currentStageIndex >= 0 && currentStageIndex < PRACTICE_STAGES.length - 1) ? PRACTICE_STAGES[currentStageIndex + 1].id : null;

    return (
        <div className={`text-[#0e1a13] dark:text-white transition-colors duration-200 min-h-screen font-sans relative overflow-hidden`}>
            {/* Background */}
            <div className="fixed inset-0 -z-30 bg-background-light dark:bg-background-dark transition-colors duration-200" />

            {/* ── ATTEMPTS EXHAUSTED OVERLAY ── */}
            {isAttemptsExhausted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/90 backdrop-blur-md">
                    <div className="bg-white dark:bg-[#0b1e2d] p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-red-500/20 animate-in fade-in zoom-in duration-300">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full mb-6 bg-red-500/10 text-red-500">
                            <span className="material-symbols-outlined text-5xl">lock</span>
                        </div>
                        <h2 className="text-2xl font-black mb-2 text-[#061824] dark:text-white">Attempts Exhausted</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                            You have completed all allowed attempts for this test assignment.
                        </p>
                        
                        {(() => {
                            const assignmentResults = recentResults.filter(r => r.assignmentId === assignmentId);
                            const bestResult = assignmentResults.length > 0
                                ? assignmentResults.reduce((best, curr) => curr.wpm > best.wpm ? curr : best, assignmentResults[0])
                                : null;
                            if (!bestResult) return null;
                            return (
                                <div className="bg-slate-50 dark:bg-[#06141f] border border-gray-100 dark:border-white/5 rounded-2xl p-5 mb-6 text-left">
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm text-[#33B974]">workspace_premium</span>
                                        Your Best Performance
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-slate-800 rounded-xl">
                                            <p className="text-[10px] text-gray-400 mb-0.5 uppercase">Speed</p>
                                            <p className="text-2xl font-bold text-[#33B974] font-mono">{bestResult.wpm} <span className="text-xs font-semibold">WPM</span></p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-slate-800 rounded-xl">
                                            <p className="text-[10px] text-gray-400 mb-0.5 uppercase">Accuracy</p>
                                            <p className="text-2xl font-bold text-[#33B974] font-mono">{bestResult.accuracy}%</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3.5 rounded-xl bg-[#094A71] hover:bg-[#094A71]/95 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">dashboard</span>
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* ── START OVERLAY ── */}
            {!isAttemptsExhausted && !isActive && !isFinished && !isCountingDown && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/85 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#0b1e2d] p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-white/5 relative overflow-hidden transition-all duration-300">
                        {/* Level badge */}
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${
                            isPractice ? 'bg-[#33B974]/10 text-[#33B974] border border-[#33B974]/20'
                            : 'bg-[#094A71]/10 text-[#094A71] border border-[#094A71]/20'
                        }`}>
                            <span className="material-symbols-outlined text-sm">{isPractice ? 'school' : 'quiz'}</span>
                            {isPractice ? 'Practice Arena' : 'Standard Test'}
                        </div>

                        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full mb-4 ${
                            isCapstoneStage ? 'bg-amber-500/10 text-amber-500'
                            : isPractice ? 'bg-[#33B974]/10 text-[#33B974]'
                            : 'bg-[#094A71]/10 text-[#094A71]'
                        }`}>
                            <span className="material-symbols-outlined text-4xl">{isCapstoneStage ? 'emoji_events' : isPractice ? 'keyboard_double_arrow_right' : 'schedule'}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-[#061824] dark:text-white">{testConfig.title}</h2>
                        
                        <p className="text-gray-500 dark:text-gray-400 mb-5 text-sm">
                            {isCapstoneStage ? (
                                <span className="inline-flex items-center gap-1 text-amber-500 font-semibold text-xs uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-sm">timer</span>
                                    1-Minute Final Challenge
                                </span>
                            ) : isPractice ? (
                                <span className="inline-flex items-center gap-1 text-[#33B974] font-semibold text-xs uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-sm">all_inclusive</span>
                                    Self-Paced Learning Path
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[#094A71] font-semibold text-xs uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-sm">alarm</span>
                                    {testConfig.duration}s Evaluation
                                </span>
                            )}
                        </p>

                        {/* Elegantly structured information cards */}
                        {isPractice ? (
                            <div className="bg-slate-50 dark:bg-[#06141f] border border-gray-100 dark:border-white/5 rounded-2xl p-5 mb-6 text-left space-y-3.5">
                                {/* N-gram 3-Phase Explainer */}
                                {testConfig.stageId?.endsWith('-ngrams') && (
                                    <div className="mb-1 pb-3.5 border-b border-slate-100 dark:border-white/5">
                                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-2.5">3-Phase Rhythm Drill</p>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-black text-[9px] flex items-center justify-center">1</span>
                                                <div>
                                                    <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">Anchor</span>
                                                    <span className="text-[10px] text-slate-400 ml-1">— rhythmic pairs of just the new keys (e.g. ur ur ur ur)</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-[9px] flex items-center justify-center">2</span>
                                                <div>
                                                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Roll</span>
                                                    <span className="text-[10px] text-slate-400 ml-1">— cross-finger combos blending new + known keys</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-[9px] flex items-center justify-center">3</span>
                                                <div>
                                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Words</span>
                                                    <span className="text-[10px] text-slate-400 ml-1">— real micro-words built around the new keys</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Capstone timed info */}
                                {isCapstoneStage ? (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-amber-500 bg-amber-500/10 p-1 rounded-lg text-base">timer</span>
                                            <div>
                                                <h4 className="text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">60-Second Timed Challenge</h4>
                                                <p className="text-[10px] text-gray-400 mt-0.5">The clock starts when you begin. Type as far as you can in 1 minute.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-[#33B974] bg-[#33B974]/10 p-1 rounded-lg text-base">psychology</span>
                                            <div>
                                                <h4 className="text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Full Keyboard Passage</h4>
                                                <p className="text-[10px] text-gray-400 mt-0.5">The passage uses every letter you've learned — from A to Z. Stay calm and trust your fingers.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-amber-500 bg-amber-500/10 p-1 rounded-lg text-base">military_tech</span>
                                            <div>
                                                <h4 className="text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Passing Benchmark</h4>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Reach <strong>{benchmark.wpm} WPM</strong> with <strong>{benchmark.accuracy}%</strong> accuracy to unlock the student tests hub.</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-[#33B974] bg-[#33B974]/10 p-1 rounded-lg text-base">all_inclusive</span>
                                            <div>
                                                <h4 className="text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">No Time Pressure</h4>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Focus on pure typing accuracy first; your speed will follow naturally.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-[#094A71] bg-[#094A71]/10 p-1 rounded-lg text-base">warning</span>
                                            <div>
                                                <h4 className="text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Tactile Error-Locking</h4>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Mismatched keys and wrong space entries highlight red and block cursor advance.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-amber-500 bg-amber-500/10 p-1 rounded-lg text-base">military_tech</span>
                                            <div>
                                                <h4 className="text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Target Accuracy</h4>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Maintain {benchmark.accuracy}% accuracy to clear this stage and progress.</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="bg-slate-50 dark:bg-[#06141f] border border-gray-100 dark:border-white/5 rounded-2xl p-5 mb-6 text-left space-y-3.5">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#094A71] bg-[#094A71]/10 p-1 rounded-lg text-base">timer</span>
                                    <div>
                                        <h4 className="text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Timed Evaluation</h4>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Type the text as fast and cleanly as you can until the countdown runs out.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#33B974] bg-[#33B974]/10 p-1 rounded-lg text-base">verified_user</span>
                                    <div>
                                        <h4 className="text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Passing Benchmark</h4>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Goal is at least <strong>{benchmark.wpm} WPM</strong> and <strong>{benchmark.accuracy}% accuracy</strong>.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleStart}
                            className={`w-full font-bold py-3.5 rounded-xl text-md transition-all shadow-md mb-3 ${
                                isCapstoneStage
                                ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20'
                                : isPractice 
                                ? 'bg-[#33B974] hover:bg-[#33B974]/95 text-white shadow-[#33B974]/10' 
                                : 'bg-[#094A71] hover:bg-[#094A71]/95 text-white shadow-[#094A71]/10'
                            }`}
                        >
                            {isCapstoneStage ? '🏆 Begin Capstone Challenge' : isPractice ? 'Start Practice Arena' : 'Begin Evaluation Test'}
                        </button>
                        <button onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600 text-xs font-semibold transition-colors mt-2">
                            ← Cancel and go back
                        </button>
                    </div>
                </div>
            )}

            {/* ── COUNTDOWN OVERLAY ── */}
            {isCountingDown && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/92 backdrop-blur-md">
                    <div className={`text-9xl font-bold animate-bounce ${isPractice ? 'text-[#33B974]' : 'text-[#094A71]'}`}>{countdown}</div>
                </div>
            )}

            {/* ── STAGE CELEBRATION ── */}
            {showStageCelebration && (
                <StageCelebration
                    stageName={testConfig.title}
                    wpm={displayWpm}
                    accuracy={displayAccuracy}
                    nextStageId={isCapstoneStage ? null : nextStageId}
                    isCapstone={isCapstoneStage}
                    onContinue={() => {
                        setShowStageCelebration(false);
                        if (isCapstoneStage) {
                            // Capstone passed → take them to Tests Hub
                            navigate('/tests');
                        } else if (nextStageId) {
                            window.location.href = `/test?mode=practice&stageId=${nextStageId}`;
                        } else {
                            navigate('/practice');
                        }
                    }}
                    onViewResults={() => {
                        setShowStageCelebration(false);
                        navigate('/results', { state: {
                            wpm: displayWpm, accuracy: displayAccuracy, passed: true, benchmark,
                            strugglingKeys: displayStrugglingKeys, stageId: testConfig.stageId,
                            stageName: testConfig.title, nextStageId,
                            isPractice, isLevel2, prevBestWpm,
                            isNewStagePassed: true,
                            keyBreakdown: keyBreakdownState,
                            assignmentId, testTitle: testConfig.title,
                        }});
                    }}
                />
            )}

            {/* ── FINISHED OVERLAY ── */}
            {isFinished && !showStageCelebration && (
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
                                : `${displayWpm} WPM!`}
                        </h2>
                        <p className="text-gray-400 text-sm mb-5">
                            {(assignmentId || stageId)
                                ? (passed
                                    ? (testConfig.stageId ? 'Next stage unlocked! Keep going.' : 'Excellent performance!')
                                    : `Goal was ${benchmark.wpm} WPM / ${benchmark.accuracy}% accuracy`)
                                : "Great effort! Here is what you achieved."}
                        </p>

                        {/* Level 1 passed → eligible for Level 2 banner */}
                        {passed && !isLevel2 && !isPractice && assignmentId && (
                            <div className="mb-5 rounded-2xl overflow-hidden border border-red-400/40 text-left">
                                <div className="bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-white text-lg">workspace_premium</span>
                                    <span className="text-white font-black text-xs uppercase tracking-widest">Level 1 Cleared!</span>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3">
                                    <p className="text-xs font-bold text-red-800 dark:text-red-300 mb-1">⚡ You are now eligible for Level 2 Survival Tests!</p>
                                    <p className="text-[11px] text-red-700 dark:text-red-400 leading-relaxed">
                                        Your facilitator can now assign you Level 2 sprint tests — a faster, harder challenge with no backspace. Get ready!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Level 2 passed → full mastery banner */}
                        {passed && isLevel2 && (
                            <div className="mb-5 rounded-2xl overflow-hidden border border-yellow-400/40 text-left">
                                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-2.5 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-white text-lg">emoji_events</span>
                                    <span className="text-white font-black text-xs uppercase tracking-widest">Full Keyboard Mastery!</span>
                                </div>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3">
                                    <p className="text-xs font-bold text-yellow-800 dark:text-yellow-300 mb-1">🏆 You have achieved Level 2 Certification!</p>
                                    <p className="text-[11px] text-yellow-700 dark:text-yellow-400 leading-relaxed">
                                        Outstanding speed and accuracy — you have demonstrated professional-level typing skill. Keep pushing your limits!
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <p className="text-xs text-gray-400 mb-1">WPM</p>
                                <p className={`text-3xl font-bold font-mono ${displayWpm >= benchmark.wpm ? 'text-[#33B974]' : 'text-red-400'}`}>{displayWpm}</p>
                                <p className="text-[10px] text-gray-400">Goal: {benchmark.wpm}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <p className="text-xs text-gray-400 mb-1">Accuracy</p>
                                <p className={`text-3xl font-bold font-mono ${displayAccuracy >= benchmark.accuracy ? 'text-[#33B974]' : 'text-red-400'}`}>{displayAccuracy}%</p>
                                <p className="text-[10px] text-gray-400">Goal: {benchmark.accuracy}%</p>
                            </div>
                        </div>

                        {/* Assignment attempt info */}
                        {(() => {
                            if (!assignmentId) return null;
                            const assignment = assignments.find(a => a.id === assignmentId);
                            if (!assignment) return null;
                            const maxAttempts = assignment.maxAttempts || 1;
                            const prevAttempts = recentResults.filter(r => r.assignmentId === assignmentId).length;
                            // This current run is the (prevAttempts + 1)th attempt
                            const currentAttemptNumber = Math.min(maxAttempts, prevAttempts + 1);
                            const remaining = Math.max(0, maxAttempts - currentAttemptNumber);

                            return (
                                <div className="mb-5 p-3.5 rounded-xl border border-[#094A71]/20 bg-[#094A71]/5 dark:bg-[#094A71]/10 text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-[#094A71] text-lg">info</span>
                                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Assignment Evaluation</h4>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        You completed attempt <span className="font-bold text-[#094A71]">{currentAttemptNumber}</span> out of <span className="font-bold text-slate-600 dark:text-slate-200">{maxAttempts}</span>.
                                    </p>
                                    {remaining > 0 ? (
                                        <p className="text-[10px] text-[#33B974] font-semibold mt-1 flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-xs">check_circle</span>
                                            {remaining} {remaining === 1 ? 'attempt' : 'attempts'} remaining if you want to try for a higher score!
                                        </p>
                                    ) : (
                                        <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-0.5 animate-pulse">
                                            <span className="material-symbols-outlined text-xs text-rose-500">lock</span>
                                            Maximum attempts reached. No more retakes allowed.
                                        </p>
                                    )}
                                </div>
                            );
                        })()}

                        {Object.keys(displayStrugglingKeys).length > 0 && (
                            <div className="mb-5 text-left">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Keys to practice</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(displayStrugglingKeys).sort(([, a], [, b]) => b - a).slice(0, 5).map(([key, count]) => (
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
                                state={{
                                    wpm: displayWpm, accuracy: displayAccuracy, passed, benchmark,
                                    strugglingKeys: displayStrugglingKeys, stageId: testConfig.stageId,
                                    stageName: testConfig.title, nextStageId,
                                    isPractice, isLevel2, prevBestWpm,
                                    isNewStagePassed: !wasAlreadyPassed && passed && !!testConfig.stageId,
                                    keyBreakdown: keyBreakdownState,
                                    assignmentId, testTitle: testConfig.title,
                                }}
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

                    {/* Attempt Warning Banner */}
                    {started && !isFinished && isFormalAssignment && (
                        <div className="w-full mb-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
                            <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
                                <span className="material-symbols-outlined text-xl animate-pulse">warning</span>
                                <div>
                                    <p className="font-bold text-sm">Do not refresh or leave this page!</p>
                                    <p className="text-xs opacity-80 mt-0.5">If you abandon this test, your attempt will be permanently lost.</p>
                                </div>
                            </div>
                            <div className="bg-amber-100 dark:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-500/30 text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-0.5">Attempts Remaining</p>
                                <p className="text-xl font-black font-mono text-amber-700 dark:text-amber-400 leading-none">{attemptsRemaining}</p>
                            </div>
                        </div>
                    )}

                    <div className="w-full mb-8">
                        {isPractice && (testConfig.practiceType === 'letters' || testConfig.practiceType === 'falling') ? (
                            <PracticeTypingArea
                                targetText={formattedTargetText}
                                userInput={userInput}
                                started={started}
                                isActive={isActive}
                                isFinished={isFinished}
                                onInputChange={handleInput}
                                elapsedSeconds={timeLeft} // counts up in untimed mode
                                mode={testConfig.practiceType || 'words'}
                                lastErrorIndex={lastErrorIndex}
                            />
                        ) : (
                            <div className="flex flex-col gap-4 w-full">
                                <TypingArea
                                    targetText={formattedTargetText}
                                    userInput={userInput}
                                    started={started}
                                    isActive={isActive}
                                    isFinished={isFinished}
                                    onInputChange={handleInput}
                                />
                                {isPractice && (
                                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/25 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                                        <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                                            <span>Overall Progress</span>
                                            <span className="font-bold text-[#33B974]">
                                                {formattedTargetText.length > 0 ? Math.round((userInput.length / formattedTargetText.length) * 100) : 0}% complete
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#094A71] to-[#33B974] rounded-full transition-all duration-300"
                                                style={{ width: `${formattedTargetText.length > 0 ? Math.round((userInput.length / formattedTargetText.length) * 100) : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
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
