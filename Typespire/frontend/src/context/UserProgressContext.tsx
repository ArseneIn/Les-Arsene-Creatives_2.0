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

interface UserStats {
    level: number;
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
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_STATS: UserStats = {
    level: 1,
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
    const loadPersisted = () => {
        try {
            const raw = localStorage.getItem(LOCAL_KEY);
            if (raw) return JSON.parse(raw);
        } catch { /* ignore */ }
        return null;
    };

    const persisted = loadPersisted();

    const [stats, setStats] = useState<UserStats>(persisted?.stats ?? INITIAL_STATS);
    const [recentResults, setRecentResults] = useState<TestResult[]>(persisted?.recentResults ?? INITIAL_RESULTS);
    const [unlockedStages, setUnlockedStages] = useState<string[]>(persisted?.unlockedStages ?? ['stage-01']);
    const [stageResults, setStageResults] = useState<Record<string, StageResult>>(persisted?.stageResults ?? {});
    const [keyStats, setKeyStats] = useState<Record<string, KeyStat>>(persisted?.keyStats ?? {});

    // Fetch user formal records from backend
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            api.get(`/test-result/student/${user.id}`)
                .then(res => {
                    if (res.data && Array.isArray(res.data)) {
                        const fetchedResults: TestResult[] = res.data.map((r: Record<string, any>) => ({
                            id: r.id,
                            date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            testName: r.assignment?.title || r.test?.title || 'Formal Assignment',
                            wpm: r.wpm,
                            accuracy: r.accuracy,
                            duration: r.duration,
                            status: 'Completed' as const,
                            assignmentId: r.assignmentId,
                            testId: r.testId,
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
        }
    }, [isAuthenticated, user?.id]);

    // ── Persist to localStorage on every change ──
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_KEY, JSON.stringify({
                stats, recentResults, unlockedStages, stageResults, keyStats

            }));
        } catch { /* ignore quota errors */ }
    }, [stats, recentResults, unlockedStages, stageResults, keyStats]);

    // ── Benchmark resolution ──
    // TODO: In the future, fetch institution's custom benchmarks and merge here
    const getBenchmark = useCallback((stageId: string) => {
        const stage = PRACTICE_STAGES.find(s => s.id === stageId);
        return { wpm: stage?.defaultWpm ?? 20, accuracy: stage?.defaultAccuracy ?? 90 };
    }, []);

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

        // If this is a formal test, send it to the backend!
        if (result.testId || result.assignmentId) {
            api.post('/test-result', {
                wpm: result.wpm,
                accuracy: result.accuracy,
                duration: result.duration,
                strugglingKeys: result.strugglingKeys,
                testId: result.testId,
                assignmentId: result.assignmentId,
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
                if (nextStage && !unlockedStages.includes(nextStage.id)) {
                    setUnlockedStages(prev => [...prev, nextStage.id]);
                }
                // Advance the player's overall level
                if (currentStage) {
                    setStats(prev => ({
                        ...prev,
                        level: Math.max(prev.level, currentStage.stageNumber),
                    }));
                }
            }
        }
    }, [getBenchmark, unlockedStages]);

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
    }, []);

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
        }}>
            {children}
        </UserProgressContext.Provider>
    );
};

export const useUserProgress = () => {
    const context = useContext(UserProgressContext);
    if (context === undefined) {
        throw new Error('useUserProgress must be used within a UserProgressProvider');
    }
    return context;
};
