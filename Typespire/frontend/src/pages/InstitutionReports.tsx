import React, { useState } from 'react';
import api from '../api/axios';
import { FileText, Download, History, Loader2, File } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const InstitutionReports: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [reportType, setReportType] = useState('Intake Performance Summary');

    const handleGeneratePDF = async () => {
        if (!user?.institutionId) return;

        setPdfLoading(true);
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
                setPdfLoading(false);
                return;
            }

            const response = await api.get(endpoint);
            const data = response.data;
            if (!data || data.length === 0) {
                alert('No data available for this report.');
                setPdfLoading(false);
                return;
            }

            // Dynamically collect headers and format values
            const keys = Object.keys(data[0]);
            const head = keys.map(k => k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
            const body = data.map((row: any) => keys.map(k => {
                const val = row[k];
                if (typeof val === 'number') {
                    if (k.toLowerCase().includes('accuracy') || k.toLowerCase().includes('rate')) {
                        return `${val.toFixed(1)}%`;
                    }
                    return val.toString();
                }
                if (val === null || val === undefined) return '-';
                return val.toString();
            }));

            // Generate beautifully styled PDF
            const doc = new jsPDF();
            const primaryColor = [9, 74, 113]; // deep teal/navy primary (#094A71)

            // Header Banner
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(0, 0, 210, 40, 'F');

            // Logo & Header text
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.text('TYPESPIRE', 15, 18);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text('INSTITUTIONAL PERFORMANCE AUDIT REPORT', 15, 24);

            // Report Details
            doc.setFontSize(9);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 155, 18);
            doc.text(`Type: ${reportType}`, 155, 24);
            doc.text('Scope: Institution-wide', 155, 30);

            // Title
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text(`${reportType} Dataset`, 15, 52);

            // Table using autoTable
            autoTable(doc, {
                startY: 56,
                head: [head],
                body: body,
                headStyles: {
                    fillColor: primaryColor,
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 9,
                    halign: 'left'
                },
                bodyStyles: {
                    fontSize: 8.5,
                    textColor: [51, 65, 85]
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                }
            });

            // Footer
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184);
                doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
                doc.text('CONFIDENTIAL - INSTITUTIONAL USE ONLY', 15, 285);
                doc.text('POWERED BY TYPESPIRE 2.0', 170, 285);
            }

            doc.save(`Typespire_${reportType.replace(/\s+/g, '_')}_Report.pdf`);
        } catch (err) {
            console.error('Failed to generate PDF:', err);
            alert('Failed to generate PDF report. Please try again.');
        } finally {
            setPdfLoading(false);
        }
    };

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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <button
                                id="generate-report-btn"
                                onClick={handleGenerateReport}
                                disabled={loading}
                                className="w-full py-2.5 rounded-lg bg-slate-150 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-850 dark:text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {loading ? 'Generating CSV...' : 'Get CSV'}
                            </button>

                            <button
                                onClick={handleGeneratePDF}
                                disabled={pdfLoading}
                                className="w-full py-2.5 rounded-lg bg-admin-primary text-white font-bold hover:bg-admin-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {pdfLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FileText className="w-4 h-4" />
                                )}
                                {pdfLoading ? 'Generating PDF...' : 'Download PDF'}
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
                                    className="px-2.5 py-1.5 text-xs font-black text-white bg-admin-primary rounded-lg shadow hover:bg-admin-primary/90 transition-all flex items-center gap-1 opacity-90 group-hover:opacity-100"
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
