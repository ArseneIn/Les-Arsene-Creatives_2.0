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
    combinations?: { name: string; isActive: boolean }[];
}

export default function SystemPage() {
    const params = useParams();
    const schoolId = params.id as string;
    const [activeTab, setActiveTab] = useState<'settings' | 'logs' | 'roles' | 'academic'>('settings');
    const [profile, setProfile] = useState<SchoolProfile>({
        name: '',
        motto: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    const [newCombo, setNewCombo] = useState("");

    const addCombination = () => {
        if (!newCombo.trim()) return;
        const updatedCombos = [...(profile.combinations || []), { name: newCombo.toUpperCase(), isActive: true }];
        setProfile({ ...profile, combinations: updatedCombos });
        setNewCombo("");
    };

    const toggleCombination = (index: number) => {
        const updatedCombos = [...(profile.combinations || [])];
        updatedCombos[index].isActive = !updatedCombos[index].isActive;
        setProfile({ ...profile, combinations: updatedCombos });
    };

    const removeCombination = (index: number) => {
        if (confirm("Are you sure you want to remove this combination?")) {
            const updatedCombos = profile.combinations?.filter((_, i) => i !== index);
            setProfile({ ...profile, combinations: updatedCombos });
        }
    };


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

    // Academic Years Logic
    const [years, setYears] = useState<any[]>([]);
    const [newYear, setNewYear] = useState({ name: '', startDate: '', endDate: '' });
    const [isYearLoading, setIsYearLoading] = useState(false);

    const fetchYears = useCallback(async () => {
        try {
            const res = await api.get('/academic-years', { params: { schoolId } });
            setYears(res.data);
        } catch (err) {
            console.error("Failed to fetch years:", err);
        }
    }, [schoolId]);

    useEffect(() => {
        if (activeTab === 'academic') {
            fetchYears();
        }
    }, [activeTab, fetchYears]);

    const handleCreateYear = async () => {
        if (!newYear.name || !newYear.startDate || !newYear.endDate) return;
        setIsYearLoading(true);
        try {
            await api.post('/academic-years', { ...newYear, schoolId, isActive: false });
            setNewYear({ name: '', startDate: '', endDate: '' });
            await fetchYears();
        } catch (err) {
            alert('Failed to create year');
            console.error(err);
        } finally {
            setIsYearLoading(false);
        }
    };


    const handleActivateYear = async (id: string) => {
        if (!confirm("Are you sure? This will deactivate all other years.")) return;
        try {
            await api.patch(`/academic-years/${id}/activate`, { schoolId });
            await fetchYears();
        } catch (err) {
            alert('Failed to activate year');
        }
    };

    // Terms Logic
    const [expandedYearId, setExpandedYearId] = useState<string | null>(null);
    const [terms, setTerms] = useState<any[]>([]);
    const [newTerm, setNewTerm] = useState({ name: '', startDate: '', endDate: '' });
    const [isTermLoading, setIsTermLoading] = useState(false);

    const toggleTerms = (yearId: string) => {
        if (expandedYearId === yearId) {
            setExpandedYearId(null);
        } else {
            setExpandedYearId(yearId);
        }
    };

    const handleCreateTerm = async (academicYearId: string) => {
        if (!newTerm.name || !newTerm.startDate || !newTerm.endDate) return;
        setIsTermLoading(true);
        try {
            await api.post('/academic-years/terms', {
                ...newTerm,
                academicYearId,
                isActive: false
            });
            setNewTerm({ name: '', startDate: '', endDate: '' });
            await fetchYears(); // Refresh to show new term
        } catch (err) {
            alert('Failed to create term');
            console.error(err);
        } finally {
            setIsTermLoading(false);
        }
    };

    const handleActivateTerm = async (termId: string) => {
        if (!confirm("Are you sure? This will designate this term as the ACTIVE term for the entire school.")) return;
        try {
            await api.patch(`/academic-years/terms/${termId}/activate`, { schoolId });
            await fetchYears();
        } catch (err) {
            alert('Failed to activate term');
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
                    <button
                        onClick={() => setActiveTab('academic')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'academic'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-[#4c4c9a] dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        Academic Years
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

                                    {/* Academic Combinations */}
                                    <div>
                                        <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">fact_check</span>
                                            Academic Combinations
                                        </h3>
                                        <div className="space-y-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700/50">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newCombo}
                                                    onChange={(e) => setNewCombo(e.target.value)}
                                                    placeholder="Add new combination (e.g. MEG)"
                                                    className="flex-1 h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-white dark:bg-black/20 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                                />
                                                <button
                                                    onClick={addCombination}
                                                    type="button"
                                                    disabled={!newCombo.trim()}
                                                    className="px-4 h-10 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {profile.combinations?.map((combo, index) => (
                                                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${combo.isActive ? 'bg-white dark:bg-black/20 border-gray-200 dark:border-gray-700' : 'bg-gray-100 dark:bg-white/5 border-transparent opacity-75'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`size-2 rounded-full ${combo.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                            <span className="font-bold text-gray-700 dark:text-gray-200">{combo.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => toggleCombination(index)}
                                                                title={combo.isActive ? "Deactivate" : "Activate"}
                                                                className={`p-1.5 rounded-md transition-colors ${combo.isActive ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">{combo.isActive ? 'toggle_on' : 'toggle_off'}</span>
                                                            </button>
                                                            <button
                                                                onClick={() => removeCombination(index)}
                                                                title="Remove"
                                                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!profile.combinations || profile.combinations.length === 0) && (
                                                    <p className="col-span-full text-center text-sm text-gray-400 py-2 italic">No combinations added yet.</p>
                                                )}
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

                    {activeTab === 'academic' && (
                        <div className="max-w-2xl space-y-8">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex gap-3">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                                <div>
                                    <p className="text-sm font-bold text-blue-800 dark:text-blue-300">Academic Year & Terms</p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                        Data such as Attendance, Report Cards, and Grades are linked to the <strong>Active Term</strong>.
                                        Ensure you set the correct term as active.
                                    </p>
                                </div>
                            </div>

                            {/* Create Year */}
                            <div>
                                <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                                    Academic Years
                                </h3>
                                <div className="space-y-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700/50">
                                    <div className="flex gap-2">
                                        <input
                                            value={newYear.name}
                                            onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                                            placeholder="Year Name (e.g. 2025-2026)"
                                            className="flex-1 h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-white dark:bg-black/20 text-sm outline-none"
                                        />
                                        <input
                                            type="date"
                                            value={newYear.startDate}
                                            onChange={(e) => setNewYear({ ...newYear, startDate: e.target.value })}
                                            className="h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-white dark:bg-black/20 text-sm outline-none"
                                        />
                                        <input
                                            type="date"
                                            value={newYear.endDate}
                                            onChange={(e) => setNewYear({ ...newYear, endDate: e.target.value })}
                                            className="h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-white dark:bg-black/20 text-sm outline-none"
                                        />
                                        <button
                                            onClick={handleCreateYear}
                                            disabled={isYearLoading || !newYear.name}
                                            className="px-4 h-10 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {isYearLoading ? '...' : 'Create'}
                                        </button>
                                    </div>

                                    {/* List of Years */}
                                    <div className="space-y-4">
                                        {years.map(year => (
                                            <div key={year.id} className={`rounded-lg border transition-all ${year.isActive ? 'bg-white dark:bg-black/20 border-green-500' : 'bg-gray-100 dark:bg-white/5 border-transparent'}`}>
                                                <div className="p-3 flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-black dark:text-white">{year.name}</span>
                                                            {year.isActive && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase">Active</span>}
                                                        </div>
                                                        <p className="text-xs text-gray-500">{new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {!year.isActive && (
                                                            <button onClick={() => handleActivateYear(year.id)} className="text-xs font-bold text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">Set Active</button>
                                                        )}
                                                        <button
                                                            onClick={() => toggleTerms(year.id)}
                                                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                        >
                                                            {expandedYearId === year.id ? 'Hide Terms' : 'Manage Terms'}
                                                            <span className="material-symbols-outlined text-[14px]">{expandedYearId === year.id ? 'expand_less' : 'expand_more'}</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Expanded Terms Section */}
                                                {expandedYearId === year.id && (
                                                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/40 rounded-b-lg">
                                                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Terms in {year.name}</h4>

                                                        {/* List Terms */}
                                                        <div className="space-y-2 mb-3">
                                                            {year.terms && year.terms.length > 0 ? (
                                                                year.terms.sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map((term: any) => (
                                                                    <div key={term.id} className="flex justify-between items-center p-2 bg-white dark:bg-white/5 rounded border border-gray-100 dark:border-gray-800">
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-sm font-bold text-black dark:text-white">{term.name}</span>
                                                                                {term.isActive && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase">Active Term</span>}
                                                                            </div>
                                                                            <p className="text-[10px] text-gray-500">{new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}</p>
                                                                        </div>
                                                                        {!term.isActive && (
                                                                            <button onClick={() => handleActivateTerm(term.id)} className="text-xs text-primary hover:underline">Set Active</button>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-xs text-gray-400 italic">No terms added yet.</p>
                                                            )}
                                                        </div>

                                                        {/* Add Term Form */}
                                                        <div className="flex gap-2 items-end">
                                                            <div className="flex-1 space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-500 uppercase">New Term Name</label>
                                                                <input
                                                                    value={newTerm.name}
                                                                    onChange={(e) => setNewTerm({ ...newTerm, name: e.target.value })}
                                                                    placeholder="e.g. Term 1"
                                                                    className="w-full h-8 px-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-xs outline-none"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Start Date</label>
                                                                <input
                                                                    type="date"
                                                                    value={newTerm.startDate}
                                                                    onChange={(e) => setNewTerm({ ...newTerm, startDate: e.target.value })}
                                                                    className="h-8 px-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-xs outline-none"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-500 uppercase">End Date</label>
                                                                <input
                                                                    type="date"
                                                                    value={newTerm.endDate}
                                                                    onChange={(e) => setNewTerm({ ...newTerm, endDate: e.target.value })}
                                                                    className="h-8 px-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-xs outline-none"
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() => handleCreateTerm(year.id)}
                                                                disabled={isTermLoading || !newTerm.name}
                                                                className="h-8 px-3 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 disabled:opacity-50"
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {years.length === 0 && <p className="text-sm text-gray-500 italic">No academic years found.</p>}
                                    </div>
                                </div>
                            </div>
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
