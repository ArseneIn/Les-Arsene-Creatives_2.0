"use client";

export default function DeanDashboard() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Academic Overview (Dean of Studies)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Average GPA</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3.2</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                            <span className="material-symbols-outlined">event_note</span>
                        </div>
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Next Week</span>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Upcoming Exams</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Mid-Term</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
                            <span className="material-symbols-outlined">person_off</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Teacher Absences</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2 Today</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
