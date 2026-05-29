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

const CATEGORY_OPTIONS = ['ALL', 'AUTH', 'INSTITUTION', 'BILLING', 'ASSIGNMENT', 'SETTINGS', 'GENERAL'];
const SEVERITY_OPTIONS = ['ALL', 'INFO', 'WARNING', 'ERROR'];

const categoryColors: Record<string, string> = {
    AUTH: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
    INSTITUTION: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400',
    BILLING: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
    ASSIGNMENT: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    SETTINGS: 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400',
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
    INSTITUTION_CREATED: 'Institution Onboarded',
    INSTITUTION_UPDATED: 'Institution Modified',
    INSTITUTION_DELETED: 'Institution Removed',
    FACILITATOR_INVITED: 'Facilitator Invited',
    BILLING_PLAN_UPDATED: 'Billing Plan Updated',
    ASSIGNMENT_PUBLISHED: 'Typing Test Published',
    ASSIGNMENT_DELETED: 'Typing Test Removed',
    SYSTEM_SETTINGS_UPDATED: 'System Benchmarks Updated',
};

const PlatformLogs: React.FC = () => {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('ALL');
    const [severity, setSeverity] = useState('ALL');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);

    const [lastSeenTime, setLastSeenTime] = useState<string>(() => {
        const saved = localStorage.getItem('platform_logs_last_seen');
        if (saved) return saved;
        // Default to 5 minutes ago so they have recent logs highlighted as "NEW" immediately on first load
        return new Date(Date.now() - 300000).toISOString();
    });

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
    }, [category, severity, page, limit]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Auto-refresh every 15 seconds for snappier real-time feeling
    useEffect(() => {
        const interval = setInterval(fetchLogs, 15000);
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

    const markAllAsSeen = () => {
        const nowStr = new Date().toISOString();
        setLastSeenTime(nowStr);
        localStorage.setItem('platform_logs_last_seen', nowStr);
    };

    const unseenCount = logs.filter(log => log.createdAt > lastSeenTime).length;

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
                            Real-time audit trail of all platform activity. Auto-refreshes every 15s.
                        </p>
                    </div>
                    
                    {/* Live & Unseen Indicators (Top Right) */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-[#232948]/35 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-[#323b67]/45">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live · {total.toLocaleString()} total events
                        </div>
                        
                        <button
                            onClick={markAllAsSeen}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-black uppercase tracking-wider relative cursor-pointer outline-none select-none ${
                                unseenCount > 0
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-slate-50 dark:bg-[#232948]/35 border-slate-100 dark:border-[#323b67]/45 text-slate-400 dark:text-slate-500'
                            }`}
                            title={unseenCount > 0 ? `Mark ${unseenCount} new events as seen` : 'All events caught up'}
                        >
                            <span className={`material-symbols-outlined text-[16px] ${unseenCount > 0 ? 'animate-bounce' : ''}`}>
                                {unseenCount > 0 ? 'notifications_active' : 'notifications'}
                            </span>
                            {unseenCount > 0 ? `${unseenCount} New` : 'Caught Up'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
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

                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Show</label>
                    <select
                        value={limit}
                        onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="appearance-none rounded-xl bg-white dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-2 px-3 text-sm font-semibold outline-none focus:border-primary/60 cursor-pointer"
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>

                <button
                    onClick={() => { setCategory('ALL'); setSeverity('ALL'); setLimit(25); setPage(1); }}
                    className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-[#323b67] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#232948] transition-all cursor-pointer"
                >
                    Reset Filters
                </button>
                
                <button
                    onClick={fetchLogs}
                    disabled={loading}
                    className="ml-auto px-4 py-2 text-xs font-bold rounded-xl bg-primary text-[#111422] hover:bg-emerald-600 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
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
                                {logs.map(log => {
                                    const isUnseen = log.createdAt > lastSeenTime;
                                    return (
                                        <tr 
                                            key={log.id} 
                                            className={`group transition-all duration-300 ${
                                                isUnseen 
                                                    ? 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06] hover:bg-emerald-500/[0.06] dark:hover:bg-emerald-500/[0.09] border-l-2 border-emerald-500' 
                                                    : 'hover:bg-slate-50 dark:hover:bg-[#232948]'
                                            }`}
                                        >
                                            <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {isUnseen && (
                                                        <span className="flex h-2 w-2 relative">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                        </span>
                                                    )}
                                                    <span className={`${isUnseen ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                                                        {formatTime(log.createdAt)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                                                            {actionLabels[log.action] || log.action.replace(/_/g, ' ')}
                                                        </span>
                                                        {isUnseen && (
                                                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-500 text-[#111422] uppercase tracking-wider animate-pulse">
                                                                NEW
                                                            </span>
                                                        )}
                                                    </div>
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
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 border-t border-slate-100 dark:border-[#323b67]">
                        <span className="text-xs text-slate-500 dark:text-[#929bc9] font-medium">
                            Showing <span className="font-bold text-slate-700 dark:text-white">{Math.min(total, (page - 1) * limit + 1)}-{Math.min(total, page * limit)}</span> of{' '}
                            <span className="font-bold text-slate-700 dark:text-white">{total.toLocaleString()}</span> entries
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232948] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            
                            {/* Individual page numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                                // Dynamic sliding page number range helper
                                let pageNum = idx + 1;
                                if (page > 3 && totalPages > 5) {
                                    if (page + 2 > totalPages) {
                                        pageNum = totalPages - 4 + idx;
                                    } else {
                                        pageNum = page - 2 + idx;
                                    }
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            page === pageNum
                                                ? 'bg-primary text-[#111422]'
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#232948]'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232948] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
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
