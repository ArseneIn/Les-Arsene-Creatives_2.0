"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";

declare global {
    interface Window {
        google: typeof google;
    }
}

export interface AddSchoolFormData {
    // Identity
    name: string;
    levels: string[]; // Primary, O-Level, A-Level, TVET
    genderType: 'Mixed' | 'Boys' | 'Girls';
    category: 'Day' | 'Boarding' | 'Mixed';

    // Location & Contact
    location: string;
    latitude?: number;
    longitude?: number;
    phone: string;
    email: string; // School Email
    website?: string;

    // Administrator
    adminName: string;
    adminEmail: string;
    adminPassword: string;

    // Subscription
    plan: 'Free' | 'Basic' | 'Standard' | 'Premium';
    billingCycle: 'Monthly' | 'Yearly';
}

interface AddSchoolFormProps {
    initialData?: Partial<AddSchoolFormData>;
    isEditing?: boolean;
    onSubmit: (data: AddSchoolFormData) => void;
    onCancel: () => void;
}

export default function AddSchoolForm({ initialData, isEditing = false, onSubmit, onCancel }: AddSchoolFormProps) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<AddSchoolFormData>({
        defaultValues: {
            name: initialData?.name || '',
            levels: initialData?.levels || [],
            genderType: initialData?.genderType || 'Mixed',
            category: initialData?.category || 'Day',
            location: initialData?.location || '',
            latitude: initialData?.latitude,
            longitude: initialData?.longitude,
            phone: initialData?.phone || '',
            email: initialData?.email || '',
            website: initialData?.website || '',
            adminName: initialData?.adminName || '',
            adminEmail: initialData?.adminEmail || '',
            adminPassword: '', 
            plan: initialData?.plan || 'Free',
            billingCycle: initialData?.billingCycle || 'Monthly'
        }
    });

    // React.useEffect removed: Google Maps initialization disabled for manual location typing


    const formData = useWatch({ control }) as AddSchoolFormData;

    return (
        <div className="flex flex-col w-full bg-slate-50/50 dark:bg-slate-900/50">
            {/* Form Area */}
            <div className="p-8 space-y-8">
                <form id="school-registration-form" onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 pb-12">
                    
                    {/* SECTION 1: IDENTITY */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined">domain</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Institutional Identity</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">School Name</label>
                                    <input
                                        {...register("name", { required: "Name is required" })}
                                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                        placeholder="e.g. Green Hills Academy"
                                    />
                                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Levels of Education</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Nursery', 'Primary', 'O-Level', 'A-Level', 'TVET'].map((level) => (
                                            <label key={level} className="relative flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 group">
                                                <input
                                                    type="checkbox"
                                                    value={level}
                                                    {...register("levels", { required: "Select at least one level" })}
                                                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                                                />
                                                <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.levels && <span className="text-red-500 text-xs mt-1 block">{errors.levels.message}</span>}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Gender Setting</label>
                                        <div className="flex flex-wrap gap-4">
                                            {['Mixed', 'Boys', 'Girls'].map((type) => (
                                                <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value={type}
                                                        {...register("genderType", { required: true })}
                                                        className="w-4 h-4 text-primary border-slate-300 focus:ring-primary focus:ring-offset-0 bg-transparent"
                                                    />
                                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Accommodation</label>
                                        <div className="flex flex-wrap gap-4">
                                            {['Day', 'Boarding', 'Mixed'].map((cat) => (
                                                <label key={cat} className="flex items-center gap-2.5 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value={cat}
                                                        {...register("category", { required: true })}
                                                        className="w-4 h-4 text-primary border-slate-300 focus:ring-primary focus:ring-offset-0 bg-transparent"
                                                    />
                                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{cat}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: CONTACT & LOCATION */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <span className="material-symbols-outlined">location_on</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact & Geography</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Institutional Email</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">alternate_email</span>
                                        <input
                                            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="info@school.rw"
                                        />
                                    </div>
                                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">call</span>
                                        <input
                                            {...register("phone", { required: "Phone is required" })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="+250 78..."
                                        />
                                    </div>
                                    {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">School Physical Location</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">map</span>
                                        <input
                                            {...register("location", { required: "Location is required" })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="e.g. KN 2 St, Kigali, Rwanda"
                                        />
                                    </div>
                                    {errors.location && <span className="text-red-500 text-xs mt-1 block">{errors.location.message}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: ADMINISTRATION */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                <span className="material-symbols-outlined">person_pin_circle</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Super Administration</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">School Principal / Head Teacher Name</label>
                                    <input
                                        {...register("adminName", { required: "Admin name is required" })}
                                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                        placeholder="Full Name of the Administrator"
                                    />
                                    {errors.adminName && <span className="text-red-500 text-xs mt-1 block">{errors.adminName.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Login Email</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                                        <input
                                            {...register("adminEmail", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="admin@school.rw"
                                        />
                                    </div>
                                    {errors.adminEmail && <span className="text-red-500 text-xs mt-1 block">{errors.adminEmail.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Default Secure Password {isEditing && <span className="lowercase text-slate-400 font-normal ml-1">(Optional)</span>}
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                        <input
                                            {...register("adminPassword", {
                                                required: !isEditing && "Password is required",
                                                minLength: { value: 6, message: "Min 6 characters" }
                                            })}
                                            type="password"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.adminPassword && <span className="text-red-500 text-xs mt-1 block">{errors.adminPassword.message}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: SUBSCRIPTION */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <span className="material-symbols-outlined">verified_user</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Licensing & Plans</h3>
                        </div>
                        <div className="p-6 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { id: 'Free', price: '0', color: 'bg-slate-500', desc: 'Core academic tools' },
                                    { id: 'Basic', price: '50k', color: 'bg-blue-500', desc: 'Advanced reporting' },
                                    { id: 'Standard', price: '150k', color: 'bg-primary', desc: 'Full operations suite' },
                                    { id: 'Premium', price: '300k', color: 'bg-purple-600', desc: 'Unlimited & Finance' }
                                ].map((p) => (
                                    <label key={p.id} className={`group relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.plan === p.id ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-slate-100 dark:border-slate-700/50 hover:border-primary/40'}`}>
                                        <input
                                            type="radio"
                                            value={p.id}
                                            {...register("plan")}
                                            className="sr-only"
                                        />
                                        <div className={`size-8 rounded-lg ${p.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                        </div>
                                        <span className="font-black text-slate-900 dark:text-white mb-1">{p.id}</span>
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">{p.desc}</span>
                                        <div className="mt-auto">
                                            <span className="text-lg font-black text-slate-900 dark:text-white">{p.price}</span>
                                            <span className="text-[10px] text-slate-500 font-bold ml-1 uppercase">RWF / Mo</span>
                                        </div>
                                        {formData.plan === p.id && (
                                            <div className="absolute top-2 right-2 text-primary">
                                                <span className="material-symbols-outlined text-xl">check_circle</span>
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Billing Cycle</h4>
                                    <p className="text-xs text-slate-500 mt-1">Choose how you want to be invoiced.</p>
                                </div>
                                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                    {['Monthly', 'Yearly'].map((cycle) => (
                                        <label key={cycle} className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg text-center cursor-pointer transition-all text-sm font-bold ${formData.billingCycle === cycle ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                                            <input type="radio" value={cycle} {...register("billingCycle")} className="sr-only" />
                                            {cycle} {cycle === 'Yearly' && <span className="block text-[8px] opacity-75">-15% Saving</span>}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Sticky Footer */}
            <div className="px-8 py-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 transition-all"
                >
                    Discard Changes
                </button>
                <div className="flex gap-4">
                    <button
                        form="school-registration-form"
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-3.5 rounded-2xl font-black text-white bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                    >
                        {isSubmitting ? 'Saving...' : isEditing ? 'Update Profile' : 'Complete Registration'}
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
