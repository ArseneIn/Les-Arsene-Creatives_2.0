"use client";

import { useState, useEffect } from "react";
import { Student } from "@/data/students";
import api from "@/lib/api";
import Link from "next/link";
import Modal from "@/components/Modal";
import AddStudentForm, { AddStudentFormData } from "@/components/AddStudentForm";
import { useParams, useRouter } from "next/navigation";

import BulkImportModal from "@/components/students/BulkImportModal";

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Filters
    const [gradeFilter, setGradeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All"); // Default to All

    const params = useParams();
    const router = useRouter();
    const schoolId = params.id as string;

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/students', {
                    params: { schoolId }
                });
                setStudents(response.data);
                setFilteredStudents(response.data);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            }
        };

        if (schoolId) {
            fetchStudents();
        }
    }, [schoolId]);

    // Apply Filters
    useEffect(() => {
        let result = students;

        if (gradeFilter !== "All") {
            // Check both grade and year for compatibility
            result = result.filter(s => s.grade === gradeFilter || s.year === gradeFilter);
        }

        if (statusFilter !== "All") {
            if (statusFilter === "Active Cards") {
                result = result.filter(s => s.status === "Active");
            } else {
                result = result.filter(s => s.status === statusFilter);
            }
        }

        setFilteredStudents(result);
    }, [students, gradeFilter, statusFilter]);


    const handleAddStudent = async (data: AddStudentFormData) => {
        try {
            const newStudentData = {
                name: data.fullName,
                admissionYear: data.admissionYear,
                level: data.level,
                year: data.grade,
                combination: data.combination,
                dob: data.dob,
                gender: data.gender,
                guardians: data.guardians,
                primaryPhone: data.guardians[0]?.phone, // Use first guardian's phone for backward compat
                emergencyPhone: data.guardians[0]?.phone, // Fallback
                grade: data.grade,
                schoolId: schoolId,
                status: "Pending",
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=random`,
            };

            await api.post('/students', newStudentData);
            window.location.reload();
        } catch (error) {
            console.error("Failed to add student:", error);
        }
    };

    return (
        <div className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 pb-4">
                    <Link href={`/school/${schoolId}/dashboard`} className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium hover:text-primary">Home</Link>
                    <span className="text-[#4c4c9a] dark:text-gray-600 text-sm font-medium">/</span>
                    <span className="text-black dark:text-white text-sm font-bold">Student Management</span>
                </div>

                {/* PageHeading */}
                <div className="flex flex-wrap justify-between items-end gap-3 pb-6">
                    <div className="flex min-w-72 flex-col gap-1">
                        <p className="text-black dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Student & Card Registry</p>
                        <p className="text-[#4c4c9a] dark:text-gray-400 text-base font-normal">Manage student records and monitor physical card issuance status.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="flex min-w-[120px] items-center justify-center rounded-lg h-11 px-5 bg-white border border-[#cfcfe7] dark:bg-white/5 dark:border-white/10 text-black dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px] mr-2">upload_file</span>
                            Bulk Import
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex min-w-[140px] items-center justify-center rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px] mr-2">person_add</span>
                            Add Student
                        </button>
                    </div>
                </div>

                {/* Filter Chips & Actions Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 mb-6 bg-white dark:bg-white/5 rounded-xl border border-[#cfcfe7] dark:border-white/10">
                    <div className="flex gap-3 flex-wrap">
                        {/* Grade Filter */}
                        <div className="relative">
                            <select
                                value={gradeFilter}
                                onChange={(e) => setGradeFilter(e.target.value)}
                                className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-[#e7e7f3] dark:bg-white/10 px-4 pr-8 hover:bg-primary/10 transition-colors appearance-none cursor-pointer outline-none text-black dark:text-white text-sm font-semibold"
                            >
                                <option value="All">Grade: All</option>
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                                <option value="S4">S4</option>
                                <option value="S5">S5</option>
                                <option value="S6">S6</option>
                            </select>
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-[18px] pointer-events-none">expand_more</span>
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-[#e7e7f3] dark:bg-white/10 px-4 pr-8 hover:bg-primary/10 transition-colors appearance-none cursor-pointer outline-none text-black dark:text-white text-sm font-semibold"
                            >
                                <option value="All">Status: All</option>
                                <option value="Active Cards">Active Cards</option>
                                <option value="Pending">Pending</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-[18px] pointer-events-none">expand_more</span>
                        </div>

                        <button
                            onClick={() => { setGradeFilter("All"); setStatusFilter("All"); }}
                            className="text-primary text-sm font-bold px-2 hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                    <div className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium">
                        Showing <span className="text-black dark:text-white font-bold">{filteredStudents.length > 0 ? 1 : 0} to {filteredStudents.length}</span> of {students.length} results
                    </div>
                </div>

                {/* Table Container */}
                <div className="@container">
                    <div className="overflow-hidden rounded-xl border border-[#cfcfe7] dark:border-white/10 bg-white dark:bg-white/5 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary dark:bg-primary">
                                    <th className="px-6 py-4 text-white text-sm font-bold uppercase tracking-wider w-[350px]">Student Name</th>
                                    <th className="px-6 py-4 text-white text-sm font-bold uppercase tracking-wider">Level & Year</th>
                                    <th className="px-6 py-4 text-white text-sm font-bold uppercase tracking-wider">Card UID</th>
                                    <th className="px-6 py-4 text-white text-sm font-bold uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-white text-sm font-bold uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#cfcfe7] dark:divide-white/10">
                                {filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        onClick={() => router.push(`/school/${schoolId}/students/${student.id}`)}
                                        className="hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20 bg-cover bg-center"
                                                    style={{
                                                        backgroundImage: `url('${
                                                            student.avatarUrl && student.avatarUrl !== 'null' && student.avatarUrl !== 'undefined'
                                                                ? (student.avatarUrl.startsWith('http') ? student.avatarUrl : `http://localhost:4000${student.avatarUrl}`)
                                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Student')}&background=random`
                                                        }')`
                                                    }}
                                                >
                                                </div>
                                                <div>
                                                    <span className="text-black dark:text-white text-sm font-bold hover:underline hover:text-primary transition-all">
                                                        {student.name}
                                                    </span>
                                                    <p className="text-[#4c4c9a] dark:text-gray-500 text-xs">ID: {student.studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded bg-[#e7e7f3] dark:bg-white/10 text-primary dark:text-primary text-xs font-bold">{student.level}</span>
                                                    <span className="text-black dark:text-white text-sm font-bold">{student.year}</span>
                                                </div>
                                                {student.level === 'A-Level' && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {student.combination}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.cardUid ? (
                                                <code className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[#4c4c9a] dark:text-gray-300">{student.cardUid}</code>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs italic">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${student.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                                student.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                                }`}>
                                                <span className={`size-1.5 rounded-full ${student.status === 'Active' ? 'bg-green-500' :
                                                    student.status === 'Pending' ? 'bg-amber-500' :
                                                        'bg-red-500'
                                                    }`}></span>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {student.status === 'Pending' ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); /* Add logic to issue card */ }}
                                                    className="px-4 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-primary/90 transition-all shadow-sm"
                                                >
                                                    Issue New Card
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); /* Add logic to issue card */ }}
                                                    className="text-primary hover:text-primary/70 text-sm font-bold transition-colors"
                                                >
                                                    Issue New Card
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        <div className="px-6 py-4 flex items-center justify-between bg-[#f8f8fc] dark:bg-white/5 border-t border-[#cfcfe7] dark:border-white/10">
                            <p className="text-sm text-[#4c4c9a] dark:text-gray-400 font-medium">Showing <span className="text-black dark:text-white font-bold">1 to {filteredStudents.length}</span> of {students.length} results</p>
                            <div className="flex gap-1">
                                <button className="size-9 flex items-center justify-center rounded-lg border border-[#cfcfe7] dark:border-white/10 bg-white dark:bg-transparent text-black dark:text-white hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">1</button>
                                {/* Pagination logic can be added later */}
                                <button className="size-9 flex items-center justify-center rounded-lg border border-[#cfcfe7] dark:border-white/10 bg-white dark:bg-transparent text-black dark:text-white hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Footer Info */}
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#4c4c9a] dark:text-gray-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-500"></span> {students.filter(s => s.status === 'Active').length} Active Cards</span>
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500"></span> {students.filter(s => s.status === 'Pending').length} Pending Requests</span>
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500"></span> {students.filter(s => s.status === 'Inactive').length} Inactive/Lost</span>
                    </div>
                    <div>Data up to date</div>
                </div>
            </div>

            {/* Add Student Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Register New Student"
                size="4xl"
            >
                <AddStudentForm
                    onSubmit={handleAddStudent}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {/* Bulk Import Modal */}
            <BulkImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={() => window.location.reload()}
                schoolId={schoolId}
            />
        </div>
    );
}
