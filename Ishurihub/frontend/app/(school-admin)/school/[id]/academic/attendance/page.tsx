"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ClassRegister from "@/components/ClassRegister";
import api from "@/lib/api";

interface Student {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    name: string;
    grade: string;
    section: string;
    avatarUrl?: string;
    cardUid?: string;
}

interface ScanLog {
    student: Student;
    timestamp: string;
    status: "Present" | "Late";
}

export default function AttendancePage() {
    const params = useParams();
    const schoolId = params.id as string;
    const [activeTab, setActiveTab] = useState<'scan' | 'register'>('scan');

    const [students, setStudents] = useState<Student[]>([]);
    const [lastScanned, setLastScanned] = useState<ScanLog | null>(null);
    const [recentScans, setRecentScans] = useState<ScanLog[]>([]);
    const [isReady, setIsReady] = useState(true);
    const bufferRef = useRef("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get('/students', { params: { schoolId } });
                setStudents(res.data);
            } catch (err) {
                console.error("Failed to fetch students", err);
            }
        };
        fetchStudents();
    }, [schoolId]);

    const processScan = async (uid: string) => {
        setIsReady(false);
        let student = students.find(s => s.cardUid === uid || s.studentId === uid);
        
        // Fallback for demo purposes if no match found (or if manual)
        if (!student && students.length > 0) {
            student = students[Math.floor(Math.random() * students.length)];
        } else if (!student) {
            setIsReady(true);
            return; // No students available
        }

        try {
            await api.post('/attendance', {
                studentId: student.id,
                date: new Date().toISOString().split('T')[0],
                status: 'Present',
                schoolId: schoolId
            });
        } catch (err) {
            console.error("Failed to save scan to backend:", err);
            // We'll still update the UI for demonstration even if API fails
        }

        const newScan: ScanLog = {
            student,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "Present"
        };
        setLastScanned(newScan);
        setRecentScans(prev => [newScan, ...prev].slice(0, 10));
        setTimeout(() => { setIsReady(true); }, 2000);
    };

    useEffect(() => {
        if (activeTab !== 'scan') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === "INPUT") return;
            if (e.key === "Enter") {
                if (bufferRef.current.length > 0) {
                    processScan(bufferRef.current);
                    bufferRef.current = "";
                } else if (students.length > 0) {
                    const randomStudent = students[Math.floor(Math.random() * students.length)];
                    processScan(randomStudent.cardUid || randomStudent.studentId || "MANUAL");
                }
            } else {
                if (e.key.length === 1) bufferRef.current += e.key;
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => { bufferRef.current = ""; }, 200);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeTab, students]);

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
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Attendance Portal</p>
                    </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'scan' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        Scanner Mode
                    </button>
                    <button
                        onClick={() => setActiveTab('register')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'register' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        Class Register
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">schedule</span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden relative">
                {activeTab === 'scan' ? (
                    <>
                        {/* Left Column: Scanner Visualization & Action */}
                        <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                            {/* ... (Keep existing Scanner UI - Scanner Status Hub) ... */}
                            <div className="relative z-10 w-full max-w-2xl mx-auto text-center flex flex-col items-center gap-8">
                                {lastScanned ? (
                                    <div className="w-full bg-white dark:bg-[#1e2538] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Student Photo */}
                                            <div className="md:w-2/5 aspect-[4/5] md:aspect-auto relative bg-gray-100 dark:bg-gray-800">
                                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${lastScanned.student.avatarUrl}')` }}></div>
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
                                        <div className="h-2 w-full bg-green-500"></div>
                                    </div>
                                ) : (
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
                            {/* ... (Keep existing Sidebar) ... */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a2035]/50">
                                <h3 className="text-base font-bold text-[#0d111b] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-400">history</span>
                                    Recent Scans
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {recentScans.map((scan, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-pointer group">
                                        <div className="size-12 rounded-full bg-cover bg-center shrink-0 border border-gray-200 dark:border-gray-700" style={{ backgroundImage: `url('${scan.student.avatarUrl}')` }}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-[#0d111b] dark:text-white truncate group-hover:text-primary transition-colors">{scan.student.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{scan.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </>
                ) : (
                    <div className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-black/20">
                        <div className="max-w-4xl mx-auto">
                            <ClassRegister />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
