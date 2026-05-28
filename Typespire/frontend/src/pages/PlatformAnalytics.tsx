import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { BarChart2, Users, Zap, Target, TrendingUp, Building2 } from 'lucide-react';

interface GlobalStats {
    totalInstitutions: number;
    activeStudents: number;
    avgWpm: number;
    avgAccuracy: number;
    totalTestsTaken: number;
}

interface InstitutionStat {
    id: string;
    name: string;
    slug: string;
    _count?: { users: number };
    avgWpm?: number;
    avgAccuracy?: number;
    testCount?: number;
}

const StatCard: React.FC<{ label: string; value: string | number; sub: string; icon: React.ReactNode; colorClass: string; bgClass: string }> =
    ({ label, value, sub, icon, colorClass, bgClass }) => (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <span className={`p-2 ${bgClass} ${colorClass} rounded-lg`}>{icon}</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{label}</p>
            <h3 className="text-2xl font-bold mt-0.5">{value}</h3>
            <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
        </div>
    );

const MiniBar: React.FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => (
    <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(100, max > 0 ? (value / max) * 100 : 0)}%` }} />
    </div>
);

const PlatformAnalytics: React.FC = () => {
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [institutions, setInstitutions] = useState<InstitutionStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [statsRes, instRes] = await Promise.all([
                    api.get<GlobalStats>('/analytics/global'),
                    api.get<InstitutionStat[]>('/institution'),
                ]);
                setStats(statsRes.data);
                setInstitutions(instRes.data);
            } catch (e) {
                console.error('Failed to load analytics', e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const maxWpm = Math.max(...institutions.map(i => i.avgWpm ?? 0), 1);
    const maxTests = Math.max(...institutions.map(i => i.testCount ?? 0), 1);

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Global Analytics</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Platform-wide performance overview</p>
                </div>
            </header>

            <div className="p-4 md:p-8 space-y-8">
                {/* Top Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Institutions" value={loading ? '…' : (stats?.totalInstitutions ?? 0)} sub="Onboarded partners" icon={<Building2 className="w-5 h-5" />} colorClass="text-blue-600" bgClass="bg-blue-100 dark:bg-blue-900/30" />
                    <StatCard label="Active Students" value={loading ? '…' : (stats?.activeStudents ?? 0)} sub="Across all institutions" icon={<Users className="w-5 h-5" />} colorClass="text-violet-600" bgClass="bg-violet-100 dark:bg-violet-900/30" />
                    <StatCard label="Avg. Typing Speed" value={loading ? '…' : `${stats?.avgWpm ?? 0} WPM`} sub="Platform average" icon={<Zap className="w-5 h-5" />} colorClass="text-amber-600" bgClass="bg-amber-100 dark:bg-amber-900/30" />
                    <StatCard label="Avg. Accuracy" value={loading ? '…' : `${stats?.avgAccuracy?.toFixed(1) ?? 0}%`} sub="Platform average" icon={<Target className="w-5 h-5" />} colorClass="text-emerald-600" bgClass="bg-emerald-100 dark:bg-emerald-900/30" />
                </div>

                {/* Total Tests Banner */}
                <div className="bg-gradient-to-r from-[#094A71] to-[#0a5d8a] rounded-xl p-6 flex items-center justify-between text-white shadow-lg shadow-[#094A71]/20">
                    <div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Total Tests Taken</p>
                        <h3 className="text-4xl font-bold mt-1">{loading ? '…' : (stats?.totalTestsTaken ?? 0).toLocaleString()}</h3>
                        <p className="text-white/60 text-sm mt-1">Cumulative assessments across all institutions</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-xl">
                        <BarChart2 className="w-12 h-12 text-[#33B974]" />
                    </div>
                </div>

                {/* Institution Breakdown Table */}
                <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-base">Institution Breakdown</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Performance metrics per institution</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[640px]">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Institution</th>
                                    <th className="px-6 py-3 text-center">Students</th>
                                    <th className="px-6 py-3">Avg. WPM</th>
                                    <th className="px-6 py-3">Avg. Accuracy</th>
                                    <th className="px-6 py-3 text-center">Tests Taken</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">Loading…</td></tr>
                                ) : institutions.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">No institutions found.</td></tr>
                                ) : institutions.map((inst, idx) => (
                                    <tr key={inst.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                                                    {inst.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{inst.name}</p>
                                                    <p className="text-xs text-slate-400">{inst.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-bold">{inst._count?.users ?? '—'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold w-10">{inst.avgWpm ?? '—'}</span>
                                                <MiniBar value={inst.avgWpm ?? 0} max={maxWpm} color="bg-amber-400" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold w-12">{inst.avgAccuracy != null ? `${inst.avgAccuracy.toFixed(1)}%` : '—'}</span>
                                                <MiniBar value={inst.avgAccuracy ?? 0} max={100} color="bg-emerald-400" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-sm font-bold">{inst.testCount ?? '—'}</span>
                                                {idx === 0 && institutions.length > 1 && (
                                                    <span className="text-[10px] font-bold text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">Top</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlatformAnalytics;
