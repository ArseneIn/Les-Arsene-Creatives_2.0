"use client";

import { useForm } from "react-hook-form";

interface AddStudentFormData {
    fullName: string;
    studentId: string;
    grade: string;
    section: string;
}

interface AddStudentFormProps {
    onSubmit: (data: AddStudentFormData) => void;
    onCancel: () => void;
}

export default function AddStudentForm({ onSubmit, onCancel }: AddStudentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddStudentFormData>();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                </label>
                <input
                    {...register("fullName", { required: "Full name is required" })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. John Doe"
                />
                {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Student ID
                </label>
                <input
                    {...register("studentId", { required: "Student ID is required" })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. 2024-001"
                />
                {errors.studentId && (
                    <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Grade
                    </label>
                    <select
                        {...register("grade", { required: "Grade is required" })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                    >
                        <option value="">Select Grade</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                    </select>
                    {errors.grade && (
                        <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Section
                    </label>
                    <input
                        {...register("section", { required: "Section is required" })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="e.g. A"
                    />
                    {errors.section && (
                        <p className="text-red-500 text-xs mt-1">{errors.section.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    Add Student
                </button>
            </div>
        </form>
    );
}
