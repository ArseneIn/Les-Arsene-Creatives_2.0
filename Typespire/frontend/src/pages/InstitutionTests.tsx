import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
    ClipboardList, 
    Calendar, 
    User, 
    Users, 
    Trash2, 
    Archive, 
    BarChart, 
    CheckCircle2, 
    AlertCircle, 
    ChevronDown, 
    ChevronUp, 
    Activity, 
    Clock, 
    Shield, 
    BookOpen,
    Search
} from 'lucide-react';
import type { Assignment, AssignmentStudentResult } from '../types/facilitator';

interface RichAssignment extends Assignment {
    section?: {
        name: string;
        intake?: {
            name: string;
        };
        facilitator?: {
            firstName: string;
            lastName: string;
        };
    };
}

interface TestAnalyticsDetails {
    averageWpm: number;
    averageAccuracy: number;
    totalAttempts: number;
    completionRate: number;
    roster: Array<{
        studentId: string;
        name: string;
        email: string | null;
        username: string | null;
        attemptsCount: number;
        bestWpm: number;
        bestAccuracy: number;
        lastAttemptAt: string | null;
        status: 'Completed' | 'No Attempts';
    }>;
}

const getTestStatusDetails = (status: string, dueDateISO?: string) => {
    if (!dueDateISO) return { text: status, colorClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' };
    
    const now = new Date();
    const due = new Date(dueDateISO);
    
    if (due < now || status === 'Completed') {
        return {
            text: 'Completed / Closed',
            colorClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
        };
    }
    
    const diffMs = due.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours <= 24) {
        return {
            text: `Active (Due in ${diffHours}h)`,
            colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse font-extrabold'
        };
    }
    
    return {
        text: `Active (Due in ${diffDays}d)`,
        colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold'
    };
};

export const InstitutionTests: React.FC = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState<RichAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<Record<string, TestAnalyticsDetails>>({});
    const [loadingAnalyticsId, setLoadingAnalyticsId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Completed'>('ALL');

    const fetchAssignments = useCallback(async () => {
        if (!user?.institutionId) return;
        setLoading(true);
        try {
            const res = await api.get(`/assignment/institution/${user.institutionId}`);
            const mapped: RichAssignment[] = res.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                dueDate: new Date(item.dueDate).toLocaleDateString(),
                dueDateISO: item.dueDate,
                status: item.status === 'ACTIVE' ? 'Active' : 'Completed',
                completionRate: 0,
                sectionId: item.sectionId || undefined,
                studentIds: item.studentIds || [],
                duration: item.test?.duration,
                maxAttempts: item.test?.maxAttempts || 1,
                level: item.test?.difficulty === 'HARD' ? 2 : 1,
                section: item.section,
                text: item.test?.content
            }));
            setAssignments(mapped);
        } catch (err) {
            console.error('Failed to load assignments for institution', err);
        } finally {
            setLoading(false);
        }
    }, [user?.institutionId]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    const handleToggleExpand = async (assignment: RichAssignment) => {
        const assignmentId = assignment.id;
        if (expandedAssignmentId === assignmentId) {
            setExpandedAssignmentId(null);
            return;
        }

        setExpandedAssignmentId(assignmentId);

        if (!analytics[assignmentId]) {
            setLoadingAnalyticsId(assignmentId);
            try {
                // 1. Fetch assignment student results
                const resultsRes = await api.get<AssignmentStudentResult[]>(`/test-result/assignment/${assignmentId}`);
                const results = resultsRes.data;

                // 2. Fetch full section details to get the class roster
                let sectionStudents: Array<{ id: string; firstName: string | null; lastName: string | null; email: string | null; username: string | null }> = [];
                if (assignment.sectionId) {
                    const sectionRes = await api.get(`/section/${assignment.sectionId}`);
                    sectionStudents = sectionRes.data.students || [];
                }

                // 3. Map roster analytics
                const roster = sectionStudents.map(student => {
                    const matchedResult = results.find(r => r.userId === student.id);
                    const name = [student.firstName, student.lastName].filter(Boolean).join(' ') || 'Student';
                    
                    if (matchedResult) {
                        return {
                            studentId: student.id,
                            name,
                            email: student.email,
                            username: student.username,
                            attemptsCount: matchedResult.attempts,
                            bestWpm: matchedResult.bestWpm,
                            bestAccuracy: matchedResult.bestAccuracy,
                            lastAttemptAt: matchedResult.submittedAt 
                                ? new Date(matchedResult.submittedAt).toLocaleString() 
                                : 'N/A',
                            status: 'Completed' as const
                        };
                    } else {
                        return {
                            studentId: student.id,
                            name,
                            email: student.email,
                            username: student.username,
                            attemptsCount: 0,
                            bestWpm: 0,
                            bestAccuracy: 0,
                            lastAttemptAt: null,
                            status: 'No Attempts' as const
                        };
                    }
                });

                // Sort roster: active completions first
                roster.sort((a, b) => (b.attemptsCount > 0 ? 1 : 0) - (a.attemptsCount > 0 ? 1 : 0));

                // 4. Calculate aggregate metrics
                const completedAttempts = results.filter(r => r.attempts > 0);
                const totalAttempts = results.reduce((sum, r) => sum + r.attempts, 0);
                const averageWpm = completedAttempts.length > 0
                    ? Math.round(completedAttempts.reduce((sum, r) => sum + r.bestWpm, 0) / completedAttempts.length)
                    : 0;
                const averageAccuracy = completedAttempts.length > 0
                    ? Math.round(completedAttempts.reduce((sum, r) => sum + r.bestAccuracy, 0) / completedAttempts.length)
                    : 0;
                const completionRate = sectionStudents.length > 0
                    ? Math.round((completedAttempts.length / sectionStudents.length) * 100)
                    : 0;

                setAnalytics(prev => ({
                    ...prev,
                    [assignmentId]: {
                        averageWpm,
                        averageAccuracy,
                        totalAttempts,
                        completionRate,
                        roster
                    }
                }));
            } catch (err) {
                console.error("Failed to fetch classroom test analytics:", err);
            } finally {
                setLoadingAnalyticsId(null);
            }
        }
    };

    const handleArchiveToggle = async (assignmentId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'COMPLETED' : 'ACTIVE';
        try {
            await api.patch(`/assignment/${assignmentId}/status`, { status: newStatus });
            setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: newStatus === 'ACTIVE' ? 'Active' : 'Completed' } : a));
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update test status.");
        }
    };

    const handleDeleteAssignment = async (assignmentId: string, title: string) => {
        const confirmDelete = window.confirm(`Are you absolutely sure you want to cancel and delete the test assignment "${title}"? This cannot be undone and will delete all student records of this test.`);
        if (!confirmDelete) return;

        try {
            await api.delete(`/assignment/${assignmentId}`);
            setAssignments(prev => prev.filter(a => a.id !== assignmentId));
            if (expandedAssignmentId === assignmentId) setExpandedAssignmentId(null);
        } catch (err) {
            console.error("Failed to delete assignment", err);
            alert("Failed to delete test assignment.");
        }
    };

    // Filter assignments
    const filteredAssignments = assignments.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.section?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (`${a.section?.facilitator?.firstName} ${a.section?.facilitator?.lastName}`).toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Aggregate values for Overview Dashboard Cards
    const totalActiveTests = assignments.filter(a => a.status === 'Active').length;
    const uniqueFacilitators = Array.from(new Set(assignments.map(a => a.section?.facilitator?.id).filter(Boolean))).length;

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 lg:px-10">
            {/* Heading */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Classroom Tests Control</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">Supervise, audit, and manage typing test assignments assigned by school facilitators.</p>
                </div>
            </div>

            {/* Dashboard Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="p-3 bg-admin-primary/10 rounded-xl text-admin-primary">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Classroom Tests</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">{totalActiveTests}</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">Supervised Classes</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">{assignments.length}</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Facilitators</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">{uniqueFacilitators}</span>
                    </div>
                </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                {/* Search */}
                <div className="relative w-full sm:max-w-md">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-400">
                        <Search className="w-5 h-5" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search tests, class cohorts, or facilitators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-admin-primary focus:border-admin-primary block w-full ps-10 p-3 shadow-sm outline-none transition-colors"
                    />
                </div>

                {/* Filter */}
                <div className="flex gap-2 self-end sm:self-auto">
                    {(['ALL', 'Active', 'Completed'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                statusFilter === tab 
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' 
                                    : 'bg-white dark:bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                        >
                            {tab === 'ALL' ? 'All Status' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Test Cards / Lists Container */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 rounded-full border-4 border-admin-primary/20 border-t-admin-primary animate-spin mb-4"></div>
                    <p className="text-slate-500 font-bold">Synchronizing Classroom Tests Directory...</p>
                </div>
            ) : filteredAssignments.length === 0 ? (
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center shadow-sm">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Test Assignments Found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">No tests have been scheduled or completed under this institution matching your search.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredAssignments.map(assignment => {
                        const isExpanded = expandedAssignmentId === assignment.id;
                        const hasAnalytics = !!analytics[assignment.id];
                        const testAnal = analytics[assignment.id];
                        const isAnalLoading = loadingAnalyticsId === assignment.id;

                        return (
                            <div key={assignment.id} className={`bg-white dark:bg-[#1f2647]/30 border rounded-2xl overflow-hidden transition-all shadow-sm ${
                                isExpanded 
                                    ? 'border-admin-primary dark:border-admin-primary ring-4 ring-admin-primary/10' 
                                    : 'border-slate-200 dark:border-[#323b67]/40 hover:border-slate-300 dark:hover:border-[#323b67]/80'
                            }`}>
                                {/* Test Header Card Row */}
                                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {(() => {
                                                const badge = getTestStatusDetails(assignment.status, assignment.dueDateISO);
                                                return (
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold shadow-sm ${badge.colorClass}`}>
                                                        {badge.text}
                                                    </span>
                                                );
                                            })()}
                                            {assignment.level === 2 && (
                                                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider">
                                                    Level 2 Survival
                                                </span>
                                            )}
                                            {assignment.section?.intake?.name && (
                                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-wider">
                                                    {assignment.section.intake.name}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white mb-2 leading-tight">
                                            {assignment.title}
                                        </h3>
                                        
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 mt-2 font-medium">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-3.5 h-3.5" /> Class Section: <strong className="text-slate-600 dark:text-white">{assignment.section?.name || 'General'}</strong>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5" /> Assigned By: <strong className="text-slate-600 dark:text-white">{assignment.section?.facilitator ? `${assignment.section.facilitator.firstName} ${assignment.section.facilitator.lastName}` : 'System'}</strong>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" /> Due Date: <strong className="text-slate-600 dark:text-white">{assignment.dueDate}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 self-end md:self-auto pt-4 md:pt-0 border-t md:border-none border-slate-100 dark:border-white/5 w-full md:w-auto justify-end">
                                        {/* Toggle status */}
                                        <button 
                                            onClick={() => handleArchiveToggle(assignment.id, assignment.status)}
                                            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                                            title={assignment.status === 'Active' ? 'Mark Completed' : 'Mark Active'}
                                        >
                                            <Archive className="w-3.5 h-3.5" />
                                            {assignment.status === 'Active' ? 'Mark Completed' : 'Mark Active'}
                                        </button>

                                        {/* Delete */}
                                        <button 
                                            onClick={() => handleDeleteAssignment(assignment.id, assignment.title)}
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                                            title="Cancel and Delete Test"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        {/* Expand details */}
                                        <button 
                                            onClick={() => handleToggleExpand(assignment)}
                                            className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                                                isExpanded 
                                                    ? 'bg-admin-primary text-white shadow-sm' 
                                                    : 'bg-admin-primary/10 text-admin-primary hover:bg-admin-primary/20'
                                            }`}
                                        >
                                            <BarChart className="w-3.5 h-3.5" />
                                            {isExpanded ? 'Hide Analytics' : 'Roster Analytics'}
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Roster & Performance Analytics Drawer */}
                                {isExpanded && (
                                    <div className="border-t border-slate-100 dark:border-[#323b67]/40 bg-slate-50/40 dark:bg-[#1a1f36]/20 p-6">
                                        {isAnalLoading ? (
                                            <div className="flex flex-col items-center justify-center py-10">
                                                <div className="w-8 h-8 rounded-full border-3 border-admin-primary/20 border-t-admin-primary animate-spin mb-3"></div>
                                                <p className="text-sm font-semibold text-slate-500">Compiling student attempt metrics...</p>
                                            </div>
                                        ) : hasAnalytics && testAnal ? (
                                            <div className="space-y-6">
                                                {/* Mini Performance Cards */}
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div className="bg-white dark:bg-[#1a1f36]/40 p-4 rounded-xl border border-slate-200/50 dark:border-[#323b67]/20 flex items-center gap-3">
                                                        <Activity className="w-5 h-5 text-admin-primary shrink-0" />
                                                        <div>
                                                            <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Average Speed</span>
                                                            <span className="text-lg font-black text-slate-800 dark:text-white leading-none mt-1 block">
                                                                {testAnal.averageWpm || '-'} <span className="text-xs font-medium text-slate-400">WPM</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white dark:bg-[#1a1f36]/40 p-4 rounded-xl border border-slate-200/50 dark:border-[#323b67]/20 flex items-center gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                                        <div>
                                                            <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Avg Accuracy</span>
                                                            <span className="text-lg font-black text-slate-800 dark:text-white leading-none mt-1 block">
                                                                {testAnal.averageAccuracy || '-'} <span className="text-xs font-medium text-slate-400">%</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white dark:bg-[#1a1f36]/40 p-4 rounded-xl border border-slate-200/50 dark:border-[#323b67]/20 flex items-center gap-3">
                                                        <Clock className="w-5 h-5 text-secondary shrink-0" />
                                                        <div>
                                                            <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Attempts Done</span>
                                                            <span className="text-lg font-black text-slate-800 dark:text-white leading-none mt-1 block">
                                                                {testAnal.totalAttempts} <span className="text-xs font-medium text-slate-400">Times</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white dark:bg-[#1a1f36]/40 p-4 rounded-xl border border-slate-200/50 dark:border-[#323b67]/20 flex items-center gap-3">
                                                        <Users className="w-5 h-5 text-purple-500 shrink-0" />
                                                        <div>
                                                            <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Class Completion</span>
                                                            <span className="text-lg font-black text-slate-800 dark:text-white leading-none mt-1 block">
                                                                {testAnal.completionRate}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Deep Student Roster Table */}
                                                <div>
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-extrabold text-slate-700 dark:text-white uppercase tracking-wider">Student Attempt Analytics</h4>
                                                        <p className="text-xs text-slate-400">Track how many times each student took this test and their top results.</p>
                                                    </div>
                                                    
                                                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#323b67]/30">
                                                        <table className="w-full text-left border-collapse bg-white dark:bg-transparent">
                                                            <thead>
                                                                <tr className="bg-slate-100/50 dark:bg-[#1a1f36]/50 border-b border-slate-200 dark:border-[#323b67]/30 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">
                                                                    <th className="py-3 px-4">Student Details</th>
                                                                    <th className="py-3 px-4 text-center">Status</th>
                                                                    <th className="py-3 px-4 text-center">Attempts Made</th>
                                                                    <th className="py-3 px-4 text-center">Best WPM</th>
                                                                    <th className="py-3 px-4 text-center">Best Accuracy</th>
                                                                    <th className="py-3 px-4 text-right">Latest Attempt</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100 dark:divide-[#323b67]/20 text-xs">
                                                                {testAnal.roster.map(student => (
                                                                    <tr key={student.studentId} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                                        <td className="py-3.5 px-4">
                                                                            <div className="font-bold text-slate-800 dark:text-white">{student.name}</div>
                                                                            <div className="text-[10px] text-slate-400 font-medium">{student.email || student.username}</div>
                                                                        </td>
                                                                        <td className="py-3.5 px-4 text-center">
                                                                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                                                                                student.status === 'Completed'
                                                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                                            }`}>
                                                                                {student.status === 'Completed' ? 'Submitted ✓' : 'No Attempts'}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-200">
                                                                            {student.attemptsCount > 0 ? (
                                                                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                                                                                    {student.attemptsCount} {student.attemptsCount === 1 ? 'attempt' : 'attempts'}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-slate-400">-</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="py-3.5 px-4 text-center font-black text-sm text-slate-800 dark:text-white">
                                                                            {student.bestWpm ? `${student.bestWpm} WPM` : '-'}
                                                                        </td>
                                                                        <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-200">
                                                                            {student.bestAccuracy ? `${student.bestAccuracy}%` : '-'}
                                                                        </td>
                                                                        <td className="py-3.5 px-4 text-right text-slate-400 font-medium">
                                                                            {student.lastAttemptAt || 'Never'}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 text-slate-400">
                                                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                                                <p className="text-sm font-semibold">Failed to fetch attempts list.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default InstitutionTests;
