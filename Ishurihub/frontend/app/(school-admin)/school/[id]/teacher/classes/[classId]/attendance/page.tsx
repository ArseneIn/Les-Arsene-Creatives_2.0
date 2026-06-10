"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

interface Student {
    id: string;
    name: string;
    studentId: string;
    avatarUrl?: string;
}

interface AttendanceRecord {
    studentId: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    notes?: string;
}

export default function DailyAttendancePage() {
    const params = useParams();
    const router = useRouter();
    const schoolId = params.id as string;
    const classId = params.classId as string;

    const [students, setStudents] = useState<Student[]>([]);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [records, setRecords] = useState<Record<string, AttendanceRecord>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [className, setClassName] = useState<string>("Loading Class...");

    useEffect(() => {
        const fetchClassData = async () => {
            setIsLoading(true);
            try {
                // In a real app, this might be separate endpoints for class details and students
                const res = await api.get(`/classes/${classId}/students`);
                setStudents(res.data.students || []);
                setClassName(res.data.className || "Class Roster");
                
                // Initialize default attendance (everyone Present)
                const initialRecords: Record<string, AttendanceRecord> = {};
                (res.data.students || []).forEach((s: Student) => {
                    initialRecords[s.id] = { studentId: s.id, status: 'Present' };
                });
                setRecords(initialRecords);
            } catch (error) {
                console.error("Failed to load students:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (classId) fetchClassData();
    }, [classId]);

    const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
        setRecords(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                classId,
                date,
                records: Object.values(records)
            };
            await api.post(`/attendance/bulk`, payload);
            alert("Attendance submitted successfully!");
            router.push(`/school/${schoolId}/teacher/dashboard`);
        } catch (error) {
            console.error("Failed to submit attendance:", error);
            alert("Failed to submit attendance. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500">Loading student roster...</div>;
    }

    return (
        <div className="p-6 md:p-8 space-y-6 min-h-screen bg-slate-50 dark:bg-black/20 text-[#0d111b] dark:text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link href={`/school/${schoolId}/teacher/dashboard`} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline mb-2">
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        Back to Classes
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight">{className}</h1>
                    <p className="text-gray-500 font-medium">Daily Attendance Roll Call</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white dark:bg-[#1e2538] p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <span className="material-symbols-outlined text-gray-400 pl-2">calendar_today</span>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-bold cursor-pointer text-gray-700 dark:text-gray-200"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e2538] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 tracking-wider">Student</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 tracking-wider">ID Number</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 tracking-wider text-right">Attendance Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="font-bold">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">
                                        {student.studentId}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                            {(['Present', 'Absent', 'Late', 'Excused'] as const).map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(student.id, status)}
                                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                                                        records[student.id]?.status === status 
                                                            ? status === 'Present' ? 'bg-green-500 text-white shadow-sm'
                                                            : status === 'Absent' ? 'bg-red-500 text-white shadow-sm'
                                                            : status === 'Late' ? 'bg-orange-500 text-white shadow-sm'
                                                            : 'bg-blue-500 text-white shadow-sm'
                                                            : 'text-gray-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                                        No students found in this class roster.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || students.length === 0}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">check_circle</span>
                            Submit Attendance
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
