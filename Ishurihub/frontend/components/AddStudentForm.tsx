"use client";

import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

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

    // Guardian Info
    guardians: {
        name: string;
        relation: string;
        phone: string;
        email?: string;
    }[];
}

interface AddStudentFormProps {
    onSubmit: (data: AddStudentFormData) => void;
    onCancel: () => void;
    initialData?: Partial<AddStudentFormData>; // Added for Edit Mode
}

const InputLabel = ({ children, required, subtitle }: { children: React.ReactNode, required?: boolean, subtitle?: string }) => (
    <div className="mb-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {children} {required && <span className="text-red-500">*</span>}
        </label>
        {subtitle && <p className="text-xs text-gray-400 font-normal">{subtitle}</p>}
    </div>
);

export default function AddStudentForm({ onSubmit, onCancel, initialData }: AddStudentFormProps) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<AddStudentFormData>({
        defaultValues: initialData || {
            guardians: [{ name: '', relation: '', phone: '' }] // Default one empty guardian
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "guardians"
    });

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

    const grade = useWatch({ control, name: "grade" });

    // Auto-detect Combination from Class Name
    useEffect(() => {
        if (grade && level === 'A-Level') {
            // Look for standard 3-letter upper case combination pattern (excluding S4, S5, S6)
            // This handles "S4 MCE" and "S4 MCE A"
            const parts = grade.split(' ');
            const foundCombo = parts.find(p => /^[A-Z]{3}$/.test(p) && !['III', 'IV'].includes(p)); // Avoid Roman numerals if any

            if (foundCombo) {
                setValue("combination", foundCombo);
            }
        }
    }, [grade, level, setValue]);

    // Fetch classes
    const [availableClasses, setAvailableClasses] = useState<any[]>([]);
    const params = useParams();
    const schoolId = params.id as string;

    useEffect(() => {
        if (schoolId) {
            api.get('/classes', { params: { schoolId } })
                .then(res => setAvailableClasses(res.data))
                .catch(err => console.error(err));
        }
    }, [schoolId]);

    const classOptions = availableClasses.filter(c => !level || c.level === level);

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Intro */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined">{initialData ? 'edit' : 'person_add'}</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{initialData ? 'Edit Student Profile' : 'New Student Enrollment'}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{initialData ? 'Update the student\'s information below.' : 'Enter the student\'s details to register them in the system.'}</p>
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
                                        {classOptions.length > 0 ? (
                                            classOptions.map(cls => (
                                                <option key={cls.id} value={`${cls.year} ${cls.stream}`}>
                                                    {cls.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No classes found for this level</option>
                                        )}
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined pointer-events-none">expand_more</span>
                                </div>
                                {errors.grade && <p className="text-red-500 text-xs mt-1 ml-1">{errors.grade.message}</p>}
                            </div>

                            {level === 'A-Level' && (
                                <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2">
                                    <InputLabel required>Combination</InputLabel>
                                    <div className="relative">
                                        <select
                                            {...register("combination", { required: "Required for A-Level" })}
                                            className={`${inputClasses} appearance-none cursor-pointer`}
                                        >
                                            <option value="">Select Combination...</option>
                                            <optgroup label="Sciences">
                                                {["PCM", "PCB", "MCB", "MPC", "MPG", "BCP", "MEG"].map(c => <option key={c} value={c}>{c}</option>)}
                                            </optgroup>
                                            <optgroup label="Humanities & Languages">
                                                {["HEG", "HEL", "LEG", "LGL", "LFK", "HGL"].map(c => <option key={c} value={c}>{c}</option>)}
                                            </optgroup>
                                            <optgroup label="Technical & Other">
                                                {["MCE", "CEM", "EFK"].map(c => <option key={c} value={c}>{c}</option>)}
                                            </optgroup>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined pointer-events-none">expand_more</span>
                                    </div>
                                    {errors.combination && <p className="text-red-500 text-xs mt-1 ml-1">{errors.combination.message}</p>}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Family & Guardians */}
                <div>
                    <section className="h-full">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400">family_restroom</span>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Guardians</h4>
                            </div>
                            <button
                                type="button"
                                onClick={() => append({ name: '', relation: '', phone: '', email: '' })}
                                className="text-xs font-bold text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined !text-sm">add</span>
                                Add Another
                            </button>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700/50 relative group">
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="text-xs font-bold uppercase text-gray-400">Guardian #{index + 1}</h5>
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                                title="Remove"
                                            >
                                                <span className="material-symbols-outlined !text-sm">delete</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-span-2">
                                                <InputLabel required>Name</InputLabel>
                                                <input
                                                    {...register(`guardians.${index}.name`, { required: "Name is required" })}
                                                    type="text"
                                                    className={`${inputClasses} py-2 text-sm`}
                                                    placeholder="e.g. Jean Pierre"
                                                />
                                                {errors.guardians?.[index]?.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.guardians[index]?.name?.message}</p>}
                                            </div>

                                            <div>
                                                <InputLabel required>Relationship</InputLabel>
                                                <div className="relative">
                                                    <select
                                                        {...register(`guardians.${index}.relation`, { required: "Required" })}
                                                        className={`${inputClasses} py-2 text-sm appearance-none cursor-pointer`}
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="Father">Father</option>
                                                        <option value="Mother">Mother</option>
                                                        <option value="Guardian">Guardian</option>
                                                        <option value="Sibling">Sibling</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined pointer-events-none !text-sm">expand_more</span>
                                                </div>
                                                {errors.guardians?.[index]?.relation && <p className="text-red-500 text-xs mt-1 ml-1">{errors.guardians[index]?.relation?.message}</p>}
                                            </div>

                                            <div>
                                                <InputLabel required>Phone</InputLabel>
                                                <input
                                                    {...register(`guardians.${index}.phone`, { required: "Required" })}
                                                    type="tel"
                                                    className={`${inputClasses} py-2 text-sm`}
                                                    placeholder="+250 7..."
                                                />
                                                {errors.guardians?.[index]?.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.guardians[index]?.phone?.message}</p>}
                                            </div>

                                            <div className="col-span-2">
                                                <InputLabel>Email (Optional)</InputLabel>
                                                <input
                                                    {...register(`guardians.${index}.email`)}
                                                    type="email"
                                                    className={`${inputClasses} py-2 text-sm`}
                                                    placeholder="guardian@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                            <span>{initialData ? 'Update Profile' : 'Register Student'}</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
