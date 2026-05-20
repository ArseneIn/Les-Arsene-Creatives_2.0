import React, { useState, useCallback } from 'react';
import { useFacilitator } from '../context/FacilitatorContext';
import { useInstitution } from '../context/InstitutionContext';
import type { AssignmentStudentResult } from '../types/facilitator';
import api from '../api/axios';

const FacilitatorClasses: React.FC = () => {
    const { sections, students, assignments, fetchAssignmentResults } = useFacilitator();
    const { intakes } = useInstitution();

    const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
    const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
    const [newStudentName, setNewStudentName] = useState<string>('');
    const [newStudentEmail, setNewStudentEmail] = useState<string>('');
    const [resettingPasswordUserId, setResettingPasswordUserId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Reports state
    const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
    const [reportResults, setReportResults] = useState<Record<string, AssignmentStudentResult[]>>({});
    const [loadingReportId, setLoadingReportId] = useState<string | null>(null);

    // Active Section Details
    const activeSection = sections.find(s => s.id === selectedSectionId) || sections[0];
    const sectionStudents = students.filter(student => student.sectionId === (activeSection?.id || ''));

    // 1. Add Student Action (calls NestJS bulk import)
    const handleAddStudentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeSection) return;

        setIsSaving(true);
        try {
            await api.post(`/section/${activeSection.id}/students/bulk`, {
                students: [
                    {
                        name: newStudentName,
                        email: newStudentEmail || undefined,
                        password: '1234' // Default initial password
                    }
                ]
            });
            alert(`Successfully added ${newStudentName} to the roster!`);
            setShowAddStudentModal(false);
            setNewStudentName('');
            setNewStudentEmail('');
            // Reload page to fetch updated rosters
            window.location.reload();
        } catch (error) {
            console.error('Failed to add student:', error);
            alert('Failed to add student to this section. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // 2. Reset Student Password Action
    const handleResetPassword = async (studentId: string, studentName: string) => {
        if (!activeSection) return;
        const confirmReset = window.confirm(`Are you sure you want to reset the password for ${studentName} to "1234"?`);
        if (!confirmReset) return;

        setResettingPasswordUserId(studentId);
        try {
            await api.patch(`/section/${activeSection.id}/students/${studentId}/reset-password`, {
                password: '1234'
            });
            alert(`Password for ${studentName} has been reset successfully to "1234"!`);
        } catch (error) {
            console.error('Failed to reset password:', error);
            alert('Failed to reset password. Please try again.');
        } finally {
            setResettingPasswordUserId(null);
        }
    };

    const handleToggleReport = useCallback(async (assignmentId: string) => {
        if (expandedReportId === assignmentId) {
            setExpandedReportId(null);
            return;
        }
        setExpandedReportId(assignmentId);
        if (!reportResults[assignmentId]) {
            setLoadingReportId(assignmentId);
            const results = await fetchAssignmentResults(assignmentId);
            setReportResults(prev => ({ ...prev, [assignmentId]: results }));
            setLoadingReportId(null);
        }
    }, [expandedReportId, reportResults, fetchAssignmentResults]);

    // Format seconds as mm:ss
    const fmtDuration = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m ${s}s`;
    };

    return (
        <>
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight font-heading">Classes & Rosters</h1>
                    <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base font-normal">
                        Manage your assigned class sections, enroll students, and coordinate credentials.
                    </p>
                </div>

                {activeSection && (
                    <button 
                        onClick={() => setShowAddStudentModal(true)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-emerald-600 hover-scale active-scale transition-all shadow-lg shadow-primary/20 font-heading"
                    >
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                        Add Student
                    </button>
                )}
            </div>

            {/* Quick Section Tabs */}
            {sections.length > 0 ? (
                <div className="flex flex-wrap gap-3 mb-8">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setSelectedSectionId(section.id)}
                            className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all hover-scale active-scale ${
                                selectedSectionId === section.id
                                    ? 'bg-slate-900 dark:bg-primary border-transparent text-white dark:text-[#111422] shadow-md'
                                    : 'border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark text-slate-600 dark:text-[#929bc9]'
                            }`}
                        >
                            {section.name}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm p-12 flex flex-col items-center justify-center min-h-[300px]">
                    <div className="p-4 bg-slate-100 dark:bg-slate-850 rounded-full mb-4 text-slate-400">
                        <span className="material-symbols-outlined text-4xl">supervised_user_circle</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Active Classes</h3>
                    <p className="text-slate-500 dark:text-[#929bc9] text-center max-w-sm text-sm">
                        You do not have any assigned class sections in Kepler College yet.
                    </p>
                </div>
            )}

            {/* Section Active Details */}
            {activeSection && (
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-[#323b67]/45 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/40 dark:bg-[#323b67]/10">
                        <div>
                            <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight font-heading">{activeSection.name}</h3>
                            <p className="text-slate-500 dark:text-[#929bc9] text-xs font-normal">Active enrollment list and metrics coordinates.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 dark:bg-[#323b67] text-slate-600 dark:text-[#929bc9] text-xs font-bold border border-slate-200/50 dark:border-[#323b67]/50 uppercase">
                                {sectionStudents.length} Students Enrolled
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-[#323b67] bg-slate-50/70 dark:bg-[#323b67]/25 pb-3">
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] w-1/3">Student Details</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Assigned Cohort</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Current Speed</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Typing Accuracy</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-right">Roster Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#323b67]/45 text-sm">
                                {sectionStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/30 dark:hover:bg-[#232948]/20 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-primary/20 border border-[#323b67] flex items-center justify-center text-primary font-bold text-xs uppercase shadow-sm">
                                                {student.name?.[0] || 'S'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</span>
                                                <span className="text-[10px] text-slate-400 dark:text-[#929bc9] font-medium lowercase">{student.email || student.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-500 dark:text-[#929bc9] font-bold text-xs uppercase">
                                            {student.major}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300 font-mono">
                                            {student.currentWpm > 0 ? `${student.currentWpm} WPM` : '--'}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300 font-mono">
                                            {student.accuracy > 0 ? `${student.accuracy}%` : '--'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                disabled={resettingPasswordUserId === student.id}
                                                onClick={() => handleResetPassword(student.id, student.name)}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-[#929bc9] hover:bg-slate-55 dark:hover:bg-slate-800 transition-all hover-scale active-scale"
                                            >
                                                <span className="material-symbols-outlined text-[15px]">key</span>
                                                {resettingPasswordUserId === student.id ? 'Resetting...' : 'Reset Credentials'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {sectionStudents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                                            No student records are currently enrolled in this section. Click "Add Student" to expand your class roster!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ─── Published Tests History ─────────────────────────────── */}
            {activeSection && (() => {
                const sectionAssignments = assignments
                    .filter(a => a.sectionId === activeSection.id)
                    .sort((a, b) => new Date(b.dueDateISO || b.dueDate).getTime() - new Date(a.dueDateISO || a.dueDate).getTime());

                if (sectionAssignments.length === 0) return null;

                // Group by date (YYYY-MM-DD)
                const byDate: Record<string, typeof sectionAssignments> = {};
                for (const a of sectionAssignments) {
                    const dateKey = new Date(a.dueDateISO || a.dueDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
                    if (!byDate[dateKey]) byDate[dateKey] = [];
                    byDate[dateKey].push(a);
                }

                return (
                    <div className="mt-8 flex flex-col gap-4">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-[#323b67]/45 pb-4">
                            <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400">
                                <span className="material-symbols-outlined text-xl">assignment_turned_in</span>
                            </div>
                            <div>
                                <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight font-heading">Published Tests History</h3>
                                <p className="text-slate-500 dark:text-[#929bc9] text-xs">Click any assignment to expand the full results report.</p>
                            </div>
                        </div>

                        {Object.entries(byDate).map(([dateLabel, dateAssignments]) => (
                            <div key={dateLabel}>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#929bc9] mb-2 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                    {dateLabel}
                                </p>
                                <div className="flex flex-col gap-3">
                                    {dateAssignments.map(assignment => {
                                        const isExpanded = expandedReportId === assignment.id;
                                        const isLoading = loadingReportId === assignment.id;
                                        const results = reportResults[assignment.id] || [];
                                        const completedIds = new Set(results.map(r => r.userId));
                                        const missingStudents = sectionStudents.filter(s => !completedIds.has(s.id));
                                        const passedCount = results.filter(r => r.passed).length;
                                        const isExpired = assignment.dueDateISO ? new Date(assignment.dueDateISO) < new Date() : false;

                                        return (
                                            <div key={assignment.id} className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] overflow-hidden shadow-sm">
                                                {/* Assignment header row — clickable */}
                                                <button
                                                    onClick={() => handleToggleReport(assignment.id)}
                                                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50/40 dark:hover:bg-[#323b67]/10 transition-colors text-left gap-4"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className={`p-2 rounded-xl flex-shrink-0 ${isExpired ? 'bg-slate-100 dark:bg-slate-700/40 text-slate-400' : 'bg-violet-500/10 text-violet-600 dark:text-violet-400'}`}>
                                                            <span className="material-symbols-outlined text-lg">{isExpired ? 'lock_clock' : 'quiz'}</span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{assignment.title}</p>
                                                            <p className="text-[10px] text-slate-400 dark:text-[#929bc9] font-semibold uppercase tracking-wider">
                                                                Level {assignment.level ?? 1} · Due {assignment.dueDate}
                                                                {isExpired ? ' · Closed' : ' · Open'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        {isExpanded && !isLoading && (
                                                            <div className="hidden sm:flex items-center gap-2">
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                                                                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                                                    {passedCount} Passed
                                                                </span>
                                                                {missingStudents.length > 0 && (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase">
                                                                        <span className="material-symbols-outlined text-[12px]">cancel</span>
                                                                        {missingStudents.length} Missing
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                                                    </div>
                                                </button>

                                                {/* Expanded report */}
                                                {isExpanded && (
                                                    <div className="border-t border-slate-100 dark:border-[#323b67]/45">
                                                        {isLoading ? (
                                                            <div className="p-8 flex items-center justify-center gap-2 text-slate-400 dark:text-[#929bc9]">
                                                                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                                                <span className="text-sm font-semibold">Loading results...</span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {/* Completed Students Table */}
                                                                {results.length > 0 ? (
                                                                    <div className="overflow-x-auto">
                                                                        <table className="w-full text-left border-collapse min-w-[680px]">
                                                                            <thead>
                                                                                <tr className="bg-slate-50/70 dark:bg-[#323b67]/25 border-b border-slate-100 dark:border-[#323b67]">
                                                                                    <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#929bc9] w-1/3">Student</th>
                                                                                    <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Attempts</th>
                                                                                    <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Best WPM</th>
                                                                                    <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Accuracy</th>
                                                                                    <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-center">Duration</th>
                                                                                    <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#929bc9] text-right">Result</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-slate-100 dark:divide-[#323b67]/45 text-sm">
                                                                                {results.map(r => (
                                                                                    <tr key={r.userId} className="hover:bg-slate-50/30 dark:hover:bg-[#232948]/20 transition-colors">
                                                                                        <td className="px-5 py-3 flex items-center gap-2.5">
                                                                                            <div className="size-8 rounded-full bg-primary/20 border border-[#323b67] flex items-center justify-center text-primary font-bold text-xs uppercase shadow-sm flex-shrink-0">
                                                                                                {(r.firstName?.[0] || r.username?.[0] || 'S')}
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="font-bold text-slate-900 dark:text-white text-sm">{[r.firstName, r.lastName].filter(Boolean).join(' ') || r.username || 'Student'}</p>
                                                                                                <p className="text-[10px] text-slate-400 dark:text-[#929bc9]">{r.email || r.username}</p>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="px-5 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{r.attempts}</td>
                                                                                        <td className="px-5 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{r.bestWpm} <span className="text-slate-400 font-normal text-xs">WPM</span></td>
                                                                                        <td className="px-5 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{r.bestAccuracy.toFixed(1)}%</td>
                                                                                        <td className="px-5 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{fmtDuration(r.durationSec)}</td>
                                                                                        <td className="px-5 py-3 text-right">
                                                                                            {r.passed ? (
                                                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                                                                                                    <span className="material-symbols-outlined text-[12px]">check_circle</span> Passed
                                                                                                </span>
                                                                                            ) : (
                                                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase">
                                                                                                    <span className="material-symbols-outlined text-[12px]">pending</span> Attempted
                                                                                                </span>
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                ) : (
                                                                    <p className="p-6 text-sm text-slate-400 dark:text-[#929bc9] text-center">No submissions yet for this assignment.</p>
                                                                )}

                                                                {/* Missing Students */}
                                                                {missingStudents.length > 0 && (
                                                                    <div className="border-t border-slate-100 dark:border-[#323b67]/45 p-5 bg-rose-50/40 dark:bg-rose-500/5">
                                                                        <p className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-1.5">
                                                                            <span className="material-symbols-outlined text-[15px]">person_off</span>
                                                                            {missingStudents.length} Student{missingStudents.length > 1 ? 's' : ''} — No Submission
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {missingStudents.map(s => (
                                                                                <span key={s.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-card-dark border border-rose-200 dark:border-rose-500/30 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                                                    <span className="size-5 rounded-full bg-rose-100 dark:bg-rose-500/15 text-rose-500 text-[10px] flex items-center justify-center font-black">{s.name[0]}</span>
                                                                                    {s.name}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })()}

            {/* Modal: Add Student */}

            {showAddStudentModal && activeSection && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-card-dark rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-[#323b67] overflow-hidden transform transition-all">
                        <div className="p-6 border-b border-slate-100 dark:border-[#323b67]/45 flex justify-between items-center bg-slate-50/40 dark:bg-[#323b67]/10">
                            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-primary text-xl font-bold">person_add</span>
                                <h3 className="font-black text-lg tracking-tight font-heading">Enroll New Student</h3>
                            </div>
                            <button 
                                onClick={() => setShowAddStudentModal(false)}
                                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddStudentSubmit} className="p-6 flex flex-col gap-5">
                            <p className="text-xs text-slate-400 dark:text-[#929bc9] leading-relaxed">
                                Add a student to **{activeSection.name}**. By default, their password will be initialized to **"1234"**, which they can customize upon their first login.
                            </p>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Mary Jane"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    className="w-full rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-3 px-4 text-sm font-semibold outline-none focus:border-primary/60"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Email Address (Optional)</label>
                                <input
                                    type="email"
                                    placeholder="e.g. mary@example.com"
                                    value={newStudentEmail}
                                    onChange={(e) => setNewStudentEmail(e.target.value)}
                                    className="w-full rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-3 px-4 text-sm font-semibold outline-none focus:border-primary/60"
                                />
                            </div>

                            <div className="flex gap-3 justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddStudentModal(false)}
                                    className="px-5 py-3 rounded-xl border border-slate-350 dark:border-[#323b67] text-slate-700 dark:text-slate-350 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-heading"
                                >
                                    Cancel
                                </button>
                                <button
                                    required
                                    disabled={isSaving}
                                    type="submit"
                                    className="px-5 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-emerald-600 transition-colors font-heading shadow-md shadow-primary/10"
                                >
                                    {isSaving ? 'Enrolling...' : 'Enroll Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="h-20"></div>
        </>
    );
};

export default FacilitatorClasses;
