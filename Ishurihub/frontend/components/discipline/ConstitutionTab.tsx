"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export interface DisciplinePolicy {
    id: string;
    name: string;
    type: 'Merit' | 'Sanction';
    points: number;
    severity?: 'Low' | 'Medium' | 'High' | 'Critical';
    description?: string;
}

export default function ConstitutionTab({ schoolId }: { schoolId: string }) {
    const [policies, setPolicies] = useState<DisciplinePolicy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        type: 'Sanction' as 'Merit' | 'Sanction',
        points: 0,
        severity: 'Low',
        description: ''
    });

    const fetchPolicies = async () => {
        try {
            const res = await api.get('/discipline/policies', { params: { schoolId } });
            setPolicies(res.data);
        } catch (err) {
            console.error("Failed to fetch policies", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, [schoolId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/discipline/policies', { ...formData, schoolId });
            setShowAddForm(false);
            setFormData({ name: '', type: 'Sanction', points: 0, severity: 'Low', description: '' });
            fetchPolicies();
        } catch (err) {
            console.error("Failed to add policy", err);
            alert("Failed to save policy.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;
        try {
            await api.delete(`/discipline/policies/${id}`);
            fetchPolicies();
        } catch (err) {
            console.error("Failed to delete policy", err);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Constitution...</div>;

    const sanctions = policies.filter(p => p.type === 'Sanction');
    const merits = policies.filter(p => p.type === 'Merit');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">School Constitution</h2>
                    <p className="text-sm text-gray-500 mt-1">Predefined rules and point allocations for discipline logging.</p>
                </div>
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Rule
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white dark:bg-gray-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/30 shadow-md">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Add New Rule</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rule Name (Infraction/Merit)</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="e.g. Late for Class" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                                <option value="Sanction">Sanction (Penalty)</option>
                                <option value="Merit">Merit (Award)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points to {formData.type === 'Merit' ? 'Award' : 'Deduct'}</label>
                            <input required type="number" min="0" max="100" value={formData.points} onChange={e => setFormData({...formData, points: parseInt(e.target.value) || 0})} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
                        </div>
                        {formData.type === 'Sanction' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity Level</label>
                                <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value as any})} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        )}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                            <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="Guidelines for when to apply this rule..." />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Rule</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sanctions List */}
                <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-red-50/50 dark:bg-red-900/10 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">warning</span>
                        <h3 className="font-bold text-gray-900 dark:text-white">Sanctions & Penalties</h3>
                        <span className="ml-auto text-xs text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">{sanctions.length} rules</span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {sanctions.length === 0 ? <div className="p-8 text-center text-gray-400">No sanctions defined.</div> : sanctions.map(policy => (
                            <div key={policy.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{policy.name}</h4>
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${policy.severity === 'Critical' ? 'bg-red-100 text-red-700' : policy.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{policy.severity}</span>
                                    </div>
                                    {policy.description && <p className="text-xs text-gray-500 mt-1">{policy.description}</p>}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-red-600">-{policy.points} pts</span>
                                    <button onClick={() => handleDelete(policy.id)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-sm">delete</span></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Merits List */}
                <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-emerald-50/50 dark:bg-emerald-900/10 flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-500">workspace_premium</span>
                        <h3 className="font-bold text-gray-900 dark:text-white">Merits & Awards</h3>
                        <span className="ml-auto text-xs text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">{merits.length} rules</span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {merits.length === 0 ? <div className="p-8 text-center text-gray-400">No merits defined.</div> : merits.map(policy => (
                            <div key={policy.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{policy.name}</h4>
                                    {policy.description && <p className="text-xs text-gray-500 mt-1">{policy.description}</p>}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-emerald-600">+{policy.points} pts</span>
                                    <button onClick={() => handleDelete(policy.id)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-sm">delete</span></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
