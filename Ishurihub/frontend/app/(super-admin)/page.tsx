import { mockInstitutions } from "@/data/institutions";
import Link from "next/link";

export default function InstitutionsPage() {
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
                        <button className="flex min-w-[140px] items-center justify-center rounded-lg h-11 px-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] transition-all">
                            <span className="material-symbols-outlined text-[18px] mr-2">add_business</span>
                            Register School
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">domain</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Institutions</p>
                        </div>
                        <h3 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{mockInstitutions.length}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <span className="material-symbols-outlined">groups</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Students</p>
                        </div>
                        <h3 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
                            {mockInstitutions.reduce((acc, curr) => acc + curr.studentCount, 0).toLocaleString()}
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
                            {mockInstitutions.filter(i => i.status === 'Active').length}
                        </h3>
                    </div>
                </div>

                {/* Institutions Table */}
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Institution Name</th>
                                <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Students</th>
                                <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {mockInstitutions.map((inst) => (
                                <tr key={inst.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 bg-cover bg-center shadow-sm"
                                                style={{ backgroundImage: `url('${inst.logoUrl}')` }}
                                            >
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white text-sm font-bold">{inst.name}</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs">Joined: {new Date(inst.joinedDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">{inst.type}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-slate-600 dark:text-slate-300 text-sm">{inst.location}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-slate-900 dark:text-white text-sm font-bold">{inst.studentCount.toLocaleString()}</span>
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
                                        <Link
                                            href="/school-dashboard"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg text-xs font-bold transition-all"
                                        >
                                            View Dashboard
                                            <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
