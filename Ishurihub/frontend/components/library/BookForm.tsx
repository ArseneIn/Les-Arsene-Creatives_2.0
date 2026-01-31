"use client";

import { useForm } from "react-hook-form";
import api from "@/lib/api";

type BookFormData = {
    title: string;
    author: string;
    isbn?: string;
    category: string;
    quantity: number;
    location?: string;
};

type BookFormProps = {
    initialData?: Partial<BookFormData> & { id?: string };
    onClose: () => void;
    onSuccess: () => void;
};

export default function BookForm({ initialData, onClose, onSuccess }: BookFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookFormData>({
        defaultValues: (initialData as any) || {
            quantity: 1,
        }
    });

    const onSubmit = async (data: BookFormData) => {
        try {
            // Ensure available quantity matches total quantity for new books (simplified logic)
            const payload = { ...data, available: data.quantity, schoolId: 'default-school-id' }; // TODO: Get from context

            if (initialData?.id) {
                await api.patch(`/library/books/${initialData.id}`, data);
            } else {
                await api.post('/library/books', payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save book:", error);
            alert("Failed to save book");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1e2538] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#0d111b] dark:text-white">
                        {initialData ? 'Edit Book' : 'Add New Book'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                            {...register("title", { required: "Title is required" })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. The Great Gatsby"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Author</label>
                            <input
                                {...register("author", { required: "Author is required" })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Author Name"
                            />
                            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select
                                {...register("category", { required: "Category is required" })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">Select...</option>
                                <option value="Fiction">Fiction</option>
                                <option value="Science">Science</option>
                                <option value="History">History</option>
                                <option value="Reference">Reference</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                            <input
                                type="number"
                                {...register("quantity", { required: "Quantity is required", min: 1 })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Shelf Location</label>
                            <input
                                {...register("location")}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="e.g. A3-12"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">ISBN (Optional)</label>
                        <input
                            {...register("isbn")}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg font-bold">Cancel</button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
