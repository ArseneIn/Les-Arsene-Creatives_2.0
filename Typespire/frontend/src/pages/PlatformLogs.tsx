import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

interface SystemLog {
    id: string;
    action: string;
    category: string;
    actorId?: string;
    actorName?: string;
    targetId?: string;
    targetName?: string;
    metadata?: Record<string, unknown>;
    severity: string;
    createdAt: string;
}

const CATEGORY_OPTIONS = ['ALL', 'AUTH', 'INSTITUTION', 'BILLING', 'TEST', 'USER', 'GENERAL'];
const SEVERITY_OPTIONS = ['ALL', 'INFO', 'WARNING', 'ERROR'];

const categoryColors: Record<string, string> = {
    AUTH: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
    INSTITUTION: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400',
    BILLING: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
    TEST: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    USER: 'bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400',
    GENERAL: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
};

const severityColors: Record<string, string> = {
    INFO: 'text-slate-400 dark:text-slate-500',
    WARNING: 'text-amber-500',
    ERROR: 'text-rose-500',
};

const severityIcons: Record<string, string> = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
};

const actionLabels: Record<string, string> = {
    USER_LOGIN: 'User Login',
    USER_REGISTERED: 'User Registered',
    INSTITUTION_CREATED: 'Institution Created',
    INSTITUTION_UPDATED: 'Institution Updated',
    BILLING_UPDATED: 'Billing Updated',
    TEST_PUBLISHED: 'Test Published',
};

const PlatformLogs: React.FC = () => {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('ALL');
    const [severity, setSeverity] = useState('ALL');
    const [page, setPage] = useState(1);
    const limit = 25;

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category !== 'ALL') params.set('category', category);
            if (severity !== 'ALL') params.set('severity', severity);
            params.set('limit', String(limit));
            params.set('offset', String((page - 1) * limit));
            const res = await api.get(`/logs?${params.toString()}`);
            setLogs(res.data.logs || []);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setLoading(false);
        }
    }, [category, severity, page]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(fetchLogs, 30000);
        return () => clearInterval(interval);
    }, [fetchLogs]);

    const totalPages = Math.ceil(total / limit) || 1;

    const formatTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-heading mb-1">
                            System Logs
                        </h1>
                        <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base">
                            Real-time audit trail of all platform activity. Auto-refreshes every 30s.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live · {total.toLocaleString()} total events
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Category</label>
                    <select
                        value={category}
                        onChange={e => { setCategory(e.target.value); setPage(1); }}
                        className="appearance-none rounded-xl bg-white dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-2 px-3 text-sm font-semibold outline-none focus:border-primary/60 cursor-pointer"
                    >
                        {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Severity</label>
                    <select
                        value={severity}
                        onChange={e => { setSeverity(e.target.value); setPage(1); }}
                        className="appearance-none rounded-xl bg-white dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-2 px-3 text-sm font-semibold outline-none focus:border-primary/60 cursor-pointer"
                    >
                        {SEVERITY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <button
                    onClick={() => { setCategory('ALL'); setSeverity('ALL'); setPage(1); }}
                    className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-[#323b67] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#232948] transition-all"
                >
                    Reset
                </button>
                <button
                    onClick={fetchLogs}
                    disabled={loading}
                    className="ml-auto px-4 py-2 text-xs font-bold rounded-xl bg-primary text-[#111422] hover:bg-emerald-600 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                >
                    <span className={`material-symbols-outlined text-[15px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
                    Refresh
                </button>
            </div>

            {/* Log Table */}
            <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm overflow-hidden">
                {loading && logs.length === 0 ? (
                    <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
                        <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                        <span className="font-semibold">Loading logs...</span>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                        <span className="material-symbols-outlined text-5xl">history_toggle_off</span>
                        <p className="font-semibold">No log entries found</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Events will appear here as users interact with the platform.</p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-[#323b67] bg-slate-50/60 dark:bg-[#232948]/60">
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Timestamp</th>
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Event</th>
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Category</th>
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Actor</th>
                                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">Severity</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-[#323b67]/50">
                                {logs.map(log => (
                                    <tr key={log.id} className="group hover:bg-slate-50 dark:hover:bg-[#232948] transition-colors">
                                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                                            {formatTime(log.createdAt)}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-slate-900 dark:text-white text-xs">
                                                    {actionLabels[log.action] || log.action.replace(/_/g, ' ')}
                                                </span>
                                                {log.targetName && (
                                                    <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                                                        Target: {log.targetName}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${categoryColors[log.category] || categoryColors['GENERAL']}`}>
                                                {log.category}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs font-medium">
                                            {log.actorName || (log.actorId ? `User ${log.actorId.substring(0, 8)}` : '—')}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-flex items-center gap-1 text-xs font-bold ${severityColors[log.severity] || severityColors['INFO']}`}>
                                                <span className="material-symbols-outlined text-[14px]">{severityIcons[log.severity] || 'info'}</span>
                                                {log.severity}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3.5 border-t border-slate-100 dark:border-[#323b67]">
                        <span className="text-sm text-slate-500 dark:text-[#929bc9]">
                            Page <span className="font-bold text-slate-700 dark:text-white">{page}</span> of{' '}
                            <span className="font-bold text-slate-700 dark:text-white">{totalPages}</span>
                            &nbsp;· {total.toLocaleString()} total entries
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232948] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">chevron_left</span> Prev
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232948] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold flex items-center gap-1"
                            >
                                Next <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="h-16"></div>
        </div>
    );
};

export default PlatformLogs;
