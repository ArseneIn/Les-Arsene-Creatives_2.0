"use client";

import { useState, useEffect, useRef } from "react";
import { mockStudents, Student } from "@/data/students";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface ScanLog {
    student: Student;
    timestamp: string;
    status: "Present" | "Late";
}

export default function AttendancePage() {
    const router = useRouter();
    const params = useParams();
    const schoolId = params.id as string;
    const [lastScanned, setLastScanned] = useState<ScanLog | null>(null);
    const [recentScans, setRecentScans] = useState<ScanLog[]>([]);
    const [isReady, setIsReady] = useState(true);

    // Simulate keyboard input buffer for NFC reader
    const bufferRef = useRef("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const processScan = (uid: string) => {
        setIsReady(false);

        // Find student (or random for demo if UID doesn't match)
        let student = mockStudents.find(s => s.cardUid === uid);

        // Fallback for demo: if UID not found, just pick the first one or random
        if (!student) {
            student = mockStudents[Math.floor(Math.random() * mockStudents.length)];
        }

        const newScan: ScanLog = {
            student,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "Present"
        };

        setLastScanned(newScan);
        setRecentScans(prev => [newScan, ...prev].slice(0, 10));

        // Reset ready state after animation
        setTimeout(() => {
            setIsReady(true);
        }, 2000);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // If user is typing in an input, ignore
            if ((e.target as HTMLElement).tagName === "INPUT") return;

            // If Enter is pressed, process the buffer
            if (e.key === "Enter") {
                if (bufferRef.current.length > 0) {
                    processScan(bufferRef.current);
                    bufferRef.current = "";
                } else {
                    // Simulation: If Enter is pressed without data (or manually triggered for demo),
                    // pick a random student to simulate a scan
                    const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
                    processScan(randomStudent.cardUid || "MANUAL");
                }
            } else {
                // Accumulate characters
                if (e.key.length === 1) {
                    bufferRef.current += e.key;
                }

                // Clear buffer if no input for 100ms (typical for human typing vs fast reader)
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    bufferRef.current = "";
                }, 200);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);



    return (
        <div className="bg-background-light dark:bg-background-dark font-sans h-screen flex flex-col overflow-hidden text-[#0d111b] dark:text-white transition-colors duration-200">
            {/* Top Navigation Bar */}
            <header className="flex-none flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151a2d] px-8 py-4 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href={`/school/${schoolId}/dashboard`} className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined !text-3xl">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight dark:text-white">Kigali International School</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Morning Attendance Portal</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">schedule</span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs text-gray-400 font-medium ml-1">| {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                    <button
                        onClick={() => router.push('/login')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg transition-colors text-sm font-bold"
                    >
                        <span className="material-symbols-outlined !text-xl">logout</span>
                        <span className="truncate">End Session</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Left Column: Scanner Visualization & Action */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                    {/* Dynamic Background decoration */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl dark:bg-primary/10"></div>
                    </div>

                    {/* Scanner Status Hub */}
                    <div className="relative z-10 w-full max-w-2xl mx-auto text-center flex flex-col items-center gap-8">
                        {lastScanned ? (
                            /* Active Scan Card */
                            <div className="w-full bg-white dark:bg-[#1e2538] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300">
                                <div className="flex flex-col md:flex-row">
                                    {/* Student Photo */}
                                    <div className="md:w-2/5 aspect-[4/5] md:aspect-auto relative bg-gray-100 dark:bg-gray-800">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url('${lastScanned.student.avatarUrl}')` }}
                                        ></div>
                                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <span className="inline-block px-2 py-1 rounded bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30">
                                                {lastScanned.student.grade} - {lastScanned.student.section}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Scan Details */}
                                    <div className="md:w-3/5 p-8 flex flex-col justify-center items-start text-left">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                                <span className="material-symbols-outlined !text-xl">check</span>
                                            </span>
                                            <span className="text-green-600 dark:text-green-400 font-bold text-sm tracking-wider uppercase">Verified Present</span>
                                        </div>
                                        <h1 className="text-4xl font-black text-[#0d111b] dark:text-white tracking-tight mb-2">{lastScanned.student.name}</h1>
                                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-6">ID: {lastScanned.student.studentId}</p>
                                        <div className="w-full h-px bg-gray-100 dark:bg-gray-700 mb-6"></div>
                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Time In</p>
                                                <p className="text-xl font-bold text-[#0d111b] dark:text-white">{lastScanned.timestamp}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Status</p>
                                                <p className="text-base font-bold text-green-600 dark:text-green-400">On Time</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Bottom success bar */}
                                <div className="h-2 w-full bg-green-500"></div>
                            </div>
                        ) : (
                            /* Waiting State */
                            <div className="w-full h-64 flex flex-col items-center justify-center bg-white/50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">sensors</span>
                                <p className="text-xl font-bold text-gray-500 dark:text-gray-400">Waiting for Card Scan...</p>
                                <p className="text-sm text-gray-400 mt-2">Tap NFC card or press Enter to simulate</p>
                            </div>
                        )}

                        {/* Ready State Indicator */}
                        {isReady && (
                            <div className="flex flex-col items-center animate-pulse">
                                <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Scanner Ready</p>
                                <div className="h-1.5 w-64 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-1/3 animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Manual Toggle Footer */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                        <button
                            onClick={() => processScan("MANUAL")}
                            className="group flex items-center gap-3 bg-white dark:bg-[#1e2538] hover:bg-gray-50 dark:hover:bg-[#252d42] border border-gray-200 dark:border-gray-700 text-[#0d111b] dark:text-white px-6 py-3 rounded-full shadow-lg transition-all hover:shadow-xl"
                        >
                            <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined !text-lg">keyboard</span>
                            </span>
                            <span className="font-bold text-sm">Simulate Scan (Press Enter)</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Recent Scans History Sidebar */}
                <aside className="w-80 bg-white dark:bg-[#151a2d] border-l border-gray-200 dark:border-gray-800 flex flex-col z-20 shadow-xl lg:flex hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a2035]/50">
                        <h3 className="text-base font-bold text-[#0d111b] dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">history</span>
                            Recent Scans
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {recentScans.map((scan, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-pointer group">
                                <div
                                    className="size-12 rounded-full bg-cover bg-center shrink-0 border border-gray-200 dark:border-gray-700"
                                    style={{ backgroundImage: `url('${scan.student.avatarUrl}')` }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[#0d111b] dark:text-white truncate group-hover:text-primary transition-colors">{scan.student.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{scan.timestamp}</p>
                                </div>
                                <div className="size-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 !text-sm">check</span>
                                </div>
                            </div>
                        ))}
                        {recentScans.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                No scans yet today.
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a2035]/50">
                        <button className="w-full py-2.5 px-4 bg-white dark:bg-[#1e2538] hover:bg-gray-50 dark:hover:bg-[#252d42] text-primary text-sm font-bold rounded-lg border border-gray-200 dark:border-gray-700 transition-colors flex items-center justify-center gap-2">
                            <span>View All History</span>
                            <span className="material-symbols-outlined !text-base">arrow_forward</span>
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
}
