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

        // Simulate nfc search or direct student ID. For simplified flow, let's assume we find student by Card UID first
        try {
            // 1. Find student by Card UID (Reusing existing endpoint if available or just mocking logic here for V1)
            // Ideally: GET /students/nfc/:cardUid
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
        <div className="p-6 max-w-lg mx-auto text-center">
            <Link href={`/school/${schoolId}/dashboard/events`} className="text-gray-400 hover:text-white text-sm mb-8 block text-left">
                ← Back to Events
            </Link>

            <h1 className="text-3xl font-bold text-white mb-6">Scan Event Attendance</h1>

            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
                <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-pulse">
                    nfc
                </span>
                <p className="text-gray-300 mb-6">Tap Student Card to record attendance</p>

                <form onSubmit={handleScan} className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-slate-900 border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Card UID or Student ID..."
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold"
                    >
                        {loading ? '...' : 'GO'}
                    </button>
                </form>

                {message && (
                    <div className={`mt-6 p-4 rounded-lg font-medium ${message.startsWith('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}

                {lastScanned && (
                    <div className="mt-6 border-t border-slate-700 pt-6">
                        <p className="text-sm text-gray-400">Last Scanned:</p>
                        <div className="mt-2 text-white text-lg font-semibold">
                            {lastScanned.firstName} {lastScanned.lastName}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
