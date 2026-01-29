"use client";

import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";

export interface AddStudentFormData {
    fullName: string;
    studentId: string;

    // Personal Info
    dob: string;
    gender: 'Male' | 'Female';
    age: number;

    // Academic Info
    level: 'O-Level' | 'A-Level';
    grade: string; // S1-S6
    combination?: string; // Only for A-Level

    // Parent Info
    fatherName: string;
    motherName: string;
    primaryPhone: string;
    emergencyPhone: string;
    email?: string;
}

interface AddStudentFormProps {
    onSubmit: (data: AddStudentFormData) => void;
    onCancel: () => void;
}

export default function AddStudentForm({ onSubmit, onCancel }: AddStudentFormProps) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<AddStudentFormData>();

    const level = useWatch({ control, name: "level" });
    const dob = useWatch({ control, name: "dob" });

    // Auto-calculate age from DOB
    useEffect(() => {
        if (dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setValue("age", age);
        }
    }, [dob, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                            {...register("fullName", { required: "Full name is required" })}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="e.g. John Doe"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                        <input
                            {...register("dob", { required: "Date of Birth is required" })}
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                        {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                            <select
                                {...register("gender", { required: "Gender is required" })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                            <input
                                {...register("age", { required: "Age is required", min: 1 })}
                                type="number"
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Information */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student ID</label>
                        <input
                            {...register("studentId", { required: "Student ID is required" })}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="e.g. 2024-001"
                        />
                        {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                        <select
                            {...register("level", { required: "Level is required" })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                        >
                            <option value="">Select Level</option>
                            <option value="O-Level">O-Level (S1-S3)</option>
                            <option value="A-Level">A-Level (S4-S6)</option>
                        </select>
                        {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class / Year</label>
                        <select
                            {...register("grade", { required: "Class is required" })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                        >
                            <option value="">Select Class</option>
                            {level === 'O-Level' && (
                                <>
                                    <option value="S1">S1</option>
                                    <option value="S2">S2</option>
                                    <option value="S3">S3</option>
                                </>
                            )}
                            {level === 'A-Level' && (
                                <>
                                    <option value="S4">S4</option>
                                    <option value="S5">S5</option>
                                    <option value="S6">S6</option>
                                </>
                            )}
                        </select>
                        {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>}
                    </div>

                    {level === 'A-Level' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Combination</label>
                            <input
                                {...register("combination", { required: "Combination is required for A-Level" })}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g. MCE, PCB"
                            />
                            {errors.combination && <p className="text-red-500 text-xs mt-1">{errors.combination.message}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Parent Information */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">Parent / Guardian Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Father&apos;s Name</label>
                        <input
                            {...register("fatherName", { required: "Father's name is required" })}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                        {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mother&apos;s Name</label>
                        <input
                            {...register("motherName", { required: "Mother's name is required" })}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                        {errors.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Phone</label>
                        <input
                            {...register("primaryPhone", { required: "Primary phone is required" })}
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="+250..."
                        />
                        {errors.primaryPhone && <p className="text-red-500 text-xs mt-1">{errors.primaryPhone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Phone</label>
                        <input
                            {...register("emergencyPhone", { required: "Emergency phone is required" })}
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="+250..."
                        />
                        {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone.message}</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
