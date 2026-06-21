"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import api from "@/lib/api";
import { DisciplineType, SeverityLevel } from "@/data/discipline";

type Student = {
    id: string;
    name: string;
    studentId: string;
    grade: string;
    avatarUrl?: string;
};

interface DisciplineKioskProps {
    onClose: () => void;
    onSuccess: () => void;
}

const QUICK_ACTIONS = [
    { label: "Late Arrival", points: 5, type: 'Sanction' as DisciplineType, severity: 'Low' as SeverityLevel, description: "Arrived late to school" },
    { label: "Uniform Violation", points: 2, type: 'Sanction' as DisciplineType, severity: 'Low' as SeverityLevel, description: "Improper uniform" },
    { label: "No Homework", points: 2, type: 'Sanction' as DisciplineType, severity: 'Low' as SeverityLevel, description: "Homework not submitted" },
    { label: "Volunteering", points: 5, type: 'Merit' as DisciplineType, description: "Volunteered for school activity" },
    { label: "Good Conduct", points: 2, type: 'Merit' as DisciplineType, description: "Exemplary behavior" },
];

export default function DisciplineKiosk({ onClose, onSuccess }: DisciplineKioskProps) {
    const [scannedUid, setScannedUid] = useState("");
    const [lastKeystroke, setLastKeystroke] = useState(0);
    const [student, setStudent] = useState<Student | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Keep focus on input
    const keepFocus = () => inputRef.current?.focus();

    const fetchStudent = async (uid: string) => {
        setStatus('loading');
        try {
            // Reusing the library endpoint as it's a generic student-by-card lookup
            const res = await api.get(`/library/students/card/${uid}`);
            setStudent(res.data);
            setStatus('success');
            setMessage("Student Verified");
        } catch {
            setStudent(null);
            setStatus('error');
            setMessage("Card not recognized or student not found.");
        }
    };

    // Focus trap for scanner
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const now = Date.now();

            // Scanner logic: rapid keystrokes usually indicate a scanner
            if (now - lastKeystroke > 100) {
                setScannedUid(""); // Reset if too slow (manual typing assumed)
            }
            setLastKeystroke(now);

            if (e.key === "Enter") {
                if (scannedUid) {
                    fetchStudent(scannedUid);
                    setScannedUid("");
                }
            } else {
                if (e.key.length === 1) {
                    setScannedUid(prev => prev + e.key);
                }
            }
        };

        window.addEventListener("keypress", handleKeyDown as EventListener);
        inputRef.current?.focus();

        return () => window.removeEventListener("keypress", handleKeyDown as EventListener);
    }, [scannedUid, lastKeystroke]);

    const handleScanInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const uid = e.currentTarget.value;
            fetchStudent(uid);
            e.currentTarget.value = '';
        }
    };

    const handleQuickAction = async (action: typeof QUICK_ACTIONS[0]) => {
        if (!student) return;
        setStatus('loading');
        try {
            await api.post('/discipline', {
                studentId: student.id,
                schoolId: 'default-school-id', // This should ideall come from context/props, but for Kiosk often implicit
                type: action.type,
                category: action.label,
                description: action.description,
                date: new Date().toISOString().split('T')[0],
                points: action.points,
                severity: action.severity || undefined,
                status: 'Pending',
                reportedBy: 'Kiosk System'
            });
            setStatus('success');
            setMessage(`${action.type === 'Sanction' ? 'Deducted' : 'Awarded'} ${action.points} points: ${action.label}`);
            onSuccess(); // Triggers refresh in parent

            // Auto-reset for next student
            setTimeout(() => {
                setStudent(null);
                setStatus('idle');
                setMessage("");
                inputRef.current?.focus();
            }, 2500);
        } catch {
            setStatus('error');
            setMessage("Failed to save record.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0f172a] text-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
            {/* Hidden Input for Scanner */}
            <input
                ref={inputRef}
                className="opacity-0 absolute"
                onBlur={keepFocus}
                onKeyDown={handleScanInput}
                autoFocus
            />

            <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-white">
                <span className="material-symbols-outlined !text-4xl">close</span>
            </button>

            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Side: Status / Instructions */}
                <div className="space-y-8 text-center md:text-left">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-red-500 uppercase mb-2">Discipline Kiosk</h2>
                        <h1 className="text-5xl font-black tracking-tight mb-4">Tap for Conduct</h1>
                        <p className="text-gray-400 text-lg">Scan ID card to log incidents or merits.</p>
                    </div>

                    <div className={`p-6 rounded-2xl border-2 transition-all ${status === 'idle' ? 'border-gray-700 bg-white/5' :
                        status === 'loading' ? 'border-primary/50 bg-primary/10' :
                            status === 'success' ? 'border-green-500/50 bg-green-500/10' :
                                'border-red-500/50 bg-red-500/10'
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className={`size-12 rounded-full flex items-center justify-center ${status === 'idle' ? 'bg-gray-700' :
                                status === 'loading' ? 'bg-primary animate-pulse' :
                                    status === 'success' ? 'bg-green-500' :
                                        'bg-red-500'
                                }`}>
                                <span className="material-symbols-outlined">
                                    {status === 'idle' ? 'contactless' :
                                        status === 'loading' ? 'hourglass_top' :
                                            status === 'success' ? 'check' :
                                                'priority_high'}
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-lg">
                                    {status === 'idle' ? 'Ready to Scan' :
                                        status === 'loading' ? 'Processing...' :
                                            status === 'success' ? 'Success' :
                                                'Error'}
                                </p>
                                {message && <p className="text-sm opacity-80">{message}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Student Profile & Action */}
                <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-xl min-h-[400px] flex flex-col justify-center">
                    {student ? (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center gap-6">
                                <div className="size-20 rounded-full bg-gray-700 overflow-hidden ring-4 ring-white/10 relative">
                                    {student.avatarUrl ? (
                                        <Image
                                            src={student.avatarUrl}
                                            alt={student.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-primary">
                                            {student.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{student.name}</h2>
                                    <p className="text-gray-400 text-lg">{student.grade} • {student.studentId}</p>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-3">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sanctions</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {QUICK_ACTIONS.filter(a => a.type === 'Sanction').map(action => (
                                        <button
                                            key={action.label}
                                            onClick={() => handleQuickAction(action)}
                                            disabled={status === 'loading'}
                                            className="p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-left transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            <div className="font-bold text-red-400 group-hover:text-red-300">{action.label}</div>
                                            <div className="text-xs text-red-500/60 font-mono">-{action.points} pts</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Merits</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {QUICK_ACTIONS.filter(a => a.type === 'Merit').map(action => (
                                        <button
                                            key={action.label}
                                            onClick={() => handleQuickAction(action)}
                                            disabled={status === 'loading'}
                                            className="p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-left transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            <div className="font-bold text-green-400 group-hover:text-green-300">{action.label}</div>
                                            <div className="text-xs text-green-500/60 font-mono">+{action.points} pts</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 space-y-4">
                            <span className="material-symbols-outlined !text-6xl opacity-20">badge</span>
                            <p className="text-lg font-medium">Waiting for student card...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
