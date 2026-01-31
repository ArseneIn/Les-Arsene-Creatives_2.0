"use client";

import { useState, useEffect } from "react";
import { Teacher } from "@/data/teachers";
import api from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal";
import AddTeacherForm, { AddTeacherFormData } from "@/components/AddTeacherForm";

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const params = useParams();
    const schoolId = params.id as string;

    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/teachers', {
                params: { schoolId }
            });
            setTeachers(response.data);
        } catch (error) {
            console.error("Failed to fetch teachers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (schoolId) {
            fetchTeachers();
        }
    }, [schoolId]);

    const handleAddTeacher = async (data: AddTeacherFormData) => {
        try {
            const newTeacherData = {
                ...data,
                schoolId: schoolId,
                status: 'Active',
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
            };

            await api.post('/teachers', newTeacherData);
            await fetchTeachers(); // Refresh list
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to add teacher:", error);
            // Ideally show a toast notification here
        }
    };

    // Stats
    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter(t => t.status === 'Active').length;
    const onLeaveTeachers = teachers.filter(t => t.status === 'On Leave').length;

    return (
        <div className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 pb-4">
                    <Link href={`/school/${schoolId}/dashboard`} className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium hover:text-primary">Home</Link>
                    <span className="text-[#4c4c9a] dark:text-gray-600 text-sm font-medium">/</span>
                    <span className="text-black dark:text-white text-sm font-bold">Teachers Directory</span>
                </div>

                {/* PageHeading */}
                <div className="flex flex-wrap justify-between items-end gap-3 pb-6">
                    <div className="flex min-w-72 flex-col gap-1">
                        <h1 className="text-black dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Staff Management</h1>
                        <p className="text-[#4c4c9a] dark:text-gray-400 text-base font-normal">Manage teaching staff, assignments, and profiles.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex min-w-[120px] items-center justify-center rounded-lg h-11 px-5 bg-white border border-[#cfcfe7] dark:bg-white/5 dark:border-white/10 text-black dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
                            <span className="material-symbols-outlined text-[18px] mr-2">file_download</span>
                            Export List
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex min-w-[140px] items-center justify-center rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px] mr-2">person_add</span>
                            Add Teacher
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#cfcfe7] dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined">groups</span>
                            </div>
                            <p className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium">Total Teachers</p>
                        </div>
                        <h3 className="text-3xl font-bold text-black dark:text-white">{totalTeachers}</h3>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#cfcfe7] dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                            <p className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium">Active Staff</p>
                        </div>
                        <h3 className="text-3xl font-bold text-black dark:text-white">{activeTeachers}</h3>
                    </div>
                    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#cfcfe7] dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                                <span className="material-symbols-outlined">beach_access</span>
                            </div>
                            <p className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium">On Leave</p>
                        </div>
                        <h3 className="text-3xl font-bold text-black dark:text-white">{onLeaveTeachers}</h3>
                    </div>
                </div>

                {/* Teachers Table */}
                <div className="overflow-hidden rounded-xl border border-[#cfcfe7] dark:border-white/10 bg-white dark:bg-white/5 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8f8fc] dark:bg-white/5 border-b border-[#cfcfe7] dark:border-white/10">
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Teacher</th>
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Classes</th>
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#cfcfe7] dark:divide-white/10">
                            {teachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center border border-gray-300 dark:border-gray-600"
                                                style={{ backgroundImage: `url('${teacher.avatarUrl}')` }}
                                            ></div>
                                            <div>
                                                <p className="text-black dark:text-white text-sm font-bold">{teacher.name}</p>
                                                <p className="text-[#4c4c9a] dark:text-gray-500 text-xs">{teacher.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-black dark:text-white text-sm font-medium">{teacher.subject}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {teacher.classes.map((cls, idx) => (
                                                <span key={idx} className="px-2 py-0.5 rounded bg-[#e7e7f3] dark:bg-white/10 text-[#4c4c9a] dark:text-gray-300 text-xs font-bold">
                                                    {cls}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${teacher.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                            teacher.status === 'On Leave' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                            }`}>
                                            <span className={`size-1.5 rounded-full ${teacher.status === 'Active' ? 'bg-green-500' :
                                                teacher.status === 'On Leave' ? 'bg-amber-500' :
                                                    'bg-red-500'
                                                }`}></span>
                                            {teacher.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Teacher Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Staff"
                size="4xl"
            >
                <AddTeacherForm
                    onSubmit={handleAddTeacher}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
