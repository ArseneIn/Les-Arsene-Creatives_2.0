"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

interface IssueRecord {
    id: string;
    book?: { title: string };
    studentId?: string;
    teacherId?: string;
    borrowedAt: string;
    dueDate: string;
    status: string;
}

export default function OverdueRecordsPage() {
    const params = useParams();
    const schoolId = params.id as string;
    const [overdueBooks, setOverdueBooks] = useState<IssueRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOverdueBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/library/issued?schoolId=${schoolId}`);
            // Filter strictly for overdue
            const overdue = res.data.filter((r: IssueRecord) => new Date(r.dueDate) < new Date() && r.status === 'Issued');
            setOverdueBooks(overdue);
        } catch (error) {
            console.error("Failed to fetch overdue books:", error);
        } finally {
            setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchOverdueBooks();
    }, [fetchOverdueBooks]);

    const handleSendReminder = async (recordId: string) => {
        // In a real app, this would hit an endpoint to send an SMS/Email
        console.log("Sending reminder for record:", recordId);
        alert("Reminder sent to borrower!");
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-gray-50 dark:bg-black/20 font-sans text-[#0d111b] dark:text-white">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2 text-red-600 dark:text-red-400">Overdue Records</h1>
                    <p className="text-gray-500 font-medium">Track late returns and issue reminders</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-[#1e2538] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400">Loading data...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500 font-bold border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4">Book Title</th>
                                    <th className="px-6 py-4">Borrower</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Days Late</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {overdueBooks.map(record => {
                                    const daysLate = Math.floor((new Date().getTime() - new Date(record.dueDate).getTime()) / (1000 * 3600 * 24));
                                    return (
                                        <tr key={record.id} className="hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                            <td className="px-6 py-4 font-bold text-[#0d111b] dark:text-white flex items-center gap-3">
                                                <div className="size-8 bg-red-100 text-red-600 rounded flex items-center justify-center">
                                                    <span className="material-symbols-outlined !text-lg">warning</span>
                                                </div>
                                                {record.book?.title || 'Unknown Book'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {record.studentId || record.teacherId || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-red-600 dark:text-red-400">
                                                {new Date(record.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-bold dark:bg-red-900/30 dark:text-red-400">
                                                    {daysLate} days
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleSendReminder(record.id)}
                                                    className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded text-xs font-bold shadow-sm transition-all"
                                                >
                                                    Send Reminder
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {overdueBooks.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                            No overdue books! Excellent.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
