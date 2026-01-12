import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useUserProgress } from '../context/UserProgressContext';

const TARGET_TEXT = "The rapid development of digital communication has transformed how we share information across the globe. Mastering the keyboard is a fundamental skill for academic and professional success in the twenty-first century. As students navigate through increasingly complex digital landscapes, the ability to translate thoughts to text with speed and precision becomes a critical advantage. This standardized assessment measures both technical proficiency and cognitive processing speed.";

const TypingTest: React.FC = () => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { saveResult } = useUserProgress();

    const {
        started,
        timeLeft,
        userInput,
        wpm,
        accuracy,
        isFinished,
        startTest,
        handleInputChange
    } = useTypingEngine({
        targetText: TARGET_TEXT,
        duration: 60,
        onFinish: (results) => {
            saveResult({
                testName: 'Standardized Trial 1',
                wpm: results.wpm,
                accuracy: results.accuracy
            });
        }
    });

    // Auto-focus input when test starts
    useEffect(() => {
        if (started && inputRef.current) {
            inputRef.current.focus();
        }
    }, [started]);

    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return {
            mins: mins.toString().padStart(2, '0'),
            secs: secs.toString().padStart(2, '0')
        };
    };

    const { mins, secs } = formatTime(timeLeft);

    // Render text with highlighting
    const renderHighlightedText = () => {
        return TARGET_TEXT.split('').map((char, index) => {
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
        <div className="bg-background-light dark:bg-background-dark text-[#0e1a13] dark:text-white transition-colors duration-200 min-h-screen font-display relative overflow-hidden">
            {/* Start Test Overlay */}
            {!started && !isFinished && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1a2e21] p-10 rounded-xl shadow-2xl max-w-md w-full text-center border border-admin-primary/20">
                        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-admin-primary/10 text-admin-primary">
                            <span className="material-symbols-outlined text-4xl">keyboard</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Ready to start?</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">This is a 60-second standardized test. Once you click "Begin", the timer will start immediately.</p>
                        <button
                            onClick={startTest}
                            className="w-full bg-admin-primary hover:bg-admin-primary/90 text-[#0e1a13] font-bold py-4 rounded-lg text-lg transition-all transform hover:scale-[1.02]"
                        >
                            Begin Typing Test
                        </button>
                        <p className="mt-4 text-xs text-gray-500 uppercase tracking-widest">Standardized Trial 1 of 2</p>
                    </div>
                </div>
            )}

            {/* Finished Overlay */}
            {isFinished && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/90 backdrop-blur-md">
                    <div className="bg-white dark:bg-[#1a2e21] p-10 rounded-xl shadow-2xl max-w-md w-full text-center border border-admin-primary/20 animate-in fade-in zoom-in duration-300">
                        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                            <span className="material-symbols-outlined text-4xl">flag</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Test Complete!</h2>
                        <div className="grid grid-cols-2 gap-4 my-8">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                                <p className="text-sm text-gray-500">WPM</p>
                                <p className="text-3xl font-bold text-admin-primary">{wpm}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                                <p className="text-sm text-gray-500">Accuracy</p>
                                <p className="text-3xl font-bold text-admin-primary">{accuracy}%</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/results"
                                state={{ wpm, accuracy }} // Pass state to results page
                                className="w-full bg-admin-primary hover:bg-admin-primary/90 text-[#0e1a13] font-bold py-4 rounded-lg text-lg transition-all transform hover:scale-[1.02]"
                            >
                                View Detailed Results
                            </Link>
                            <button
                                onClick={startTest}
                                className="w-full bg-transparent border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative flex min-h-screen flex-col">
                {/* TopNavBar Component */}
                <header className="flex items-center justify-between border-b border-solid border-[#e8f2ec] dark:border-[#2a3d31] px-10 py-3 bg-white dark:bg-[#1a2e21]">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="size-8 text-admin-primary">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                                <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </Link>
                        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">Typespire</h2>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                        <span className="text-sm font-medium text-gray-500">Academic Portal</span>
                    </div>
                    <div className="flex flex-1 justify-end items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm font-bold">Alex Rivera</p>
                            <p className="text-[10px] uppercase text-gray-400">Student ID: 48291</p>
                        </div>
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-admin-primary"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWxsMfecaynYAAwK2wZkCmOOgclRjfPh1T5ax-p80mI1dq_Z-5rLfqhHcvrhuzRr-N8uIW7FkMHMIuyz_P_UxMcdxoTzixLkEE3ihPUoi1AWH64yTX1_PWac71SnRCUL3L_7srL3HYYmn-GCk_PPKFPEsGB6F4CyEMuqEDGbxDv6w7DrsVyRDlgX707nA9vgGPQMmtdvr08Wjgv0WDcUoGuBFcX_J5FMgBmz77Y8__3JownNqtPJEecAPq1W3PMqboY1kxEnOh2Xbh')" }}
                        ></div>
                    </div>
                </header>

                <main className="flex-1 max-w-5xl mx-auto w-full px-10 py-8">
                    {/* Header Section with Timer */}
                    <div className="flex justify-between items-end mb-10">
                        <div className="flex flex-col">
                            <span className="bg-admin-primary/20 text-admin-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 w-fit">In Progress</span>
                            {/* SectionHeader */}
                            <h2 className="text-3xl font-bold leading-tight tracking-tight">Standardized Trial 1 of 2</h2>
                        </div>
                        {/* Timer Component Integrated */}
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-white dark:bg-[#1a2e21] shadow-sm border border-[#d1e6d9] dark:border-[#2a3d31]">
                                    <p className="text-3xl font-bold leading-tight tracking-[-0.015em]">{mins}</p>
                                </div>
                                <p className="text-xs font-medium text-gray-500 mt-2">MIN</p>
                            </div>
                            <div className="flex items-center text-2xl font-bold pb-6">:</div>
                            <div className="flex flex-col items-center">
                                <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-white dark:bg-[#1a2e21] shadow-sm border border-[#d1e6d9] dark:border-[#2a3d31]">
                                    <p className="text-3xl font-bold leading-tight tracking-[-0.015em]">{secs}</p>
                                </div>
                                <p className="text-xs font-medium text-gray-500 mt-2">SEC</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Component Integrated (Floating HUD style) */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-4 rounded-xl p-6 bg-white dark:bg-[#1a2e21] shadow-sm border border-[#d1e6d9] dark:border-[#2a3d31]">
                            <div className="p-3 bg-admin-primary/10 rounded-lg text-admin-primary">
                                <span className="material-symbols-outlined">speed</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Current WPM</p>
                                <p className="text-3xl font-bold leading-tight">{wpm}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-xl p-6 bg-white dark:bg-[#1a2e21] shadow-sm border border-[#d1e6d9] dark:border-[#2a3d31]">
                            <div className="p-3 bg-admin-primary/10 rounded-lg text-admin-primary">
                                <span className="material-symbols-outlined">verified</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Accuracy %</p>
                                <p className="text-3xl font-bold leading-tight text-admin-primary">{accuracy}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Typing Area */}
                    <div className="bg-white dark:bg-[#1a2e21] rounded-2xl p-10 shadow-sm border border-[#d1e6d9] dark:border-[#2a3d31] relative">
                        {/* Overlay Text (The Target) */}
                        <div className="absolute top-10 left-10 right-10 bottom-10 pointer-events-none select-none">
                            <h3 className="text-2xl font-display leading-relaxed text-left break-words whitespace-pre-wrap">
                                {renderHighlightedText()}
                            </h3>
                        </div>

                        {/* Invisible Textarea for Input */}
                        <textarea
                            ref={inputRef}
                            value={userInput}
                            onChange={handleInputChange}
                            className="w-full h-full absolute inset-0 opacity-0 cursor-text z-10 resize-none"
                            autoFocus
                            spellCheck="false"
                            disabled={!started || isFinished}
                        ></textarea>

                        {/* Visual Placeholder to maintain height */}
                        <div className="invisible text-2xl font-display leading-relaxed text-left break-words whitespace-pre-wrap">
                            {TARGET_TEXT}
                        </div>
                    </div>

                    {/* Footer Support */}
                    <div className="mt-8 flex justify-between items-center text-gray-400 text-sm">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">keyboard_capslock</span>
                                <span className="uppercase">Caps Lock is OFF</span>
                            </div>
                            <div className="flex items-center gap-2 text-admin-primary">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                <span>Keyboard Connected</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="hover:text-admin-primary transition-colors">Accessibility Options</button>
                            <span>|</span>
                            <button className="hover:text-admin-primary transition-colors">Support</button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Background Decorative Element */}
            <div className="fixed top-0 right-0 -z-10 opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2">
                <div className="w-[800px] h-[800px] rounded-full bg-admin-primary blur-[120px]"></div>
            </div>
        </div>
    );
};

export default TypingTest;
