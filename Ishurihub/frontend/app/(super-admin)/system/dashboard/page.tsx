"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import AddSchoolForm, { AddSchoolFormData } from "@/components/AddSchoolForm";
import api from "@/lib/api";
import { AxiosError } from 'axios';

// Define the Backend response interface
interface BackendSchool {
    id: string;
    name: string;
    type?: string;
    category?: string;
    levels?: string[];
    location: string;
    latitude?: number;
    longitude?: number;
    students?: unknown[];
    subscriptionStatus?: string;
    logoUrl?: string;
    createdAt: string;
    plan?: string;
}

// Define the Institution interface based on backend entity
interface Institution {
    id: string;
    name: string;
    type: string;
    category?: string;
    levels?: string[];
    location: string;
    latitude?: number;
    longitude?: number;
    studentCount: number; // This might need to be added to backend response or calculated
    status: string; // 'Active', 'Pending', etc.
    logoUrl?: string;
    createdAt: string;
    plan?: string;
    subscriptionStatus?: string;
}

export default function InstitutionsPage() {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState<AddSchoolFormData & { id?: string } | null>(null);

    // ... (imports)

    // ...

    // Fetch institutions from API
    const fetchInstitutions = async () => {
        try {
            setIsLoading(true);
            const response = await api.get<BackendSchool[]>('/schools');
            // Ensure response data maps to our interface.
            const data = response.data.map((school) => ({
                ...school,
                type: school.name.includes('University') ? 'University' : 'K-12', // distinct property 'type' is missing in BackendSchool? adding fallback or logic
                studentCount: school.students?.length || 0,
                status: school.subscriptionStatus || 'Active',
                // Ensure mandatory Institution fields are present if not in BackendSchool
                location: school.location || '',
            }));
            setInstitutions(data as Institution[]);
        } catch (err) {
            console.error("Failed to fetch schools:", err);
            setError("Failed to load institutions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const handleSaveSchool = async (data: AddSchoolFormData) => {
        try {
            if (editingSchool?.id) {
                // Update existing school
                await api.patch(`/schools/${editingSchool.id}`, data);
            } else {
                // Create new school
                await api.post('/schools', {
                    ...data,
                });
            }
            await fetchInstitutions(); // Refresh list
            setIsModalOpen(false);
            setEditingSchool(null);
        } catch (err: unknown) {
            console.error("Failed to save school:", err);
            const error = err as AxiosError<{ message: string }>;
            alert(error.response?.data?.message || "Failed to save school");
        }
    };

    const handleEditSchool = (inst: Institution) => {
        // Map Institution back to AddSchoolFormData
        // Note: Some fields might be missing in the simple Institution list view so ideally we fetch details, 
        // but for now we map what we have.
        setEditingSchool({
            id: inst.id,
            name: inst.name,
            levels: inst.levels || [],
            genderType: 'Mixed', // Default or need to be in Institution interface
            category: (inst.category as AddSchoolFormData['category']) || 'Day',
            location: inst.location,
            latitude: inst.latitude,
            longitude: inst.longitude,
            phone: '', // Need to ensure backend sends this or fetch detail
            email: '', // Need to ensure backend sends this or fetch detail
            adminName: '', // Usually separate user entity
            adminEmail: '',
            adminPassword: '',
            plan: (inst.plan as AddSchoolFormData['plan']) || 'Free',
            billingCycle: 'Monthly'
        });
        setIsModalOpen(true);
    };

    const handleDeleteSchool = async (id: string) => {
        if (!confirm("Are you sure you want to delete this school? This action cannot be undone.")) return;
        try {
            await api.delete(`/schools/${id}`);
            setInstitutions(prev => prev.filter(i => i.id !== id));
        } catch (err: unknown) {
            console.error("Failed to delete school:", err);
            alert("Failed to delete school.");
        }
    };

    // Derived Stats
    const totalStudents = institutions.reduce((acc, curr) => acc + (curr.studentCount || 0), 0);
    const activeLicenses = institutions.filter(i => i.status === 'Active').length;

    return (
        <div className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
                {/* PageHeading */}
                <div className="flex flex-wrap justify-between items-end gap-3 pb-6">
                    <div className="flex min-w-72 flex-col gap-1">
                        <h1 className="text-slate-900 dark:text-white text-3xl font-heading font-black leading-tight tracking-[-0.033em]">Institutions</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Manage registered schools and educational centers.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setEditingSchool(null);
                                setIsModalOpen(true);
                            }}
                            className="flex min-w-[140px] items-center justify-center rounded-lg h-11 px-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px] mr-2">add_business</span>
                            Register School
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* ... stats ... */}
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">domain</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Institutions</p>
                        </div>
                        <h3 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{institutions.length}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <span className="material-symbols-outlined">groups</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Students</p>
                        </div>
                        <h3 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
                            {totalStudents.toLocaleString()}
                        </h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined">verified</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Licenses</p>
                        </div>
                        <h3 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
                            {activeLicenses}
                        </h3>
                    </div>
                </div>

                {/* Institutions Table */}
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20 overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center text-slate-500">Loading schools...</div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-500">{error}</div>
                    ) : institutions.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">No schools registered yet.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Institution Name</th>
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Students</th>
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {institutions.map((inst) => (
                                    <tr key={inst.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 bg-cover bg-center shadow-sm"
                                                    style={{ backgroundImage: `url('${inst.logoUrl || "https://ui-avatars.com/api/?name=" + inst.name}')` }}
                                                >
                                                </div>
                                                <div>
                                                    <p className="text-slate-900 dark:text-white text-sm font-bold">{inst.name}</p>
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs">Joined: {new Date(inst.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">{inst.type || 'General'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-slate-600 dark:text-slate-300 text-sm">{inst.location || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white text-sm font-bold">
                                            {inst.studentCount?.toLocaleString() || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider ${inst.plan === 'Premium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                inst.plan === 'Standard' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' :
                                                    inst.plan === 'Basic' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                                        'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                {inst.plan || 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${inst.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                                inst.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                                }`}>
                                                <span className={`size-1.5 rounded-full ${inst.status === 'Active' ? 'bg-green-500' :
                                                    inst.status === 'Pending' ? 'bg-amber-500' :
                                                        'bg-red-500'
                                                    }`}></span>
                                                {inst.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/school/${inst.id}/dashboard`}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleEditSchool(inst)}
                                                    className="inline-flex items-center justify-center p-1.5 bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                                                    title="Edit School"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSchool(inst.id)}
                                                    className="inline-flex items-center justify-center p-1.5 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-all"
                                                    title="Delete School"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>


            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSchool ? "Edit School" : "Register New School"}
                size="full"
            >
                <AddSchoolForm
                    initialData={editingSchool || undefined}
                    isEditing={!!editingSchool}
                    onSubmit={handleSaveSchool}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div >
    );
}
