"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/Modal";
import api from "@/lib/api";

interface Student {
    id: string;
    name: string;
    studentId: string;
    avatarUrl?: string;
}

interface ClassStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    classId: string;
    className: string;
}

export default function ClassStudentsModal({
    isOpen,
    onClose,
    classId,
    className
}: ClassStudentsModalProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStudents = useCallback(async () => {
        if (!classId) return;
        setIsLoading(true);
        try {
            const response = await api.get(`/classes/${classId}/students`);
            setStudents(response.data);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        } finally {
            setIsLoading(false);
        }
    }, [classId]);

    useEffect(() => {
        if (isOpen && classId) {
            fetchStudents();
        }
    }, [isOpen, classId, fetchStudents]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={className}
            size="md"
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {students.length} Students
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <span className="size-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                            No students in this class.
                        </div>
                    ) : (
                        students.map(student => (
                            <div key={student.id} className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-primary/20 transition-colors">
                                <div className="size-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 overflow-hidden">
                                    {student.avatarUrl ? (
                                        <img src={student.avatarUrl} alt={student.name} className="size-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined">person</span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{student.name}</h4>
                                    <p className="text-xs text-gray-500">{student.studentId}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
}
