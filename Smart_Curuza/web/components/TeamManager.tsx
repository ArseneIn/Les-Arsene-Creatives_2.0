import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, User, Shield, Activity, X } from 'lucide-react';
import PhoneInput from './ui/PhoneInput';

interface StaffMember {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    role: string;
    created_at: string;
}

interface ShiftActivity {
    id: string;
    start_time: string;
    end_time?: string;
    starting_cash: number;
    expected_cash: number;
    actual_cash?: number;
    difference?: number;
    status: 'OPEN' | 'CLOSED';
}

export default function TeamManager() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('phone');
    const [countryCode, setCountryCode] = useState('+250');
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [newStaff, setNewStaff] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        pin: '',
        role: 'CASHIER'
    });

    // Activity Monitoring State
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [staffActivity, setStaffActivity] = useState<ShiftActivity[]>([]);
    const [loadingActivity, setLoadingActivity] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const data = await api.get<StaffMember[]>('/merchants/staff');
            setStaff(data);
        } catch (error) {
            console.error('Failed to fetch staff', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaffActivity = async (staffId: string) => {
        setLoadingActivity(true);
        try {
            const data = await api.get<ShiftActivity[]>(`/merchants/staff/${staffId}/activity`);
            setStaffActivity(data);
        } catch (error) {
            console.error('Failed to fetch staff activity', error);
        } finally {
            setLoadingActivity(false);
        }
    };

    const handleViewActivity = (member: StaffMember) => {
        setSelectedStaff(member);
        fetchStaffActivity(member.id);
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formattedPhone = `${countryCode}${newStaff.phone.replace(/^0+/, '')}`;

            const payload = authMethod === 'email'
                ? { name: newStaff.name, email: newStaff.email, password: newStaff.password, role: newStaff.role }
                : { name: newStaff.name, phone: formattedPhone, pin: newStaff.pin, role: newStaff.role };

            await api.post('/merchants/staff', payload);
            setShowAddModal(false);
            setNewStaff({ name: '', email: '', password: '', phone: '', pin: '', role: 'CASHIER' });
            setCountryCode('+250');
            fetchStaff();
        } catch (error) {
            console.error('Failed to add staff', error);
            alert('Failed to add staff member');
        }
    };

    const handleRemoveStaff = async (id: string) => {
        if (!confirm('Are you sure you want to remove this staff member?')) return;
        try {
            await api.delete(`/merchants/staff/${id}`);
            fetchStaff();
        } catch (error) {
            console.error('Failed to remove staff', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-jet font-heading">Team Management</h2>
                    <p className="text-jet-700">Manage your shop staff and their access</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-gold text-onyx rounded-lg font-bold hover:bg-gold/90 transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Staff
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading team...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.map(member => (
                        <div key={member.id} className="bg-surface p-4 rounded-xl border border-platinum-600 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-platinum-200 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-jet" />
                                </div>
                                <div>
                                    <p className="font-medium text-jet">{member.name || 'Unnamed Staff'}</p>
                                    <p className="text-xs text-jet-500">{member.email || member.phone}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1 text-xs text-jet-700">
                                            <Shield className="h-3 w-3" />
                                            {member.role}
                                        </div>
                                        <button
                                            onClick={() => handleViewActivity(member)}
                                            className="text-xs text-gold hover:underline flex items-center gap-1"
                                        >
                                            <Activity className="h-3 w-3" />
                                            View Activity
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveStaff(member.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Activity Modal */}
            {selectedStaff && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-surface w-full max-w-2xl rounded-xl shadow-lg p-6 animate-in fade-in zoom-in duration-200 max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-jet font-heading">{selectedStaff.name}'s Activity</h3>
                                <p className="text-sm text-jet-700">Recent shifts and performance</p>
                            </div>
                            <button
                                onClick={() => setSelectedStaff(null)}
                                className="p-2 hover:bg-platinum-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-jet-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {loadingActivity ? (
                                <div className="text-center py-8">Loading activity...</div>
                            ) : staffActivity.length === 0 ? (
                                <div className="text-center py-8 text-jet-500">No activity recorded yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {staffActivity.map(shift => (
                                        <div key={shift.id} className="border border-platinum-200 rounded-lg p-4 hover:bg-platinum-50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${shift.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {shift.status}
                                                    </span>
                                                    <p className="text-sm font-medium text-jet mt-2">
                                                        {new Date(shift.start_time).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-jet-500">
                                                        {new Date(shift.start_time).toLocaleTimeString()} - {shift.end_time ? new Date(shift.end_time).toLocaleTimeString() : 'Ongoing'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-jet-700">Expected: <span className="font-medium">{Number(shift.expected_cash).toLocaleString()} RWF</span></p>
                                                    {shift.actual_cash !== null && (
                                                        <p className="text-sm text-jet-700">Actual: <span className="font-medium">{Number(shift.actual_cash).toLocaleString()} RWF</span></p>
                                                    )}
                                                    {shift.difference !== undefined && shift.difference !== null && shift.difference !== 0 && (
                                                        <p className={`text-sm font-bold ${shift.difference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                            {shift.difference > 0 ? '+' : ''}{Number(shift.difference).toLocaleString()} RWF
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-surface w-full max-w-md rounded-xl shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-jet mb-4">Add New Staff Member</h3>

                        {/* Auth Method Toggle */}
                        <div className="flex p-1 bg-gray-100 rounded-lg mb-4">
                            <button
                                type="button"
                                onClick={() => setAuthMethod('phone')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMethod === 'phone' ? 'bg-white text-jet shadow-sm' : 'text-gray-500 hover:text-jet'
                                    }`}
                            >
                                Phone & PIN
                            </button>
                            <button
                                type="button"
                                onClick={() => setAuthMethod('email')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMethod === 'email' ? 'bg-white text-jet shadow-sm' : 'text-gray-500 hover:text-jet'
                                    }`}
                            >
                                Email & Password
                            </button>
                        </div>

                        <form onSubmit={handleAddStaff} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-jet mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={newStaff.name}
                                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>

                            {authMethod === 'email' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-jet mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={newStaff.email}
                                            onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-jet mb-1">Password</label>
                                        <input
                                            type="password"
                                            value={newStaff.password}
                                            onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                                            className="w-full px-4 py-2 border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-jet mb-1">Phone Number</label>
                                        <PhoneInput
                                            value={newStaff.phone}
                                            onChange={(val, isValid) => {
                                                setNewStaff({ ...newStaff, phone: val });
                                                setIsPhoneValid(isValid);
                                            }}
                                            countryCode={countryCode}
                                            onCountryChange={setCountryCode}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-jet mb-1">PIN Code (4 digits)</label>
                                        <input
                                            type="password"
                                            value={newStaff.pin}
                                            onChange={e => setNewStaff({ ...newStaff, pin: e.target.value })}
                                            className="w-full px-4 py-2 border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none tracking-widest"
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-jet mb-1">Role</label>
                                <select
                                    value={newStaff.role}
                                    onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                >
                                    <option value="CASHIER">Cashier</option>
                                    <option value="MERCHANT">Manager</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-jet-600 hover:bg-platinum-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={authMethod === 'phone' && !isPhoneValid}
                                    className="px-4 py-2 bg-gold text-onyx rounded-lg font-bold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
