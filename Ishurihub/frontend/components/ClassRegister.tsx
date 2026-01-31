"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

type Student = {
    id: string;
    studentId: string; // The display ID (e.g., STU-001)
    firstName: string;
    lastName: string;
    avatarUrl?: string;
};

type Class = {
    id: string;
    name: string;
    level: string;
};

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excuse';

export default function ClassRegister() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Classes on Mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // Assuming we have a schoolId in context or URL, but for component isolation, 
                // we might need to pass it as prop or fetch generally if api handles context.
                // For now, let's assume the API returns classes for the current user's school context
                const response = await api.get('/classes');
                setClasses(response.data);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            }
        };
        fetchClasses();
    }, []);

    // Fetch Students when Class Selected
    useEffect(() => {
        if (!selectedClassId) return;

        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/classes/${selectedClassId}/students`);
                setStudents(response.data);

                // Initialize attendance as 'Present' for all
                const initialStatus: Record<string, AttendanceStatus> = {};
                response.data.forEach((s: Student) => {
                    initialStatus[s.id] = 'Present';
                });
                setAttendance(initialStatus);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, [selectedClassId]);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async () => {
        if (!selectedClassId) return;
        setIsSubmitting(true);
        try {
            // Transform state to payload
            // const payload = Object.entries(attendance).map(([studentId, status]) => ({
            //    studentId,
            //    status,
            //    classId: selectedClassId
            // }));

            // For now, let's iterate and send individual requests or a batch if supported.
            // MVP: Loop request (not efficient but simple for now)
            // Ideally backend supports POST /attendance/batch

            const promises = Object.entries(attendance).map(([studentId, status]) =>
                api.post('/attendance', {
                    studentId,
                    status,
                    classId: selectedClassId,
                    date: new Date().toISOString().split('T')[0] // Today
                })
            );

            await Promise.all(promises);
            alert("Attendance submitted successfully!");
            // Reset or redirect?
        } catch (error) {
            console.error("Failed to submit attendance:", error);
            alert("Failed to submit attendance. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Class Selector */}
            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-[#cfcfe7] dark:border-white/10">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Class</label>
                <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full max-w-md h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-white dark:bg-black/20 text-sm outline-none"
                >
                    <option value="">-- Choose a Class --</option>
                    {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name} ({cls.level})</option>
                    ))}
                </select>
            </div>

            {/* Student List */}
            {selectedClassId && (
                <div className="bg-white dark:bg-white/5 rounded-xl border border-[#cfcfe7] dark:border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-[#cfcfe7] dark:border-white/10 flex justify-between items-center">
                        <h3 className="font-bold text-black dark:text-white">Class Register</h3>
                        <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center text-gray-400">Loading students...</div>
                    ) : students.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No students found in this class.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500 font-bold">
                                <tr>
                                    <th className="px-4 py-3">Student</th>
                                    <th className="px-4 py-3 text-center">Present</th>
                                    <th className="px-4 py-3 text-center">Absent</th>
                                    <th className="px-4 py-3 text-center">Late</th>
                                    <th className="px-4 py-3 text-center">Excuse</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {students.map(student => (
                                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${student.avatarUrl || `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}`})` }}></div>
                                                <div>
                                                    <p className="font-bold text-sm text-black dark:text-white">{student.firstName} {student.lastName}</p>
                                                    <p className="text-xs text-gray-500">{student.studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {['Present', 'Absent', 'Late', 'Excuse'].map(status => (
                                            <td key={status} className="px-4 py-3 text-center">
                                                <input
                                                    type="radio"
                                                    name={`status-${student.id}`}
                                                    checked={attendance[student.id] === status}
                                                    onChange={() => handleStatusChange(student.id, status as AttendanceStatus)}
                                                    className="accent-primary size-4 cursor-pointer"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {students.length > 0 && (
                        <div className="p-4 border-t border-[#cfcfe7] dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow hover:bg-primary/90 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Register'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
