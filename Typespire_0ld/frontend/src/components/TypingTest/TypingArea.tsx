import React, { useRef, useEffect } from 'react';

interface TypingAreaProps {
    targetText: string;
    userInput: string;
    started: boolean;
    isFinished: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
    targetText,
    userInput,
    started,
    isFinished,
    onInputChange
}) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus input on mount and when not finished, and especially when started
    useEffect(() => {
        if (!isFinished && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFinished, started]);

    // Keep focus unless finished
    useEffect(() => {
        const handleBlur = () => {
            if (!isFinished && inputRef.current) {
                // Optional: Force focus back if you want strict focus lock
                // inputRef.current.focus(); 
            }
        };

        const input = inputRef.current;
        if (input) {
            input.addEventListener('blur', handleBlur);
        }

        return () => {
            if (input) {
                input.removeEventListener('blur', handleBlur);
            }
        };
    }, [isFinished]);

    const renderHighlightedText = () => {
        return targetText.split('').map((char, index) => {
            let colorClass = "text-gray-400 dark:text-gray-500"; // Default (untouched)
            let bgClass = "";

            if (index < userInput.length) {
                if (userInput[index] === char) {
                    colorClass = "text-green-600 dark:text-green-400"; // Correct
                } else {
                    colorClass = "text-red-600 dark:text-red-400"; // Incorrect
                    bgClass = "bg-red-100 dark:bg-red-900/30";
                }
            } else if (index === userInput.length) {
                bgClass = "bg-admin-primary/20 animate-pulse"; // Cursor position
            }

            return (
                <span key={index} className={`${colorClass} ${bgClass} transition-colors duration-75`}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div
            className={`
                relative rounded-3xl p-12 transition-all duration-500 ease-out
                bg-white/60 dark:bg-[#1a2e21]/60 backdrop-blur-xl
                border border-white/40 dark:border-white/5
                shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
                ${started && !isFinished ? 'ring-2 ring-admin-primary/30 shadow-[0_8px_40px_rgba(16,185,129,0.15)]' : 'hover:shadow-lg'}
            `}
            onClick={() => inputRef.current?.focus()}
        >
            {/* Overlay Text (The Target) */}
            <div className="absolute top-12 left-12 right-12 bottom-12 pointer-events-none select-none">
                <h3 className="text-3xl font-display leading-relaxed text-left break-words whitespace-pre-wrap tracking-wide">
                    {renderHighlightedText()}
                </h3>
            </div>

            {/* Invisible Textarea for Input */}
            <textarea
                ref={inputRef}
                value={userInput}
                onChange={onInputChange}
                className="w-full h-full absolute inset-0 opacity-0 cursor-text z-20 resize-none"
                autoFocus
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                disabled={isFinished || !started}
            />

            {/* Visual Placeholder to maintain height */}
            <div className="invisible text-3xl font-display leading-relaxed text-left break-words whitespace-pre-wrap tracking-wide">
                {targetText}
            </div>
        </div>
    );
};
