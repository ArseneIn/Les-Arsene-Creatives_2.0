"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/api";

type IssueFormData = {
    bookId: string;
    studentId: string;
    dueDate: string;
};

type IssueBookModalProps = {
    onClose: () => void;
    onSuccess: () => void;
    schoolId: string;
};

interface Book {
    id: string;
    title: string;
    available: number;
}

interface Student {
    id: string;
    name: string;
    studentId: string;
    grade: string;
}

export default function IssueBookModal({ onClose, onSuccess, schoolId }: IssueBookModalProps) {
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<IssueFormData>();
    const [books, setBooks] = useState<Book[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (schoolId) {
            // Fetch available books
            api.get(`/library/books?schoolId=${schoolId}`).then(res => {
                setBooks(res.data.filter((b: Book) => b.available > 0));
            });

            // Fetch all students for search
            api.get(`/students?schoolId=${schoolId}`).then(res => {
                setStudents(res.data);
            });
        }
    }, [schoolId]);

    const filteredStudents = useMemo(() => {
        if (!searchTerm) return [];
        const lower = searchTerm.toLowerCase();
        return students.filter(s =>
            s.name.toLowerCase().includes(lower) ||
            s.studentId.toLowerCase().includes(lower)
        ).slice(0, 10);
    }, [searchTerm, students]);

    const selectStudent = (student: Student) => {
        setValue("studentId", student.id);
        setSearchTerm(`${student.name} (${student.studentId})`);
        setShowSuggestions(false);
    };

    const onSubmit = async (data: IssueFormData) => {
        try {
            await api.post('/library/issue', {
                ...data,
                schoolId,
                dueDate: new Date(data.dueDate)
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to issue book:", error);
            alert("Failed to issue book. It might be unavailable.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1e2538] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#0d111b] dark:text-white">Issue Book</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Select Book</label>
                        <select
                            {...register("bookId", { required: "Book is required" })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        >
                            <option value="">-- Choose Book --</option>
                            {books.map(book => (
                                <option key={book.id} value={book.id}>{book.title} (Qty: {book.available})</option>
                            ))}
                        </select>
                        {errors.bookId && <p className="text-red-500 text-xs mt-1">{errors.bookId.message}</p>}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Student</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowSuggestions(true);
                                setValue("studentId", ""); // Reset ID on manual type
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                            placeholder="Search by name or ID..."
                            autoComplete="off"
                        />
                        {/* Hidden input to store the actual UUID */}
                        <input type="hidden" {...register("studentId", { required: "Student is required" })} />

                        {showSuggestions && filteredStudents.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1e2538] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {filteredStudents.map(student => (
                                    <button
                                        key={student.id}
                                        type="button"
                                        onClick={() => selectStudent(student)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 last:border-0"
                                    >
                                        <p className="font-bold">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.studentId} • {student.grade}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                        {errors.studentId && <p className="text-red-500 text-xs mt-1">Please select a valid student from the list</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                        <input
                            type="date"
                            {...register("dueDate", { required: "Due date is required" })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                        {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg font-bold">Cancel</button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Issuing...' : 'Issue Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
