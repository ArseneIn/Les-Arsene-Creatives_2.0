export default function DisciplinePage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Discipline & Conduct</h1>
            <div className="bg-white dark:bg-[#1e293b] p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                <div className="size-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-400">gavel</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Student Conduct Records</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Track disciplinary actions, merits, and behavioral reports. This module is currently under development.
                </p>
            </div>
        </div>
    );
}
