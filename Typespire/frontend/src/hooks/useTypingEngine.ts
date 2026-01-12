import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTypingEngineProps {
    targetText: string;
    duration?: number; // in seconds
    onFinish?: (results: { wpm: number; accuracy: number; errors: number }) => void;
}

export const useTypingEngine = ({ targetText, duration = 60, onFinish }: UseTypingEngineProps) => {
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [userInput, setUserInput] = useState('');
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const [errors, setErrors] = useState(0);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const calculateStats = useCallback(() => {
        if (!startTimeRef.current) return;

        const timeElapsedMin = (Date.now() - startTimeRef.current) / 60000;
        const wordsTyped = userInput.length / 5;
        const currentWpm = timeElapsedMin > 0 ? Math.round(wordsTyped / timeElapsedMin) : 0;

        // Calculate errors
        let errorCount = 0;
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] !== targetText[i]) {
                errorCount++;
            }
        }

        const currentAccuracy = userInput.length > 0
            ? Math.max(0, Math.round(((userInput.length - errorCount) / userInput.length) * 100))
            : 100;

        setWpm(currentWpm);
        setAccuracy(currentAccuracy);
        setErrors(errorCount);
    }, [userInput, targetText]);

    const startTest = useCallback(() => {
        setStarted(true);
        setIsFinished(false);
        setTimeLeft(duration);
        setUserInput('');
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
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
    }, [duration, calculateStats]);

    const finishTest = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsFinished(true);
        setStarted(false);

        // Final calculation
        if (onFinish) {
            // We need to recalculate one last time to ensure latest data
            // Note: We can't use the state variables directly here reliably due to closure staleness 
            // if we were calling this from an effect, but since it's called from the interval, 
            // we rely on the latest render cycle's calculateStats. 
            // For simplicity, we'll pass the current state values which should be close enough 
            // or we could recalculate locally.
            // Let's rely on the state for now as it updates every keystroke.
        }
    }, [onFinish]);

    // Trigger onFinish when isFinished becomes true
    useEffect(() => {
        if (isFinished && onFinish) {
            onFinish({ wpm, accuracy, errors });
        }
    }, [isFinished, onFinish, wpm, accuracy, errors]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (!started || isFinished) return;

        const value = e.target.value;

        // Prevent typing beyond the text length
        if (value.length > targetText.length) return;

        setUserInput(value);

        // Calculate stats immediately on input
        // We duplicate logic here slightly to ensure instant feedback
        if (startTimeRef.current) {
            const timeElapsedMin = (Date.now() - startTimeRef.current) / 60000;
            const wordsTyped = value.length / 5;
            const currentWpm = timeElapsedMin > 0 ? Math.round(wordsTyped / timeElapsedMin) : 0;

            let errorCount = 0;
            for (let i = 0; i < value.length; i++) {
                if (value[i] !== targetText[i]) {
                    errorCount++;
                }
            }
            const currentAccuracy = value.length > 0
                ? Math.max(0, Math.round(((value.length - errorCount) / value.length) * 100))
                : 100;

            setWpm(currentWpm);
            setAccuracy(currentAccuracy);
            setErrors(errorCount);
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
        startTest,
        handleInputChange,
        resetTest: startTest // Alias for restarting
    };
};
