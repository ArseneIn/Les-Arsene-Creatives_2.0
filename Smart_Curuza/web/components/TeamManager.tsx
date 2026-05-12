import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, User, Shield, Activity, X, ShieldCheck, UserCheck, UserX, Clock, Bell, TrendingUp, ShoppingBag, RotateCcw, DollarSign } from 'lucide-react';
import PhoneInput from './ui/PhoneInput';

interface PendingLoginRequest {
    id: string;
    cashier?: { name?: string; email?: string; phone?: string };
    expires_at: string;
    status: string;
}

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

interface StaffSaleRecord {
    id: string;
    total: number;
    payment_method: string;
    status: string;
    items: { productName: string; quantity: number; price: number }[];
    created_at: string;
}

interface StaffSalesData {
    staff: StaffMember;
    sales: StaffSaleRecord[];
    summary: { totalSales: number; totalRevenue: number; refunds: number };
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
    const [activeTab, setActiveTab] = useState<'shifts' | 'sales'>('shifts');
    const [staffActivity, setStaffActivity] = useState<ShiftActivity[]>([]);
    const [loadingActivity, setLoadingActivity] = useState(false);
    const [staffSalesData, setStaffSalesData] = useState<StaffSalesData | null>(null);
    const [loadingSales, setLoadingSales] = useState(false);
    const [salesDateRange, setSalesDateRange] = useState<{ start: string; end: string }>({
        start: '',
        end: '',
    });

    // Pending Login Approvals State
    const [pendingLogins, setPendingLogins] = useState<PendingLoginRequest[]>([]);
    const [approvingId, setApprovingId] = useState<string | null>(null);

    const fetchPendingLogins = useCallback(async () => {
        try {
            const data = await api.get<PendingLoginRequest[]>('/merchants/staff/pending-logins');
            setPendingLogins(data);
        } catch (error) {
            // Silently fail — don't interrupt the user
        }
    }, []);

    useEffect(() => {
        fetchStaff();
        fetchPendingLogins();
        // Poll every 10 seconds for new login requests
        const interval = setInterval(fetchPendingLogins, 10000);
        return () => clearInterval(interval);
    }, [fetchPendingLogins]);

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

    const fetchStaffSales = async (staffId: string, startDate?: string, endDate?: string) => {
        setLoadingSales(true);
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            const query = params.toString() ? `?${params.toString()}` : '';
            const data = await api.get<StaffSalesData>(`/merchants/staff/${staffId}/sales${query}`);
            setStaffSalesData(data);
        } catch (error) {
            console.error('Failed to fetch staff sales', error);
        } finally {
            setLoadingSales(false);
        }
    };

    const handleViewStaff = (member: StaffMember) => {
        setSelectedStaff(member);
        setActiveTab('shifts');
        setStaffActivity([]);
        setStaffSalesData(null);
        setSalesDateRange({ start: '', end: '' });
        fetchStaffActivity(member.id);
        fetchStaffSales(member.id);
    };

    const handleApplySalesDateFilter = () => {
        if (selectedStaff) {
            fetchStaffSales(selectedStaff.id, salesDateRange.start || undefined, salesDateRange.end || undefined);
        }
    };

    const handleClearSalesDateFilter = () => {
        setSalesDateRange({ start: '', end: '' });
        if (selectedStaff) fetchStaffSales(selectedStaff.id);
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

    const handleApproveLogin = async (requestId: string) => {
        setApprovingId(requestId);
        try {
            await api.post(`/auth/login/approve/${requestId}`, {});
            fetchPendingLogins();
        } catch (error) {
            console.error('Failed to approve login', error);
        } finally {
            setApprovingId(null);
        }
    };

    const handleRejectLogin = async (requestId: string) => {
        setApprovingId(requestId);
        try {
            await api.post(`/auth/login/reject/${requestId}`, {});
            fetchPendingLogins();
        } catch (error) {
            console.error('Failed to reject login', error);
        } finally {
            setApprovingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* PENDING LOGIN APPROVALS */}
            {pendingLogins.length > 0 && (
                <div className="rounded-xl border-2 border-amber-400/60 bg-amber-50/50 p-4 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="relative">
                            <Bell className="h-5 w-5 text-amber-600" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
                            </span>
                        </div>
                        <span className="font-bold text-amber-800 text-sm">Login Approvals ({pendingLogins.length})</span>
                    </div>
                    {pendingLogins.map(request => {
                        const expiresAt = new Date(request.expires_at);
                        const minutesLeft = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000));
                        const isExpiring = minutesLeft <= 1;
                        const isProcessing = approvingId === request.id;
                        return (
                            <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-lg p-3 border border-amber-200 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-jet text-sm">{request.cashier?.name || request.cashier?.email || request.cashier?.phone || 'Unknown Staff'}</p>
                                        <p className="text-xs text-jet-500">Wants to log in</p>
                                        <div className={`flex items-center gap-1 text-xs mt-0.5 font-semibold ${isExpiring ? 'text-red-600' : 'text-amber-700'}`}>
                                            <Clock className="h-3 w-3" />
                                            <span>Expires {isExpiring ? 'in &lt;1 min' : `in ${minutesLeft} min`} — {expiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 self-end sm:self-auto">
                                    <button
                                        onClick={() => handleRejectLogin(request.id)}
                                        disabled={isProcessing}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                                    >
                                        <UserX className="h-4 w-4" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApproveLogin(request.id)}
                                        disabled={isProcessing}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                                    >
                                        <UserCheck className="h-4 w-4" />
                                        {isProcessing ? '...' : 'Approve'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="flex justify-end items-center mb-4">
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
                                            onClick={() => handleViewStaff(member)}
                                            className="text-xs text-gold hover:underline flex items-center gap-1"
                                        >
                                            <Activity className="h-3 w-3" />
                                            View Details
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

            {/* Staff Detail Modal */}
            {selectedStaff && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-surface w-full max-w-2xl rounded-xl shadow-lg p-6 animate-in fade-in zoom-in duration-200 max-h-[85vh] flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-jet font-heading">{selectedStaff.name}</h3>
                                <p className="text-sm text-jet-700">{selectedStaff.email || selectedStaff.phone} · {selectedStaff.role}</p>
                            </div>
                            <button
                                onClick={() => setSelectedStaff(null)}
                                className="p-2 hover:bg-platinum-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-jet-500" />
                            </button>
                        </div>

                        {/* Summary KPIs (from sales data) */}
                        {staffSalesData && (
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                                    <p className="text-xs text-green-700 font-semibold">Total Revenue</p>
                                    <p className="text-lg font-bold text-green-800">{Number(staffSalesData.summary.totalRevenue).toLocaleString()} <span className="text-xs">RWF</span></p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                                    <p className="text-xs text-blue-700 font-semibold">Sales Count</p>
                                    <p className="text-lg font-bold text-blue-800">{staffSalesData.summary.totalSales}</p>
                                </div>
                                <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                                    <p className="text-xs text-red-700 font-semibold">Refunds</p>
                                    <p className="text-lg font-bold text-red-800">{staffSalesData.summary.refunds}</p>
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="flex gap-2 mb-4 border-b border-platinum-200">
                            <button
                                onClick={() => setActiveTab('shifts')}
                                className={`pb-2 px-1 text-sm font-semibold border-b-2 transition-colors ${
                                    activeTab === 'shifts' ? 'border-gold text-jet' : 'border-transparent text-jet-500 hover:text-jet'
                                }`}
                            >
                                Shift History
                            </button>
                            <button
                                onClick={() => setActiveTab('sales')}
                                className={`pb-2 px-1 text-sm font-semibold border-b-2 transition-colors ${
                                    activeTab === 'sales' ? 'border-gold text-jet' : 'border-transparent text-jet-500 hover:text-jet'
                                }`}
                            >
                                Sales ({staffSalesData?.summary.totalSales ?? '...'})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {activeTab === 'shifts' ? (
                                loadingActivity ? (
                                    <div className="text-center py-8 text-jet-500">Loading shifts...</div>
                                ) : staffActivity.length === 0 ? (
                                    <div className="text-center py-8 text-jet-500">No shifts recorded yet.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {staffActivity.map(shift => (
                                            <div key={shift.id} className="border border-platinum-200 rounded-lg p-4 hover:bg-platinum-50 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${shift.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                            {shift.status}
                                                        </span>
                                                        <p className="text-sm font-medium text-jet mt-2">{new Date(shift.start_time).toLocaleDateString()}</p>
                                                        <p className="text-xs text-jet-500">
                                                            {new Date(shift.start_time).toLocaleTimeString()} → {shift.end_time ? new Date(shift.end_time).toLocaleTimeString() : 'Ongoing'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-jet-700">Expected: <span className="font-medium">{Number(shift.expected_cash).toLocaleString()} RWF</span></p>
                                                        {shift.actual_cash != null && (
                                                            <p className="text-sm text-jet-700">Actual: <span className="font-medium">{Number(shift.actual_cash).toLocaleString()} RWF</span></p>
                                                        )}
                                                        {shift.difference != null && shift.difference !== 0 && (
                                                            <p className={`text-sm font-bold ${shift.difference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                                {shift.difference > 0 ? '+' : ''}{Number(shift.difference).toLocaleString()} RWF
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div>
                                    {/* Date filter bar */}
                                    <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-platinum-50 rounded-xl border border-platinum-200">
                                        <div className="flex items-center gap-1.5">
                                            <label className="text-xs font-semibold text-jet-600">From</label>
                                            <input
                                                type="date"
                                                value={salesDateRange.start}
                                                onChange={e => setSalesDateRange(r => ({ ...r, start: e.target.value }))}
                                                className="text-xs border border-platinum-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold/30"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <label className="text-xs font-semibold text-jet-600">To</label>
                                            <input
                                                type="date"
                                                value={salesDateRange.end}
                                                onChange={e => setSalesDateRange(r => ({ ...r, end: e.target.value }))}
                                                className="text-xs border border-platinum-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold/30"
                                            />
                                        </div>
                                        <button
                                            onClick={handleApplySalesDateFilter}
                                            className="text-xs px-3 py-1.5 bg-gold text-onyx font-bold rounded-lg hover:bg-gold/90 transition-colors"
                                        >
                                            Apply
                                        </button>
                                        {(salesDateRange.start || salesDateRange.end) && (
                                            <button
                                                onClick={handleClearSalesDateFilter}
                                                className="text-xs px-3 py-1.5 bg-platinum-200 text-jet-600 font-bold rounded-lg hover:bg-platinum-300 transition-colors"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    {loadingSales ? (
                                        <div className="text-center py-8 text-jet-500">Loading sales...</div>
                                    ) : !staffSalesData || staffSalesData.sales.length === 0 ? (
                                        <div className="text-center py-8 text-jet-500">No sales found for selected period.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {staffSalesData.sales.map(sale => (
                                            <div key={sale.id} className="border border-platinum-200 rounded-lg p-4 hover:bg-platinum-50 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                                sale.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                                {sale.status}
                                                            </span>
                                                            <span className="text-xs bg-platinum-100 text-jet-600 px-2 py-0.5 rounded-full font-medium">{sale.payment_method}</span>
                                                        </div>
                                                        <p className="text-xs text-jet-500 mt-1">
                                                            {new Date(sale.created_at).toLocaleString()}
                                                        </p>
                                                        {sale.items?.length > 0 && (
                                                            <p className="text-xs text-jet-500 mt-0.5">
                                                                {sale.items.length} item{sale.items.length > 1 ? 's' : ''}: {sale.items.map(i => i.productName).join(', ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-lg font-bold ${sale.status === 'REFUNDED' ? 'text-red-500 line-through' : 'text-jet'}`}>
                                                            {Number(sale.total).toLocaleString()} RWF
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowAddModal(false);
                    }}
                >
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
