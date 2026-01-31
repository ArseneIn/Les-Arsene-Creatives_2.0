"use client";

import { useState, useEffect } from "react";
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
};

export default function IssueBookModal({ onClose, onSuccess }: IssueBookModalProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IssueFormData>();
    const [books, setBooks] = useState<any[]>([]);

    useEffect(() => {
        // Fetch available books
        api.get('/library/books?schoolId=default-school-id').then(res => {
            // Filter only available books
            setBooks(res.data.filter((b: any) => b.available > 0));
        });
    }, []);

    const onSubmit = async (data: IssueFormData) => {
        try {
            await api.post('/library/issue', {
                ...data,
                schoolId: 'default-school-id',
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
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">-- Choose Book --</option>
                            {books.map(book => (
                                <option key={book.id} value={book.id}>{book.title} (Qty: {book.available})</option>
                            ))}
                        </select>
                        {errors.bookId && <p className="text-red-500 text-xs mt-1">{errors.bookId.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Student ID / Name</label>
                        {/* Simplified Input for MVP - Ideally a Searchable Dropdown */}
                        <input
                            {...register("studentId", { required: "Student ID/Name is required" })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Enter Student ID"
                        />
                        {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                        <input
                            type="date"
                            {...register("dueDate", { required: "Due date is required" })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
