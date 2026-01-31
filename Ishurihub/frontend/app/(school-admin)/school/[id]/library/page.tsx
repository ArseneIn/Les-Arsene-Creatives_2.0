"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from '@/lib/api';
import { LibraryTransaction } from "@/data/library";

export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    totalCopies: number;
    availableCopies: number;
    coverUrl?: string; // Optional in backend
}

export default function LibraryPage() {
    const params = useParams();
    const schoolId = params.id as string;
    const [activeTab, setActiveTab] = useState<'inventory' | 'transactions'>('inventory');
    const [books, setBooks] = useState<Book[]>([]);
    const [transactions, setTransactions] = useState<LibraryTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBooks = useCallback(async () => {
        if (!schoolId) return;
        setIsLoading(true);
        try {
            const response = await api.get('/library/books', {
                params: { schoolId }
            });
            setBooks(response.data);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        } finally {
            setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Stats
    const totalBooks = books.reduce((acc, book) => acc + book.totalCopies, 0);
    const availableBooks = books.reduce((acc, book) => acc + book.availableCopies, 0);
    const borrowedBooks = totalBooks - availableBooks;
    const overdueBooks = transactions.filter(t => t.status === 'Overdue').length;

    return (
        <div className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 pb-4">
                    <Link href={`/school/${schoolId}/dashboard`} className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium hover:text-primary">Home</Link>
                    <span className="text-[#4c4c9a] dark:text-gray-600 text-sm font-medium">/</span>
                    <span className="text-black dark:text-white text-sm font-bold">Library</span>
                </div>

                {/* PageHeading */}
                <div className="flex flex-wrap justify-between items-end gap-3 pb-6">
                    <div className="flex min-w-72 flex-col gap-1">
                        <h1 className="text-black dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Library Management</h1>
                        <p className="text-[#4c4c9a] dark:text-gray-400 text-base font-normal">Manage book inventory and track student loans.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex min-w-[140px] items-center justify-center rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all">
                            <span className="material-symbols-outlined text-[18px] mr-2">add_circle</span>
                            Add Book
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#cfcfe7] dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">library_books</span>
                            </div>
                            <p className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium">Total Books</p>
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white">{totalBooks}</h3>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#cfcfe7] dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                            <p className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium">Available</p>
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white">{availableBooks}</h3>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#cfcfe7] dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                                <span className="material-symbols-outlined">pending</span>
                            </div>
                            <p className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium">Borrowed</p>
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white">{borrowedBooks}</h3>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#cfcfe7] dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <p className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium">Overdue</p>
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white">{overdueBooks}</h3>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#cfcfe7] dark:border-white/10 mb-6">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'inventory'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-[#4c4c9a] dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        Book Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'transactions'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-[#4c4c9a] dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        Borrowing Records
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-white/5 rounded-xl border border-[#cfcfe7] dark:border-white/10 shadow-sm overflow-hidden">
                    {activeTab === 'inventory' ? (
                        <>
                            {isLoading ? (
                                <div className="p-8 text-center text-gray-500">Loading library inventory...</div>
                            ) : books.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No books found in the library.</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f8fc] dark:bg-white/5 border-b border-[#cfcfe7] dark:border-white/10">
                                            <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Book Title</th>
                                            <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">ISBN</th>
                                            <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Availability</th>
                                            <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#cfcfe7] dark:divide-white/10">
                                        {books.map((book) => (
                                            <tr key={book.id} className="hover:bg-[#f8f8fc] dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="size-10 rounded bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
                                                            style={{ backgroundImage: `url('${book.coverUrl || 'https://placehold.co/100x150?text=No+Cover'}')` }}
                                                        ></div>
                                                        <div>
                                                            <p className="text-black dark:text-white text-sm font-bold">{book.title}</p>
                                                            <p className="text-[#4c4c9a] dark:text-gray-500 text-xs">{book.author}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 rounded bg-[#e7e7f3] dark:bg-white/10 text-primary dark:text-primary text-xs font-bold">{book.category}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-black dark:text-white font-mono">{book.isbn}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex justify-between text-xs font-bold">
                                                            <span className="text-black dark:text-white">{book.availableCopies} / {book.totalCopies}</span>
                                                            <span className={book.availableCopies > 0 ? "text-green-600" : "text-red-600"}>
                                                                {book.availableCopies > 0 ? "In Stock" : "Out of Stock"}
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${book.availableCopies > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                                                style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-primary hover:text-primary/70 text-sm font-bold mr-3">Edit</button>
                                                    <button className="text-red-500 hover:text-red-600 text-sm font-bold">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f8f8fc] dark:bg-white/5 border-b border-[#cfcfe7] dark:border-white/10">
                                    <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Transaction ID</th>
                                    <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Book</th>
                                    <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#cfcfe7] dark:divide-white/10">
                                {transactions.map((t) => {
                                    const book = books.find(b => b.id === t.bookId);
                                    return (
                                        <tr key={t.id} className="hover:bg-[#f8f8fc] dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-xs font-mono text-[#4c4c9a] dark:text-gray-500">#{t.id}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-black dark:text-white text-sm font-bold">{t.studentName}</p>
                                                <p className="text-[#4c4c9a] dark:text-gray-500 text-xs">ID: {t.studentId}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-black dark:text-white">{book?.title || 'Unknown Book'}</td>
                                            <td className="px-6 py-4 text-sm text-black dark:text-white">{new Date(t.dueDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${t.status === 'Borrowed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                    t.status === 'Overdue' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                                        'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                                                    }`}>
                                                    <span className={`size-1.5 rounded-full ${t.status === 'Borrowed' ? 'bg-amber-500' :
                                                        t.status === 'Overdue' ? 'bg-red-500' :
                                                            'bg-green-500'
                                                        }`}></span>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {t.status !== 'Returned' && (
                                                    <button className="px-3 py-1.5 bg-primary text-white rounded text-xs font-bold hover:bg-primary/90 transition-all shadow-sm">
                                                        Return
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
