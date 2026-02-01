"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import api from "@/lib/api";

type Student = {
    id: string;
    name: string;
    studentId: string;
    grade: string;
    avatarUrl?: string;
};

type Book = {
    id: string;
    title: string;
    author: string;
    available: number;
};

interface LibraryKioskProps {
    onClose: () => void;
    onSuccess: () => void;
    schoolId: string;
}

export default function LibraryKiosk({ onClose, onSuccess, schoolId }: LibraryKioskProps) {
    const [scannedUid, setScannedUid] = useState("");
    const [lastKeystroke, setLastKeystroke] = useState(0);
    const [student, setStudent] = useState<Student | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBookId, setSelectedBookId] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial fetch of books
    useEffect(() => {
        if (schoolId) {
            api.get(`/library/books?schoolId=${schoolId}`).then(res => {
                setBooks(res.data.filter((b: Book) => b.available > 0));
            });
        }
    }, [schoolId]);

    // Keep focus on input
    const keepFocus = () => inputRef.current?.focus();

    const fetchStudent = async (uid: string) => {
        setStatus('loading');
        try {
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

        // Attach to window to catch global scans
        window.addEventListener("keypress", handleKeyDown as unknown as EventListener);
        inputRef.current?.focus();

        return () => window.removeEventListener("keypress", handleKeyDown as unknown as EventListener);
    }, [scannedUid, lastKeystroke]);

    const handleScanInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const uid = e.currentTarget.value;
            fetchStudent(uid);
            e.currentTarget.value = '';
        }
    };

    const handleIssueBook = async () => {
        if (!student || !selectedBookId) return;
        setStatus('loading');
        try {
            await api.post('/library/issue', {
                bookId: selectedBookId,
                studentId: student.id,
                schoolId,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 7 days
            });
            setStatus('success');
            setMessage(`Book issued to ${student.name}!`);
            onSuccess();

            setTimeout(() => {
                setStudent(null);
                setSelectedBookId("");
                setStatus('idle');
                setMessage("");
                inputRef.current?.focus();
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage("Failed to issue book.");
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

            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Side: Status / Instructions */}
                <div className="space-y-8 text-center md:text-left">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Kiosk Mode</h2>
                        <h1 className="text-5xl font-black tracking-tight mb-4">Tap to Issue</h1>
                        <p className="text-gray-400 text-lg">Scan a student ID card to begin transaction.</p>
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

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-400">Select Book to Issue</label>
                                <select
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-primary"
                                    value={selectedBookId}
                                    onChange={(e) => setSelectedBookId(e.target.value)}
                                >
                                    <option value="">-- Choose Book --</option>
                                    {books.map(b => (
                                        <option key={b.id} value={b.id}>{b.title}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleIssueBook}
                                disabled={!selectedBookId || status === 'loading'}
                                className="w-full py-4 bg-primary hover:bg-primary/90 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">output</span>
                                Confirm Issue
                            </button>
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
