import { mockStudents } from "@/data/students";
import Link from "next/link";

export default function StudentsPage() {
    return (
        <div className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 pb-4">
                    <Link href="/" className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium hover:text-primary">Home</Link>
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
                        <button className="flex min-w-[120px] items-center justify-center rounded-lg h-11 px-5 bg-white border border-[#cfcfe7] dark:bg-white/5 dark:border-white/10 text-black dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
                            <span className="material-symbols-outlined text-[18px] mr-2">file_download</span>
                            Export CSV
                        </button>
                        <button className="flex min-w-[140px] items-center justify-center rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all">
                            <span className="material-symbols-outlined text-[18px] mr-2">person_add</span>
                            Add Student
                        </button>
                    </div>
                </div>

                {/* Filter Chips & Actions Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 mb-6 bg-white dark:bg-white/5 rounded-xl border border-[#cfcfe7] dark:border-white/10">
                    <div className="flex gap-3 flex-wrap">
                        <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-[#e7e7f3] dark:bg-white/10 px-4 hover:bg-primary/10 transition-colors">
                            <span className="text-black dark:text-white text-sm font-semibold">Grade: All</span>
                            <span className="material-symbols-outlined text-primary text-[18px]">expand_more</span>
                        </button>
                        <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-[#e7e7f3] dark:bg-white/10 px-4 hover:bg-primary/10 transition-colors">
                            <span className="text-black dark:text-white text-sm font-semibold">Section: All</span>
                            <span className="material-symbols-outlined text-primary text-[18px]">expand_more</span>
                        </button>
                        <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-[#e7e7f3] dark:bg-white/10 px-4 hover:bg-primary/10 transition-colors">
                            <span className="text-black dark:text-white text-sm font-semibold">Status: Active Cards</span>
                            <span className="material-symbols-outlined text-primary text-[18px]">expand_more</span>
                        </button>
                        <button className="text-primary text-sm font-bold px-2 hover:underline">Reset Filters</button>
                    </div>
                    <div className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium">
                        Showing <span className="text-black dark:text-white font-bold">{mockStudents.length}</span> students
                    </div>
                </div>

                {/* Table Container */}
                <div className="@container">
                    <div className="overflow-hidden rounded-xl border border-[#cfcfe7] dark:border-white/10 bg-white dark:bg-white/5 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary dark:bg-primary">
                                    <th className="px-6 py-4 text-white text-sm font-bold uppercase tracking-wider w-[350px]">Student Name</th>
                                    <th className="px-6 py-4 text-white text-sm font-bold uppercase tracking-wider">Class & Section</th>
                                    <th className="px-6 py-4 text-white text-sm font-bold uppercase tracking-wider">Card UID</th>
                                    <th className="px-6 py-4 text-white text-sm font-bold uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-white text-sm font-bold uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#cfcfe7] dark:divide-white/10">
                                {mockStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20 bg-cover bg-center"
                                                    style={{ backgroundImage: `url('${student.avatarUrl}')` }}
                                                >
                                                </div>
                                                <div>
                                                    <p className="text-black dark:text-white text-sm font-bold">{student.name}</p>
                                                    <p className="text-[#4c4c9a] dark:text-gray-500 text-xs">ID: {student.studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 rounded bg-[#e7e7f3] dark:bg-white/10 text-primary dark:text-primary text-xs font-bold">{student.grade}</span>
                                                <span className="text-black dark:text-white text-sm font-medium">{student.section}</span>
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
                                                <button className="px-4 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-primary/90 transition-all shadow-sm">
                                                    Issue New Card
                                                </button>
                                            ) : (
                                                <button className="text-primary hover:text-primary/70 text-sm font-bold transition-colors">
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
                            <p className="text-sm text-[#4c4c9a] dark:text-gray-400 font-medium">Showing <span className="text-black dark:text-white font-bold">1 to {mockStudents.length}</span> of 452 results</p>
                            <div className="flex gap-1">
                                <button className="size-9 flex items-center justify-center rounded-lg border border-[#cfcfe7] dark:border-white/10 bg-white dark:bg-transparent text-black dark:text-white hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">1</button>
                                <button className="size-9 flex items-center justify-center rounded-lg border border-[#cfcfe7] dark:border-white/10 bg-white dark:bg-transparent text-black dark:text-white hover:bg-gray-50 transition-colors font-medium text-sm">2</button>
                                <button className="size-9 flex items-center justify-center rounded-lg border border-[#cfcfe7] dark:border-white/10 bg-white dark:bg-transparent text-black dark:text-white hover:bg-gray-50 transition-colors font-medium text-sm">3</button>
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
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-500"></span> 380 Active Cards</span>
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500"></span> 12 Pending Requests</span>
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500"></span> 60 Inactive/Lost</span>
                    </div>
                    <div>Last synchronized: Oct 24, 2023 - 09:12 AM</div>
                </div>
            </div>
        </div>
    );
}
