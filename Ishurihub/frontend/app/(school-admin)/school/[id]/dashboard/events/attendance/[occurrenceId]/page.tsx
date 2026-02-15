'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    cardUid: string;
    name?: string;
}

export default function EventAttendancePage({ params }: { params: { schoolId: string; occurrenceId: string } }) {
    const { schoolId, occurrenceId } = params;
    const { token } = useAuth();
    const [scanInput, setScanInput] = useState('');
    const [lastScanned, setLastScanned] = useState<Student | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Keep focus on input for scanning
        inputRef.current?.focus();
    }, []);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scanInput) return;

        setLoading(true);
        setMessage('');

        try {
            // 1. Find student by Card UID
            const studentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/nfc/${scanInput}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!studentRes.ok) {
                throw new Error('Student not found with this card.');
            }

            const student = await studentRes.json();
            setLastScanned(student);

            // 2. Record Attendance
            const attendanceRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/occurrences/${occurrenceId}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    studentId: student.id,
                    status: 'PRESENT'
                })
            });

            if (attendanceRes.ok) {
                setMessage(`✅ Marked ${student.firstName} ${student.lastName} as PRESENT`);
            } else {
                setMessage('❌ Failed to mark attendance');
            }

        } catch (err) {
            const error = err as Error;
            setMessage(`❌ Error: ${error.message || 'Unknown error'}`);
            setLastScanned(null);
        } finally {
            setLoading(false);
            setScanInput(''); // Clear for next scan
            inputRef.current?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] p-6">
            <div className="max-w-2xl mx-auto">
                <Link
                    href={`/school/${schoolId}/dashboard/events`}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors group"
                >
                    <span className="material-symbols-outlined rounded-full p-1 bg-slate-800 group-hover:bg-primary group-hover:text-white transition-colors text-lg">arrow_back</span>
                    Back to Events
                </Link>

                <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-green-400 via-primary to-blue-500"></div>

                    <div className="p-10 text-center">
                        <div className="size-24 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700 shadow-inner relative group">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                            <span className="material-symbols-outlined text-6xl text-primary relative z-10 group-hover:scale-110 transition-transform">nfc</span>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">Scan Attendance</h1>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">Ready to scan. Tap a student ID card or enter the UID manually.</p>

                        <form onSubmit={handleScan} className="relative max-w-md mx-auto mb-8">
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full bg-[#0f172a] border border-slate-600 rounded-xl py-4 pl-6 pr-14 text-white text-lg placeholder-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner"
                                placeholder="Scanning..."
                                value={scanInput}
                                onChange={(e) => setScanInput(e.target.value)}
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-2 bottom-2 aspect-square bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
                            >
                                {loading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined">arrow_forward</span>}
                            </button>
                        </form>

                        <div className="h-24 flex items-center justify-center">
                            {message && (
                                <div className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${message.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    <span className="material-symbols-outlined text-xl">{message.startsWith('✅') ? 'check_circle' : 'error'}</span>
                                    {message.replace(/^[✅❌]\s*/, '')}
                                </div>
                            )}
                        </div>
                    </div>

                    {lastScanned && (
                        <div className="bg-[#0f172a] border-t border-slate-700/50 p-6 animate-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-lg font-bold text-gray-400">
                                    {lastScanned.firstName[0]}{lastScanned.lastName[0]}
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Last Scanned</p>
                                    <p className="text-white font-bold text-lg">{lastScanned.firstName} {lastScanned.lastName}</p>
                                </div>
                                <div className="ml-auto">
                                    <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20 font-mono">
                                        {new Date().toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
