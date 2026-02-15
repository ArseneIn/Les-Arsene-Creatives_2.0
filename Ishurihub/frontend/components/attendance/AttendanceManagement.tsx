"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface Student {
    id: string;
    fullName: string;
    admissionNumber: string;
}

interface ClassEntity {
    id: string;
    name: string;
}

interface AttendanceRecordState {
    status: string;
    remarks: string;
}

interface ApiAttendanceRecord {
    studentId: string;
    status: string;
    remarks: string;
}

interface AttendanceManagementProps {
    schoolId: string;
    initialClassId?: string;
}

export default function AttendanceManagement({ schoolId, initialClassId }: AttendanceManagementProps) {
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [classes, setClasses] = useState<ClassEntity[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || "");
    const [students, setStudents] = useState<Student[]>([]);
    const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecordState>>({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch Classes on Mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await api.get(`/classes?schoolId=${schoolId}`);
                setClasses(res.data);
            } catch (error) {
                console.error("Failed to fetch classes", error);
            }
        };
        fetchClasses();
    }, [schoolId]);

    // Fetch Students & Existing Attendance when Class/Date changes
    useEffect(() => {
        if (!selectedClassId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Get Students
                const studentsRes = await api.get(`/classes/${selectedClassId}/students`);
                setStudents(studentsRes.data);

                // 2. Get Existing Attendance
                const attendanceRes = await api.get<ApiAttendanceRecord[]>(`/attendance?schoolId=${schoolId}&date=${date}`);

                // Map existing attendance to state
                const initialData: Record<string, AttendanceRecordState> = {};
                studentsRes.data.forEach((s: Student) => {
                    // Default to Present if not found, or use existing
                    const existing = attendanceRes.data.find((r) => r.studentId === s.id);
                    initialData[s.id] = existing ? {
                        status: existing.status,
                        remarks: existing.remarks || ""
                    } : {
                        status: "Present",
                        remarks: ""
                    };
                });
                setAttendanceData(initialData);

            } catch (error) {
                console.error("Failed to fetch data", error);
                alert("Failed to load students or attendance data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedClassId, date, schoolId]);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };

    const handleRemarkChange = (studentId: string, remarks: string) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks }
        }));
    };

    const markAllPresent = () => {
        const newData = { ...attendanceData };
        students.forEach(s => {
            newData[s.id] = { ...newData[s.id], status: 'Present' };
        });
        setAttendanceData(newData);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                schoolId,
                classId: selectedClassId,
                date: date,
                records: students.map(s => ({
                    studentId: s.id,
                    status: attendanceData[s.id].status,
                    remarks: attendanceData[s.id].remarks
                }))
            };

            await api.post('/attendance/bulk', payload);
            alert("Attendance saved successfully.");
        } catch (error) {
            console.error("Failed to save attendance", error);
            alert("Failed to save attendance.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-end bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="w-full sm:w-[200px] flex flex-col gap-1.5">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Select Class</label>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
                    >
                        <option value="">Select a class</option>
                        {classes.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="w-full sm:w-[200px] flex flex-col gap-1.5">
                    <label className="text-sm font-medium leading-none">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    />
                </div>
            </div>

            {selectedClassId && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Students ({students.length})</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={markAllPresent}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-9 px-3"
                            >
                                <span className="material-symbols-outlined mr-2" style={{ fontSize: '16px' }}>check_circle</span>
                                Mark All Present
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || loading}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-9 px-3"
                            >
                                <span className="material-symbols-outlined mr-2" style={{ fontSize: '16px' }}>save</span>
                                {submitting ? "Saving..." : "Save Attendance"}
                            </button>
                        </div>
                    </div>

                    <div className="rounded-md border border-slate-200 dark:border-slate-800">
                        <div className="w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">Student Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {loading ? (
                                        <tr className="border-b transition-colors hover:bg-slate-100/50">
                                            <td colSpan={3} className="p-4 align-middle text-center h-24">
                                                Loading students...
                                            </td>
                                        </tr>
                                    ) : students.length === 0 ? (
                                        <tr className="border-b transition-colors hover:bg-slate-100/50">
                                            <td colSpan={3} className="p-4 align-middle text-center h-24">
                                                No students found in this class.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((student) => (
                                            <tr key={student.id} className="border-b transition-colors hover:bg-slate-100/50">
                                                <td className="p-4 align-middle font-medium">
                                                    {student.fullName}
                                                    <div className="text-xs text-muted-foreground">{student.admissionNumber}</div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex gap-4">
                                                        {['Present', 'Absent', 'Late', 'Excuse'].map((status) => (
                                                            <label key={status} className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name={`status-${student.id}`}
                                                                    value={status}
                                                                    checked={attendanceData[student.id]?.status === status}
                                                                    onChange={() => handleStatusChange(student.id, status)}
                                                                    className="accent-slate-900 w-4 h-4"
                                                                />
                                                                <span className={`text-sm ${status === 'Present' ? 'text-green-600' :
                                                                    status === 'Absent' ? 'text-red-600' :
                                                                        status === 'Late' ? 'text-yellow-600' : ''
                                                                    }`}>{status}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <input
                                                        placeholder="Optional remarks"
                                                        value={attendanceData[student.id]?.remarks || ''}
                                                        onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-[200px]"
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
