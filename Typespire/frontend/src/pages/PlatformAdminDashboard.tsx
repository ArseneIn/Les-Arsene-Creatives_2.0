import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Institution, CreateInstitutionDto } from '../types/institution';

const PlatformAdminDashboard: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(true);
    const [newInstitution, setNewInstitution] = useState<CreateInstitutionDto>({
        name: '',
        slug: '',
        contactEmail: '',
        address: ''
    });

    useEffect(() => {
        fetchInstitutions();
    }, []);

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

    const handleOnboardClick = () => {
        setShowOnboardModal(true);
    };

    const handleCreateInstitution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/institution', newInstitution);
            setShowOnboardModal(false);
            fetchInstitutions();
            setNewInstitution({ name: '', slug: '', contactEmail: '', address: '' });
        } catch (error) {
            console.error('Failed to create institution', error);
            alert('Failed to create institution');
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
                    <div className="relative w-64">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-admin-primary text-sm" placeholder="Global search..." type="text" />
                    </div>
                    <button className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">notifications</span>
                    </button>
                    <button
                        onClick={handleOnboardClick}
                        className="bg-admin-primary hover:bg-admin-primary/90 text-navy-blue font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-admin-primary/20 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        Onboard Institution
                    </button>
                </div>
            </header>

            {/* Dashboard Body */}
            <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                <span className="material-symbols-outlined">apartment</span>
                            </span>
                            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">+4.2% <span className="material-symbols-outlined text-xs">trending_up</span></span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Institutions</p>
                        <h3 className="text-3xl font-bold mt-1">{institutions.length}</h3>
                    </div>
                    {/* ... other stats ... */}
                    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                <span className="material-symbols-outlined">group</span>
                            </span>
                            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">+12.5% <span className="material-symbols-outlined text-xs">trending_up</span></span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Students</p>
                        <h3 className="text-3xl font-bold mt-1">48,202</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                                <span className="material-symbols-outlined">speed</span>
                            </span>
                            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">+8.1% <span className="material-symbols-outlined text-xs">trending_up</span></span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg. Typing Speed</p>
                        <h3 className="text-3xl font-bold mt-1">54 <span className="text-sm font-normal text-slate-400 uppercase">WPM</span></h3>
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
                        <div className="flex items-center gap-3">
                            <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 text-sm font-medium border-r border-slate-200 dark:border-slate-700 ${filter === 'all' ? 'bg-slate-100 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('active')}
                                    className={`px-4 py-2 text-sm font-medium border-r border-slate-200 dark:border-slate-700 ${filter === 'active' ? 'bg-slate-100 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setFilter('suspended')}
                                    className={`px-4 py-2 text-sm font-medium ${filter === 'suspended' ? 'bg-slate-100 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                >
                                    Suspended
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium">
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                                More Filters
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
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
                                                    <button className="p-2 text-slate-400 hover:text-admin-primary transition-colors">
                                                        <span className="material-symbols-outlined text-xl">settings_account_box</span>
                                                    </button>
                                                    <button className="px-3 py-1.5 bg-navy-blue dark:bg-slate-700 text-white text-xs font-bold rounded-lg hover:bg-navy-blue/80 transition-colors">Manage</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-sm text-slate-500">Showing <span className="font-bold">{institutions.length}</span> institutions</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Previous</button>
                            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Next</button>
                        </div>
                    </div>
                </div>

                {/* Footer / Quick Access */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-navy-blue rounded-xl text-white flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-lg text-admin-primary">
                            <span className="material-symbols-outlined">help</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold">Support Center</p>
                            <p className="text-xs text-slate-400">View documentation</p>
                        </div>
                    </div>
                    <div className="p-4 bg-navy-blue rounded-xl text-white flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-lg text-admin-primary">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold">Legal & Privacy</p>
                            <p className="text-xs text-slate-400">Tenant agreements</p>
                        </div>
                    </div>
                    <div className="p-4 bg-navy-blue rounded-xl text-white flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-lg text-admin-primary">
                            <span className="material-symbols-outlined">database</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold">API Access</p>
                            <p className="text-xs text-slate-400">Integrations panel</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Onboard Modal */}
            {showOnboardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Onboard Institution</h2>
                        <form onSubmit={handleCreateInstitution} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newInstitution.name}
                                    onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })}
                                    className="w-full p-2 rounded border dark:bg-slate-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={newInstitution.slug}
                                    onChange={(e) => setNewInstitution({ ...newInstitution, slug: e.target.value })}
                                    className="w-full p-2 rounded border dark:bg-slate-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    value={newInstitution.contactEmail}
                                    onChange={(e) => setNewInstitution({ ...newInstitution, contactEmail: e.target.value })}
                                    className="w-full p-2 rounded border dark:bg-slate-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <input
                                    type="text"
                                    value={newInstitution.address}
                                    onChange={(e) => setNewInstitution({ ...newInstitution, address: e.target.value })}
                                    className="w-full p-2 rounded border dark:bg-slate-700"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowOnboardModal(false)}
                                    className="px-4 py-2 text-slate-500 hover:text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-admin-primary text-navy-blue font-bold rounded hover:bg-admin-primary/90"
                                >
                                    Create
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
