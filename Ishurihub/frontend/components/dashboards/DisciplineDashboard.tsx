"use client";

import { mockStudents } from "@/data/students";

export default function DisciplineDashboard() {
    const atRiskStudents = mockStudents.filter(s => (s.disciplinePoints || 100) < 50);
    const topPerformers = mockStudents.filter(s => (s.disciplinePoints || 100) === 100).slice(0, 5);

    return (
        <div className="p-8 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Discipline Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
                            <span className="material-symbols-outlined">gavel</span>
                        </div>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">+2 Today</span>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Incidents</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">15</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                            <span className="material-symbols-outlined">remove_circle</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Points Deducted</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">-120</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-lg">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Students At Risk</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{atRiskStudents.length}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* At Risk Students */}
                <div className="bg-white dark:bg-[#1e2536] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Attention Needed</h3>
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Low Scores</span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {atRiskStudents.length > 0 ? atRiskStudents.map(student => (
                            <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gray-200" style={{ backgroundImage: `url('${student.avatarUrl}')`, backgroundSize: 'cover' }}></div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.grade}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-bold text-red-600">{student.disciplinePoints || 100}</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Points</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-500 text-sm">No students currently at risk.</div>
                        )}
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white dark:bg-[#1e2536] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Top Conduct</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">100 Points</span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {topPerformers.map(student => (
                            <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gray-200" style={{ backgroundImage: `url('${student.avatarUrl}')`, backgroundSize: 'cover' }}></div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.grade}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-bold text-green-600">{student.disciplinePoints || 100}</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Points</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
