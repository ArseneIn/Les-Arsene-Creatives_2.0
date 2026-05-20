import React, { useState } from 'react';
import type { PracticeModuleContent } from '../../data/practiceModules';

interface FunctionalKeyTutorialProps {
    stage: PracticeModuleContent;
    onComplete: () => void; // user finished tutorial, start the drill
    onSkip: () => void;     // experienced user, skip straight to drill
}

type TutorialStep = 'intro' | 'visualization' | 'placement' | 'try-it' | 'done';

const STEPS: TutorialStep[] = ['intro', 'visualization', 'placement', 'try-it', 'done'];

const STEP_LABELS: Record<TutorialStep, string> = {
    intro: 'Introduction',
    visualization: 'Key Location',
    placement: 'Finger Placement',
    'try-it': 'Try It!',
    done: 'Ready',
};

// Which keyboard key is being highlighted for each stage
const STAGE_KEY_HIGHLIGHTS: Record<string, string[]> = {
    'stage-07': ['CapsLock'],
    'stage-08': ['Shift', 'RShift'],
};

// Finger diagrams as emoji + text descriptions
const FINGER_DIAGRAMS: Record<string, { hand: string; finger: string; detail: string }> = {
    'stage-07': {
        hand: '🤚',
        finger: 'Left Pinky',
        detail: 'Your left pinky finger rests just above the A key. Reach it slightly left and up to hit Caps Lock. Press once to activate, once more to deactivate — the key toggles.',
    },
    'stage-08': {
        hand: '🤜 🤛',
        finger: 'Both Pinky Fingers',
        detail: 'For a right-hand letter (like "T"), use your LEFT Shift with your left pinky. For a left-hand letter (like "A"), use your RIGHT Shift with your right pinky. Hold Shift, press the letter, release Shift immediately.',
    },
};

// Interactive try-it prompts
const TRY_IT_PROMPTS: Record<string, { instruction: string; targetWord: string; hint: string }> = {
    'stage-07': {
        instruction: 'Press Caps Lock, type the word below, then press Caps Lock again to turn it off.',
        targetWord: 'HELLO',
        hint: 'Press Caps Lock → type H-E-L-L-O → press Caps Lock again',
    },
    'stage-08': {
        instruction: 'Use Shift to type the capitalized word below naturally.',
        targetWord: 'World',
        hint: 'Hold Right Shift → press W → release Shift → type o-r-l-d',
    },
};

export const FunctionalKeyTutorial: React.FC<FunctionalKeyTutorialProps> = ({ stage, onComplete, onSkip }) => {
    const [currentStep, setCurrentStep] = useState<TutorialStep>('intro');
    const [tryItInput, setTryItInput] = useState('');
    const [tryItDone, setTryItDone] = useState(false);

    const stepIndex = STEPS.indexOf(currentStep);
    const highlightedKeys = STAGE_KEY_HIGHLIGHTS[stage.id] ?? [];
    const fingerDiagram = FINGER_DIAGRAMS[stage.id];
    const tryItPrompt = TRY_IT_PROMPTS[stage.id];

    const goNext = () => {
        if (currentStep === 'done') {
            onComplete();
            return;
        }
        const next = STEPS[stepIndex + 1];
        setCurrentStep(next);
    };

    const goPrev = () => {
        if (stepIndex === 0) return;
        setCurrentStep(STEPS[stepIndex - 1]);
    };

    const handleTryItChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTryItInput(val);
        if (tryItPrompt && val === tryItPrompt.targetWord) {
            setTryItDone(true);
        }
    };

    // Render keyboard mini-diagram with highlighted keys
    const renderMiniKeyboard = () => {
        const rows = [
            ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'RShift'],
        ];
        return (
            <div className="flex flex-col gap-2 my-4">
                {rows.map((row, ri) => (
                    <div key={ri} className="flex gap-1.5 justify-center flex-wrap">
                        {row.map((key) => {
                            const isHighlighted = highlightedKeys.includes(key);
                            return (
                                <div
                                    key={key}
                                    className={`
                                        flex items-center justify-center rounded-md border text-[10px] font-bold px-2 h-8 min-w-[30px]
                                        transition-all duration-300
                                        ${isHighlighted
                                            ? 'bg-[#33B974] text-white border-[#33B974] scale-110 shadow-[0_0_14px_4px_rgba(51,185,116,0.4)] animate-pulse'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                                        }
                                        ${key === 'CapsLock' || key === 'Shift' || key === 'RShift' ? 'min-w-[56px]' : ''}
                                    `}
                                >
                                    {key === 'RShift' ? '⇧ R' : key === 'Shift' ? '⇧ L' : key === 'CapsLock' ? '⇪' : key.toUpperCase()}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/80 backdrop-blur-md">
            <div className="bg-white dark:bg-[#0b1e2d] rounded-3xl shadow-2xl border border-white/10 max-w-lg w-full mx-4 overflow-hidden">
                {/* Progress bar */}
                <div className="h-1 bg-slate-100 dark:bg-slate-800">
                    <div
                        className="h-full bg-[#33B974] transition-all duration-500"
                        style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                    />
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-between px-6 pt-5 pb-2">
                    <div className="flex gap-2">
                        {STEPS.map((s, i) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i <= stepIndex ? 'bg-[#33B974] w-6' : 'bg-slate-200 dark:bg-slate-700 w-3'}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={onSkip}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors font-medium uppercase tracking-wide"
                    >
                        Skip Tutorial
                    </button>
                </div>

                <div className="px-8 pb-8 pt-4">
                    {/* Stage badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[#33B974] text-xl">{stage.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#33B974] bg-[#33B974]/10 px-2 py-0.5 rounded-full">
                            Stage {stage.stageNumber} · {STEP_LABELS[currentStep]}
                        </span>
                    </div>

                    {/* ── STEP: INTRO ── */}
                    {currentStep === 'intro' && (
                        <>
                            <h2 className="text-2xl font-bold text-[#061824] dark:text-white mb-3">{stage.title}</h2>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{stage.description}</p>
                            <div className="bg-[#094A71]/5 dark:bg-[#094A71]/10 border border-[#094A71]/15 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#094A71] mt-0.5">info</span>
                                    <p className="text-sm text-[#094A71] dark:text-[#5aacdf] font-medium leading-relaxed">
                                        This is an interactive tutorial. We'll guide you step by step before you start typing.
                                        You can skip to the drill anytime using the button above.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── STEP: VISUALIZATION ── */}
                    {currentStep === 'visualization' && (
                        <>
                            <h2 className="text-xl font-bold text-[#061824] dark:text-white mb-2">Find the Key</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                                The highlighted key{highlightedKeys.length > 1 ? 's are' : ' is'} shown glowing on the keyboard below.
                            </p>
                            {renderMiniKeyboard()}
                            <div className="bg-[#33B974]/5 border border-[#33B974]/20 rounded-xl p-3 text-sm text-[#33B974] font-medium mt-2">
                                🎯 Your focus key{highlightedKeys.length > 1 ? 's' : ''}: <strong>{highlightedKeys.join(' + ')}</strong>
                            </div>
                        </>
                    )}

                    {/* ── STEP: PLACEMENT ── */}
                    {currentStep === 'placement' && fingerDiagram && (
                        <>
                            <h2 className="text-xl font-bold text-[#061824] dark:text-white mb-2">Finger Placement</h2>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-4xl">{fingerDiagram.hand}</span>
                                <div>
                                    <p className="font-bold text-[#094A71] dark:text-[#33B974]">{fingerDiagram.finger}</p>
                                    <p className="text-xs text-gray-400">Responsible finger</p>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                {fingerDiagram.detail}
                            </p>
                            <div className="mt-4 text-xs text-gray-400 flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm text-amber-500">tips_and_updates</span>
                                <span>{stage.fingerHint}</span>
                            </div>
                        </>
                    )}

                    {/* ── STEP: TRY IT ── */}
                    {currentStep === 'try-it' && tryItPrompt && (
                        <>
                            <h2 className="text-xl font-bold text-[#061824] dark:text-white mb-2">Try It!</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{tryItPrompt.instruction}</p>

                            {/* Target word display */}
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-1 text-3xl font-mono font-bold tracking-widest">
                                    {tryItPrompt.targetWord.split('').map((char, i) => {
                                        const typed = tryItInput[i];
                                        const color = typed === undefined
                                            ? 'text-slate-300 dark:text-slate-600'
                                            : typed === char
                                                ? 'text-[#33B974]'
                                                : 'text-red-500';
                                        return (
                                            <span key={i} className={`transition-colors duration-150 ${color} ${i === tryItInput.length ? 'border-b-2 border-[#33B974] animate-pulse' : ''}`}>
                                                {char}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            <input
                                type="text"
                                value={tryItInput}
                                onChange={handleTryItChange}
                                maxLength={tryItPrompt.targetWord.length}
                                autoFocus
                                spellCheck={false}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                disabled={tryItDone}
                                placeholder="Type here..."
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-[#33B974]/50 transition-all"
                            />
                            {tryItDone && (
                                <div className="mt-3 flex items-center justify-center gap-2 text-[#33B974] font-bold animate-in fade-in">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    <span>Perfect! You did it!</span>
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-3 text-center">{tryItPrompt.hint}</p>
                        </>
                    )}

                    {/* ── STEP: DONE ── */}
                    {currentStep === 'done' && (
                        <>
                            <div className="text-center py-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#33B974]/10 text-[#33B974] mb-4">
                                    <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                                </div>
                                <h2 className="text-2xl font-bold text-[#061824] dark:text-white mb-2">You're ready!</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                                    You've completed the tutorial for <strong>{stage.title}</strong>. Now let's practice for real!
                                </p>
                            </div>
                        </>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3 mt-6">
                        {stepIndex > 0 && (
                            <button
                                onClick={goPrev}
                                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm"
                            >
                                ← Back
                            </button>
                        )}
                        <button
                            onClick={currentStep === 'try-it' && !tryItDone ? undefined : goNext}
                            disabled={currentStep === 'try-it' && !tryItDone}
                            className={`
                                flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200
                                ${currentStep === 'try-it' && !tryItDone
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                    : 'bg-[#33B974] hover:bg-[#33B974]/90 text-white shadow-[0_4px_14px_rgba(51,185,116,0.3)] hover:shadow-[0_6px_20px_rgba(51,185,116,0.4)]'
                                }
                            `}
                        >
                            {currentStep === 'done' ? '🚀 Start Drill' : currentStep === 'try-it' && !tryItDone ? 'Complete the exercise first' : 'Next →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
