"use client";

export default function ParentDashboard() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Child&apos;s Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Attendance Rate</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">98%</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                            <span className="material-symbols-outlined">grade</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Current GPA</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3.5</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2536] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                            <span className="material-symbols-outlined">credit_card</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Card Balance</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">RWF 5,000</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
