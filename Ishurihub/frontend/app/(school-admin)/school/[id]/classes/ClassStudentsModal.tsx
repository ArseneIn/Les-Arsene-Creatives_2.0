"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/Modal";
import api from "@/lib/api";

interface Student {
    id: string;
    name: string;
    studentId: string;
    avatarUrl?: string;
    grade?: string;
}

interface ClassStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    classId: string;
    className: string;
    schoolId: string;
}

export default function ClassStudentsModal({
    isOpen,
    onClose,
    classId,
    className,
    schoolId
}: ClassStudentsModalProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Add Student State
    const [isAddMode, setIsAddMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
            setIsAddMode(false);
            setSearchTerm("");
            setSearchResults([]);
            setSelectedStudents([]);
        }
    }, [isOpen, classId, fetchStudents]);

    // Search Students Effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length >= 2) {
                setIsSearching(true);
                try {
                    // Assuming we have a general student search endpoint or filters
                    // For now, let's fetch students by school (ideally we filter by year/unassigned)
                    // We need a better endpoint for "Find students to add", maybe just filtering existing students list
                    // Since we don't have a dedicated "search unassigned" endpoint yet, let's use the main list API with a search query
                    // You might need to adjust the backend to support 'search' query param on /students
                    const res = await api.get(`/students`, { params: { search: searchTerm, schoolId: 'get-from-context-or-prop' } });
                    // Since we don't have schoolId prop easily here (it's in parent Params), we might need to rely on backend ensuring scope
                    // Let's assume the API handles it or we pass it. 
                    // Ideally parent passes schoolId. For now, let's try just searching.
                    // A safer bet is to search by the Class's year? 

                    // Optimization: Use the Class ID to find potential students? 
                    // Or just generic search.
                    setSearchResults(res.data.data || res.data); // Handle pagination structure if any
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleAddStudents = async () => {
        if (selectedStudents.length === 0) return;
        setIsSaving(true);
        try {
            await api.post(`/classes/${classId}/students`, { studentIds: selectedStudents });
            await fetchStudents();
            setIsAddMode(false);
            setSelectedStudents([]);
            setSearchTerm("");
        } catch (error) {
            console.error("Failed to add students", error);
            alert("Failed to add students");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleStudentSelection = (id: string) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

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
                        {isAddMode ? `${selectedStudents.length} Selected` : `${students.length} Students`}
                    </div>
                    <button
                        onClick={() => setIsAddMode(!isAddMode)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${isAddMode ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                    >
                        {isAddMode ? (
                            <>PROPOSED
                                <span className="material-symbols-outlined text-[16px]">close</span>
                                Cancel
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[16px]">person_add</span>
                                Add Students
                            </>
                        )}
                    </button>
                </div>

                {isAddMode ? (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder="Search student by name or ID..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                autoFocus
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1 min-h-[200px]">
                            {isSearching ? (
                                <div className="flex justify-center py-8"><span className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span></div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(student => {
                                    const isSelected = selectedStudents.includes(student.id);
                                    const isAlreadyInClass = students.some(s => s.id === student.id);
                                    if (isAlreadyInClass) return null; // Skip already added

                                    return (
                                        <div
                                            key={student.id}
                                            onClick={() => toggleStudentSelection(student.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-primary/5 border-primary/50' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-gray-700 hover:border-gray-300'}`}
                                        >
                                            <div className={`size-5 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'}`}>
                                                {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{student.name}</h4>
                                                <p className="text-xs text-gray-500">{student.studentId} • {student.grade || 'No Grade'}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : searchTerm.length >= 2 ? (
                                <p className="text-center text-gray-400 text-sm py-4">No students found.</p>
                            ) : (
                                <p className="text-center text-gray-400 text-sm py-4">Type to search...</p>
                            )}
                        </div>

                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <button
                                disabled={selectedStudents.length === 0 || isSaving}
                                onClick={handleAddStudents}
                                className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                Add Selected ({selectedStudents.length})
                            </button>
                        </div>
                    </div>
                ) : (

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
                )}
            </div>
        </Modal>
    );
}
