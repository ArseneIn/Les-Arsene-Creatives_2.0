import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Institution, CreateInstitutionDto } from '../types/institution';

const PlatformAdminDashboard: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalInstitutions: 0,
        activeStudents: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        totalTestsTaken: 0
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newInstitution, setNewInstitution] = useState<CreateInstitutionDto>({
        name: '',
        slug: '',
        contactEmail: '',
        address: '',
        adminEmail: '',
        adminPassword: '',
        adminFirstName: '',
        adminLastName: ''
    });

    useEffect(() => {
        fetchInstitutions();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/analytics/global');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch global stats', error);
        }
    };

    const fetchInstitutions = async () => {
        try {
            const response = await api.get<Institution[]>('/institution');
            setInstitutions(response.data);
        } catch (error) {
            console.error('Failed to fetch institutions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOnboardClick = (institution?: Institution) => {
        if (institution) {
            setEditingId(institution.id);
            setNewInstitution({
                name: institution.name,
                slug: institution.slug,
                contactEmail: institution.contactEmail || '',
                address: institution.address || '',
                // Admin fields are not editable here or needed for update usually, 
                // but we keep the structure. Password won't be pre-filled.
                adminEmail: '',
                adminPassword: '',
                adminFirstName: '',
                adminLastName: ''
            });
        } else {
            setEditingId(null);
            setNewInstitution({
                name: '',
                slug: '',
                contactEmail: '',
                address: '',
                adminEmail: '',
                adminPassword: '',
                adminFirstName: '',
                adminLastName: ''
            });
        }
        setShowOnboardModal(true);
    };

    const handleCreateOrUpdateInstitution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.patch(`/institution/${editingId}`, newInstitution);
            } else {
                await api.post('/institution', newInstitution);
            }
            setShowOnboardModal(false);
            fetchInstitutions();
            setEditingId(null);
            setNewInstitution({
                name: '',
                slug: '',
                contactEmail: '',
                address: '',
                adminEmail: '',
                adminPassword: '',
                adminFirstName: '',
                adminLastName: ''
            });
        } catch (error) {
            console.error('Failed to save institution', error);
            alert('Failed to save institution');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this institution? This action cannot be undone.')) {
            try {
                await api.delete(`/institution/${id}`);
                fetchInstitutions();
            } catch (error) {
                console.error('Failed to delete institution', error);
                alert('Failed to delete institution');
            }
        }
    };

    return (
        <>
            {/* Top Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold">Platform Overview</h2>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        SYSTEM LIVE
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-64 hidden md:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-admin-primary text-sm" placeholder="Global search..." type="text" />
                    </div>
                    <button className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">notifications</span>
                    </button>
                    <button
                        onClick={() => handleOnboardClick()}
                        className="bg-admin-primary hover:bg-admin-primary/90 text-navy-blue font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-admin-primary/20 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        <span className="hidden sm:inline">Onboard Institution</span>
                    </button>
                </div>
            </header>

            {/* Dashboard Body */}
            <div className="p-4 md:p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                <span className="material-symbols-outlined">apartment</span>
                            </span>
                            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">+4.2% <span className="material-symbols-outlined text-xs">trending_up</span></span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Institutions</p>
                        <h3 className="text-3xl font-bold mt-1">{stats.totalInstitutions}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                <span className="material-symbols-outlined">group</span>
                            </span>
                            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">+12.5% <span className="material-symbols-outlined text-xs">trending_up</span></span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Students</p>
                        <h3 className="text-3xl font-bold mt-1">{stats.activeStudents}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                                <span className="material-symbols-outlined">speed</span>
                            </span>
                            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">+8.1% <span className="material-symbols-outlined text-xs">trending_up</span></span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg. Typing Speed</p>
                        <h3 className="text-3xl font-bold mt-1">{stats.avgWpm} <span className="text-sm font-normal text-slate-400 uppercase">WPM</span></h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-admin-primary/20 text-admin-primary rounded-lg">
                                <span className="material-symbols-outlined">health_and_safety</span>
                            </span>
                            <span className="text-slate-400 text-sm font-bold">Stable</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Uptime Status</p>
                        <h3 className="text-3xl font-bold mt-1">99.98%</h3>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold">Manage Institutions</h2>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium border-r border-slate-200 dark:border-slate-700 ${filter === 'all' ? 'bg-slate-100 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('active')}
                                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium border-r border-slate-200 dark:border-slate-700 ${filter === 'active' ? 'bg-slate-100 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setFilter('suspended')}
                                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium ${filter === 'suspended' ? 'bg-slate-100 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                >
                                    Suspended
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium w-full sm:w-auto justify-center">
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                                Filters
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Institution Name & Slug</th>
                                    <th className="px-6 py-4">Main Contact</th>
                                    <th className="px-6 py-4 text-center">Active Students</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-slate-500">Loading...</td>
                                    </tr>
                                ) : institutions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-slate-500">No institutions found.</td>
                                    </tr>
                                ) : (
                                    institutions.map((inst) => (
                                        <tr key={inst.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded-lg text-blue-600 font-bold">
                                                        {inst.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{inst.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{inst.slug}.typespire.edu</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                <p className="font-medium">{inst.contactEmail || 'N/A'}</p>
                                                <p className="text-xs">Primary Admin</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-sm font-bold">-</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">Active</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDelete(inst.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                        title="Delete Institution"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOnboardClick(inst)}
                                                        className="px-3 py-1.5 bg-navy-blue dark:bg-slate-700 text-white text-xs font-bold rounded-lg hover:bg-navy-blue/80 transition-colors"
                                                    >
                                                        Manage
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Onboard Modal */}
            {showOnboardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
                        <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {editingId ? 'Edit Institution' : 'Onboard Institution'}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    {editingId ? 'Update institution details' : 'Add a new educational partner to Typespire'}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowOnboardModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateOrUpdateInstitution} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Institution Details */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2 text-admin-primary">
                                        <span className="material-symbols-outlined">apartment</span>
                                        <h3 className="font-bold text-sm uppercase tracking-wider">Institution Details</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Institution Name</label>
                                            <input
                                                type="text"
                                                value={newInstitution.name}
                                                onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary outline-none transition-all text-sm"
                                                placeholder="e.g. Kepler College"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    value={newInstitution.slug}
                                                    onChange={(e) => setNewInstitution({ ...newInstitution, slug: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-l-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary outline-none transition-all text-sm"
                                                    placeholder="kepler"
                                                    required
                                                />
                                                <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-lg text-slate-500 text-xs font-medium flex items-center">
                                                    .typespire.edu
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                                            <input
                                                type="email"
                                                value={newInstitution.contactEmail}
                                                onChange={(e) => setNewInstitution({ ...newInstitution, contactEmail: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary outline-none transition-all text-sm"
                                                placeholder="contact@institution.edu"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Physical Address</label>
                                            <textarea
                                                value={newInstitution.address}
                                                onChange={(e) => setNewInstitution({ ...newInstitution, address: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary outline-none transition-all text-sm resize-none h-24"
                                                placeholder="123 Education St, City, Country"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Admin User */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2 text-blue-500">
                                        <span className="material-symbols-outlined">shield_person</span>
                                        <h3 className="font-bold text-sm uppercase tracking-wider">
                                            {editingId ? 'Institution Admin' : 'Initial Administrator'}
                                        </h3>
                                    </div>

                                    {editingId ? (
                                        <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 flex flex-col items-center justify-center text-center h-full">
                                            <span className="material-symbols-outlined text-4xl text-blue-400 mb-2">admin_panel_settings</span>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Admin Management</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 max-w-[200px]">
                                                To manage administrators, please use the "Manage Users" section or ask the institution admin to invite new users.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 space-y-4">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                                                        <input
                                                            type="text"
                                                            value={newInstitution.adminFirstName}
                                                            onChange={(e) => setNewInstitution({ ...newInstitution, adminFirstName: e.target.value })}
                                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                                                            placeholder="Admin"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                                                        <input
                                                            type="text"
                                                            value={newInstitution.adminLastName}
                                                            onChange={(e) => setNewInstitution({ ...newInstitution, adminLastName: e.target.value })}
                                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                                                            placeholder="User"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Admin Email</label>
                                                    <input
                                                        type="email"
                                                        value={newInstitution.adminEmail}
                                                        onChange={(e) => setNewInstitution({ ...newInstitution, adminEmail: e.target.value })}
                                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                                                        placeholder="admin@institution.edu"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                                    <input
                                                        type="password"
                                                        value={newInstitution.adminPassword}
                                                        onChange={(e) => setNewInstitution({ ...newInstitution, adminPassword: e.target.value })}
                                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                                                        placeholder="••••••••"
                                                    />
                                                    <p className="text-[10px] text-slate-500 mt-1">Must be at least 8 characters</p>
                                                </div>
                                            </div>

                                            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 flex gap-3 items-start">
                                                <span className="material-symbols-outlined text-amber-500 text-lg mt-0.5">info</span>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    The initial administrator will receive an email with their credentials. They will have full access to manage the institution's settings.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setShowOnboardModal(false)}
                                    className="px-6 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-admin-primary hover:bg-admin-primary/90 text-navy-blue font-bold rounded-lg shadow-lg shadow-admin-primary/20 transition-all transform active:scale-[0.98] flex items-center gap-2 text-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {editingId ? 'save' : 'rocket_launch'}
                                    </span>
                                    {editingId ? 'Update Institution' : 'Create Institution'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlatformAdminDashboard;
