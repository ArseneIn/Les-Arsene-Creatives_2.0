"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import BookForm from "@/components/library/BookForm";

interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    location?: string;
    quantity: number;
    available: number;
}

export default function ManageBooksPage() {
    const params = useParams();
    const schoolId = params.id as string;
    const [books, setBooks] = useState<Book[]>([]);
    const [showBookModal, setShowBookModal] = useState(false);
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

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

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

    return (
        <div className="p-8 space-y-8 min-h-screen bg-gray-50 dark:bg-black/20 font-sans text-[#0d111b] dark:text-white">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Manage Books</h1>
                    <p className="text-gray-500 font-medium">Add, edit, or remove books from the library inventory</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setSelectedBook(null); setShowBookModal(true); }}
                        className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Book
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
                )}
            </div>

            {/* Modals */}
            {showBookModal && (
                <BookForm
                    initialData={selectedBook || undefined}
                    onClose={() => setShowBookModal(false)}
                    onSuccess={fetchBooks}
                    schoolId={schoolId}
                />
            )}
        </div>
    );
}
