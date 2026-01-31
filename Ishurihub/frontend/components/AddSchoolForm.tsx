"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export interface AddSchoolFormData {
    // Identity
    name: string;
    levels: string[]; // Primary, O-Level, A-Level, TVET
    genderType: 'Mixed' | 'Boys' | 'Girls';
    category: 'Day' | 'Boarding' | 'Mixed';

    // Location & Contact
    location: string;
    phone: string;
    email: string; // School Email
    website?: string;

    // Administrator
    adminName: string;
    adminEmail: string;
    adminPassword: string;

    // Subscription
    plan: 'Free' | 'Basic' | 'Premium';
    billingCycle: 'Monthly' | 'Yearly';
}

interface AddSchoolFormProps {
    initialData?: Partial<AddSchoolFormData>;
    isEditing?: boolean;
    onSubmit: (data: AddSchoolFormData) => void;
    onCancel: () => void;
}

const STEPS = [
    { id: 1, title: "Identity", icon: "school" },
    { id: 2, title: "Contact", icon: "location_on" },
    { id: 3, title: "Administrator", icon: "admin_panel_settings" },
    { id: 4, title: "Subscription", icon: "payments" },
];

export default function AddSchoolForm({ initialData, isEditing = false, onSubmit, onCancel }: AddSchoolFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const { register, handleSubmit, control, trigger, formState: { errors } } = useForm<AddSchoolFormData>({
        defaultValues: {
            name: initialData?.name || '',
            levels: initialData?.levels || [],
            genderType: initialData?.genderType || 'Mixed',
            category: initialData?.category || 'Day',
            location: initialData?.location || '',
            phone: initialData?.phone || '',
            email: initialData?.email || '',
            website: initialData?.website || '',
            adminName: initialData?.adminName || '',
            adminEmail: initialData?.adminEmail || '',
            adminPassword: '', // Don't pre-fill password for security/logic reasons usually, or maybe handled by backend
            plan: initialData?.plan || 'Free',
            billingCycle: initialData?.billingCycle || 'Monthly'
        }
    });

    const formData = useWatch({ control }) as AddSchoolFormData;

    const nextStep = async () => {
        let valid = false;
        if (currentStep === 1) valid = await trigger(['name', 'levels', 'genderType', 'category']);
        if (currentStep === 2) valid = await trigger(['location', 'phone', 'email']);
        if (currentStep === 3) {
            // If editing, password might be optional if left blank? 
            // For now enforcing validation same as create to keep simple or assume re-entry.
            // Actually, for edit, usually we don't require password re-entry unless changing it.
            // Let's keep it simple: required.
            valid = await trigger(['adminName', 'adminEmail', 'adminPassword']);
        }

        if (valid) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    return (
        <div className="flex flex-col md:flex-row h-[70vh] min-h-[500px] w-full">
            {/* Sidebar / Progress */}
            <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                        {isEditing ? 'Edit School' : 'Register School'}
                    </h2>
                    <div className="space-y-1">
                        {STEPS.map((step) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;
                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-primary/10 text-primary' :
                                        isCompleted ? 'text-green-600' : 'text-slate-400'
                                        }`}
                                >
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold ${isActive ? 'border-primary bg-primary text-white' :
                                        isCompleted ? 'border-green-600 bg-green-600 text-white' : 'border-slate-300'
                                        }`}>
                                        {isCompleted ? <span className="material-symbols-outlined text-sm">check</span> : step.id}
                                    </div>
                                    <span className={`text-sm font-medium ${isActive ? 'text-slate-900 dark:text-white' : ''}`}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="text-xs text-slate-400 hidden md:block">
                    Step {currentStep} of {STEPS.length}
                </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1">

                    {/* STEP 1: IDENTITY */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Institution Details</h3>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    School Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("name", { required: "Name is required" })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="e.g. Green Hills Academy"
                                />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    School Type <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Nursery', 'Primary', 'O-Level', 'A-Level', 'TVET'].map((level) => (
                                        <label key={level} className="relative flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                            <input
                                                type="checkbox"
                                                value={level}
                                                {...register("levels", { required: "Select at least one level" })}
                                                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                                            />
                                            <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">{level}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.levels && <span className="text-red-500 text-xs">{errors.levels.message}</span>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Gender Composition <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                        {['Mixed', 'Boys Only', 'Girls Only'].map((type) => (
                                            <label key={type} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={type}
                                                    {...register("genderType", { required: true })}
                                                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                                                />
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Accommodation <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                        {['Day', 'Boarding', 'Mixed'].map((cat) => (
                                            <label key={cat} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={cat}
                                                    {...register("category", { required: true })}
                                                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                                                />
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CONTACT */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Location & Contact</h3>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    School Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="info@school.rw"
                                />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("phone", { required: "Phone is required" })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="+250 78..."
                                />
                                {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Address / Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("location", { required: "Location is required" })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="District, Sector"
                                />
                                {errors.location && <span className="text-red-500 text-xs">{errors.location.message}</span>}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: ADMINISTRATOR */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Admin Account</h3>
                            <p className="text-sm text-slate-500 mb-6">This user will be the main Super Admin for the school.</p>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Head Teacher Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("adminName", { required: "Admin name is required" })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="Full Name"
                                />
                                {errors.adminName && <span className="text-red-500 text-xs">{errors.adminName.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Admin Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("adminEmail", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="admin@school.rw"
                                />
                                {errors.adminEmail && <span className="text-red-500 text-xs">{errors.adminEmail.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Default Password {isEditing && <span className="text-xs text-slate-500">(Leave blank to keep current)</span>}
                                </label>
                                <input
                                    {...register("adminPassword", {
                                        required: !isEditing && "Password is required",
                                        minLength: { value: 6, message: "Min 6 characters" }
                                    })}
                                    type="password"
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="******"
                                />
                                {errors.adminPassword && <span className="text-red-500 text-xs">{errors.adminPassword.message}</span>}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: SUBSCRIPTION */}
                    {currentStep === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Subscription Plan</h3>

                            <div className="grid grid-cols-1 gap-4">
                                {['Free', 'Basic', 'Premium'].map((plan) => (
                                    <label key={plan} className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.plan === plan ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'
                                        }`}>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <input
                                                    type="radio"
                                                    value={plan}
                                                    {...register("plan")}
                                                    className="w-5 h-5 text-primary border-slate-300 focus:ring-primary"
                                                />
                                                <span className="font-bold text-slate-900 dark:text-white">{plan} Plan</span>
                                            </div>
                                            <p className="text-xs text-slate-500 ml-8">
                                                {plan === 'Free' ? 'Essential features for small schools.' :
                                                    plan === 'Basic' ? 'Advanced reporting and finance.' :
                                                        'Unimited access to all modules.'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-slate-900 dark:text-white">
                                                {plan === 'Free' ? '0 RWF' : plan === 'Basic' ? '50k RWF' : '100k RWF'}
                                            </span>
                                            <span className="text-xs text-slate-500">/month</span>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Billing Cycle:</span>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="Monthly" {...register("billingCycle")} className="text-primary focus:ring-primary" />
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Monthly</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="Yearly" {...register("billingCycle")} className="text-primary focus:ring-primary" />
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Yearly (Save 10%)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                </form>

                {/* Footer Buttons */}
                <div className="mt-auto pt-6 flex justify-between border-t border-slate-200 dark:border-slate-700">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                            Back
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            Cancel
                        </button>
                    )}

                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-2.5 rounded-xl font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 transition-colors flex items-center gap-2"
                        >
                            Next Step
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit(onSubmit)}
                            className="px-8 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
                        >
                            {isEditing ? 'Update School' : 'Complete Registration'}
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
