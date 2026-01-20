import { initialResources } from "../../data/resources";

export const Dashboard = () => {
    const stats = [
        { label: "Total Resources", value: initialResources.length, icon: "folder_open", color: "bg-blue-500" },
        { label: "Active News", value: "12", icon: "newspaper", color: "bg-green-500" },
        { label: "Pending Reviews", value: "3", icon: "pending", color: "bg-orange-500" },
        { label: "Total Downloads", value: "1.2k", icon: "download", color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md`}>
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 hover:text-primary transition-colors border border-gray-200 dark:border-gray-600 border-dashed">
                            <span className="material-symbols-outlined text-3xl">add_circle</span>
                            <span className="text-sm font-medium">Add Resource</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors border border-gray-200 dark:border-gray-600 border-dashed">
                            <span className="material-symbols-outlined text-3xl">post_add</span>
                            <span className="text-sm font-medium">Post News</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Storage Usage</span>
                            <span className="font-medium text-gray-900 dark:text-white">45% (4.5GB / 10GB)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-900">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            <span>All systems operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
