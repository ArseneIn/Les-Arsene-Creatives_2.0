import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTypingEngineProps {
    targetText: string;
    duration?: number; // in seconds
    onFinish?: (results: { wpm: number; accuracy: number; errors: number; strugglingKeys: Record<string, number> }) => void;
}

export const useTypingEngine = ({ targetText, duration = 60, onFinish }: UseTypingEngineProps) => {
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [userInput, setUserInput] = useState('');
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const [errors, setErrors] = useState(0);
    const [strugglingKeys, setStrugglingKeys] = useState<Record<string, number>>({});

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const finishTest = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsFinished(true);
        setStarted(false);
    }, []);

    const calculateStats = useCallback(() => {
        if (!startTimeRef.current) return;

        const timeElapsedMin = (Date.now() - startTimeRef.current) / 60000;

        // Calculate errors and struggling keys
        let errorCount = 0;
        const keyErrors: Record<string, number> = {};

        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] !== targetText[i]) {
                errorCount++;
                const expectedKey = targetText[i];
                keyErrors[expectedKey] = (keyErrors[expectedKey] || 0) + 1;
            }
        }

        // Net WPM Calculation: (Total Characters - Errors) / 5 / Time
        const netCharacters = Math.max(0, userInput.length - errorCount);
        const wordsTyped = netCharacters / 5;
        const currentWpm = timeElapsedMin > 0 ? Math.round(wordsTyped / timeElapsedMin) : 0;

        const currentAccuracy = userInput.length > 0
            ? Math.max(0, Math.round(((userInput.length - errorCount) / userInput.length) * 100))
            : 100;

        setWpm(currentWpm);
        setAccuracy(currentAccuracy);
        setErrors(errorCount);
        setStrugglingKeys(keyErrors);
    }, [userInput, targetText]);

    const startTest = useCallback(() => {
        setStarted(true);
        setIsFinished(false);
        setTimeLeft(duration);
        setUserInput('');
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        setStrugglingKeys({});
        startTimeRef.current = Date.now();

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    finishTest();
                    return 0;
                }
                return prev - 1;
            });
            // Recalculate stats every second to keep WPM updated even if user stops typing
            calculateStats();
        }, 1000);
    }, [duration, calculateStats, finishTest]);



    // Trigger onFinish when isFinished becomes true
    useEffect(() => {
        if (isFinished && onFinish) {
            onFinish({ wpm, accuracy, errors, strugglingKeys });
        }
    }, [isFinished, onFinish, wpm, accuracy, errors, strugglingKeys]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (isFinished) return;

        // Start test on first input if not already started
        if (!started) {
            // If not started, prevent input (or allow it but don't start timer? User requested explicit start)
            // Given the new flow, we should probably block input until started.
            return;
        }

        const value = e.target.value;

        // Prevent typing beyond the text length
        if (value.length > targetText.length) return;

        setUserInput(value);

        // Calculate stats immediately on input
        if (startTimeRef.current || !started) {
            // If just started, use current time as start time for calc
            const startTime = startTimeRef.current || Date.now();
            const timeElapsedMin = (Date.now() - startTime) / 60000;
            let errorCount = 0;
            const keyErrors: Record<string, number> = {};

            for (let i = 0; i < value.length; i++) {
                if (value[i] !== targetText[i]) {
                    errorCount++;
                    const expectedKey = targetText[i];
                    keyErrors[expectedKey] = (keyErrors[expectedKey] || 0) + 1;
                }
            }

            // Net WPM Calculation
            const netCharacters = Math.max(0, value.length - errorCount);
            const wordsTyped = netCharacters / 5;
            const currentWpm = timeElapsedMin > 0 ? Math.round(wordsTyped / timeElapsedMin) : 0;

            const currentAccuracy = value.length > 0
                ? Math.max(0, Math.round(((value.length - errorCount) / value.length) * 100))
                : 100;

            setWpm(currentWpm);
            setAccuracy(currentAccuracy);
            setErrors(errorCount);
            setStrugglingKeys(keyErrors);
        }

        // Auto-finish if text is complete
        if (value.length === targetText.length) {
            finishTest();
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return {
        started,
        timeLeft,
        userInput,
        wpm,
        accuracy,
        isFinished,
        errors,
        strugglingKeys,
        startTest,
        handleInputChange,
        resetTest: startTest // Alias for restarting
    };
};
