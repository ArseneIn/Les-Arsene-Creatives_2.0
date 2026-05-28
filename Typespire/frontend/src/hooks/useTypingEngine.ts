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
    const [strictErrorCount, setStrictErrorCount] = useState(0);
    const [strictKeyErrors, setStrictKeyErrors] = useState<Record<string, number>>({});
    const [lastErrorIndex, setLastErrorIndex] = useState<number | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const userInputRef = useRef(''); // Fix for stale closure in setInterval

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

        // Add strict errors (from blocked inputs)
        setStrictErrorCount(prevStrictErrs => {
            setStrictKeyErrors(prevStrictKeys => {
                const totalErrors = errorCount + prevStrictErrs;
                const totalKeyErrors = { ...keyErrors };
                for (const k in prevStrictKeys) {
                    totalKeyErrors[k] = (totalKeyErrors[k] || 0) + prevStrictKeys[k];
                }

                // Net WPM Calculation: (Total Characters - Errors) / 5 / Time
                const netCharacters = Math.max(0, currentInput.length - totalErrors);
                const wordsTyped = netCharacters / 5;
                const currentWpm = timeElapsedMin > 0 ? Math.round(wordsTyped / timeElapsedMin) : 0;

                const attempts = currentInput.length + prevStrictErrs;
                const currentAccuracy = attempts > 0
                    ? Math.max(0, Math.round(((attempts - totalErrors) / attempts) * 100))
                    : 100;

                setWpm(currentWpm);
                setAccuracy(currentAccuracy);
                setErrors(totalErrors);
                setStrugglingKeys(totalKeyErrors);
                
                return prevStrictKeys;
            });
            return prevStrictErrs;
        });

    }, [targetText]);

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
        setStrictErrorCount(0);
        setStrictKeyErrors({});
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
            calculateStats();
        }, 1000);
    }, [duration, untimed, calculateStats, finishTest]);



    // Trigger onFinish when isFinished becomes true (exactly once per session)
    useEffect(() => {
        if (isFinished && onFinish && !hasFinishedRef.current) {
            hasFinishedRef.current = true;
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
                setStrictErrorCount(prev => prev + 1);
                setStrictKeyErrors(prev => ({ ...prev, [expectedChar]: (prev[expectedChar] || 0) + 1 }));
                setLastErrorIndex(addedCharIndex);
                setTimeout(() => setLastErrorIndex(null), 400);
                calculateStats();
                return; // Block input, force correct functional key
            }

            // Scenario 2: Expected a letter/symbol, but they pressed Space instead
            if (typedChar === ' ' && expectedChar !== ' ' && expectedChar !== '\n') {
                setStrictErrorCount(prev => prev + 1);
                setStrictKeyErrors(prev => ({ ...prev, [expectedChar]: (prev[expectedChar] || 0) + 1 }));
                setLastErrorIndex(addedCharIndex);
                setTimeout(() => setLastErrorIndex(null), 400);
                calculateStats();
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
                setStrictErrorCount(prev => prev + 1);
                setStrictKeyErrors(prev => ({ ...prev, [expectedChar]: (prev[expectedChar] || 0) + 1 }));
                
                // Signal UI to show shake animation
                setLastErrorIndex(addedCharIndex);
                setTimeout(() => setLastErrorIndex(null), 400); // clear after animation duration
                
                calculateStats(); // recalculate accuracy immediately
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

            setStrictErrorCount(prevStrictErrs => {
                setStrictKeyErrors(prevStrictKeys => {
                    const totalErrors = errorCount + prevStrictErrs;
                    const totalKeyErrors = { ...keyErrors };
                    for (const k in prevStrictKeys) {
                        totalKeyErrors[k] = (totalKeyErrors[k] || 0) + prevStrictKeys[k];
                    }

                    // Net WPM Calculation
                    const netCharacters = Math.max(0, value.length - totalErrors);
                    const wordsTyped = netCharacters / 5;
                    const currentWpm = timeElapsedMin > 0 ? Math.round(wordsTyped / timeElapsedMin) : 0;

                    const attempts = value.length + prevStrictErrs;
                    const currentAccuracy = attempts > 0
                        ? Math.max(0, Math.round(((attempts - totalErrors) / attempts) * 100))
                        : 100;

                    setWpm(currentWpm);
                    setAccuracy(currentAccuracy);
                    setErrors(totalErrors);
                    setStrugglingKeys(totalKeyErrors);
                    
                    return prevStrictKeys;
                });
                return prevStrictErrs;
            });
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
        lastErrorIndex, // Exported for UI shake animations
        startTest,
        handleInputChange,
        resetTest: startTest // Alias for restarting
    };
};
