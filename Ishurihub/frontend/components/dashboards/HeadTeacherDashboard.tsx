"use client";

export default function HeadTeacherDashboard() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Head Teacher Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Students</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2,543</h3>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                            <span className="material-symbols-outlined">person_apron</span>
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+4%</span>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Active Teachers</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">128</h3>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+8%</span>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">RWF 45M</h3>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white dark:bg-[#1e2536] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                    <button className="text-sm text-primary font-medium hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                        <div className="bg-gray-100 dark:bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300">
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Timetable Updated</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Grade 10 Physics Schedule modified by J. Doe</p>
                        </div>
                        <span className="text-xs text-gray-400">2h ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
