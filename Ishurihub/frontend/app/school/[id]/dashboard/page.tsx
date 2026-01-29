import DashboardResolver from "@/components/dashboards/DashboardResolver";

export default function DashboardPage() {
    return (
        <>
            {/* Top Bar */}
            <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151b2b] flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Dashboard Overview</h2>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-primary transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </header>

            {/* Content Body */}
            <DashboardResolver />
        </>
    );
}
