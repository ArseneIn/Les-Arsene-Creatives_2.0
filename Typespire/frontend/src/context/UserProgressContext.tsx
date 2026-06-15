import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { PRACTICE_STAGES } from '../data/practiceModules';
import { useAuth } from './AuthContext';
import api from '../api/axios';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TestResult {
    id: string;
    date: string;
    testName: string;
    wpm: number;
    accuracy: number;
    duration: number;
    strugglingKeys?: Record<string, number>;
    status: 'Completed' | 'Incomplete';
    stageId?: string;
    testLevel?: 1 | 2;
    assignmentId?: string;
    testId?: string;
    wpmRequirement?: number;
    accuracyRequirement?: number;
    bypassLevel?: boolean;
}

export interface StageResult {
    stageId: string;
    bestWpm: number;
    bestAccuracy: number;
    attempts: number;
    passed: boolean;
    passedAt?: string;
}

export interface KeyStat {
    attempts: number;
    hits: number;
    misses: number;
}

// The 4 official student ranks
export type StudentRank = 'beginner' | 'level1' | 'level2' | 'graduate';

interface UserStats {
    level: number;
    rank: StudentRank;
    currentWpm: number;
    targetWpm: number;
    streakDays: number;
}

interface UserProgressContextType {
    // Core
    stats: UserStats;
    recentResults: TestResult[];
    saveResult: (result: Omit<TestResult, 'id' | 'date' | 'status'>) => void;

    // Progressive stages
    unlockedStages: string[];
    stageResults: Record<string, StageResult>;
    isStageUnlocked: (stageId: string) => boolean;
    isStagePassed: (stageId: string) => boolean;
    getBenchmark: (stageId: string) => { wpm: number; accuracy: number };

    // Key heatmap
    keyStats: Record<string, KeyStat>;
    updateKeyStats: (keysTyped: Record<string, { hits: number; misses: number }>) => void;
    getKeyAccuracy: (key: string) => number | null;

    // Personalized drills
    strugglingKeys: string[];
    generatePersonalizedDrill: () => string;

    // Custom Benchmarks
    sectionRequirements: Record<string, { wpm: number; accuracy: number }>;
    studentOverrides: Record<string, { wpm: number; accuracy: number }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_STATS: UserStats = {
    level: 1,
    rank: 'beginner',
    currentWpm: 0,
    targetWpm: 50,
    streakDays: 0,
};

const INITIAL_RESULTS: TestResult[] = [
    { id: '1', date: 'Oct 24, 2023', testName: 'Home Row - Basic', wpm: 35, accuracy: 98, duration: 60, status: 'Completed' },
    { id: '2', date: 'Oct 23, 2023', testName: 'Common Words 100', wpm: 32, accuracy: 92, duration: 60, status: 'Completed' },
    { id: '3', date: 'Oct 22, 2023', testName: 'Shift Key Practice', wpm: 28, accuracy: 96, duration: 60, status: 'Completed' },
];

const LOCAL_KEY = 'typespire_progress';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns a shuffle of characters biased toward the provided keys. */
function buildDrillText(keys: string[], length = 80): string {
    if (keys.length === 0) return 'asdf jkl; asdf jkl; asdf jkl;';
    const pool: string[] = [];
    keys.forEach(k => {
        // Weight struggling keys higher
        for (let i = 0; i < 8; i++) pool.push(k);
    });
    // Pad with home-row filler
    const filler = 'asdfjkl;'.split('');
    filler.forEach(f => pool.push(f));

    let result = '';
    for (let i = 0; i < length; i++) {
        if (i > 0 && i % 6 === 0) {
            result += ' ';
        } else {
            result += pool[Math.floor(Math.random() * pool.length)];
        }
    }
    return result.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    
    // ── Persisted state loaded from localStorage ──
    const getLocalKey = (userId?: string) => userId ? `${LOCAL_KEY}_${userId}` : LOCAL_KEY;

    const loadPersisted = (userId?: string) => {
        try {
            const raw = localStorage.getItem(getLocalKey(userId));
            if (raw) return JSON.parse(raw);
        } catch { /* ignore */ }
        return null;
    };

    const persisted = loadPersisted(user?.id);

    const ensureStage1 = (stages: string[] | undefined) => {
        const firstStageId = PRACTICE_STAGES[0]?.id || 'stage-1-1-a';
        const currentStages = stages ? [...stages] : [];
        if (!currentStages.includes(firstStageId)) currentStages.push(firstStageId);

        // Migration: Ensure all stages prior to the furthest unlocked stage are also unlocked
        let maxIndex = 0;
        PRACTICE_STAGES.forEach((stage, index) => {
            if (currentStages.includes(stage.id)) {
                if (index > maxIndex) maxIndex = index;
            }
        });

        const finalStages = new Set(currentStages);
        for (let i = 0; i <= maxIndex; i++) {
            if (PRACTICE_STAGES[i]) {
                finalStages.add(PRACTICE_STAGES[i].id);
            }
        }

        return Array.from(finalStages);
    };

    const [stats, setStats] = useState<UserStats>(persisted?.stats ?? INITIAL_STATS);
    const [recentResults, setRecentResults] = useState<TestResult[]>(persisted?.recentResults ?? INITIAL_RESULTS);
    const [unlockedStages, setUnlockedStages] = useState<string[]>(ensureStage1(persisted?.unlockedStages));
    const [stageResults, setStageResults] = useState<Record<string, StageResult>>(persisted?.stageResults ?? {});
    const [keyStats, setKeyStats] = useState<Record<string, KeyStat>>(persisted?.keyStats ?? {});
    
    // Auto-heal unlocked stages if curriculum changes (e.g. new stages inserted in the middle)
    useEffect(() => {
        setUnlockedStages(prev => {
            const healed = ensureStage1(prev);
            if (healed.length > prev.length) return healed;
            return prev;
        });

        // Retroactively pass intermediate modes if Word mode is already passed (for users who progressed before Falling or N-Grams modes were added)
        setStageResults(prev => {
            let changed = false;
            const newResults = { ...prev };
            for (let i = 1; i <= 9; i++) {
                if (newResults[`stage-${i}-words`]?.passed) {
                    if (!newResults[`stage-${i}-falling`]?.passed) {
                        newResults[`stage-${i}-falling`] = { stageId: `stage-${i}-falling`, attempts: 1, passed: true, bestWpm: 0, bestAccuracy: 0 };
                        changed = true;
                    }
                    if (!newResults[`stage-${i}-ngrams`]?.passed) {
                        newResults[`stage-${i}-ngrams`] = { stageId: `stage-${i}-ngrams`, attempts: 1, passed: true, bestWpm: 0, bestAccuracy: 0 };
                        changed = true;
                    }
                    if (i >= 2 && !newResults[`stage-${i}-paragraphs`]?.passed) {
                        newResults[`stage-${i}-paragraphs`] = { stageId: `stage-${i}-paragraphs`, attempts: 1, passed: true, bestWpm: 0, bestAccuracy: 0 };
                        changed = true;
                    }
                    if (i === 3 && !newResults[`stage-3-shift`]?.passed) {
                        newResults[`stage-3-shift`] = { stageId: `stage-3-shift`, attempts: 1, passed: true, bestWpm: 0, bestAccuracy: 0 };
                        changed = true;
                    }
                }
            }
            return changed ? newResults : prev;
        });
    }, []);

    // Sync state when user changes (during render to avoid cascading updates)
    const prevUserId = React.useRef(user?.id);
    if (prevUserId.current !== user?.id) {
        prevUserId.current = user?.id;
        const newData = loadPersisted(user?.id);
        setStats(newData?.stats ?? INITIAL_STATS);
        setRecentResults(newData?.recentResults ?? INITIAL_RESULTS);
        setUnlockedStages(ensureStage1(newData?.unlockedStages));
        setStageResults(newData?.stageResults ?? {});
        setKeyStats(newData?.keyStats ?? {});
    }
    const [sectionRequirements, setSectionRequirements] = useState<Record<string, { wpm: number; accuracy: number }>>({});
    const [studentOverrides, setStudentOverrides] = useState<Record<string, { wpm: number; accuracy: number }>>({});

    // Fetch user formal records from backend
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            api.get(`/test-result/student/${user.id}`)
                .then(res => {
                    if (res.data && Array.isArray(res.data)) {
                        interface BackendResult {
                            id: string;
                            createdAt: string;
                            wpm: number;
                            accuracy: number;
                            duration: number;
                            assignmentId?: string;
                            testId?: string;
                            bypassLevel?: boolean;
                            assignment?: { 
                                title: string; 
                                level: number; 
                                wpmRequirement?: number | null; 
                                accuracyRequirement?: number | null; 
                            };
                            test?: { title: string; difficulty: string };
                        }
                        const fetchedResults: TestResult[] = res.data.map((r: BackendResult) => ({
                            id: r.id,
                            date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            testName: r.assignment?.title || r.test?.title || 'Formal Assignment',
                            wpm: r.wpm,
                            accuracy: r.accuracy,
                            duration: r.duration,
                            status: 'Completed' as const,
                            assignmentId: r.assignmentId,
                            testId: r.testId,
                            testLevel: (r.assignment?.level === 2 || r.test?.title?.toLowerCase().includes('level 2') || r.test?.difficulty === 'HARD' ? 2 : 1) as 1 | 2,
                            wpmRequirement: r.assignment?.wpmRequirement || undefined,
                            accuracyRequirement: r.assignment?.accuracyRequirement || undefined,
                            bypassLevel: r.bypassLevel,
                        }));
                        
                        // We replace the recentResults completely if the user is authenticated 
                        // and has backend data, prioritizing truth from the server.
                        // (Or combine, but server is the source of truth for formal tests)
                        if (fetchedResults.length > 0) {
                            setRecentResults(fetchedResults);
                            
                            // Re-calculate stats based on server data
                            const avgWpm = Math.round(fetchedResults.reduce((acc, curr) => acc + curr.wpm, 0) / fetchedResults.length);
                            setStats(prev => ({ ...prev, currentWpm: avgWpm }));
                        }
                    }
                })
                .catch(err => console.error("Failed to fetch formal test results:", err));

            // Fetch custom requirements
            if (user?.sectionId) {
                api.get(`/requirements/section/${user.sectionId}`)
                    .then(res => {
                        const reqs: Record<string, { wpm: number; accuracy: number }> = {};
                        res.data.forEach((r: { stageId: string; wpm: number; accuracy: number }) => { reqs[r.stageId] = { wpm: r.wpm, accuracy: r.accuracy }; });
                        setSectionRequirements(reqs);
                    })
                    .catch(err => console.error("Failed to fetch section requirements:", err));
            }

            api.get(`/requirements/student/${user.id}`)
                .then(res => {
                    const overrides: Record<string, { wpm: number; accuracy: number }> = {};
                    res.data.forEach((r: { stageId: string; wpm: number; accuracy: number }) => { overrides[r.stageId] = { wpm: r.wpm, accuracy: r.accuracy }; });
                    setStudentOverrides(overrides);
                })
                .catch(err => console.error("Failed to fetch student overrides:", err));
        }
    }, [isAuthenticated, user?.id, user?.sectionId]);

    // ── Compute streak from result dates ──
    useEffect(() => {
        if (recentResults.length === 0) return;

        // Collect unique calendar date strings (YYYY-MM-DD) from results
        const uniqueDates = new Set(
            recentResults.map(r => {
                const d = new Date(r.date);
                // Handle both ISO strings and locale strings (e.g. "May 29, 2026")
                return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
            }).filter(Boolean)
        ) as Set<string>;

        const sortedDates = Array.from(uniqueDates).sort().reverse(); // newest first

        if (sortedDates.length === 0) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let streak = 0;
        let checkDate = new Date(today);

        // Allow streak to start from today or yesterday (in case they haven't typed yet today)
        const latestDate = new Date(sortedDates[0]);
        latestDate.setHours(0, 0, 0, 0);
        const diffFromToday = Math.round((today.getTime() - latestDate.getTime()) / 86400000);
        if (diffFromToday > 1) {
            // Last activity was more than 1 day ago — streak is broken
            setStats(prev => prev.streakDays === 0 ? prev : { ...prev, streakDays: 0 });
            return;
        }

        checkDate = new Date(latestDate);

        for (const dateStr of sortedDates) {
            const d = new Date(dateStr);
            d.setHours(0, 0, 0, 0);
            const diff = Math.round((checkDate.getTime() - d.getTime()) / 86400000);
            if (diff === 0) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        setStats(prev => streak !== prev.streakDays ? { ...prev, streakDays: streak } : prev);
    }, [recentResults]);

    // ── Auto-update student rank based on milestones ──
    useEffect(() => {
        const hasPassedLevel2 = recentResults.some(r => {
            if (r.testLevel !== 2) return false;
            if (r.bypassLevel) return false; // Ignore bypass testing results
            const targetWpm = r.wpmRequirement ?? 50;
            const targetAcc = r.accuracyRequirement ?? 92;
            return r.wpm >= targetWpm && r.accuracy >= targetAcc;
        });
        const hasPassedLevel1 = recentResults.some(r => {
            if (r.testLevel !== 1) return false;
            if (r.bypassLevel) return false; // Ignore bypass testing results
            const targetWpm = r.wpmRequirement ?? 50;
            const targetAcc = r.accuracyRequirement ?? 90;
            return r.wpm >= targetWpm && r.accuracy >= targetAcc;
        });
        const isCapstonePassed = stageResults['stage-capstone']?.passed ?? false;

        let computedRank: StudentRank = 'beginner';
        if (hasPassedLevel2) {
            computedRank = 'graduate';
        } else if (hasPassedLevel1) {
            computedRank = 'level2';
        } else if (isCapstonePassed) {
            computedRank = 'level1';
        }

        setStats(prev => {
            if (prev.rank !== computedRank) {
                return { ...prev, rank: computedRank };
            }
            return prev;
        });
    }, [recentResults, stageResults]);

    // ── Persist to localStorage on every change ──
    useEffect(() => {
        try {
            localStorage.setItem(getLocalKey(user?.id), JSON.stringify({
                stats, recentResults, unlockedStages, stageResults, keyStats
            }));
        } catch { /* ignore quota errors */ }
    }, [stats, recentResults, unlockedStages, stageResults, keyStats, user?.id]);

    // ── Benchmark resolution ──
    const getBenchmark = useCallback((stageId: string) => {
        // Priority: Student Override > Section Requirement > Default Hardcoded
        if (studentOverrides[stageId]) return studentOverrides[stageId];
        if (sectionRequirements[stageId]) return sectionRequirements[stageId];
        const stage = PRACTICE_STAGES.find(s => s.id === stageId);
        return { wpm: stage?.defaultWpm ?? 20, accuracy: stage?.defaultAccuracy ?? 90 };
    }, [studentOverrides, sectionRequirements]);

    // ── Stage status helpers ──
    const isStageUnlocked = useCallback((stageId: string) => {
        return unlockedStages.includes(stageId);
    }, [unlockedStages]);

    const isStagePassed = useCallback((stageId: string) => {
        return stageResults[stageId]?.passed ?? false;
    }, [stageResults]);

    // ── Save a practice/test result and evaluate unlocks ──
    const saveResult = useCallback((newResult: Omit<TestResult, 'id' | 'date' | 'status'>) => {
        const result: TestResult = {
            ...newResult,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Completed',
        };

        setRecentResults(prev => [result, ...prev].slice(0, 50)); // cap at 50

        // If this is a formal test or the course capstone review, send it to the backend!
        if (result.testId || result.assignmentId || result.stageId === 'stage-capstone') {
            api.post('/test-result', {
                wpm: result.wpm,
                accuracy: result.accuracy,
                duration: result.duration,
                strugglingKeys: result.strugglingKeys,
                testId: result.testId,
                assignmentId: result.assignmentId,
                testTitle: result.stageId === 'stage-capstone' ? 'Course Capstone — Full Keyboard Challenge' : undefined,
            }).catch(err => console.error("Failed to sync result to server:", err));
        }

        // Update rolling WPM average
        setStats(prev => ({
            ...prev,
            currentWpm: Math.round((prev.currentWpm + result.wpm) / 2),
        }));

        // Update stage-specific results and check for unlocks
        if (result.stageId) {
            const stageId = result.stageId;
            const benchmark = getBenchmark(stageId);
            const passed = result.wpm >= benchmark.wpm && result.accuracy >= benchmark.accuracy;

            setStageResults(prev => {
                const existing = prev[stageId];
                const updated: StageResult = {
                    stageId,
                    bestWpm: Math.max(result.wpm, existing?.bestWpm ?? 0),
                    bestAccuracy: Math.max(result.accuracy, existing?.bestAccuracy ?? 0),
                    attempts: (existing?.attempts ?? 0) + 1,
                    passed: existing?.passed || passed,
                    passedAt: (existing?.passed || passed) ? (existing?.passedAt ?? result.date) : undefined,
                };
                return { ...prev, [stageId]: updated };
            });

            // If passed, unlock the next stage
            if (passed) {
                const currentStage = PRACTICE_STAGES.find(s => s.id === stageId);
                const nextStage = PRACTICE_STAGES.find(s => s.unlockRequires === stageId);
                if (nextStage) {
                    setUnlockedStages(prev => prev.includes(nextStage.id) ? prev : [...prev, nextStage.id]);
                }

                // Advance the player's numeric level (for display purposes)
                if (currentStage) {
                    const levelNum = parseFloat(currentStage.stageNumber);
                    if (!isNaN(levelNum)) {
                        setStats(prev => ({
                            ...prev,
                            level: Math.max(prev.level, levelNum),
                        }));
                    }
                }
            }
        }
    }, [getBenchmark]);

    // ── Key heatmap stat updates ──
    const updateKeyStats = useCallback((keysTyped: Record<string, { hits: number; misses: number }>) => {
        setKeyStats(prev => {
            const updated = { ...prev };
            for (const [key, data] of Object.entries(keysTyped)) {
                const existing = updated[key] ?? { attempts: 0, hits: 0, misses: 0 };
                updated[key] = {
                    attempts: existing.attempts + data.hits + data.misses,
                    hits: existing.hits + data.hits,
                    misses: existing.misses + data.misses,
                };
            }
            return updated;
        });
    }, [setKeyStats]);

    const getKeyAccuracy = useCallback((key: string): number | null => {
        const stat = keyStats[key];
        if (!stat || stat.attempts === 0) return null;
        return Math.round((stat.hits / stat.attempts) * 100);
    }, [keyStats]);

    // ── Struggling keys (top 3 worst accuracy, min 5 attempts) ──
    const strugglingKeys = React.useMemo(() => {
        return Object.entries(keyStats)
            .filter(([, stat]) => stat.attempts >= 5)
            .map(([key, stat]) => ({
                key,
                accuracy: stat.attempts > 0 ? stat.hits / stat.attempts : 1,
            }))
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, 3)
            .map(entry => entry.key);
    }, [keyStats]);

    // ── Personalized drill generator ──
    const generatePersonalizedDrill = useCallback((): string => {
        if (strugglingKeys.length === 0) return 'asdf jkl; asdf jkl; home row practice drill asdf jkl;';
        return buildDrillText(strugglingKeys);
    }, [strugglingKeys]);

    return (
        <UserProgressContext.Provider value={{
            stats,
            recentResults,
            saveResult,
            unlockedStages,
            stageResults,
            isStageUnlocked,
            isStagePassed,
            getBenchmark,
            keyStats,
            updateKeyStats,
            getKeyAccuracy,
            strugglingKeys,
            generatePersonalizedDrill,
            sectionRequirements,
            studentOverrides,
        }}>
            {children}
        </UserProgressContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserProgress = () => {
    const context = useContext(UserProgressContext);
    if (context === undefined) {
        throw new Error('useUserProgress must be used within a UserProgressProvider');
    }
    return context;
};
