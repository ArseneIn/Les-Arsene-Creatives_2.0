import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const InstitutionReports: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState('Intake Performance Summary');

    const handleGenerateReport = async () => {
        if (!user?.institutionId) return;

        setLoading(true);
        try {
            let endpoint = '';
            if (reportType === 'Intake Performance Summary') {
                endpoint = `/institution/${user.institutionId}/reports/intake-performance`;
            } else {
                alert('This report type is not yet implemented.');
                setLoading(false);
                return;
            }

            const response = await api.get(endpoint);

            // Convert JSON to CSV
            const data = response.data;
            if (!data || data.length === 0) {
                alert('No data available for this report.');
                setLoading(false);
                return;
            }

            const headers = Object.keys(data[0]).join(',');
            const rows = data.map((row: any) => Object.values(row).join(',')).join('\n');
            const csvContent = `${headers}\n${rows}`;

            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to generate report', error);
            alert('Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 lg:px-10">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Reports</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                    Generate and download performance reports for intakes and individual students.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Generate Report Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-admin-primary/10 rounded-lg text-admin-primary">
                            <span className="material-symbols-outlined">post_add</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Generate New Report</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Report Type</label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-admin-primary focus:border-admin-primary"
                            >
                                <option>Intake Performance Summary</option>
                                <option>Student Progress Detail</option>
                                <option>Facilitator Activity Log</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Date Range</label>
                            <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-admin-primary focus:border-admin-primary">
                                <option>Last 30 Days</option>
                                <option>This Semester</option>
                                <option>All Time</option>
                                <option>Custom Range</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleGenerateReport}
                                disabled={loading}
                                className="w-full py-2.5 rounded-lg bg-admin-primary text-slate-900 font-bold hover:bg-admin-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined">download</span>
                                )}
                                {loading ? 'Generating...' : 'Generate Report'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined">history</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Reports</h2>
                    </div>

                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600 group">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                        <span className="material-symbols-outlined">picture_as_pdf</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Jan 2025 Intake Summary</p>
                                        <p className="text-xs text-slate-500">Generated on Jan 12, 2026</p>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-admin-primary transition-colors opacity-0 group-hover:opacity-100">
                                    <span className="material-symbols-outlined">download</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        View All History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstitutionReports;
