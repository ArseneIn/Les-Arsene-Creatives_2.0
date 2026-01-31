"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import BookForm from "@/components/library/BookForm";
import IssueBookModal from "@/components/library/IssueBookModal";
import LibraryKiosk from "@/components/library/LibraryKiosk";

interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    location?: string;
    quantity: number;
    available: number;
}

interface IssueRecord {
    id: string;
    book?: { title: string };
    studentId?: string;
    teacherId?: string;
    borrowedAt: string;
    dueDate: string;
    status: string;
}

export default function LibraryPage() {
    const params = useParams();
    const schoolId = params.id as string;
    const [activeTab, setActiveTab] = useState<'inventory' | 'issued'>('inventory');
    const [books, setBooks] = useState<Book[]>([]);
    const [issuedBooks, setIssuedBooks] = useState<IssueRecord[]>([]);
    const [showBookModal, setShowBookModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showKiosk, setShowKiosk] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/library/books?schoolId=${schoolId}`);
            setBooks(res.data);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        } finally {
            setIsLoading(false);
        }
    }, [schoolId]);

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
        if (activeTab === 'inventory') fetchBooks();
        if (activeTab === 'issued') fetchIssuedBooks();
    }, [activeTab, fetchBooks, fetchIssuedBooks]);

    const handleEditBook = (book: Book) => {
        setSelectedBook(book as any); // Cast to any to satisfy Partial<BookFormData> requirement in BookForm
        setShowBookModal(true);
    };

    const handleDeleteBook = async (id: string) => {
        if (!confirm("Are you sure you want to delete this book?")) return;
        try {
            await api.delete(`/library/books/${id}`);
            fetchBooks();
        } catch (error) {
            console.error("Failed to delete book:", error);
            alert("Failed to delete book");
        }
    };

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
                    <h1 className="text-3xl font-black tracking-tight mb-2">Library Management</h1>
                    <p className="text-gray-500 font-medium">Manage inventory and borrowing records</p>
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
                        className="px-6 py-2.5 bg-white dark:bg-[#1e2538] text-[#0d111b] dark:text-white font-bold rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">outbound</span>
                        Issue Book
                    </button>
                    <button
                        onClick={() => { setSelectedBook(null); setShowBookModal(true); }}
                        className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Book
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white dark:bg-[#1e2538] p-1 rounded-xl w-fit shadow-sm border border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                    Books Inventory
                </button>
                <button
                    onClick={() => setActiveTab('issued')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'issued' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                    Issued Books ({issuedBooks.length})
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-[#1e2538] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400">Loading data...</div>
                ) : activeTab === 'inventory' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500 font-bold border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Author</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4 text-center">Available</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {books.map(book => (
                                    <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-[#0d111b] dark:text-white">{book.title}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{book.author}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {book.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{book.location || '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${book.available > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                                                {book.available} / {book.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleEditBook(book)} className="text-primary hover:text-primary/80 font-bold text-xs mr-3">Edit</button>
                                            <button onClick={() => handleDeleteBook(book.id)} className="text-red-500 hover:text-red-600 font-bold text-xs">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {books.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            No books found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
            {showBookModal && (
                <BookForm
                    initialData={selectedBook}
                    onClose={() => setShowBookModal(false)}
                    onSuccess={fetchBooks}
                />
            )}

            {showIssueModal && (
                <IssueBookModal
                    onClose={() => setShowIssueModal(false)}
                    onSuccess={() => {
                        fetchBooks(); // Update quantity
                        if (activeTab === 'issued') fetchIssuedBooks();
                    }}
                />
            )}

            {showKiosk && (
                <LibraryKiosk
                    onClose={() => setShowKiosk(false)}
                    onSuccess={() => {
                        fetchBooks();
                        if (activeTab === 'issued') fetchIssuedBooks();
                    }}
                />
            )}
        </div>
    );
}
