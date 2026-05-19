import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useUserProgress } from '../context/UserProgressContext';
import { useAuth } from '../context/AuthContext';
import { useFacilitator } from '../context/FacilitatorContext';
import { TypingArea } from '../components/TypingTest/TypingArea';
import { TestStats } from '../components/TypingTest/TestStats';
import { PRACTICE_MODULES_CONTENT, DEFAULT_TEXT } from '../data/practiceModules';

const TypingTest: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { saveResult } = useUserProgress();
    const { user } = useAuth();
    const { submitTestResult, assignments } = useFacilitator();

    const moduleId = searchParams.get('moduleId');
    const assignmentId = searchParams.get('assignmentId');

    const testConfig = useMemo(() => {
        // 1. Check if assignment is targeted
        if (assignmentId) {
            const assignment = assignments.find(a => a.id === assignmentId);
            if (assignment) {
                if (assignment.title === 'The Velveteen Rabbit') {
                    return {
                        text: "What is REAL? asked the Rabbit one day, when they were lying side by side near the nursery fender, before the Nana came to tidy the room. Does it mean having things that buzz inside you and a spoon-shaped handle? Real isn't how you are made, said the Skin Horse. It's a thing that happens to you. When a child loves you for a long, long time, not just to play with, but REALLY loves you, then you become Real.",
                        duration: 120,
                        title: 'The Velveteen Rabbit'
                    };
                } else if (assignment.title === 'The Scale of the Universe') {
                    return {
                        text: "The universe is vast beyond comprehension. To understand its scale, we must first look at our own solar system as a mere speck of dust in the Milky Way galaxy. There are hundreds of billions of galaxies in the observable universe, each hosting trillions of stars and planets. When we look up at the night sky, we are looking back in time, seeing light that has traveled for billions of years to reach our eyes.",
                        duration: 180,
                        title: 'The Scale of the Universe'
                    };
                } else if (assignment.title === 'Introduction to Python') {
                    return {
                        text: "def calculate_area(radius): return 3.14159 * radius ** 2. This function demonstrates basic syntax in Python. It includes a function definition, parameter passing, mathematical exponentiation using the double asterisk operator, and returning a value. Python is widely celebrated for its clean readability and simple indentations, making it an excellent first language for computer science.",
                        duration: 300,
                        title: 'Introduction to Python'
                    };
                }
            }
        }

        // 2. Standard practice content lookup
        if (moduleId && PRACTICE_MODULES_CONTENT[moduleId]) {
            return {
                text: PRACTICE_MODULES_CONTENT[moduleId].text,
                duration: PRACTICE_MODULES_CONTENT[moduleId].duration,
                title: PRACTICE_MODULES_CONTENT[moduleId].title
            };
        }

        return {
            text: DEFAULT_TEXT,
            duration: 60,
            title: 'Standardized Trial 1'
        };
    }, [moduleId, assignmentId, assignments]);

    const {
        started,
        timeLeft,
        userInput,
        wpm,
        accuracy,
        isFinished,
        strugglingKeys,
        startTest,
        handleInputChange
    } = useTypingEngine({
        targetText: testConfig.text,
        duration: testConfig.duration,
        onFinish: (results) => {
            saveResult({
                testName: testConfig.title,
                wpm: results.wpm,
                accuracy: results.accuracy,
                duration: testConfig.duration,
                strugglingKeys: results.strugglingKeys,
            });
            if (user?.id) {
                submitTestResult(user.id, results.wpm, results.accuracy);
            }
        }
    });

    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const handleStart = () => {
        setIsCountingDown(true);
        setCountdown(3);

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsCountingDown(false);
                    startTest(); // Start the actual test logic
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

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

    return (
        <div className="text-[#0e1a13] dark:text-white transition-colors duration-200 min-h-screen font-sans relative overflow-hidden">
            {/* Solid Background Layer */}
            <div className="fixed inset-0 -z-30 bg-background-light dark:bg-background-dark transition-colors duration-200"></div>
            {/* Start Test Overlay */}
            {!started && !isFinished && !isCountingDown && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 backdrop-blur-sm">
                    <div className="bg-white/90 dark:bg-[#1a2e21]/90 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-white/20 dark:border-white/10 relative overflow-hidden ring-1 ring-black/5">
                        {/* Doodle Background for Modal */}
                        <div className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: "url('/assets/login_doodle_bg.png')", backgroundSize: '300px' }}></div>

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-admin-primary to-transparent opacity-50 z-10"></div>

                        <div className="relative z-10 mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-admin-primary/5 text-admin-primary ring-1 ring-admin-primary/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]">
                            <span className="material-symbols-outlined text-5xl">keyboard</span>
                        </div>
                        <h2 className="relative z-10 text-4xl font-bold mb-3 tracking-tight text-gray-900 dark:text-white font-heading">Ready to start?</h2>
                        <p className="relative z-10 text-gray-500 dark:text-gray-400 mb-10 text-lg leading-relaxed">
                            This is a <span className="font-bold text-gray-900 dark:text-white">{testConfig.duration}-second</span> {moduleId ? 'test' : 'practice session'}.
                            <br />Focus on accuracy and rhythm.
                        </p>

                        <button
                            onClick={handleStart}
                            className="relative z-10 w-full bg-admin-primary hover:bg-admin-primary/90 text-white font-bold py-5 rounded-xl text-xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.6)] hover:-translate-y-1 mb-6 font-heading"
                        >
                            {moduleId ? 'Start Test' : 'Start Practice'}
                        </button>

                        <button
                            onClick={() => window.history.back()}
                            className="relative z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-bold tracking-widest uppercase transition-colors py-2 font-heading"
                        >
                            Not ready? Go back
                        </button>

                        <div className="relative z-10 mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium font-heading">{testConfig.title}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Countdown Overlay */}
            {isCountingDown && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/90 backdrop-blur-md">
                    <div className="text-9xl font-bold text-admin-primary animate-bounce font-heading">
                        {countdown}
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
                        <h2 className="text-3xl font-bold mb-2 font-heading">Test Complete!</h2>

                        <div className="grid grid-cols-2 gap-4 my-6">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                                <p className="text-sm text-gray-500">WPM</p>
                                <p className="text-3xl font-bold text-admin-primary font-mono">{wpm}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                                <p className="text-sm text-gray-500">Accuracy</p>
                                <p className="text-3xl font-bold text-admin-primary font-mono">{accuracy}%</p>
                            </div>
                        </div>

                        {/* Struggling Keys Section */}
                        {Object.keys(strugglingKeys).length > 0 && (
                            <div className="mb-8">
                                <p className="text-sm text-gray-500 mb-3">Struggling Keys</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {Object.entries(strugglingKeys)
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 5)
                                        .map(([key, count]) => (
                                            <div key={key} className="flex flex-col items-center bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 px-3 py-2 rounded-lg">
                                                <span className="text-lg font-bold text-red-600 dark:text-red-400 font-mono">{key === ' ' ? 'Space' : key}</span>
                                                <span className="text-xs text-red-400 dark:text-red-500 font-medium">{count} miss{count > 1 ? 'es' : ''}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <Link
                                to="/results"
                                state={{ wpm, accuracy, strugglingKeys }}
                                className="w-full bg-admin-primary hover:bg-admin-primary/90 text-[#0e1a13] font-bold py-4 rounded-lg text-lg transition-all transform hover:scale-[1.02] font-heading flex items-center justify-center"
                            >
                                View Detailed Results
                            </Link>
                            <button
                                onClick={startTest}
                                className="w-full bg-transparent border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all font-heading"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative flex min-h-screen flex-col">
                <header className="flex items-center justify-between border-b border-solid border-slate-800 px-10 py-3 bg-[#111422] border-b-[#323b67] text-white shadow-md">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-admin-primary rounded-lg p-2 flex items-center justify-center group-hover:bg-admin-primary/90 transition-colors shadow-lg shadow-admin-primary/20">
                                <span className="material-symbols-outlined text-navy-blue text-2xl">keyboard</span>
                            </div>
                        </Link>
                        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-white font-heading">Typespire</h2>
                        <div className="h-6 w-px bg-slate-700 mx-2"></div>
                        <span className="text-sm font-medium text-slate-400">Academic Portal</span>
                    </div>
                    <div className="flex flex-1 justify-end items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">
                                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Student'}
                            </p>
                            <p className="text-[10px] uppercase text-slate-400">
                                Username: {user?.username || 'Unknown'}
                            </p>
                        </div>
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-admin-primary flex items-center justify-center font-bold text-sm bg-primary/20 text-primary uppercase"
                        >
                            {user?.firstName?.[0] || 'S'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-12 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-12">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${started ? 'bg-admin-primary animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 font-heading">
                                    {started ? 'In Progress' : 'Ready to Start'}
                                </span>
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white font-heading">{testConfig.title}</h2>
                        </div>

                        <div className="flex items-center gap-10">
                            <div className="flex items-baseline gap-1 font-variant-numeric tabular-nums font-mono">
                                <span className="text-6xl font-light tracking-tighter text-gray-900 dark:text-white">{mins}</span>
                                <span className="text-2xl text-gray-300 dark:text-gray-600 font-light">:</span>
                                <span className="text-6xl font-light tracking-tighter text-gray-900 dark:text-white">{secs}</span>
                            </div>

                            <button
                                onClick={startTest}
                                className="group p-4 rounded-full bg-gray-50 dark:bg-white/5 hover:bg-admin-primary hover:text-[#111422] text-gray-400 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-admin-primary/30"
                                title="Restart Test"
                            >
                                <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-500">refresh</span>
                            </button>
                        </div>
                    </div>

                    <TestStats wpm={wpm} accuracy={accuracy} />

                    <div className="w-full mb-8">
                        <TypingArea
                            targetText={testConfig.text}
                            userInput={userInput}
                            started={started}
                            isFinished={isFinished}
                            onInputChange={handleInputChange}
                        />
                    </div>

                    <div className="w-full flex justify-between items-center text-gray-400 dark:text-gray-500 text-sm mt-auto px-4">
                        <div className="flex gap-8">
                            <div className="flex items-center gap-2 transition-colors hover:text-gray-600 dark:hover:text-gray-300">
                                <span className="material-symbols-outlined text-lg">keyboard_capslock</span>
                                <span className="uppercase tracking-wider text-xs font-bold font-heading">Caps Lock is OFF</span>
                            </div>
                            <div className="flex items-center gap-2 text-admin-primary">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                <span className="tracking-wider text-xs font-bold font-heading">System Ready</span>
                            </div>
                        </div>
                        <div className="flex gap-6 text-xs font-bold tracking-widest uppercase font-heading">
                            <button className="hover:text-admin-primary transition-colors">Accessibility</button>
                            <button className="hover:text-admin-primary transition-colors">Shortcuts</button>
                        </div>
                    </div>
                </main>
            </div>

            <div className="fixed top-0 right-0 -z-10 opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2">
                <div className="w-[800px] h-[800px] rounded-full bg-admin-primary blur-[120px]"></div>
            </div>

            <div className="fixed inset-0 -z-20 pointer-events-none opacity-[0.1] dark:opacity-[0.15]" style={{ backgroundImage: "url('/assets/login_doodle_bg.png')", backgroundSize: '400px' }}></div>
        </div>
    );
};

export default TypingTest;
