"use client";

export default function DisciplineDashboard() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Discipline Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Students on Probation</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">8</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
