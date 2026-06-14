import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { 
    FileText, 
    Download, 
    History, 
    Loader2, 
    File, 
    CheckCircle, 
    AlertTriangle, 
    Search, 
    Calendar, 
    Award,
    Activity,
    SlidersHorizontal,
    Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Types ---

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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Reports & Compliance</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-base font-medium">
                    Generate and download performance reports, audit student levels, and track curriculum compliance.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Generate Report Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#094A71]/10 rounded-lg text-[#094A71]">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-[#061824]">Export Dataset Report</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Report Type</label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full rounded-lg border-slate-200 bg-white text-slate-800 focus:ring-[#094A71] focus:border-[#094A71] text-sm font-medium"
                                >
                                    <option>Intake Performance Summary</option>
                                    <option>Student Progress Detail</option>
                                    <option>Facilitator Activity Log</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date Scope</label>
                                <select className="w-full rounded-lg border-slate-200 bg-white text-slate-800 focus:ring-[#094A71] focus:border-[#094A71] text-sm font-medium">
                                    <option>All Time Records</option>
                                    <option>Last 30 Days</option>
                                    <option>This Semester</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-4">
                        <button
                            id="generate-report-btn"
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            {loading ? 'Generating CSV...' : 'Export CSV'}
                        </button>

                        <button
                            onClick={handleGeneratePDF}
                            disabled={pdfLoading}
                            className="w-full py-2.5 rounded-lg bg-[#094A71] text-white font-bold hover:bg-[#094A71]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-md"
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

                {/* Quick Templates */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <History className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-[#061824]">Quick Templates</h2>
                    </div>

                    <div className="space-y-3">
                        {[
                            { title: 'Intake Performance Summary', type: 'Intake Performance Summary', desc: 'Real-time overview of active/archived cohorts' },
                            { title: 'Student Milestone Progress Detail', type: 'Student Progress Detail', desc: 'Typing levels, speed, accuracy & milestone badges' },
                            { title: 'Facilitator Activity Log', type: 'Facilitator Activity Log', desc: 'Assigned sections, student counts & performance' },
                        ].map((report, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-150 group">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                                        <File className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">{report.title}</p>
                                        <p className="text-[10px] text-slate-400 font-medium truncate">{report.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setReportType(report.type);
                                        setTimeout(() => {
                                            const btn = document.getElementById('generate-report-btn');
                                            if (btn) btn.click();
                                        }, 50);
                                    }}
                                    className="px-2.5 py-1.5 text-[10px] font-black text-white bg-[#094A71] rounded-lg shadow hover:bg-[#094A71]/90 transition-all flex items-center gap-1 shrink-0"
                                    title="Generate and Download instant CSV"
                                >
                                    <Download className="w-3 h-3" />
                                    CSV
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );
};

export default InstitutionReports;
