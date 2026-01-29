"use client";

import { useForm } from "react-hook-form";

export interface AddSchoolFormData {
    name: string;
    category: 'Boarding' | 'Day' | 'Mixed';
    levels: ('O-Level' | 'A-Level' | 'TVET' | 'University')[];
    combinations?: string; // Comma separated string for input
    location: string;
    logoUrl: string;
}

interface AddSchoolFormProps {
    onSubmit: (data: AddSchoolFormData) => void;
    onCancel: () => void;
}

export default function AddSchoolForm({ onSubmit, onCancel }: AddSchoolFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddSchoolFormData>();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Institution Name
                </label>
                <input
                    {...register("name", { required: "Institution name is required" })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Kigali International School"
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                </label>
                <select
                    {...register("category", { required: "Category is required" })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                >
                    <option value="">Select Category</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Day">Day</option>
                    <option value="Mixed">Mixed</option>
                </select>
                {errors.category && (
                    <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Levels Offered
                </label>
                <div className="flex flex-wrap gap-4">
                    {['O-Level', 'A-Level', 'TVET', 'University'].map((level) => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                value={level}
                                {...register("levels", { required: "At least one level is required" })}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{level}</span>
                        </label>
                    ))}
                </div>
                {errors.levels && (
                    <p className="text-red-500 text-xs mt-1">{errors.levels.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Combinations (for A-Level)
                </label>
                <input
                    {...register("combinations")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. MCE, PCB, PCM (Comma separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Optional: Only required if A-Level is selected</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                </label>
                <input
                    {...register("location", { required: "Location is required" })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Kigali, Rwanda"
                />
                {errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Logo URL (Optional)
                </label>
                <input
                    {...register("logoUrl")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="https://..."
                />
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
                    Register School
                </button>
            </div>
        </form>
    );
}
