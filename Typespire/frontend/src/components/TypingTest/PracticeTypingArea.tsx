import React, { useRef, useEffect, useMemo, useState } from 'react';

interface PracticeTypingAreaProps {
    targetText: string;
    userInput: string;
    started: boolean;
    isFinished: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    elapsedSeconds: number; // counts up in untimed mode
}

/** Returns per-character state for rendering */
type CharState = 'correct' | 'incorrect' | 'cursor' | 'pending';

function getCharState(index: number, userInput: string, targetText: string): CharState {
    if (index < userInput.length) {
        return userInput[index] === targetText[index] ? 'correct' : 'incorrect';
    }
    if (index === userInput.length) return 'cursor';
    return 'pending';
}

const CHAR_STYLES: Record<CharState, string> = {
    correct:   'text-[#33B974]',
    incorrect: 'text-red-500 bg-red-100 dark:bg-red-900/40 rounded shadow-[0_0_0_1px_rgba(239,68,68,0.5)]',
    cursor:    'text-[#094A71] dark:text-[#33B974] bg-[#094A71]/10 dark:bg-[#33B974]/20 rounded shadow-[0_0_0_2px_rgba(9,74,113,0.3)] dark:shadow-[0_0_0_2px_rgba(51,185,116,0.3)] animate-pulse',
    pending:   'text-slate-400 dark:text-slate-500',
};

function formatElapsed(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export const PracticeTypingArea: React.FC<PracticeTypingAreaProps> = ({
    targetText,
    userInput,
    started,
    isFinished,
    onInputChange,
    elapsedSeconds,
}) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [capsLockWarning, setCapsLockWarning] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.getModifierState('CapsLock')) {
            e.preventDefault();
            setCapsLockWarning(true);
            setTimeout(() => setCapsLockWarning(false), 2000);
        }
    };

    // Keep input focused
    useEffect(() => {
        if (!isFinished && inputRef.current) inputRef.current.focus();
    }, [isFinished, started]);

    // Parse targetText into lines and words
    const lineMetas = useMemo(() => {
        const lines = targetText.split('\n');
        const metas = [];
        let offset = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const lineText = lines[i];
            const wordsRaw = lineText.split(' ');
            const wordsMeta = [];
            let wordOffset = offset;
            
            for (let w = 0; w < wordsRaw.length; w++) {
                const wordText = wordsRaw[w];
                const isLastInRow = w === wordsRaw.length - 1;
                const isAbsoluteLast = i === lines.length - 1 && isLastInRow;
                
                wordsMeta.push({
                    text: wordText,
                    globalStart: wordOffset,
                    isLastInRow,
                    separator: isAbsoluteLast ? null : (isLastInRow ? '\n' : ' ')
                });
                
                wordOffset += wordText.length + 1; // +1 for the space or newline
            }
            
            metas.push({ text: lineText, globalStart: offset, words: wordsMeta });
            offset += lineText.length + 1; // +1 for the newline
        }
        return metas;
    }, [targetText]);

    const completedChars = userInput.length;
    // Calculate newlines based on the TARGET text up to the user's progress.
    // This prevents the UI from jumping ahead if the user types incorrect newline characters.
    const completedNewlines = (targetText.slice(0, completedChars).match(/\n/g) || []).length;
    
    // Calculate current page (2 lines per page)
    const currentLineIdx = Math.min(completedNewlines, lineMetas.length - 1);
    const pageIndex = Math.floor(currentLineIdx / 2);
    const startLineIdx = pageIndex * 2;
    const pageLines = lineMetas.slice(startLineIdx, startLineIdx + 2);

    const progressPct = targetText.length > 0
        ? Math.round((completedChars / targetText.length) * 100)
        : 0;

    return (
        <div
            className="flex flex-col w-full gap-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg relative"
            onClick={() => inputRef.current?.focus()}
        >
            {/* CAPS LOCK WARNING OVERLAY */}
            {capsLockWarning && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 animate-bounce">
                    <span className="material-symbols-outlined">warning</span>
                    Caps Lock is ON! Please turn it off and use the Shift key.
                </div>
            )}

            {/* ── TOP PANEL: 2x2 Grid ── */}
            <div className="bg-white dark:bg-[#0b1e2d] p-6 md:p-10 border-b border-slate-100 dark:border-slate-800/80 min-h-[300px] flex flex-col">
                
                {/* Panel label */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#094A71] dark:text-[#33B974] text-lg">grid_view</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            Type words and use Space / Enter to advance
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                        <span className="text-[#33B974]">Page {pageIndex + 1}</span>
                        <span>/</span>
                        <span>{Math.ceil(lineMetas.length / 2)}</span>
                    </div>
                </div>

                {/* The Grid Area */}
                <div className="flex-1 flex flex-col justify-center gap-10">
                    {pageLines.map((line, rowIdx) => (
                        <div key={`row-${startLineIdx + rowIdx}`} className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
                            {line.words.map((word) => {
                                const wordEndIdx = word.globalStart + word.text.length;
                                // Is the cursor inside this word?
                                const isWordActive = completedChars >= word.globalStart && completedChars < wordEndIdx;
                                // Did the user type something wrong inside this word?
                                const wordHasError = Array.from({length: word.text.length}).some((_, i) => {
                                    const gIdx = word.globalStart + i;
                                    return gIdx < completedChars && userInput[gIdx] !== targetText[gIdx];
                                });
                                // Has the user passed this word completely?
                                const isWordCompleted = completedChars >= wordEndIdx;

                                // Separator logic
                                const separatorGlobalIdx = wordEndIdx;
                                const isSeparatorActive = completedChars === separatorGlobalIdx;
                                const separatorPassed = completedChars > separatorGlobalIdx;
                                const separatorIsEnter = word.separator === '\n';
                                const separatorError = separatorPassed && userInput[separatorGlobalIdx] !== word.separator;

                                return (
                                    <React.Fragment key={`word-${word.globalStart}`}>
                                        {/* Word Box */}
                                        <div 
                                            className={`
                                                relative px-6 py-4 rounded-2xl border-2 text-2xl md:text-3xl font-mono tracking-wider transition-all duration-300
                                                ${isWordActive 
                                                    ? wordHasError 
                                                        ? 'border-red-400 shadow-[0_4px_15px_rgba(239,68,68,0.2)] scale-105 bg-red-50/50 dark:bg-red-500/5' 
                                                        : 'border-[#094A71] dark:border-[#33B974] shadow-[0_4px_15px_rgba(9,74,113,0.15)] dark:shadow-[0_4px_15px_rgba(51,185,116,0.15)] scale-105 bg-slate-50/50 dark:bg-[#061824]/50'
                                                    : isWordCompleted
                                                        ? wordHasError ? 'border-red-200 dark:border-red-900/50 opacity-80' : 'border-[#33B974]/30 dark:border-[#33B974]/20 opacity-80'
                                                        : 'border-slate-200 dark:border-slate-800 opacity-50'
                                                }
                                            `}
                                        >
                                            {word.text.split('').map((char, i) => {
                                                const gIdx = word.globalStart + i;
                                                const state = getCharState(gIdx, userInput, targetText);
                                                return (
                                                    <span key={gIdx} className={`transition-colors duration-150 ${CHAR_STYLES[state]}`}>
                                                        {char}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        {/* Separator Prompt (Space or Enter) */}
                                        {word.separator && (
                                            <div 
                                                className={`
                                                    flex items-center justify-center rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all duration-300
                                                    ${isSeparatorActive 
                                                        ? 'border-[#094A71] dark:border-[#33B974] text-[#094A71] dark:text-[#33B974] shadow-[0_0_0_4px_rgba(9,74,113,0.1)] dark:shadow-[0_0_0_4px_rgba(51,185,116,0.1)] scale-110 animate-pulse'
                                                        : separatorPassed
                                                            ? separatorError
                                                                ? 'border-red-400 text-red-500 bg-red-50 dark:bg-red-500/10 animate-[shake_0.2s_ease]'
                                                                : 'border-[#33B974]/30 text-[#33B974]/50 bg-[#33B974]/5'
                                                            : 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 opacity-50'
                                                    }
                                                `}
                                            >
                                                {separatorIsEnter ? (
                                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">keyboard_return</span> Enter</span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">space_bar</span> Space</span>
                                                )}
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="mt-8">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                        <span>Overall Progress</span>
                        <span className="font-bold text-[#33B974]">{progressPct}% complete</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#094A71] to-[#33B974] rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>
            </div>
                        {/* ── FOOTER STATS & HIDDEN INPUT ── */}
            <div className="bg-slate-50 dark:bg-[#061824] p-4 md:px-8 md:py-5 flex items-center justify-between relative overflow-hidden">
                {/* The actual hidden textarea capturing keystrokes */}
                <textarea
                    ref={inputRef}
                    value={userInput}
                    onChange={onInputChange}
                    onKeyDown={handleKeyDown}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20 resize-none"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    disabled={isFinished || !started}
                />
                
                {/* Helper hints */}
                <div className="flex items-center gap-4 text-[10px] md:text-xs text-slate-400 dark:text-slate-600 pointer-events-none relative z-30">
                    {!started ? (
                        <span className="italic font-sans">Click anywhere here or start typing to begin...</span>
                    ) : (
                        <>
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Correct
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-red-400">cancel</span>
                                Mistake
                            </span>
                        </>
                    )}
                </div>

                {/* Live mini-stats */}
                <div className="flex items-center gap-3 md:gap-4 text-xs font-bold pointer-events-none relative z-30">
                    {started && (
                        <>
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <span className="material-symbols-outlined text-sm text-slate-300">timer</span>
                                <span className="font-mono text-slate-500 dark:text-slate-400">{formatElapsed(elapsedSeconds)}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
