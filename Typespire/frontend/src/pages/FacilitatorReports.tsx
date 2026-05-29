import React, { useState } from 'react';
import { useFacilitator } from '../context/FacilitatorContext';
import api from '../api/axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const FacilitatorReports: React.FC = () => {
    const { sections, students } = useFacilitator();
    const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
    const [period, setPeriod] = useState<string>('all');
    const [csvLoading, setCsvLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    React.useEffect(() => {
        if (sections.length > 0 && !selectedSectionId) {
            setSelectedSectionId(sections[0].id);
        }
    }, [sections, selectedSectionId]);

    const handleDownloadReport = async (e: React.FormEvent) => {
        e.preventDefault();
        const activeSection = sections.find(s => s.id === selectedSectionId);
        if (!activeSection) {
            alert('Please select a valid class section.');
            return;
        }

        setPdfLoading(true);
        try {
            // Fetch live results for this section
            const res = await api.get(`/test-result/section/${selectedSectionId}`);
            const testResults = Array.isArray(res.data) ? res.data : [];

            // Filter students belonging to this section
            const sectionStudents = students.filter(s => s.sectionId === selectedSectionId || s.major === activeSection.name);
            const targetStudents = sectionStudents.length > 0 ? sectionStudents : students;

            // Aggregate metrics
            const resultMap: Record<string, { bestWpm: number; bestAccuracy: number; attempts: number; level: number }> = {};
            for (const r of testResults) {
                const uid = r.user?.id || r.userId;
                if (!uid) continue;
                const existing = resultMap[uid];
                const testLevel = r.testLevel ?? (r.test?.difficulty === 'HARD' ? 2 : 1);
                if (!existing || r.wpm > existing.bestWpm) {
                    resultMap[uid] = {
                        bestWpm: r.wpm,
                        bestAccuracy: r.accuracy,
                        attempts: (existing?.attempts ?? 0) + 1,
                        level: testLevel,
                    };
                } else {
                    resultMap[uid].attempts = (resultMap[uid].attempts ?? 0) + 1;
                }
            }

            // Calculate aggregates
            let totalWpm = 0;
            let totalAccuracy = 0;
            let studentsWithResults = 0;
            let passedCount = 0;

            const tableRows = targetStudents.map(s => {
                const stats = resultMap[s.id];
                const wpm = stats?.bestWpm ?? 0;
                const acc = stats?.bestAccuracy ?? 0;
                const attempts = stats?.attempts ?? 0;
                const passed = wpm >= 20 && acc >= 70; // passing baseline

                if (stats) {
                    totalWpm += wpm;
                    totalAccuracy += acc;
                    studentsWithResults++;
                }
                if (passed) passedCount++;

                return [
                    s.id.substring(0, 8),
                    s.name,
                    s.email || s.username,
                    wpm > 0 ? `Level ${stats?.level ?? 1}` : '-',
                    wpm > 0 ? `${wpm} WPM` : 'No attempts',
                    acc > 0 ? `${acc.toFixed(1)}%` : '-',
                    attempts.toString(),
                    passed ? 'PASS' : wpm > 0 ? 'FAIL' : 'PENDING'
                ];
            });

            const avgWpm = studentsWithResults > 0 ? (totalWpm / studentsWithResults).toFixed(1) : '0';
            const avgAcc = studentsWithResults > 0 ? (totalAccuracy / studentsWithResults).toFixed(1) : '0';
            const passRate = targetStudents.length > 0 ? ((passedCount / targetStudents.length) * 100).toFixed(0) : '0';

            // Generate beautiful PDF
            const doc = new jsPDF();
            const primaryColor = [9, 74, 113]; // deep teal/navy primary (#094A71)
            const accentColor = [51, 185, 116]; // emerald green (#33B974)

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
            doc.text('ACADEMIC KEYBOARDING PERFORMANCE SHEET', 15, 24);

            // Report Details
            doc.setFontSize(9);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 155, 18);
            doc.text(`Section: ${activeSection.name}`, 155, 24);
            doc.text(`Timeframe: ${period === 'all' ? 'Semester to Date' : period === 'week' ? 'Current Week' : 'Current Month'}`, 155, 30);

            // Summary Stats Cards Container
            doc.setFillColor(245, 247, 250);
            doc.rect(15, 48, 180, 25, 'F');
            doc.setDrawColor(226, 232, 240);
            doc.rect(15, 48, 180, 25, 'S');

            // Card 1: Total Students
            doc.setTextColor(100, 116, 139);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('TOTAL ROSTER', 22, 55);
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(13);
            doc.text(`${targetStudents.length} Students`, 22, 65);

            // Card 2: Average WPM
            doc.setTextColor(100, 116, 139);
            doc.setFontSize(8);
            doc.text('AVERAGE SPEED', 70, 55);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setFontSize(13);
            doc.text(`${avgWpm} WPM`, 70, 65);

            // Card 3: Average Accuracy
            doc.setTextColor(100, 116, 139);
            doc.setFontSize(8);
            doc.text('AVG ACCURACY', 115, 55);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setFontSize(13);
            doc.text(`${avgAcc}%`, 115, 65);

            // Card 4: Pass Rate
            doc.setTextColor(100, 116, 139);
            doc.setFontSize(8);
            doc.text('PASSING RATE', 160, 55);
            doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.setFontSize(13);
            doc.text(`${passRate}%`, 160, 65);

            // Table Header Title
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text('Student Performance Breakdown', 15, 84);

            // Roster Table using autoTable
            autoTable(doc, {
                startY: 88,
                head: [['ID', 'Name', 'Email Address', 'Level', 'Best Speed', 'Best Accuracy', 'Attempts', 'Status']],
                body: tableRows,
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
                columnStyles: {
                    0: { cellWidth: 15 },
                    1: { cellWidth: 30, fontStyle: 'bold' },
                    2: { cellWidth: 45 },
                    3: { cellWidth: 18 },
                    4: { cellWidth: 22 },
                    5: { cellWidth: 22 },
                    6: { cellWidth: 14 },
                    7: { cellWidth: 14, fontStyle: 'bold' }
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                didParseCell: (data) => {
                    if (data.column.index === 7) {
                        const val = data.cell.text[0];
                        if (val === 'PASS') {
                            data.cell.styles.textColor = [16, 124, 65]; // Green
                        } else if (val === 'FAIL') {
                            data.cell.styles.textColor = [168, 85, 24]; // Orange/red
                        } else {
                            data.cell.styles.textColor = [100, 116, 139]; // Slate
                        }
                    }
                }
            });

            // Footer
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184);
                doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
                doc.text('CONFIDENTIAL - FOR FACILITATOR USE ONLY', 15, 285);
                doc.text('POWERED BY TYPESPIRE 2.0', 170, 285);
            }

            doc.save(`Typespire_${activeSection.name.replace(/\s+/g, '_')}_Report.pdf`);
        } catch (err) {
            console.error('Failed to generate PDF:', err);
            alert('Failed to construct PDF report. Please try again.');
        } finally {
            setPdfLoading(false);
        }
    };


    const handleDownloadCSV = async () => {
        if (students.length === 0) {
            alert('No students found. Make sure a section is selected.');
            return;
        }

        setCsvLoading(true);
        try {
            // Fetch real test results for all sections this facilitator manages
            const sectionIds = sections.map(s => s.id);

            // Collect best results per student across all sections
            const resultMap: Record<string, { bestWpm: number; bestAccuracy: number; attempts: number; level: number }> = {};

            await Promise.all(
                sectionIds.map(async (sectionId) => {
                    const res = await api.get(`/test-result/section/${sectionId}`);
                    if (res.data && Array.isArray(res.data)) {
                        for (const r of res.data) {
                            const uid = r.user?.id || r.userId;
                            if (!uid) continue;
                            const existing = resultMap[uid];
                            const testLevel = r.testLevel ?? (r.test?.difficulty === 'HARD' ? 2 : 1);
                            if (!existing || r.wpm > existing.bestWpm) {
                                resultMap[uid] = {
                                    bestWpm: r.wpm,
                                    bestAccuracy: r.accuracy,
                                    attempts: (existing?.attempts ?? 0) + 1,
                                    level: testLevel,
                                };
                            } else {
                                resultMap[uid].attempts = (resultMap[uid].attempts ?? 0) + 1;
                            }
                        }
                    }
                })
            );

            const csvContent = "data:text/csv;charset=utf-8,ID,Name,Email,Class,Level,Best WPM,Best Accuracy (%),Attempts,Status\n" +
                students.map(s => {
                    const stats = resultMap[s.id];
                    const wpm = stats?.bestWpm ?? 0;
                    return `"${s.id}","${s.name}","${s.email || s.username}","${s.major}","${wpm > 0 ? 'Level ' + (stats?.level ?? 1) : '-'}","${wpm}","${stats?.bestAccuracy?.toFixed(1) ?? '0.0'}","${stats?.attempts ?? 0}","Active"`;
                }).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Typespire_Roster_Export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Failed to generate CSV:', err);
            alert('Failed to load student data. Please try again.');
        } finally {
            setCsvLoading(false);
        }
    };

    return (
        <>
            {/* Page Heading */}
            <div className="mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight font-heading mb-2">Class Reports</h1>
                <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base font-normal max-w-2xl">
                    Compile, analyze, and export comprehensive performance sheets for your active student rosters.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PDF Generator Card */}
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-[#323b67]/45 pb-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-primary shadow-sm">
                                <span className="material-symbols-outlined text-xl flex items-center justify-center">assignment</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Performance Summary Report</h2>
                        </div>

                        <form onSubmit={handleDownloadReport} className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Select Class Section</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] focus:border-primary/60 text-slate-900 dark:text-white py-3 px-4 pr-10 text-sm font-semibold outline-none"
                                        value={selectedSectionId}
                                        onChange={(e) => setSelectedSectionId(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select an active class...</option>
                                        {sections.map(section => (
                                            <option key={section.id} value={section.id}>
                                                {section.intakeName ? `${section.intakeName} - ` : ''}{section.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-[#929bc9]">
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Report Period</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] focus:border-primary/60 text-slate-900 dark:text-white py-3 px-4 pr-10 text-sm font-semibold outline-none"
                                        value={period}
                                        onChange={(e) => setPeriod(e.target.value)}
                                    >
                                        <option value="all">Semester to Date (Cumulative)</option>
                                        <option value="week">Current Week</option>
                                        <option value="month">Current Month</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-[#929bc9]">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                    </div>
                                </div>
                            </div>

                             <div className="pt-4">
                                 <button
                                     disabled={sections.length === 0 || pdfLoading}
                                     type="submit"
                                     className="w-full py-3.5 rounded-xl bg-primary text-[#111422] font-black hover:bg-emerald-600 hover-scale active-scale transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 font-heading text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     {pdfLoading ? (
                                         <>
                                             <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                                             Generating PDF...
                                         </>
                                     ) : (
                                         <>
                                             <span className="material-symbols-outlined text-[18px]">download</span>
                                             Download PDF Report
                                         </>
                                     )}
                                 </button>
                             </div>
                        </form>
                    </div>
                </div>

                {/* CSV Export Card */}
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm p-6 md:p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-[#323b67]/45 pb-4">
                        <div className="p-3 bg-slate-100 dark:bg-[#323b67] rounded-xl text-slate-650 dark:text-slate-300 shadow-sm">
                            <span className="material-symbols-outlined text-xl flex items-center justify-center">history</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Direct Excel Export</h2>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-black/10 min-h-[220px]">
                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-3">table_chart</span>
                        <h4 className="text-slate-900 dark:text-white font-bold text-base mb-1 font-heading">Export Roster Grid</h4>
                        <p className="text-slate-500 dark:text-[#929bc9] text-xs max-w-sm mb-4 leading-relaxed">
                            Generate flat Excel/CSV spreads with all student IDs, speeds, and emails — populated with <strong>live data</strong> from the server.
                        </p>
                        <button
                            onClick={handleDownloadCSV}
                            disabled={csvLoading || students.length === 0}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover-scale active-scale disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {csvLoading ? (
                                <>
                                    <span className="material-symbols-outlined text-[15px] animate-spin">sync</span>
                                    Fetching data...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[15px]">download</span>
                                    Download CSV Spreadsheet
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-20"></div>
        </>
    );
};

export default FacilitatorReports;
