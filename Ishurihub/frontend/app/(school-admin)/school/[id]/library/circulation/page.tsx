"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import IssueBookModal from "@/components/library/IssueBookModal";
import LibraryKiosk from "@/components/library/LibraryKiosk";

interface IssueRecord {
    id: string;
    book?: { title: string };
    studentId?: string;
    teacherId?: string;
    borrowedAt: string;
    dueDate: string;
    status: string;
}

export default function CirculationPage() {
    const params = useParams();
    const schoolId = params.id as string;
    const [issuedBooks, setIssuedBooks] = useState<IssueRecord[]>([]);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showKiosk, setShowKiosk] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchIssuedBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/library/issued?schoolId=${schoolId}`);
            setIssuedBooks(res.data);
        } catch (error) {
            console.error("Failed to fetch issued books:", error);
        } finally {
            setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchIssuedBooks();
    }, [fetchIssuedBooks]);

    const handleReturnBook = async (recordId: string) => {
        if (!confirm("Confirm return of this book?")) return;
        try {
            await api.post(`/library/return/${recordId}`);
            fetchIssuedBooks();
        } catch (error) {
            console.error("Failed to return book:", error);
            alert("Failed to return book");
        }
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-gray-50 dark:bg-black/20 font-sans text-[#0d111b] dark:text-white">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Lend & Return Books</h1>
                    <p className="text-gray-500 font-medium">Issue books to users and process returns</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowKiosk(true)}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">contactless</span>
                        Kiosk Mode
                    </button>
                    <button
                        onClick={() => setShowIssueModal(true)}
                        className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">outbound</span>
                        Issue Book
                    </button>
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
                                    <th className="px-6 py-4">Borrowed on</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {issuedBooks.map(record => (
                                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-[#0d111b] dark:text-white flex items-center gap-3">
                                            <div className="size-8 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                                                <span className="material-symbols-outlined !text-lg">menu_book</span>
                                            </div>
                                            {record.book?.title || 'Unknown Book'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {record.studentId || record.teacherId || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(record.borrowedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#0d111b] dark:text-white">
                                            {new Date(record.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-orange-100 text-orange-600 text-xs font-bold dark:bg-orange-900/30 dark:text-orange-400">
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleReturnBook(record.id)}
                                                className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded text-xs font-bold shadow-sm transition-all"
                                            >
                                                Mark Returned
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {issuedBooks.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            No issued books records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showIssueModal && (
                <IssueBookModal
                    onClose={() => setShowIssueModal(false)}
                    onSuccess={fetchIssuedBooks}
                    schoolId={schoolId}
                />
            )}

            {showKiosk && (
                <LibraryKiosk
                    onClose={() => setShowKiosk(false)}
                    onSuccess={fetchIssuedBooks}
                    schoolId={schoolId}
                />
            )}
        </div>
    );
}
