"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from '@/lib/api';
import RoleModal from "./RoleModal";
import UserModal from "./UserModal";

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
    location: string;
    website?: string;
    email?: string;
    phone?: string;
    logoUrl?: string;
    combinations?: { name: string; isActive: boolean }[];
}

export default function SystemPage() {
    const params = useParams();
    const schoolId = params.id as string;
    const [activeTab, setActiveTab] = useState<'settings' | 'logs' | 'roles' | 'academic' | 'users'>('settings');
    const [profile, setProfile] = useState<SchoolProfile>({
        name: '',
        motto: '',
        location: ''
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




    // Roles Logic
    const [roles, setRoles] = useState<any[]>([]);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);

    const fetchRoles = useCallback(async () => {
        if (!schoolId) return;
        try {
            const res = await api.get('/roles', { params: { schoolId } });
            setRoles(res.data);
        } catch (err) {
            console.error("Failed to fetch roles:", err);
        }
    }, [schoolId]);

    useEffect(() => {
        if (activeTab === 'roles') {
            fetchRoles();
        }
    }, [activeTab, fetchRoles]);

    const handleEditRole = (role: any) => {
        setSelectedRole(role);
        setIsRoleModalOpen(true);
    };

    const handleDeleteRole = async (roleId: string) => {
        if (!confirm("Are you sure you want to delete this role?")) return;
        try {
            await api.delete(`/roles/${roleId}`);
            await fetchRoles();
        } catch (err) {
            alert("Failed to delete role");
        }
    };

    // Users Logic
    const [users, setUsers] = useState<any[]>([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const fetchUsers = useCallback(async () => {
        if (!schoolId) return;
        try {
            const res = await api.get('/users', { params: { schoolId } });
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    }, [schoolId]);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
            if (roles.length === 0) fetchRoles(); // Ensure roles are loaded for the modal
        }
    }, [activeTab, fetchUsers, fetchRoles, roles.length]);

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${userId}`);
            await fetchUsers();
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    return (
        <div className="flex flex-1 justify-center py-8">
            <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => { setIsRoleModalOpen(false); setSelectedRole(null); }}
                schoolId={schoolId}
                role={selectedRole}
                onSuccess={fetchRoles}
            />
            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => { setIsUserModalOpen(false); setSelectedUser(null); }}
                schoolId={schoolId}
                user={selectedUser}
                roles={roles}
                onSuccess={fetchUsers}
            />
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
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'users'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-[#4c4c9a] dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        User Managment
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
                                            {/* Logo Upload Section */}
                                            <div className="md:col-span-2 flex items-center gap-6 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                                <div className="shrink-0 relative group">
                                                    <div className="size-24 rounded-xl bg-white dark:bg-black/20 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                                                        {profile.logoUrl ? (
                                                            <img
                                                                src={`${api.defaults.baseURL}${profile.logoUrl}`}
                                                                alt="School Logo"
                                                                className="w-full h-full object-contain"
                                                            />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-gray-400 text-4xl">add_photo_alternate</span>
                                                        )}
                                                    </div>
                                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer">
                                                        <span className="text-xs font-bold">Change</span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    const file = e.target.files[0];
                                                                    const formData = new FormData();
                                                                    formData.append('file', file);

                                                                    try {
                                                                        const res = await api.post(`/schools/${schoolId}/logo`, formData, {
                                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                                        });
                                                                        setProfile({ ...profile, logoUrl: res.data.logoUrl });
                                                                    } catch (err) {
                                                                        console.error("Failed to upload logo", err);
                                                                        alert("Failed to upload logo. Please try again.");
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">School Logo</h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Upload a PNG or JPG image. Recommended size: 500x500px.
                                                        This logo will appear on reports and the dashboard sidebar.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">School Name</label>
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    className="w-full h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-transparent text-sm active:border-primary focus:border-primary outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Motto</label>
                                                <input
                                                    type="text"
                                                    value={profile.motto || ''}
                                                    onChange={(e) => setProfile({ ...profile, motto: e.target.value })}
                                                    className="w-full h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-transparent text-sm active:border-primary focus:border-primary outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                                                <input
                                                    type="text"
                                                    value={profile.location || ''}
                                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                                    className="w-full h-10 px-3 rounded-lg border border-[#cfcfe7] dark:border-gray-600 bg-transparent text-sm active:border-primary focus:border-primary outline-none"
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
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                                    Manage Roles & Permissions
                                </h3>
                                <button
                                    onClick={() => { setSelectedRole(null); setIsRoleModalOpen(true); }}
                                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    Add New Role
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {roles.map((role) => (
                                    <div key={role.id} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:border-primary/30 transition-all group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center border border-gray-100 dark:border-gray-700 text-primary">
                                                    <span className="material-symbols-outlined">security</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{role.name}</h4>
                                                    <p className="text-xs text-gray-500">{role.permissions?.length || 0} permissions</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditRole(role)}
                                                    className="p-1.5 text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRole(role.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {role.permissions?.slice(0, 3).map((perm: string) => (
                                                <span key={perm} className="px-2 py-0.5 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded capitalize">
                                                    {perm.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                            {(role.permissions?.length || 0) > 3 && (
                                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-500 text-[10px] font-bold rounded">
                                                    +{role.permissions.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {roles.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-gray-400 italic">
                                        No roles defined yet. Create one to get started.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">group</span>
                                    User Management
                                </h3>
                                <button
                                    onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }}
                                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                                    Add New User
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#f8f8fc] dark:bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-[#4c4c9a] dark:text-gray-400 uppercase">User</th>
                                            <th className="px-6 py-4 text-xs font-bold text-[#4c4c9a] dark:text-gray-400 uppercase">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold text-[#4c4c9a] dark:text-gray-400 uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
                                                            style={{
                                                                backgroundImage: `url('${
                                                                    user.avatarUrl && user.avatarUrl !== 'null' && user.avatarUrl !== 'undefined'
                                                                        ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:4000${user.avatarUrl}`)
                                                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`
                                                                }')`
                                                            }}
                                                        ></div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                                            <p className="text-xs text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.customRole ? (
                                                        <span className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold">
                                                            {user.customRole.name}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold capitalize">
                                                            {user.roleId?.replace('_', ' ') || 'User'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

