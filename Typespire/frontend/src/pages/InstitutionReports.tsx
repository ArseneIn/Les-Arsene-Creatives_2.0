import React, { useState } from 'react';
import api from '../api/axios';
import { FileText, Download, History, Loader2, File } from 'lucide-react';
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
            } else if (reportType === 'Student Progress Detail') {
                endpoint = `/institution/${user.institutionId}/reports/student-progress`;
            } else if (reportType === 'Facilitator Activity Log') {
                endpoint = `/institution/${user.institutionId}/reports/facilitator-activity`;
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
            const rows = data.map((row: Record<string, unknown>) => Object.values(row).join(',')).join('\n');
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
                            <FileText className="w-6 h-6" />
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
                                id="generate-report-btn"
                                onClick={handleGenerateReport}
                                disabled={loading}
                                className="w-full py-2.5 rounded-lg bg-admin-primary text-slate-900 font-bold hover:bg-admin-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Download className="w-5 h-5" />
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
                            <History className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Templates</h2>
                    </div>

                    <div className="space-y-3">
                        {[
                            { title: 'Intake Performance Summary', type: 'Intake Performance Summary', desc: 'Real-time overview of active/archived cohorts' },
                            { title: 'Student Milestone Progress Detail', type: 'Student Progress Detail', desc: 'Typing levels, speed, accuracy & milestone badges' },
                            { title: 'Facilitator Activity Log', type: 'Facilitator Activity Log', desc: 'Assigned sections, student counts & performance' },
                        ].map((report, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600 group">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                        <File className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{report.title}</p>
                                        <p className="text-xs text-slate-500">{report.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setReportType(report.type);
                                        // Trigger generation directly after React state updates
                                        setTimeout(() => {
                                            const btn = document.getElementById('generate-report-btn');
                                            if (btn) btn.click();
                                        }, 50);
                                    }}
                                    className="px-2.5 py-1.5 text-xs font-black text-slate-900 bg-admin-primary rounded-lg shadow hover:bg-admin-primary/90 transition-all flex items-center gap-1 opacity-90 group-hover:opacity-100"
                                    title="Generate and Download instant CSV"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Get CSV
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-5 font-semibold">
                        All generated reports download instantly as standard CSV tables.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InstitutionReports;
