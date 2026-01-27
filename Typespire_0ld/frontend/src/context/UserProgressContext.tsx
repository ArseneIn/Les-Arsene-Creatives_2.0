import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface TestResult {
    id: string;
    date: string;
    testName: string;
    wpm: number;
    accuracy: number;
    duration: number;
    strugglingKeys?: Record<string, number>;
    status: 'Completed' | 'Incomplete';
}

interface UserStats {
    level: number;
    currentWpm: number;
    targetWpm: number;
    streakDays: number;
}

interface UserProgressContextType {
    stats: UserStats;
    recentResults: TestResult[];
    saveResult: (result: Omit<TestResult, 'id' | 'date' | 'status'>) => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

// Mock initial data
const INITIAL_RESULTS: TestResult[] = [
    { id: '1', date: 'Oct 24, 2023', testName: 'Home Row - Basic', wpm: 35, accuracy: 98, duration: 60, status: 'Completed' },
    { id: '2', date: 'Oct 23, 2023', testName: 'Common Words 100', wpm: 32, accuracy: 92, duration: 60, status: 'Completed' },
    { id: '3', date: 'Oct 22, 2023', testName: 'Shift Key Practice', wpm: 28, accuracy: 96, duration: 60, status: 'Completed' },
];

const INITIAL_STATS: UserStats = {
    level: 2,
    currentWpm: 35,
    targetWpm: 50,
    streakDays: 5
};

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
    const [recentResults, setRecentResults] = useState<TestResult[]>(INITIAL_RESULTS);

    const saveResult = (newResult: Omit<TestResult, 'id' | 'date' | 'status'>) => {
        const result: TestResult = {
            ...newResult,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Completed'
        };

        setRecentResults(prev => [result, ...prev]);

        // Update stats logic (simple moving average for demo)
        setStats(prev => ({
            ...prev,
            currentWpm: Math.round((prev.currentWpm + result.wpm) / 2),
            // Increment streak if it's a new day (mock logic)
            streakDays: prev.streakDays // In a real app, check dates
        }));
    };

    return (
        <UserProgressContext.Provider value={{ stats, recentResults, saveResult }}>
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
