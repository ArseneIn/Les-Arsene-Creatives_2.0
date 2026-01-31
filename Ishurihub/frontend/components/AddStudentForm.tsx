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

const InputLabel = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {children} {required && <span className="text-red-500">*</span>}
    </label>
);

export default function AddStudentForm({ onSubmit, onCancel }: AddStudentFormProps) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
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

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Intro */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined">person_add</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">New Student Enrollment</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enter the student&apos;s details to register them in the system.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Personal & Academic */}
                <div className="space-y-8">
                    {/* Personal Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-gray-400">badge</span>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Personal Identity</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <InputLabel required>Full Name</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">person</span>
                                    <input
                                        {...register("fullName", { required: "Full name is required" })}
                                        type="text"
                                        className={`${inputClasses} pl-11`}
                                        placeholder="e.g. Arsene Gaconzi"
                                    />
                                </div>
                                {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Date of Birth</InputLabel>
                                <input
                                    {...register("dob", { required: "Required" })}
                                    type="date"
                                    className={inputClasses}
                                />
                                {errors.dob && <p className="text-red-500 text-xs mt-1 ml-1">{errors.dob.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Gender</InputLabel>
                                <div className="relative">
                                    <select
                                        {...register("gender", { required: "Required" })}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined pointer-events-none">expand_more</span>
                                </div>
                                {errors.gender && <p className="text-red-500 text-xs mt-1 ml-1">{errors.gender.message}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Academic Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-gray-400">school</span>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Academic Details</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <InputLabel required>Student ID Number</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">id_card</span>
                                    <input
                                        {...register("studentId", { required: "Student ID is required" })}
                                        type="text"
                                        className={`${inputClasses} pl-11`}
                                        placeholder="e.g. 2024-001"
                                    />
                                </div>
                                {errors.studentId && <p className="text-red-500 text-xs mt-1 ml-1">{errors.studentId.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Level</InputLabel>
                                <div className="relative">
                                    <select
                                        {...register("level", { required: "Required" })}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="">Select...</option>
                                        <option value="O-Level">O-Level (S1-S3)</option>
                                        <option value="A-Level">A-Level (S4-S6)</option>
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined pointer-events-none">expand_more</span>
                                </div>
                                {errors.level && <p className="text-red-500 text-xs mt-1 ml-1">{errors.level.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Class</InputLabel>
                                <div className="relative">
                                    <select
                                        {...register("grade", { required: "Required" })}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="">Select...</option>
                                        {level === 'O-Level' && ['S1', 'S2', 'S3'].map(g => <option key={g} value={g}>{g}</option>)}
                                        {level === 'A-Level' && ['S4', 'S5', 'S6'].map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined pointer-events-none">expand_more</span>
                                </div>
                                {errors.grade && <p className="text-red-500 text-xs mt-1 ml-1">{errors.grade.message}</p>}
                            </div>

                            {level === 'A-Level' && (
                                <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2">
                                    <InputLabel required>Combination</InputLabel>
                                    <input
                                        {...register("combination", { required: "Required for A-Level" })}
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. MPC (Maths, Physics, Comp)"
                                    />
                                    {errors.combination && <p className="text-red-500 text-xs mt-1 ml-1">{errors.combination.message}</p>}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Family */}
                <div>
                    <section className="h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-gray-400">family_restroom</span>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Family & Guardian Info</h4>
                        </div>

                        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700/50 space-y-4">
                            <div>
                                <InputLabel required>Father&apos;s Name</InputLabel>
                                <input
                                    {...register("fatherName", { required: "Required" })}
                                    type="text"
                                    className={`${inputClasses} bg-white dark:bg-black/20`}
                                    placeholder="e.g. Jean Pierre"
                                />
                                {errors.fatherName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fatherName.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Mother&apos;s Name</InputLabel>
                                <input
                                    {...register("motherName", { required: "Required" })}
                                    type="text"
                                    className={`${inputClasses} bg-white dark:bg-black/20`}
                                    placeholder="e.g. Marie Claire"
                                />
                                {errors.motherName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.motherName.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Primary Phone</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">call</span>
                                    <input
                                        {...register("primaryPhone", { required: "Required" })}
                                        type="tel"
                                        className={`${inputClasses} bg-white dark:bg-black/20 pl-11`}
                                        placeholder="+250 7..."
                                    />
                                </div>
                                {errors.primaryPhone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.primaryPhone.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Emergency Phone</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">sos</span>
                                    <input
                                        {...register("emergencyPhone", { required: "Required" })}
                                        type="tel"
                                        className={`${inputClasses} bg-white dark:bg-black/20 pl-11`}
                                        placeholder="+250 7..."
                                    />
                                </div>
                                {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.emergencyPhone.message}</p>}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Saving...
                        </>
                    ) : (
                        <>
                            <span>Register Student</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
