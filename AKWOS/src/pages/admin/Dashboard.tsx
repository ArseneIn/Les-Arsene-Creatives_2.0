import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../utils/apiConfig';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([
        { label: "Total Resources", value: "0", icon: "folder_open", color: "bg-blue-500" },
        { label: "Active News", value: "0", icon: "newspaper", color: "bg-green-500" },
        { label: "Institutional Partners", value: "0", icon: "handshake", color: "bg-orange-500" }, // Changed from Pending Reviews
        { label: "Total Downloads", value: "...", icon: "download", color: "bg-purple-500" },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(getApiUrl('stats.php'));
                const data = await response.json();

                if (data) {
                    setStats([
                        { label: "Total Resources", value: data.resources?.toString() || "0", icon: "folder_open", color: "bg-blue-500" },
                        { label: "Active News", value: data.news?.toString() || "0", icon: "newspaper", color: "bg-green-500" },
                        { label: "Institutional Partners", value: data.partners?.toString() || "0", icon: "handshake", color: "bg-orange-500" },
                        { label: "Total Downloads", value: "2.4k", icon: "download", color: "bg-purple-500" }, // Keep mock for now
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };

        fetchStats();
    }, []);

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
                {/* New cards added based on instruction */}
                <div onClick={() => navigate('/admin/partners')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                        <span className="material-symbols-outlined text-orange-600 text-2xl">handshake</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">Partnerships</h3>
                    <p className="text-sm text-gray-500">Manage institutional partners</p>
                </div>

                <div onClick={() => navigate('/admin/team')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
                    <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                        <span className="material-symbols-outlined text-indigo-600 text-2xl">groups</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">Team & Leadership</h3>
                    <p className="text-sm text-gray-500">Manage board & field officers</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => navigate('/admin/resources')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 hover:text-primary transition-colors border border-gray-200 dark:border-gray-600 border-dashed">
                            <span className="material-symbols-outlined text-3xl">add_circle</span>
                            <span className="text-sm font-medium">Add Resource</span>
                        </button>
                        <button onClick={() => navigate('/admin/news')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors border border-gray-200 dark:border-gray-600 border-dashed">
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
