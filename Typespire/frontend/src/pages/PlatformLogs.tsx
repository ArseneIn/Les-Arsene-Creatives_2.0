import React from 'react';

const PlatformLogs: React.FC = () => {
    const logs = [
        { id: 1, event: 'User Login', user: 'admin@oxford.edu', ip: '192.168.1.1', time: '2 mins ago', severity: 'info' },
        { id: 2, event: 'Plan Updated', user: 'superadmin@typespire.com', ip: '10.0.0.5', time: '15 mins ago', severity: 'success' },
        { id: 3, event: 'Failed Login', user: 'unknown@ip.addr', ip: '45.22.11.9', time: '1 hour ago', severity: 'warning' },
        { id: 4, event: 'System Backup', user: 'System', ip: 'localhost', time: '3 hours ago', severity: 'info' },
        { id: 5, event: 'API Error', user: 'System', ip: 'localhost', time: '5 hours ago', severity: 'error' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Logs</h1>
                    <p className="text-slate-500 dark:text-slate-400">Monitor system activities and security events.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                        />
                    </div>
                    <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">filter_list</span>
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Event</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">IP Address</th>
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4">Severity</th>
                            <th className="px-6 py-4 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{log.event}</td>
                                <td className="px-6 py-4 text-sm">{log.user}</td>
                                <td className="px-6 py-4 text-sm font-mono text-slate-500">{log.ip}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{log.time}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${log.severity === 'info' ? 'bg-blue-100 text-blue-600' :
                                            log.severity === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                                log.severity === 'warning' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-red-100 text-red-600'
                                        }`}>
                                        {log.severity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-admin-primary">
                                        <span className="material-symbols-outlined">visibility</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlatformLogs;
