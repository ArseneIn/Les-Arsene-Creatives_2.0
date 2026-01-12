import React, { useState } from 'react';

// --- Types ---
interface Facilitator {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Pending' | 'Inactive';
    assignedIntakes: string[];
}

// --- Mock Data ---
const MOCK_FACILITATORS: Facilitator[] = [
    { id: '1', name: 'Jane Doe', email: 'jane.doe@kepler.edu', role: 'Senior Facilitator', status: 'Active', assignedIntakes: ['Fall 2024'] },
    { id: '2', name: 'John Smith', email: 'john.smith@kepler.edu', role: 'Facilitator', status: 'Active', assignedIntakes: ['Spring 2025'] },
    { id: '3', name: 'Alice Johnson', email: 'alice.j@kepler.edu', role: 'Assistant', status: 'Pending', assignedIntakes: [] },
];

const InstitutionFacilitators: React.FC = () => {
    const [facilitators, setFacilitators] = useState<Facilitator[]>(MOCK_FACILITATORS);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('Facilitator');

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        const newFacilitator: Facilitator = {
            id: Date.now().toString(),
            name: 'Pending User',
            email: inviteEmail,
            role: inviteRole,
            status: 'Pending',
            assignedIntakes: []
        };
        setFacilitators([...facilitators, newFacilitator]);
        setInviteEmail('');
        setShowInviteModal(false);
    };

    return (
        <>
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-[#0d1b17] text-3xl font-bold leading-tight">Facilitator Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage staff access, roles, and intake assignments.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0d1b17] text-white rounded-lg text-sm font-bold hover:bg-[#1a2e28] transition-colors shadow-lg shadow-gray-200"
                >
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    Invite Facilitator
                </button>
            </header>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0f253a] text-white text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Facilitator</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Assigned Intakes</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {facilitators.map((facilitator) => (
                                <tr key={facilitator.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0d1b17] font-bold border border-gray-200">
                                                {facilitator.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#0d1b17]">{facilitator.name}</p>
                                                <p className="text-xs text-gray-500">{facilitator.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{facilitator.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${facilitator.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                facilitator.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {facilitator.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {facilitator.assignedIntakes.length > 0 ? (
                                                facilitator.assignedIntakes.map((intake, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded border border-gray-200">
                                                        {intake}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">No assignments</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-[#0d1b17] transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#0d1b17]">Invite Facilitator</h3>
                            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleInvite} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none"
                                    placeholder="colleague@kepler.edu"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                >
                                    <option value="Facilitator">Facilitator</option>
                                    <option value="Senior Facilitator">Senior Facilitator</option>
                                    <option value="Assistant">Assistant</option>
                                </select>
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#0d1b17] text-white font-bold rounded-lg hover:bg-[#1a2e28] shadow-lg shadow-[#0d1b17]/20"
                                >
                                    Send Invitation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstitutionFacilitators;
