import React, { useRef, useEffect, useMemo, useState } from 'react';

interface PracticeTypingAreaProps {
    targetText: string;
    userInput: string;
    started: boolean;
    isFinished: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    elapsedSeconds: number; // counts up in untimed mode
    mode?: 'letters' | 'falling' | 'words';
    lastErrorIndex?: number | null;
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
    mode = 'words',
    lastErrorIndex = null,
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

    // Parse targetText into words
    const wordsRaw = useMemo(() => targetText.split(' '), [targetText]);

    const wordsMeta = useMemo(() => {
        const metas = [];
        let globalOffset = 0;
        for (let w = 0; w < wordsRaw.length; w++) {
            const wordText = wordsRaw[w];
            const isAbsoluteLast = w === wordsRaw.length - 1;
            metas.push({
                text: wordText,
                globalStart: globalOffset,
                separator: isAbsoluteLast ? null : ' '
            });
            globalOffset += wordText.length + 1; // +1 for space
        }
        return metas;
    }, [wordsRaw]);

    const completedChars = userInput.length;

    // --- KEYBOARD & FALLING LOGIC ---
    const KEYBOARD_ROWS = [
        ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
        ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
        ['CapsLock','a','s','d','f','g','h','j','k','l',';',"'",'Enter'],
        ['Shift','z','x','c','v','b','n','m',',','.','/','RShift'],
        ['Space'],
    ];
    
    const KEY_WIDTHS: Record<string, string> = {
        'Backspace': 'min-w-[72px]', 'Tab': 'min-w-[56px]', 'CapsLock': 'min-w-[68px]',
        'Enter': 'min-w-[72px]', 'Shift': 'min-w-[88px]', 'RShift': 'min-w-[88px]', 'Space': 'w-[300px]'
    };

    const [keyCenters, setKeyCenters] = useState<Record<string, number>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    const measureKey = (key: string, el: HTMLDivElement | null) => {
        if (el && containerRef.current) {
            const rect = el.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const center = rect.left - containerRect.left + (rect.width / 2);
            setKeyCenters(prev => {
                if (Math.abs((prev[key] || 0) - center) < 1) return prev;
                return { ...prev, [key]: center };
            });
        }
    };

    // --- WORD MODE PAGINATION ---
    const WORDS_PER_PAGE = 12; // 6 words * 2 lines
    let currentWordIdx = 0;
    for (let i = 0; i < wordsMeta.length; i++) {
        if (completedChars >= wordsMeta[i].globalStart) {
            currentWordIdx = i;
        } else {
            break;
        }
    }
    const pageIndex = Math.floor(currentWordIdx / WORDS_PER_PAGE);
    const startWordIdx = pageIndex * WORDS_PER_PAGE;
    const pageWords = wordsMeta.slice(startWordIdx, startWordIdx + WORDS_PER_PAGE);
    const totalPages = Math.ceil(wordsMeta.length / WORDS_PER_PAGE);

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

            {/* ── TOP PANEL ── */}
            <div 
                ref={containerRef}
                className="bg-white dark:bg-[#0b1e2d] p-6 md:p-10 border-b border-slate-100 dark:border-slate-800/80 min-h-[300px] flex flex-col relative overflow-hidden"
            >
                
                {/* Panel label */}
                <div className="flex items-center justify-between mb-8 z-10 relative">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#094A71] dark:text-[#33B974] text-lg">
                            {mode === 'falling' ? 'keyboard_capslock' : mode === 'letters' ? 'linear_scale' : 'grid_view'}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            {mode === 'falling' ? 'Type the falling letters' : mode === 'letters' ? 'Type letters and use Space to advance' : 'Type words and use Space to advance'}
                        </span>
                    </div>
                    {mode === 'words' && (
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            <span className="text-[#33B974]">Page {pageIndex + 1}</span>
                            <span>/</span>
                            <span>{totalPages}</span>
                        </div>
                    )}
                </div>

                {/* The Typing Area */}
                <div className="flex-1 flex flex-col justify-center relative min-h-[200px]">
                    
                    {mode === 'falling' ? (
                        /* FALLING LETTERS MODE */
                        <div className="w-full h-[400px] relative flex flex-col items-center justify-end overflow-hidden pb-4">
                            
                            {/* Falling Cards Container */}
                            <div className="absolute inset-x-0 bottom-[140px] top-0 overflow-hidden pointer-events-none">
                                {/* Active Lane Highlight */}
                                {(() => {
                                    const activeChar = targetText[completedChars];
                                    if (!activeChar) return null;
                                    const lookupKey = activeChar === ' ' ? 'Space' : activeChar;
                                    const centerX = keyCenters[lookupKey] || 0;
                                    if (!centerX) return null;
                                    
                                    const isError = lastErrorIndex === completedChars;
                                    
                                    return (
                                        <div 
                                            className={`absolute bottom-0 top-0 transition-all duration-300 pointer-events-none rounded-t-xl ${
                                                isError 
                                                    ? 'bg-red-500/10 border-x border-red-500/30' 
                                                    : 'bg-[#3B82F6]/5 border-x border-[#3B82F6]/20'
                                            }`}
                                            style={{
                                                left: `${centerX}px`,
                                                transform: `translateX(-50%)`,
                                                width: activeChar === ' ' ? '6rem' : '3rem'
                                            }}
                                        />
                                    );
                                })()}

                                {targetText.split('').map((char, idx) => {
                                    if (idx < completedChars || idx > completedChars + 6) return null; // Only show upcoming 7 characters
                                    
                                    const queuePos = idx - completedChars;
                                    const isActive = queuePos === 0;
                                    const isShaking = isActive && lastErrorIndex === idx;
                                    const lookupKey = char === ' ' ? 'Space' : char;
                                    const centerX = keyCenters[lookupKey] || 0;
                                    
                                    if (!centerX) return null; // Wait for measurement

                                    return (
                                        <div 
                                            key={`fall-${idx}`}
                                            className={`
                                                absolute flex items-center justify-center rounded-xl border-2 font-bold transition-all duration-300
                                                ${char === ' ' ? 'w-24 h-12 text-sm' : 'w-12 h-14 text-2xl uppercase'}
                                                ${isActive 
                                                    ? isShaking 
                                                        ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/40 animate-[shake_0.4s_ease-in-out_1]' 
                                                        : 'border-[#3B82F6] bg-[#3B82F6] text-white shadow-lg shadow-blue-500/40 scale-110 z-20' 
                                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#061824] text-slate-500 z-10'
                                                }
                                            `}
                                            style={{
                                                left: `${centerX}px`,
                                                transform: `translateX(-50%)`,
                                                bottom: `${queuePos * 64}px`, // Stack vertically
                                                opacity: queuePos > 4 ? 0 : 1 - (queuePos * 0.15), // Fade out higher ones
                                            }}
                                        >
                                            {char === ' ' ? 'SPACE' : char}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Virtual Keyboard */}
                            <div className="w-full max-w-[800px] mx-auto flex flex-col gap-1.5 opacity-80 mt-auto">
                                {KEYBOARD_ROWS.map((row, rIdx) => (
                                    <div key={`r-${rIdx}`} className="flex justify-center gap-1.5">
                                        {row.map(key => {
                                            const isSpace = key === 'Space';
                                            const activeChar = targetText[completedChars];
                                            const lookupKey = activeChar === ' ' ? 'Space' : activeChar;
                                            const isKeyTargeted = key.toLowerCase() === lookupKey?.toLowerCase();
                                            const isError = lastErrorIndex === completedChars && isKeyTargeted;
                                            
                                            return (
                                                <div 
                                                    key={key}
                                                    ref={(el) => measureKey(key.toLowerCase() === 'space' ? 'Space' : key.toLowerCase(), el)}
                                                    className={`
                                                        flex items-center justify-center rounded-lg border text-[10px] font-bold h-10 px-2 transition-all duration-200
                                                        ${KEY_WIDTHS[key] || 'min-w-[40px]'}
                                                        ${isKeyTargeted
                                                            ? isError 
                                                                ? 'bg-red-500/20 border-red-500 text-red-500' 
                                                                : 'bg-[#3B82F6]/20 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                                                            : 'bg-slate-50 dark:bg-[#061824] border-slate-200 dark:border-slate-700/50 text-slate-400'
                                                        }
                                                    `}
                                                >
                                                    {isSpace ? '' : key.length === 1 ? key.toUpperCase() : key}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                        </div>
                    ) : mode === 'letters' ? (
                        /* LETTER MODE: Single horizontal scrolling line */
                        <div className="w-full overflow-hidden relative h-32 flex items-center">
                            {/* Fade edges */}
                            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-[#0b1e2d] to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-[#0b1e2d] to-transparent z-10 pointer-events-none" />
                            
                            <div 
                                className="flex items-center gap-8 absolute left-1/2 transition-transform duration-500 ease-in-out"
                                style={{ 
                                    transform: `translateX(calc(-432px - ${Math.floor(completedChars / 8) * 896}px))` 
                                }}
                            >
                                {targetText.split('').map((char, idx) => {
                                    const isActive = completedChars === idx;
                                    const isPassed = completedChars > idx;
                                    const hasError = (isPassed && userInput[idx] !== char) || (isActive && lastErrorIndex === idx);
                                    const isShaking = isActive && lastErrorIndex === idx;
                                    const isSpace = char === ' ';

                                    if (isSpace) {
                                        return (
                                            <div key={`char-${idx}`} className={`
                                                flex items-center justify-center w-20 h-24 rounded-2xl border-2 text-4xl font-sans transition-all duration-300 shrink-0
                                                ${isActive 
                                                    ? hasError 
                                                        ? 'border-red-500 shadow-[0_4px_15px_rgba(239,68,68,0.4)] scale-110 bg-red-500 text-white' 
                                                        : 'border-[#3B82F6] shadow-[0_4px_15px_rgba(59,130,246,0.4)] scale-110 bg-[#3B82F6] text-white' 
                                                    : isPassed
                                                        ? hasError ? 'border-red-500 shadow-[0_4px_15px_rgba(239,68,68,0.2)] bg-red-500 text-white' : 'border-[#33B974]/40 bg-[#33B974]/10 opacity-80'
                                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#061824] opacity-60'
                                                }
                                                ${isShaking ? 'animate-[shake_0.4s_ease-in-out_1]' : ''}
                                            `}>
                                                {hasError && <span className="text-white">_</span>}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={`char-${idx}`} className={`
                                            flex items-center justify-center w-20 h-24 rounded-2xl border-2 text-5xl font-sans transition-all duration-300 shrink-0
                                            ${isActive 
                                                ? hasError 
                                                    ? 'border-red-500 shadow-[0_4px_15px_rgba(239,68,68,0.4)] scale-110 bg-red-500 text-white' 
                                                    : 'border-[#3B82F6] shadow-[0_4px_15px_rgba(59,130,246,0.4)] scale-110 bg-[#3B82F6] text-white'
                                                : isPassed
                                                    ? hasError ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 opacity-70 text-red-500' : 'border-[#33B974]/40 bg-[#33B974]/10 opacity-80 text-[#33B974]'
                                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#061824] text-slate-500 dark:text-slate-400 opacity-60'
                                            }
                                            ${isShaking ? 'animate-[shake_0.4s_ease-in-out_1]' : ''}
                                        `}>
                                            {char}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* WORD MODE: Grid wrap */
                        <div className="flex items-center justify-center gap-x-6 gap-y-10 flex-wrap">
                            {pageWords.map((word) => {
                                const wordEndIdx = word.globalStart + word.text.length;
                                const isWordActive = completedChars >= word.globalStart && completedChars < wordEndIdx;
                                const isWordCompleted = completedChars >= wordEndIdx;
                                const wordHasError = Array.from({length: word.text.length}).some((_, i) => {
                                    const gIdx = word.globalStart + i;
                                    return gIdx < completedChars && userInput[gIdx] !== targetText[gIdx];
                                });

                                // Space separator logic
                                const separatorGlobalIdx = wordEndIdx;
                                const isSeparatorActive = completedChars === separatorGlobalIdx && word.separator;
                                const separatorPassed = completedChars > separatorGlobalIdx && word.separator;
                                const separatorError = separatorPassed && userInput[separatorGlobalIdx] !== ' ';

                                return (
                                    <React.Fragment key={`word-${word.globalStart}`}>
                                        <div className="flex items-center gap-6">
                                            {/* Word Box */}
                                            <div 
                                                className={`
                                                    relative px-5 py-3 rounded-2xl border-2 text-2xl md:text-3xl font-mono tracking-wider transition-all duration-300
                                                    ${isWordActive 
                                                        ? wordHasError 
                                                            ? 'border-red-400 shadow-[0_4px_15px_rgba(239,68,68,0.2)] scale-105 bg-red-50/50 dark:bg-red-500/5' 
                                                            : 'border-blue-500 shadow-[0_4px_15px_rgba(59,130,246,0.2)] scale-105 bg-blue-50/50 dark:bg-blue-500/10'
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

                                            {/* Space Gap Indicator (Subtle bottom border/glow) */}
                                            {word.separator && (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className={`w-6 h-1.5 rounded-full transition-all duration-300 ${
                                                        isSeparatorActive ? 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)] scale-125 animate-pulse' 
                                                        : separatorError ? 'bg-red-400'
                                                        : 'bg-transparent'
                                                    }`} />
                                                </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
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
