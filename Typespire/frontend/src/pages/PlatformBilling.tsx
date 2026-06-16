import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    Receipt, TrendingUp, Users, CreditCard, Star, Zap, Building2,
    X, CheckCircle, AlertCircle, Clock, Ban, ChevronDown, Save, Plus, Edit3
} from 'lucide-react';

type Plan = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
type SubStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';

interface BillingInstitution {
    id: string;
    name: string;
    slug: string;
    contactEmail?: string;
    plan: Plan;
    subscriptionStatus: SubStatus;
    subscriptionStartDate?: string;
    subscriptionEndDate?: string;
    maxStudents: number;
    totalUsers: number;
}

interface PlanConfig {
    id: string;
    plan: Plan;
    name: string;
    price: number;
    maxStudents: number;
    features: string[];
}

interface BillingStats {
    totalMRR: number;
    activePaidSubscriptions: number;
    trialsAndFree: number;
    avgStudentsPerInstitution: number;
    planCounts: Record<string, number>;
    statusCounts: Record<string, number>;
    totalInstitutions: number;
}

const PLAN_META: Record<Plan, { label: string; color: string; bg: string; border: string; price: number; icon: React.ReactNode }> = {
    FREE:         { label: 'Free',         color: 'text-slate-500',   bg: 'bg-slate-100 dark:bg-slate-700',    border: 'border-slate-300 dark:border-slate-600', price: 0,   icon: <Building2 className="w-4 h-4" /> },
    STARTER:      { label: 'Starter',      color: 'text-sky-600',     bg: 'bg-sky-100 dark:bg-sky-900/30',     border: 'border-sky-300 dark:border-sky-700',     price: 49,  icon: <Star className="w-4 h-4" /> },
    PROFESSIONAL: { label: 'Professional', color: 'text-violet-600',  bg: 'bg-violet-100 dark:bg-violet-900/30', border: 'border-violet-300 dark:border-violet-700', price: 149, icon: <Zap className="w-4 h-4" /> },
    ENTERPRISE:   { label: 'Enterprise',   color: 'text-amber-600',   bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-300 dark:border-amber-700',  price: 499, icon: <CreditCard className="w-4 h-4" /> },
};

const STATUS_META: Record<SubStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    ACTIVE:    { label: 'Active',    color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    TRIAL:     { label: 'Trial',     color: 'text-sky-600 dark:text-sky-400',         bg: 'bg-sky-100 dark:bg-sky-900/30',         icon: <Clock className="w-3.5 h-3.5" /> },
    SUSPENDED: { label: 'Suspended', color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-100 dark:bg-amber-900/30',     icon: <AlertCircle className="w-3.5 h-3.5" /> },
    EXPIRED:   { label: 'Expired',   color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-100 dark:bg-red-900/30',         icon: <Ban className="w-3.5 h-3.5" /> },
};

const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
const toInputDate = (d?: string) => d ? new Date(d).toISOString().split('T')[0] : '';

const PlatformBilling: React.FC = () => {
    const [institutions, setInstitutions] = useState<BillingInstitution[]>([]);
    const [plansConfig, setPlansConfig] = useState<PlanConfig[]>([]);
    const [stats, setStats] = useState<BillingStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'subscriptions' | 'configurations'>('subscriptions');
    
    // Subscriptions tab filters
    const [planFilter, setPlanFilter] = useState<Plan | 'ALL'>('ALL');
    const [statusFilter, setStatusFilter] = useState<SubStatus | 'ALL'>('ALL');
    
    // Modal state for institution updates
    const [selected, setSelected] = useState<BillingInstitution | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<{ plan: Plan; subscriptionStatus: SubStatus; subscriptionStartDate: string; subscriptionEndDate: string; maxStudents: number }>({
        plan: 'FREE', subscriptionStatus: 'TRIAL', subscriptionStartDate: '', subscriptionEndDate: '', maxStudents: 50,
    });

    // Side drawer modal for plan config updates
    const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
    const [editPrice, setEditPrice] = useState<number>(0);
    const [editMaxStudents, setEditMaxStudents] = useState<number>(0);
    const [editFeatures, setEditFeatures] = useState<string[]>([]);
    const [newFeatureText, setNewFeatureText] = useState<string>('');
    const [savingConfig, setSavingConfig] = useState(false);

    const fetchAll = async () => {
        try {
            const [instRes, statsRes, plansRes] = await Promise.all([
                api.get<BillingInstitution[]>('/billing'),
                api.get<BillingStats>('/billing/stats'),
                api.get<PlanConfig[]>('/billing/plans'),
            ]);
            setInstitutions(instRes.data);
            setStats(statsRes.data);
            setPlansConfig(plansRes.data);
        } catch (e) {
            console.error('Failed to load billing data', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const openModal = (inst: BillingInstitution) => {
        setSelected(inst);
        setForm({
            plan: inst.plan,
            subscriptionStatus: inst.subscriptionStatus,
            subscriptionStartDate: toInputDate(inst.subscriptionStartDate),
            subscriptionEndDate: toInputDate(inst.subscriptionEndDate),
            maxStudents: inst.maxStudents,
        });
    };

    const handleSave = async () => {
        if (!selected) return;
        setSaving(true);
        try {
            await api.patch(`/billing/${selected.id}`, {
                plan: form.plan,
                subscriptionStatus: form.subscriptionStatus,
                subscriptionStartDate: form.subscriptionStartDate || null,
                subscriptionEndDate: form.subscriptionEndDate || null,
                maxStudents: form.maxStudents,
            });
            setSelected(null);
            fetchAll();
        } catch (e) {
            console.error('Failed to update billing', e);
        } finally {
            setSaving(false);
        }
    };

    const openConfigDrawer = (config: PlanConfig) => {
        setEditingPlan(config);
        setEditPrice(config.price);
        setEditMaxStudents(config.maxStudents);
        setEditFeatures(config.features || []);
        setNewFeatureText('');
    };

    const handleAddFeature = () => {
        if (newFeatureText.trim() && !editFeatures.includes(newFeatureText.trim())) {
            setEditFeatures([...editFeatures, newFeatureText.trim()]);
            setNewFeatureText('');
        }
    };

    const handleRemoveFeature = (index: number) => {
        setEditFeatures(editFeatures.filter((_, i) => i !== index));
    };

    const handleSavePlanConfig = async () => {
        if (!editingPlan) return;
        setSavingConfig(true);
        try {
            await api.put(`/billing/plans/${editingPlan.plan}`, {
                price: editPrice,
                maxStudents: editMaxStudents,
                features: editFeatures,
            });
            setEditingPlan(null);
            fetchAll();
        } catch (err) {
            console.error('Failed to update plan configuration', err);
        } finally {
            setSavingConfig(false);
        }
    };

    const filtered = institutions.filter(i =>
        (planFilter === 'ALL' || i.plan === planFilter) &&
        (statusFilter === 'ALL' || i.subscriptionStatus === statusFilter)
    );

    return (
        <>
            {/* Header */}
            <header className="bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                        <Receipt className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Billing &amp; Plans</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage institution configurations and subscription levels</p>
                    </div>
                </div>
            </header>

            {/* Tabs Selector */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-8 bg-white dark:bg-background-dark/50 shrink-0">
                <button
                    onClick={() => setActiveTab('subscriptions')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'subscriptions' ? 'border-[#33B974] text-[#33B974]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                    Subscriptions
                </button>
                <button
                    onClick={() => setActiveTab('configurations')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'configurations' ? 'border-[#33B974] text-[#33B974]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                    Plan Configurations
                </button>
            </div>

            <div className="p-4 md:p-8 space-y-8 overflow-y-auto flex-1">
                {activeTab === 'subscriptions' ? (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Monthly Revenue', value: stats ? `$${stats.totalMRR.toLocaleString()}` : '—', sub: 'Estimated MRR', icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                                { label: 'Paid Subscriptions', value: stats ? stats.activePaidSubscriptions : '—', sub: 'Active paying institutions', icon: <CheckCircle className="w-5 h-5" />, color: 'text-sky-600', bg: 'bg-sky-100 dark:bg-sky-900/30' },
                                { label: 'Trial / Free', value: stats ? stats.trialsAndFree : '—', sub: 'Not yet converting', icon: <Clock className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
                                { label: 'Avg. Students', value: stats ? stats.avgStudentsPerInstitution : '—', sub: 'Per institution', icon: <Users className="w-5 h-5" />, color: 'text-violet-600', bg: 'bg-violet-100 dark:bg-violet-900/30' },
                            ].map((s) => (
                                <div key={s.label} className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`p-2 ${s.bg} ${s.color} rounded-lg`}>{s.icon}</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{s.label}</p>
                                    <h3 className="text-2xl font-bold mt-0.5">{loading ? <span className="text-slate-300 dark:text-slate-600">...</span> : s.value}</h3>
                                    <p className="text-[11px] text-slate-400 mt-1">{s.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Plan Distribution Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(Object.keys(PLAN_META) as Plan[]).map((plan) => {
                                const meta = PLAN_META[plan];
                                const config = plansConfig.find(p => p.plan === plan);
                                const price = config ? config.price : meta.price;
                                const count = stats?.planCounts?.[plan] ?? 0;
                                return (
                                    <button
                                        key={plan}
                                        onClick={() => setPlanFilter(planFilter === plan ? 'ALL' : plan)}
                                        className={`relative p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${planFilter === plan ? `${meta.border} ${meta.bg}` : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                    >
                                        <div className={`inline-flex items-center gap-1.5 mb-3 ${meta.color}`}>{meta.icon}<span className="text-xs font-bold uppercase tracking-wider">{meta.label}</span></div>
                                        <p className="text-2xl font-bold">{loading ? '—' : count}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">institutions</p>
                                        {price > 0 && <p className={`text-xs font-bold mt-2 ${meta.color}`}>${price}/mo</p>}
                                        {price === 0 && <p className="text-xs font-bold mt-2 text-slate-400">Free</p>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h3 className="font-bold text-base">Subscriptions</h3>
                                <div className="flex items-center gap-2">
                                    {/* Status filter */}
                                    <div className="relative">
                                        <select
                                            value={statusFilter}
                                            onChange={e => setStatusFilter(e.target.value as SubStatus | 'ALL')}
                                            className="appearance-none pl-3 pr-8 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none cursor-pointer"
                                        >
                                            <option value="ALL">All Statuses</option>
                                            {(Object.keys(STATUS_META) as SubStatus[]).map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                                        </select>
                                        <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[720px]">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3">Institution</th>
                                            <th className="px-6 py-3">Plan</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Students</th>
                                            <th className="px-6 py-3">Renewal Date</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                        {loading ? (
                                            <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">Loading...</td></tr>
                                        ) : filtered.length === 0 ? (
                                            <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">No institutions match filters.</td></tr>
                                        ) : filtered.map(inst => {
                                            const pm = PLAN_META[inst.plan];
                                            const sm = STATUS_META[inst.subscriptionStatus];
                                            return (
                                                <tr key={inst.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-300 shrink-0">
                                                                {inst.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm">{inst.name}</p>
                                                                <p className="text-xs text-slate-400">{inst.slug}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${pm.bg} ${pm.color}`}>
                                                            {pm.icon}{pm.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${sm.bg} ${sm.color}`}>
                                                            {sm.icon}{sm.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-medium">{inst.totalUsers}</span>
                                                        <span className="text-xs text-slate-400"> / {inst.maxStudents}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{fmt(inst.subscriptionEndDate)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => openModal(inst)}
                                                            className="px-3 py-1.5 bg-[#094A71] hover:bg-[#094A71]/80 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            Manage Plan
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Plan Configurations Tab */
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Plan Tiers</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Configure prices, maximum students limits, and feature lists for each plan.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {plansConfig.map((config) => {
                                const meta = PLAN_META[config.plan];
                                return (
                                    <div key={config.id} className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#33B974]/50 transition-all duration-300">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.color}`}>
                                                    {meta.icon}<span>{meta.label}</span>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                                    {config.price === 0 ? 'Free' : `$${config.price}`}
                                                    {config.price > 0 && <span className="text-xs font-medium text-slate-500"> / month</span>}
                                                </h4>
                                                <p className="text-xs text-slate-400 mt-1">Student limit: <span className="font-bold text-slate-700 dark:text-slate-200">{config.maxStudents.toLocaleString()} seats</span></p>
                                            </div>

                                            <hr className="border-slate-100 dark:border-slate-800 mb-4" />

                                            <div className="space-y-2 mb-6">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Features Included</p>
                                                {config.features && config.features.map((feature, i) => (
                                                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                        <CheckCircle className="w-3.5 h-3.5 text-[#33B974] shrink-0 mt-0.5" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => openConfigDrawer(config)}
                                            className="w-full mt-2 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer border border-slate-100 dark:border-slate-700"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                            <span>Configure Plan</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Manage Institution Plan Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
                    <div
                        className="relative h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4 shrink-0">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Manage Plan</p>
                                <h3 className="text-lg font-bold">{selected.name}</h3>
                                <p className="text-xs text-slate-400">{selected.slug}</p>
                            </div>
                            <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mt-0.5">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Plan Selection */}
                        <div className="p-6 space-y-6 flex-1">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Select Plan</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(Object.keys(PLAN_META) as Plan[]).map(plan => {
                                        const meta = PLAN_META[plan];
                                        const isActive = form.plan === plan;
                                        const config = plansConfig.find(p => p.plan === plan);
                                        const price = config ? config.price : meta.price;
                                        return (
                                            <button
                                                key={plan}
                                                type="button"
                                                onClick={() => setForm(f => ({ ...f, plan }))}
                                                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${isActive ? `${meta.border} ${meta.bg}` : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500'}`}
                                            >
                                                <div className={`flex items-center gap-1.5 mb-1 ${meta.color}`}>{meta.icon}<span className="text-xs font-bold">{meta.label}</span></div>
                                                <p className="text-xs text-slate-500">{price === 0 ? 'Free' : `$${price}/mo`}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Subscription Status</label>
                                <div className="relative">
                                    <select
                                        value={form.subscriptionStatus}
                                        onChange={e => setForm(f => ({ ...f, subscriptionStatus: e.target.value as SubStatus }))}
                                        className="w-full appearance-none pl-4 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#33B974]/50 focus:border-[#33B974] outline-none transition-all cursor-pointer"
                                    >
                                        {(Object.keys(STATUS_META) as SubStatus[]).map(s => (
                                            <option key={s} value={s}>{STATUS_META[s].label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={form.subscriptionStartDate}
                                        onChange={e => setForm(f => ({ ...f, subscriptionStartDate: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#33B974]/50 focus:border-[#33B974] outline-none transition-all cursor-pointer text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={form.subscriptionEndDate}
                                        onChange={e => setForm(f => ({ ...f, subscriptionEndDate: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#33B974]/50 focus:border-[#33B974] outline-none transition-all cursor-pointer text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Max Students */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Max Students Allowed</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={form.maxStudents}
                                    onChange={e => setForm(f => ({ ...f, maxStudents: parseInt(e.target.value) || 1 }))}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#33B974]/50 focus:border-[#33B974] outline-none transition-all text-slate-900 dark:text-white"
                                />
                                <p className="text-xs text-slate-400 mt-1">Currently {selected.totalUsers} students enrolled</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3 shrink-0">
                            <button
                                onClick={() => setSelected(null)}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-[#33B974] hover:bg-[#33B974]/90 text-white rounded-lg shadow-lg shadow-[#33B974]/20 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Plan Configuration Side Drawer Drawer */}
            {editingPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm" onClick={() => setEditingPlan(null)}>
                    <div
                        className="relative h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4 shrink-0">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Configure Plan Properties</p>
                                <h3 className="text-lg font-bold">Plan: {editingPlan.name}</h3>
                                <p className="text-xs text-slate-400">{editingPlan.plan}</p>
                            </div>
                            <button onClick={() => setEditingPlan(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mt-0.5 cursor-pointer">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="p-6 space-y-6 flex-1">
                            {/* Price */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Plan Price ($ / month)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={editPrice}
                                    onChange={e => setEditPrice(parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#33B974]/50 focus:border-[#33B974] outline-none transition-all text-slate-900 dark:text-white"
                                />
                            </div>

                            {/* Max Students */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Student Capacity Limit (Seats)</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={editMaxStudents}
                                    onChange={e => setEditMaxStudents(parseInt(e.target.value) || 1)}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#33B974]/50 focus:border-[#33B974] outline-none transition-all text-slate-900 dark:text-white"
                                />
                            </div>

                            {/* Features Editor */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Plan Features List</label>
                                
                                {/* Existing tags */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {editFeatures.map((feat, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-lg border border-slate-200 dark:border-slate-700">
                                            <span>{feat}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeature(idx)}
                                                className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {editFeatures.length === 0 && (
                                        <p className="text-xs text-slate-400 italic">No features configured yet.</p>
                                    )}
                                </div>

                                {/* Add feature */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a feature tag..."
                                        value={newFeatureText}
                                        onChange={e => setNewFeatureText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAddFeature()}
                                        className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#33B974]/50 focus:border-[#33B974] outline-none transition-all text-slate-900 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddFeature}
                                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3 shrink-0">
                            <button
                                onClick={() => setEditingPlan(null)}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSavePlanConfig}
                                disabled={savingConfig}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-[#33B974] hover:bg-[#33B974]/90 text-white rounded-lg shadow-lg shadow-[#33B974]/20 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                {savingConfig ? 'Saving...' : 'Save Config'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlatformBilling;
