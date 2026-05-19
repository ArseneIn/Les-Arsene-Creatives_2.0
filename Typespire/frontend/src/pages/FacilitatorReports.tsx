import React, { useState } from 'react';
import { useFacilitator } from '../context/FacilitatorContext';

const FacilitatorReports: React.FC = () => {
    const { sections, students } = useFacilitator();
    const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
    const [period, setPeriod] = useState<string>('all');

    const handleDownloadReport = (e: React.FormEvent) => {
        e.preventDefault();
        const activeSection = sections.find(s => s.id === selectedSectionId);
        if (!activeSection) {
            alert('Please select a valid class section.');
            return;
        }

        // Trigger native print flow or alert detailing download payload
        alert(`Generating and compiling live Performance Report PDF for ${activeSection.name} (${period} timeframe). Directing to printer module...`);
        window.print();
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
                                                {section.name}
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
                                    disabled={sections.length === 0}
                                    type="submit" 
                                    className="w-full py-3.5 rounded-xl bg-primary text-[#111422] font-black hover:bg-emerald-600 hover-scale active-scale transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 font-heading text-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    Generate & Print PDF
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* History/Archived Reports List Card */}
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
                            Generate flat Excel/CSV spreads containing all student IDs, speeds, levels, and emails instantly.
                        </p>
                        <button
                            onClick={() => {
                                const csvContent = "data:text/csv;charset=utf-8,ID,Name,Email,Class,WPM,Accuracy,Status\n" + 
                                    students.map(s => `"${s.id}","${s.name}","${s.email || s.username}","${s.major}",0,0,"Active"`).join("\n");
                                const encodedUri = encodeURI(csvContent);
                                const link = document.createElement("a");
                                link.setAttribute("href", encodedUri);
                                link.setAttribute("download", `Typespire_Roster_Export_${new Date().toISOString().split('T')[0]}.csv`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-slate-205 dark:border-[#323b67] text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover-scale active-scale"
                        >
                            <span className="material-symbols-outlined text-[15px]">download</span>
                            Download CSV Spreadsheet
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-20"></div>
        </>
    );
};

export default FacilitatorReports;
