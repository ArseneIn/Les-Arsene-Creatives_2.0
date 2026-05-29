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
interface StudentProgressRow {
    studentId: string;
    name: string;
    email: string;
    intake: string;
    section: string;
    totalTests: number;
    avgWpm: number;
    avgAccuracy: number;
    milestoneStatus: string; // 'Practicing' | 'Level 1' | 'Level 2' | 'Passed'
}

const InstitutionReports: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [reportType, setReportType] = useState('Intake Performance Summary');
    
    // Live Student Progress States
    const [students, setStudents] = useState<StudentProgressRow[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [cohortFilter, setCohortFilter] = useState('All');

    useEffect(() => {
        if (user?.institutionId) {
            fetchStudentProgress(user.institutionId);
        }
    }, [user?.institutionId]);

    const fetchStudentProgress = async (institutionId: string) => {
        setLoadingData(true);
        try {
            const res = await api.get<StudentProgressRow[]>(`/institution/${institutionId}/reports/student-progress`);
            setStudents(res.data || []);
        } catch (err) {
            console.error("Failed to fetch student progress data", err);
        } finally {
            setLoadingData(false);
        }
    };

    // Calculate dynamic milestone statistics
    const milestoneCounts = useMemo(() => {
        let practice = 0;
        let lvl1 = 0;
        let lvl2 = 0;
        let passed = 0;
        let notPassed = 0;

        students.forEach(s => {
            const status = s.milestoneStatus;
            if (status === 'Passed') {
                passed++;
            } else {
                notPassed++;
                if (status === 'Practicing') practice++;
                else if (status === 'Level 1') lvl1++;
                else if (status === 'Level 2') lvl2++;
            }
        });

        return { practice, lvl1, lvl2, passed, notPassed, total: students.length };
    }, [students]);

    // Unique intakes for the Cohort Filter select box
    const uniqueCohorts = useMemo(() => {
        const cohorts = new Set<string>();
        students.forEach(s => {
            if (s.intake) cohorts.add(s.intake);
        });
        return Array.from(cohorts).sort();
    }, [students]);

    // Filtered students list matching current search and filters
    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  s.email.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCohort = cohortFilter === 'All' || s.intake === cohortFilter;

            let matchesStatus = true;
            if (statusFilter === 'Passed') {
                matchesStatus = s.milestoneStatus === 'Passed';
            } else if (statusFilter === 'Not Passed') {
                matchesStatus = s.milestoneStatus !== 'Passed';
            } else if (statusFilter === 'Practice') {
                matchesStatus = s.milestoneStatus === 'Practicing';
            } else if (statusFilter === 'Level 1') {
                matchesStatus = s.milestoneStatus === 'Level 1';
            } else if (statusFilter === 'Level 2') {
                matchesStatus = s.milestoneStatus === 'Level 2';
            }

            return matchesSearch && matchesCohort && matchesStatus;
        });
    }, [students, searchQuery, cohortFilter, statusFilter]);

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

    const handleDownloadFilteredCSV = () => {
        if (filteredStudents.length === 0) return;
        const headers = ['Student ID', 'Name', 'Email', 'Cohort', 'Section', 'Avg WPM', 'Avg Accuracy', 'Milestone Stage', 'Requirements Status'];
        const rows = filteredStudents.map(s => {
            const requirements = s.milestoneStatus === 'Passed' ? 'Requirements Met' : 'Requirements Not Met';
            let stage = s.milestoneStatus;
            if (stage === 'Practicing') stage = 'Practice Mode';
            return [
                s.studentId,
                s.name.replace(/,/g, ''),
                s.email,
                s.intake,
                s.section,
                s.avgWpm,
                s.avgAccuracy,
                stage,
                requirements
            ].join(',');
        }).join('\n');
        
        const csvContent = `${headers.join(',')}\n${rows}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Filtered_Audited_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

            {/* Live Audit Metrics Grid */}
            <div className="mb-8">
                <h3 className="text-[#061824] text-xl font-black tracking-tight mb-2">Live School Auditing Center</h3>
                <p className="text-slate-500 text-xs font-medium mb-6">Audited progress tiers across all enrolled student cohorts.</p>

                {loadingData ? (
                    <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
                        <Loader2 className="w-6 h-6 text-[#094A71] animate-spin mx-auto mb-2" />
                        <span className="text-sm font-semibold text-slate-500">Loading student compliance profiles...</span>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            {/* Card 1: Practice Mode */}
                            <div className="bg-white rounded-xl p-4 border border-slate-250 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2.5 bg-blue-500/10 rounded-bl-xl text-blue-500">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Practice Mode</p>
                                <h4 className="text-[#061824] text-2xl font-black">{milestoneCounts.practice}</h4>
                                <span className="text-[9px] text-slate-400 font-bold block mt-1">Not Passed (Drills stage)</span>
                            </div>

                            {/* Card 2: Level 1 */}
                            <div className="bg-white rounded-xl p-4 border border-slate-250 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2.5 bg-slate-500/10 rounded-bl-xl text-slate-500">
                                    <Award className="w-4 h-4" />
                                </div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Level 1 Working</p>
                                <h4 className="text-[#061824] text-2xl font-black">{milestoneCounts.lvl1}</h4>
                                <span className="text-[9px] text-slate-400 font-bold block mt-1">Not Passed (L1 stage)</span>
                            </div>

                            {/* Card 3: Level 2 */}
                            <div className="bg-white rounded-xl p-4 border border-slate-250 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2.5 bg-indigo-500/10 rounded-bl-xl text-indigo-500">
                                    <Award className="w-4 h-4" />
                                </div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Level 2 Working</p>
                                <h4 className="text-[#061824] text-2xl font-black">{milestoneCounts.lvl2}</h4>
                                <span className="text-[9px] text-slate-400 font-bold block mt-1">Not Passed (L2 stage)</span>
                            </div>

                            {/* Card 4: Passed */}
                            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-250 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2.5 bg-emerald-500/15 rounded-bl-xl text-emerald-600">
                                    <CheckCircle className="w-4 h-4 shrink-0" />
                                </div>
                                <p className="text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-1">Passed (Certified)</p>
                                <h4 className="text-emerald-950 text-2xl font-black">{milestoneCounts.passed}</h4>
                                <span className="text-[9px] text-emerald-600 font-black block mt-1">Requirements Met</span>
                            </div>

                            {/* Card 5: Not Yet Passed */}
                            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-250 shadow-sm relative overflow-hidden col-span-2 lg:col-span-1">
                                <div className="absolute top-0 right-0 p-2.5 bg-amber-500/15 rounded-bl-xl text-amber-600">
                                    <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                                </div>
                                <p className="text-amber-700 text-[10px] font-black uppercase tracking-wider mb-1">Not Yet Passed</p>
                                <h4 className="text-amber-950 text-2xl font-black">{milestoneCounts.notPassed}</h4>
                                <span className="text-[9px] text-amber-600 font-black block mt-1">Requirements Not Met</span>
                            </div>
                        </div>

                        {/* Interactive Data Filter Panel */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                <div className="flex items-center gap-2 shrink-0">
                                    <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Active Filters</span>
                                </div>

                                <div className="flex flex-wrap gap-3 w-full lg:w-auto items-center lg:justify-end">
                                    {/* Cohort filter select */}
                                    <div className="flex-1 sm:flex-initial">
                                        <select
                                            value={cohortFilter}
                                            onChange={(e) => setCohortFilter(e.target.value)}
                                            className="w-full sm:w-44 rounded-lg border-slate-250 bg-white text-xs font-bold text-slate-700 focus:ring-[#094A71] focus:border-[#094A71]"
                                        >
                                            <option value="All">All Cohorts</option>
                                            {uniqueCohorts.map(cohort => (
                                                <option key={cohort} value={cohort}>{cohort}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status filter select */}
                                    <div className="flex-1 sm:flex-initial">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full sm:w-56 rounded-lg border-slate-250 bg-white text-xs font-bold text-slate-700 focus:ring-[#094A71] focus:border-[#094A71]"
                                        >
                                            <option value="All">All Statuses</option>
                                            <option value="Practice">Practice Mode (Not Passed)</option>
                                            <option value="Level 1">Level 1 (Not Passed)</option>
                                            <option value="Level 2">Level 2 (Not Passed)</option>
                                            <option value="Passed">Passed (Requirements Met)</option>
                                            <option value="Not Passed">Not Yet Passed (Requirements Not Met)</option>
                                        </select>
                                    </div>

                                    {/* Text Search query */}
                                    <div className="relative flex-1 sm:flex-initial">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                            <Search className="w-3.5 h-3.5" />
                                        </span>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search student or email..."
                                            className="w-full sm:w-52 pl-9 pr-4 py-1.5 rounded-lg border-slate-250 bg-white text-xs font-bold text-slate-700 focus:ring-[#094A71] focus:border-[#094A71]"
                                        />
                                    </div>

                                    {filteredStudents.length > 0 && (
                                        <button
                                            onClick={handleDownloadFilteredCSV}
                                            className="px-3 py-1.5 bg-[#33B974] text-white hover:bg-[#33B974]/90 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shadow"
                                            title="Download exact matching students as CSV"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Download Audited CSV
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Audit table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-[#094A71] text-white text-xs font-bold uppercase tracking-wider">
                                            <th className="px-6 py-3.5">Student Info</th>
                                            <th className="px-6 py-3.5">Cohort & Section</th>
                                            <th className="px-6 py-3.5 text-center">Milestone Stage</th>
                                            <th className="px-6 py-3.5 text-center">Auditing Status</th>
                                            <th className="px-6 py-3.5 text-right">Avg Speed</th>
                                            <th className="px-6 py-3.5 text-right">Avg Accuracy</th>
                                            <th className="px-6 py-3.5 text-center">Total Attempts</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                        {filteredStudents.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-bold">No audited student matching the current filter parameters was discovered.</td>
                                            </tr>
                                        ) : (
                                            filteredStudents.map(student => {
                                                const passed = student.milestoneStatus === 'Passed';
                                                
                                                return (
                                                    <tr key={student.studentId} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-[#094A71]/5 flex items-center justify-center font-black text-[#094A71] border border-[#094A71]/15 shrink-0">
                                                                    {student.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-[#061824]">{student.name}</p>
                                                                    <p className="text-[10px] text-slate-400 font-semibold">{student.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-500 font-bold">
                                                            {student.intake} • {student.section}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                                student.milestoneStatus === 'Passed'
                                                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                    : student.milestoneStatus === 'Level 2'
                                                                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                                                                    : student.milestoneStatus === 'Level 1'
                                                                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                                                                    : 'bg-blue-100 text-blue-700 border-blue-200'
                                                            }`}>
                                                                {student.milestoneStatus === 'Practicing' ? 'Practice Mode' : student.milestoneStatus}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                                passed
                                                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-250 shadow-sm shadow-emerald-50'
                                                                    : 'bg-amber-100 text-amber-700 border border-amber-250 shadow-sm shadow-amber-50 animate-pulse'
                                                            }`}>
                                                                {passed ? 'Requirements Met' : 'Not Met'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className="font-black text-slate-800 text-sm">{student.avgWpm}</span>
                                                            <span className="text-[9px] text-slate-400 uppercase font-black ml-0.5">wpm</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold text-slate-700">
                                                            {student.avgAccuracy}%
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-bold text-slate-600">
                                                            {student.totalTests} tests
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filteredStudents.length > 0 && (
                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                                    <span>Auditing Summary: showing {filteredStudents.length} of {students.length} student compliance profiles</span>
                                    <span className="text-slate-400 font-semibold">Requirements Met: {filteredStudents.filter(s => s.milestoneStatus === 'Passed').length} students</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InstitutionReports;
