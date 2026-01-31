"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from '@/lib/api';

// Mock Data
const auditLogs = [
    { id: 1, action: "User Login", user: "Admin (You)", ip: "192.168.1.1", timestamp: "Today, 10:23 AM", status: "Success" },
    { id: 2, action: "Grade Update", user: "Mr. Karera", ip: "192.168.1.15", timestamp: "Today, 09:45 AM", status: "Success" },
    { id: 3, action: "Fee Payment Recorded", user: "Bursar", ip: "192.168.1.20", timestamp: "Yesterday, 04:30 PM", status: "Success" },
    { id: 4, action: "Failed Login Attempt", user: "Unknown", ip: "45.12.33.1", timestamp: "Yesterday, 11:20 PM", status: "Failed" },
    { id: 5, action: "System Backup", user: "System", ip: "Localhost", timestamp: "Yesterday, 02:00 AM", status: "Success" },
];

interface SchoolProfile {
    name: string;
    motto: string;
    address: string;
    website?: string;
    email?: string;
    phone?: string;
}

export default function SystemPage() {
    const params = useParams();
    const schoolId = params.id as string;
    const [activeTab, setActiveTab] = useState<'settings' | 'logs' | 'roles'>('settings');
    const [profile, setProfile] = useState<SchoolProfile>({
        name: '',
        motto: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchSchool = useCallback(async () => {
        if (!schoolId) return;
        try {
            const response = await api.get(`/schools/${schoolId}`);
            setProfile(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch school:", error);
            setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchSchool();
    }, [fetchSchool]);

    const handleUpdate = async () => {
        try {
            await api.patch(`/schools/${schoolId}`, profile);
            alert("School profile updated successfully!");
        } catch (error) {
            console.error("Failed to update school:", error);
            alert("Failed to update school profile.");
        }
    };

    return (
        <div className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 pb-4">
                    <Link href={`/school/${schoolId}/dashboard`} className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium hover:text-primary">Home</Link>
                    <span className="text-[#4c4c9a] dark:text-gray-600 text-sm font-medium">/</span>
                    <span className="text-black dark:text-white text-sm font-bold">System & Compliance</span>
                </div>

                {/* Header */}
                <div className="flex flex-wrap justify-between items-end gap-3 pb-6">
                    <div className="flex min-w-72 flex-col gap-1">
                        <h1 className="text-black dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">System Settings</h1>
                        <p className="text-[#4c4c9a] dark:text-gray-400 text-base font-normal">Configure school settings, manage roles, and view logs.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#cfcfe7] dark:border-white/10 mb-6">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'settings'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-[#4c4c9a] dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        General Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'logs'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-[#4c4c9a] dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        Audit Logs
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'roles'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-[#4c4c9a] dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        Roles & Permissions
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#cfcfe7] dark:border-white/10 shadow-sm p-6">
                    {activeTab === 'settings' && (
                        <div className="max-w-2xl space-y-8">
                            {isLoading ? (
                                <div className="text-center py-10 text-gray-500">Loading school details...</div>
                            ) : (
                                <>
                                    {/* School Information */}
                                    <div>
                                        <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">school</span>
                                            School Profile
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">School Name</label>
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    className="w-full h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-transparent text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Motto</label>
                                                <input
                                                    type="text"
                                                    value={profile.motto || ''}
                                                    onChange={(e) => setProfile({ ...profile, motto: e.target.value })}
                                                    className="w-full h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-transparent text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                                <input
                                                    type="text"
                                                    value={profile.address || ''}
                                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                                    className="w-full h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100 dark:border-gray-700" />

                                    {/* Preferences */}
                                    <div>
                                        <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">tune</span>
                                            System Preferences
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-black dark:text-white">Enable Parent Portal</p>
                                                    <p className="text-xs text-gray-500">Allow parents to log in and view student reports.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" checked readOnly />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-black dark:text-white">Auto-Generate Report Cards</p>
                                                    <p className="text-xs text-gray-500">Automatically generate PDF reports at end of term.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleUpdate}
                                            className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f8f8fc] dark:bg-white/5 border-b border-[#cfcfe7] dark:border-white/10">
                                        <th className="px-4 py-3 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Action</th>
                                        <th className="px-4 py-3 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">User</th>
                                        <th className="px-4 py-3 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">IP Address</th>
                                        <th className="px-4 py-3 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Timestamp</th>
                                        <th className="px-4 py-3 text-[#4c4c9a] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#cfcfe7] dark:divide-white/10">
                                    {auditLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-sm font-bold text-black dark:text-white">{log.action}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{log.user}</td>
                                            <td className="px-4 py-3 text-xs font-mono text-gray-500">{log.ip}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{log.timestamp}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${log.status === 'Success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'roles' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="size-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-gray-400 text-3xl">lock</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Role Management</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                                Advanced permission handling and role creation will be available in the next update.
                            </p>
                            <button className="mt-6 px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                                Learn More
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
