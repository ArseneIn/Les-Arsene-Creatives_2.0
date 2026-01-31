"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export interface AddTeacherFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    classes: string[]; // For UI checkboxes
    joinedDate: string;
}

interface AddTeacherFormProps {
    onSubmit: (data: AddTeacherFormData) => void;
    onCancel: () => void;
}

const InputLabel = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {children} {required && <span className="text-red-500">*</span>}
    </label>
);

export default function AddTeacherForm({ onSubmit, onCancel }: AddTeacherFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AddTeacherFormData>();

    const [availableClasses, setAvailableClasses] = useState<{ id: string; name: string; year: string; stream: string }[]>([]);
    const params = useParams();
    const schoolId = params.id as string;

    useEffect(() => {
        if (schoolId) {
            api.get('/classes', { params: { schoolId } })
                .then(res => setAvailableClasses(res.data))
                .catch(err => console.error(err));
        }
    }, [schoolId]);

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Intro */}
            <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/20">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">New Teacher Registration</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enter the teacher&apos;s details to register them in the system.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Personal Info */}
                <div className="space-y-8">
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-gray-400">badge</span>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Professional Identity</h4>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <InputLabel required>Full Name</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">person</span>
                                    <input
                                        {...register("name", { required: "Full name is required" })}
                                        type="text"
                                        className={`${inputClasses} pl-11`}
                                        placeholder="e.g. Dr. Jean Pierre"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Email Address</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">mail</span>
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        type="email"
                                        className={`${inputClasses} pl-11`}
                                        placeholder="e.g. jean@school.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Phone Number</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">call</span>
                                    <input
                                        {...register("phone", { required: "Phone is required" })}
                                        type="tel"
                                        className={`${inputClasses} pl-11`}
                                        placeholder="+250 7..."
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Joining Date</InputLabel>
                                <input
                                    {...register("joinedDate", { required: "Required" })}
                                    type="date"
                                    className={inputClasses}
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                                {errors.joinedDate && <p className="text-red-500 text-xs mt-1 ml-1">{errors.joinedDate.message}</p>}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Academic & Assignment */}
                <div>
                    <section className="h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-gray-400">assignment_ind</span>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Academic Assignment</h4>
                        </div>

                        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700/50 space-y-6">
                            <div>
                                <InputLabel required>Primary Subject</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">menu_book</span>
                                    <input
                                        {...register("subject", { required: "Subject is required" })}
                                        type="text"
                                        className={`${inputClasses} bg-white dark:bg-black/20 pl-11`}
                                        placeholder="e.g. Mathematics"
                                    />
                                </div>
                                {errors.subject && <p className="text-red-500 text-xs mt-1 ml-1">{errors.subject.message}</p>}
                            </div>

                            <div>
                                <InputLabel required>Assigned Classes</InputLabel>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {availableClasses.length > 0 ? (
                                        availableClasses.map((cls) => (
                                            <label key={cls.id} className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-600/50 cursor-pointer hover:border-primary/50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    value={`${cls.year} ${cls.stream}`}
                                                    {...register("classes", { required: "Select at least one class" })}
                                                    className="rounded text-primary focus:ring-primary/20 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 size-4"
                                                />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cls.name}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="col-span-3 text-sm text-gray-400 italic">No classes found. Please create classes first.</p>
                                    )}
                                </div>
                                {errors.classes && <p className="text-red-500 text-xs mt-2 ml-1">{errors.classes.message}</p>}
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
                    className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Saving...
                        </>
                    ) : (
                        <>
                            <span>Register Teacher</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
