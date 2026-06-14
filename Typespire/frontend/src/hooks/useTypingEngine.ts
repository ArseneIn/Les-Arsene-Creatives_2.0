import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTypingEngineProps {
    targetText: string;
    duration?: number; // in seconds (ignored in untimed mode)
    untimed?: boolean; // if true, no countdown — only text completion ends session
    strict?: boolean;  // if true, blocks incorrect input but logs the mistake
    onFinish?: (results: { wpm: number; accuracy: number; errors: number; strugglingKeys: Record<string, number> }) => void;
}

export const useTypingEngine = ({ targetText, duration = 60, untimed = false, strict = false, onFinish }: UseTypingEngineProps) => {
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [userInput, setUserInput] = useState('');
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const [errors, setErrors] = useState(0);
    const [strugglingKeys, setStrugglingKeys] = useState<Record<string, number>>({});
    
    // Strict mode state tracking
    const strictErrorCountRef = useRef(0);
    const strictKeyErrorsRef = useRef<Record<string, number>>({});
    const [lastErrorIndex, setLastErrorIndex] = useState<number | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const userInputRef = useRef(''); // Fix for stale closure in setInterval
    const finalResultsRef = useRef<{ wpm: number; accuracy: number; errors: number; strugglingKeys: Record<string, number> }>({ wpm: 0, accuracy: 100, errors: 0, strugglingKeys: {} });
    const finalUserInputRef = useRef(''); // Always tracks latest userInput for onFinish closure

    const finishTest = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsFinished(true);
        setStarted(false);
    }, []);

    const calculateStats = useCallback(() => {
        if (!startTimeRef.current) return;

        const timeElapsedMin = (Date.now() - startTimeRef.current) / 60000;
        const currentInput = userInputRef.current;

        // Calculate standard errors and struggling keys
        let errorCount = 0;
        const keyErrors: Record<string, number> = {};

        for (let i = 0; i < currentInput.length; i++) {
            if (currentInput[i] !== targetText[i]) {
                errorCount++;
                const expectedKey = targetText[i];
                keyErrors[expectedKey] = (keyErrors[expectedKey] || 0) + 1;
            }
        }

        const totalErrors = errorCount + strictErrorCountRef.current;
        const totalKeyErrors = { ...keyErrors };
        for (const k in strictKeyErrorsRef.current) {
            totalKeyErrors[k] = (totalKeyErrors[k] || 0) + strictKeyErrorsRef.current[k];
        }

        // Net WPM Calculation: (Total Characters - Errors) / 5 / Time
        const netCharacters = Math.max(0, currentInput.length - totalErrors);
        const wordsTyped = netCharacters / 5;
        let currentWpm = timeElapsedMin > 0 ? Math.round(wordsTyped / timeElapsedMin) : 0;
        if (Number.isNaN(currentWpm) || !isFinite(currentWpm)) currentWpm = 0;

        const attempts = currentInput.length + strictErrorCountRef.current;
        let currentAccuracy = attempts > 0
            ? Math.max(0, Math.round(((attempts - totalErrors) / attempts) * 100))
            : 100;
        if (Number.isNaN(currentAccuracy) || !isFinite(currentAccuracy)) currentAccuracy = 100;

        // Always keep finalResultsRef up-to-date so onFinish always gets fresh values
        finalResultsRef.current = { wpm: currentWpm, accuracy: currentAccuracy, errors: totalErrors, strugglingKeys: totalKeyErrors };

        setWpm(currentWpm);
        setAccuracy(currentAccuracy);
        setErrors(totalErrors);
        setStrugglingKeys(totalKeyErrors);

    }, [targetText]);

    const calculateStatsRef = useRef(calculateStats);
    useEffect(() => {
        calculateStatsRef.current = calculateStats;
    }, [calculateStats]);

    const hasFinishedRef = useRef(false);

    const startTest = useCallback(() => {
        hasFinishedRef.current = false;
        setStarted(true);
        setIsFinished(false);
        setTimeLeft(untimed ? 0 : duration);
        setUserInput('');
        userInputRef.current = '';
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        strictErrorCountRef.current = 0;
        strictKeyErrorsRef.current = {};
        setStrugglingKeys({});
        startTimeRef.current = Date.now();

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (untimed) {
                // In untimed mode: count elapsed seconds upward (for live WPM), never auto-finish
                setTimeLeft(prev => prev + 1);
            } else {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        finishTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }
            // Recalculate stats every second
            calculateStatsRef.current();
        }, 1000);
    }, [duration, untimed, finishTest]);



    // Trigger onFinish when isFinished becomes true (exactly once per session)
    // Use finalResultsRef instead of state to avoid stale closure values
    useEffect(() => {
        if (isFinished && onFinish && !hasFinishedRef.current) {
            hasFinishedRef.current = true;
            onFinish(finalResultsRef.current);
        }
    }, [isFinished, onFinish]);

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

        // Smart Backspace Lock: If they are trying to backspace, check what they are deleting.
        // If the character they are deleting (the last character of their current input) is a Space or Enter,
        // it means they already completed that word, so we block the backspace!
        if (value.length < userInput.length) {
            const charToDelete = userInput[userInput.length - 1];
            if (charToDelete === ' ' || charToDelete === '\n') {
                return; // Block backspace, word is completed!
            }
        }

        // Mandatory Functional Keys (Space & Enter) and Misplaced Spaces in Practice Mode:
        if (untimed && value.length > userInput.length) {
            const addedCharIndex = value.length - 1;
            const expectedChar = targetText[addedCharIndex];
            const typedChar = value[addedCharIndex];
            
            // Scenario 1: Expected a space/enter, but they typed a letter/symbol instead
            if ((expectedChar === '\n' || expectedChar === ' ') && typedChar !== expectedChar) {
                strictErrorCountRef.current += 1;
                strictKeyErrorsRef.current[expectedChar] = (strictKeyErrorsRef.current[expectedChar] || 0) + 1;
                setLastErrorIndex(addedCharIndex);
                setTimeout(() => setLastErrorIndex(null), 400);
                calculateStatsRef.current();
                return; // Block input, force correct functional key
            }

            // Scenario 2: Expected a letter/symbol, but they pressed Space instead
            if (typedChar === ' ' && expectedChar !== ' ' && expectedChar !== '\n') {
                strictErrorCountRef.current += 1;
                strictKeyErrorsRef.current[expectedChar] = (strictKeyErrorsRef.current[expectedChar] || 0) + 1;
                setLastErrorIndex(addedCharIndex);
                setTimeout(() => setLastErrorIndex(null), 400);
                calculateStatsRef.current();
                return; // Block input, force correct letter
            }
        }

        // Strict Mode: Block ANY incorrect keystroke
        if (strict && value.length > userInput.length) {
            const addedCharIndex = value.length - 1;
            const expectedChar = targetText[addedCharIndex];
            const typedChar = value[addedCharIndex];
            
            if (typedChar !== expectedChar) {
                // Log the strict mistake
                strictErrorCountRef.current += 1;
                strictKeyErrorsRef.current[expectedChar] = (strictKeyErrorsRef.current[expectedChar] || 0) + 1;
                
                // Signal UI to show shake animation
                setLastErrorIndex(addedCharIndex);
                setTimeout(() => setLastErrorIndex(null), 400); // clear after animation duration
                
                calculateStatsRef.current(); // recalculate accuracy immediately
                return; // Block the input completely!
            }
        }

        // Practice Mode strictness: Block two consecutive errors
        // If they are adding a character, and both the new char and the previous char are errors, reject it.
        if (!strict && untimed && value.length > userInput.length && value.length >= 2) {
            const prevCharIndex = value.length - 2;
            const newCharIndex = value.length - 1;
            
            const prevIsError = value[prevCharIndex] !== targetText[prevCharIndex];
            const newIsError = value[newCharIndex] !== targetText[newCharIndex];
            
            if (prevIsError && newIsError) {
                // Reject the keystroke by returning early
                return;
            }
        }

        setUserInput(value);
        userInputRef.current = value;
        finalUserInputRef.current = value; // Keep ref in sync for onFinish

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

            const totalErrors = errorCount + strictErrorCountRef.current;
            const totalKeyErrors = { ...keyErrors };
            for (const k in strictKeyErrorsRef.current) {
                totalKeyErrors[k] = (totalKeyErrors[k] || 0) + strictKeyErrorsRef.current[k];
            }

            // Net WPM Calculation
            const netCharacters = Math.max(0, value.length - totalErrors);
            const wordsTyped = netCharacters / 5;
            let currentWpm = timeElapsedMin > 0 ? Math.round(wordsTyped / timeElapsedMin) : 0;
            if (Number.isNaN(currentWpm) || !isFinite(currentWpm)) currentWpm = 0;

            const attempts = value.length + strictErrorCountRef.current;
            let currentAccuracy = attempts > 0
                ? Math.max(0, Math.round(((attempts - totalErrors) / attempts) * 100))
                : 100;
            if (Number.isNaN(currentAccuracy) || !isFinite(currentAccuracy)) currentAccuracy = 100;

            // Always keep finalResultsRef up-to-date so onFinish always gets fresh values
            finalResultsRef.current = { wpm: currentWpm, accuracy: currentAccuracy, errors: totalErrors, strugglingKeys: totalKeyErrors };

            setWpm(currentWpm);
            setAccuracy(currentAccuracy);
            setErrors(totalErrors);
            setStrugglingKeys(totalKeyErrors);
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
        finalUserInput: finalUserInputRef, // Ref to avoid stale closure in onFinish
        wpm,
        accuracy,
        isFinished,
        errors,
        strugglingKeys,
        lastErrorIndex, // Exported for UI shake animations
        startTest,
        handleInputChange,
        resetTest: startTest // Alias for restarting
    };
};
