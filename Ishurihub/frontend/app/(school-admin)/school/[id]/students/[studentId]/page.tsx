"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";

// --- Types ---
interface Student {
    id: string;
    name: string;
    studentId: string;
    grade: string;
    level: string;
    section?: string;
    combination?: string;
    status: string;
    avatarUrl?: string;
    cardUid?: string;
    dob?: string;
    gender?: string;
    fatherName?: string;
    motherName?: string;
    email?: string;
    primaryPhone?: string;
    emergencyPhone?: string;
    disciplinePoints?: number;
}

interface AttendanceStats {
    total: number;
    present: number;
    absent: number;
    late: number;
    attendanceRate: number;
}

interface AttendanceRecord {
    id: string;
    date: string;
    status: string;
}

interface LibraryData {
    active: Array<{
        id: string;
        book: { title: string; author: string };
        borrowedAt: string;
        dueDate: string;
    }>;
    history: Array<{
        id: string;
        book: { title: string };
        borrowedAt: string;
        returnedAt?: string;
        status: string;
    }>;
}

interface DisciplineData {
    points: number;
    records: Array<{
        id: string;
        reason: string;
        points: number;
        date: string;
        type: string;
    }>;
}

export default function StudentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const schoolId = params.id as string;
    const studentId = params.studentId as string;

    const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'library' | 'discipline'>('overview');
    const [student, setStudent] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Module Data
    const [attendanceData, setAttendanceData] = useState<{ stats: AttendanceStats; history: AttendanceRecord[] } | null>(null);
    const [libraryData, setLibraryData] = useState<LibraryData | null>(null);
    const [disciplineData, setDisciplineData] = useState<DisciplineData | null>(null);

    // Fetch Student Core Data
    useEffect(() => {
        api.get(`/students/${studentId}`).then(res => {
            setStudent(res.data);
            setIsLoading(false);
        }).catch(err => {
            console.error(err);
            setIsLoading(false); // Handle 404 cleanly in real app
        });
    }, [studentId]);

    // Fetch Tab Data on Change
    useEffect(() => {
        if (!studentId) return;

        if (activeTab === 'attendance' && !attendanceData) {
            api.get(`/attendance/student/${studentId}`).then(res => setAttendanceData(res.data));
        }
        if (activeTab === 'library' && !libraryData) {
            api.get(`/library/student/${studentId}`).then(res => setLibraryData(res.data));
        }
        if (activeTab === 'discipline' && !disciplineData) {
            api.get(`/discipline/student/${studentId}`).then(res => setDisciplineData(res.data));
        }
    }, [activeTab, studentId]);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!student) return <div className="p-8 text-center text-gray-500">Student not found</div>;

    return (
        <div className="flex flex-1 flex-col p-8 max-w-[1200px] mx-auto w-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href={`/school/${schoolId}/students`} className="text-gray-500 hover:text-primary">Students</Link>
                <span className="text-gray-400">/</span>
                <span className="font-bold text-gray-800 dark:text-white">{student.name}</span>
            </div>

            {/* Header / Profile Card */}
            <div className="bg-white dark:bg-[#1e2538] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="size-32 rounded-2xl overflow-hidden bg-gray-100 relative shrink-0">
                    {student.avatarUrl ? (
                        <Image src={student.avatarUrl} alt={student.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-bold">
                            {student.name.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{student.name}</h1>
                            <div className="flex flex-wrap gap-2 text-sm">
                                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold dark:bg-blue-900/30 dark:text-blue-400">
                                    {student.studentId}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold dark:bg-gray-700 dark:text-gray-300">
                                    {student.level} - {student.grade} {student.section ? `(${student.section})` : ''}
                                </span>
                                {student.cardUid && (
                                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold dark:bg-purple-900/30 dark:text-purple-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined !text-sm">contactless</span> {student.cardUid}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-sm text-gray-600 dark:text-gray-400">
                        {student.email && <div className="flex items-center gap-2"><span className="material-symbols-outlined !text-lg">mail</span> {student.email}</div>}
                        {student.primaryPhone && <div className="flex items-center gap-2"><span className="material-symbols-outlined !text-lg">call</span> {student.primaryPhone}</div>}
                        {student.dob && <div className="flex items-center gap-2"><span className="material-symbols-outlined !text-lg">cake</span> {new Date(student.dob).toLocaleDateString()}</div>}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
                {['overview', 'attendance', 'library', 'discipline'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as 'overview' | 'attendance' | 'library' | 'discipline')}
                        className={`px-8 py-3 text-sm font-bold capitalize border-b-2 transition-colors ${activeTab === tab
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Parent Info */}
                        <div className="bg-white dark:bg-[#1e2538] p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">family_restroom</span>
                                Guardian Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Father</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-200">{student.fatherName || 'Not Recorded'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Mother</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-200">{student.motherName || 'Not Recorded'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Emergency Contact</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-200">{student.emergencyPhone || 'Not Recorded'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div className="bg-white dark:bg-[#1e2538] p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">school</span>
                                Academic Details
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Level</p>
                                        <p className="font-medium">{student.level}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Year</p>
                                        <p className="font-medium">{student.grade}</p>
                                    </div>
                                </div>
                                {student.level === 'A-Level' && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Combination</p>
                                        <p className="font-medium text-primary bg-primary/10 inline-block px-2 py-1 rounded mt-1">{student.combination}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ATTENDANCE TAB */}
                {activeTab === 'attendance' && attendanceData && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Attendance Rate" value={`${attendanceData.stats.attendanceRate.toFixed(1)}%`} icon="percent" color="bg-blue-500" />
                            <StatCard label="Days Present" value={attendanceData.stats.present} icon="check_circle" color="bg-green-500" />
                            <StatCard label="Days Absent" value={attendanceData.stats.absent} icon="cancel" color="bg-red-500" />
                            <StatCard label="Times Late" value={attendanceData.stats.late} icon="schedule" color="bg-orange-500" />
                        </div>

                        <div className="bg-white dark:bg-[#1e2538] rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-700 font-bold">Recent History</div>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-100 dark:border-gray-700">
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.history.map(record => (
                                        <tr key={record.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="px-6 py-3 font-medium">{new Date(record.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                                    record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {attendanceData.history.length === 0 && (
                                        <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-400">No records found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* LIBRARY TAB */}
                {activeTab === 'library' && libraryData && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#1e2538] rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-primary/10 border-b border-primary/20 font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined">menu_book</span>
                                Active Loans ({libraryData.active.length})
                            </div>
                            {libraryData.active.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-white/10">
                                    {libraryData.active.map(loan => (
                                        <div key={loan.id} className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-lg">{loan.book.title}</p>
                                                <p className="text-sm text-gray-500">Borrowed: {new Date(loan.borrowedAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold uppercase text-gray-400">Due Date</p>
                                                <p className="font-bold text-red-500">{new Date(loan.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-400">No active book loans.</div>
                            )}
                        </div>

                        <div className="bg-white dark:bg-[#1e2538] rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-700 font-bold">Borrowing History</div>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-100 dark:border-gray-700">
                                        <th className="px-6 py-3">Book Title</th>
                                        <th className="px-6 py-3">Returned On</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {libraryData.history.map(record => (
                                        <tr key={record.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="px-6 py-3 font-medium">{record.book.title}</td>
                                            <td className="px-6 py-3">{record.returnedAt ? new Date(record.returnedAt).toLocaleDateString() : '-'}</td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${record.status === 'Returned' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* DISCIPLINE TAB */}
                {activeTab === 'discipline' && disciplineData && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl p-8 text-white flex justify-between items-center">
                            <div>
                                <p className="font-bold opacity-80 uppercase tracking-widest text-sm mb-1">Conduct Score</p>
                                <h2 className="text-5xl font-black tracking-tighter">{disciplineData.points} <span className="text-2xl opacity-50 font-normal">/ 100</span></h2>
                            </div>
                            <div className="size-16 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="material-symbols-outlined !text-4xl">shield</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1e2538] rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-700 font-bold">Incident Log</div>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-100 dark:border-gray-700">
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Incident</th>
                                        <th className="px-6 py-3 text-right">Points Deduction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {disciplineData.records.map(record => (
                                        <tr key={record.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="px-6 py-3 font-medium">{new Date(record.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-3">
                                                <p className="font-bold">{record.type}</p>
                                                <p className="text-gray-500 text-xs">{record.reason}</p>
                                            </td>
                                            <td className="px-6 py-3 text-right font-bold text-red-500">
                                                -{record.points}
                                            </td>
                                        </tr>
                                    ))}
                                    {disciplineData.records.length === 0 && (
                                        <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No disciplinary incidents recorded. Good job! 🌟</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-[#1e2538] p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className={`size-12 rounded-full flex items-center justify-center text-white ${color}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div>
                <p className="text-xs text-gray-400 font-bold uppercase">{label}</p>
                <p className="text-xl font-black">{value}</p>
            </div>
        </div>
    );
}
