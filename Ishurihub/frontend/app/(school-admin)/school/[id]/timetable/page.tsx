export default function TimetablePage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Timetable Management</h1>
            <div className="bg-white dark:bg-[#1e293b] p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-primary">calendar_month</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Class Schedules & Timetables</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Manage class schedules, teacher assignments, and academic calendars here. This module is currently under development.
                </p>
            </div>
        </div>
    );
}
