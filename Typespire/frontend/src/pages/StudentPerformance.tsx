import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInstitution } from '../context/InstitutionContext';
import api from '../api/axios';
import { 
    Activity, 
    User, 
    Download, 
    Filter, 
    Award, 
    Calendar,
    ChevronDown,
    ListFilter,
    Loader2,
    CheckCircle,
    AlertTriangle,
    SlidersHorizontal,
    Search
} from 'lucide-react';

interface Intake {
    id: string;
    name: string;
}

interface Section {
    id: string;
    name: string;
    intakeId: string;
    intake?: Intake;
}

interface Student {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string;
    email: string | null;
}

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

interface TestResultData {
    id: string;
    wpm: number;
    accuracy: number;
    createdAt: string;
    test: {
        title: string;
        difficulty: string;
    };
    assignment: {
        title: string;
    } | null;
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
    };
}

export const StudentPerformance: React.FC = () => {
    const { user } = useAuth();
    const { settings } = useInstitution();

    // Live Student Progress States
    const [auditedStudents, setAuditedStudents] = useState<StudentProgressRow[]>([]);
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
            setAuditedStudents(res.data || []);
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

        auditedStudents.forEach(s => {
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

        return { practice, lvl1, lvl2, passed, notPassed, total: auditedStudents.length };
    }, [auditedStudents]);

    // Unique intakes for the Cohort Filter select box
    const uniqueCohorts = useMemo(() => {
        const cohorts = new Set<string>();
        auditedStudents.forEach(s => {
            if (s.intake) cohorts.add(s.intake);
        });
        return Array.from(cohorts).sort();
    }, [auditedStudents]);

    // Filtered students list matching current search and filters
    const filteredStudents = useMemo(() => {
        return auditedStudents.filter(s => {
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
    }, [auditedStudents, searchQuery, cohortFilter, statusFilter]);

    
    // Dropdowns data
    const [intakes, setIntakes] = useState<Intake[]>([]);
    const [allSections, setAllSections] = useState<Section[]>([]);
    const [filteredSections, setFilteredSections] = useState<Section[]>([]);
    
    // Filters selection
    const [selectedIntakeId, setSelectedIntakeId] = useState<string>('');
    const [selectedSectionId, setSelectedSectionId] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<'ALL' | '1' | '2'>('ALL'); // ALL, Level 1, Level 2
    
    // Main loaded data
    const [students, setStudents] = useState<Student[]>([]);
    const [testResults, setTestResults] = useState<TestResultData[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Tooltip / Details overlay
    const [hoveredCell, setHoveredCell] = useState<{ studentId: string; date: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'audit' | 'ledger'>('audit');

    // 1. Load Intakes and Sections on Mount
    useEffect(() => {
        const fetchFilters = async () => {
            if (!user?.institutionId) return;
            try {
                // Fetch intakes
                const intakesRes = await api.get(`/intake?institutionId=${user.institutionId}`);
                setIntakes(intakesRes.data);
                if (intakesRes.data.length > 0) {
                    setSelectedIntakeId(intakesRes.data[0].id);
                }

                // Fetch sections
                const sectionsRes = await api.get('/section');
                setAllSections(sectionsRes.data);
            } catch (err) {
                console.error("Failed to load filters for performance ledger:", err);
            }
        };
        fetchFilters();
    }, [user?.institutionId]);

    // 2. Filter Sections when Selected Intake Changes
    useEffect(() => {
        if (!selectedIntakeId) {
            setFilteredSections([]);
            setSelectedSectionId('');
            return;
        }
        const filtered = allSections.filter(sec => sec.intakeId === selectedIntakeId);
        setFilteredSections(filtered);
        if (filtered.length > 0) {
            setSelectedSectionId(filtered[0].id);
        } else {
            setSelectedSectionId('');
        }
    }, [selectedIntakeId, allSections]);

    // 3. Load Student List and Test Results for Selected Section
    const loadLedgerData = useCallback(async () => {
        if (!selectedSectionId) {
            setStudents([]);
            setTestResults([]);
            return;
        }
        setLoading(true);
        try {
            // Fetch Section to get Roster
            const sectionRes = await api.get(`/section/${selectedSectionId}`);
            setStudents(sectionRes.data.students || []);

            // Fetch test results for section
            const resultsRes = await api.get(`/test-result/section/${selectedSectionId}`);
            setTestResults(resultsRes.data);
        } catch (err) {
            console.error("Failed to fetch section performance ledger data:", err);
        } finally {
            setLoading(false);
        }
    }, [selectedSectionId]);

    useEffect(() => {
        loadLedgerData();
    }, [loadLedgerData]);

    // Format Dates Utility
    const getFormattedDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Filter test results by level
    const levelFilteredResults = testResults.filter(r => {
        if (selectedLevel === 'ALL') return true;
        const testLevel = r.test?.difficulty === 'HARD' ? '2' : '1';
        return testLevel === selectedLevel;
    });

    // 4. Extract Unique Sorted Dates Taken
    const uniqueDates = Array.from(
        new Set(
            levelFilteredResults.map(r => getFormattedDate(r.createdAt))
        )
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // 5. Group attempts by Student and Date
    const getStudentDataForDate = (studentId: string, dateStr: string) => {
        const studentDateResults = levelFilteredResults.filter(r => 
            r.user.id === studentId && getFormattedDate(r.createdAt) === dateStr
        );

        if (studentDateResults.length === 0) return null;

        // Find best attempt based on WPM
        const bestAttempt = studentDateResults.reduce((best, current) => 
            current.wpm > best.wpm ? current : best
        , studentDateResults[0]);

        return {
            bestWpm: bestAttempt.wpm,
            bestAccuracy: Math.round(bestAttempt.accuracy),
            attempts: studentDateResults.length,
            difficulty: bestAttempt.test?.difficulty || 'MEDIUM',
            testTitle: bestAttempt.test?.title || 'Unknown Test',
            assignmentTitle: bestAttempt.assignment?.title
        };
    };

    // 6. Benchmark Highlighting Verification
    const doesMeetBenchmark = (wpm: number, accuracy: number, difficulty: string) => {
        // Level 2 Survival (HARD) Benchmark
        if (difficulty === 'HARD') {
            return wpm >= (settings?.level2Wpm ?? 50) && accuracy >= (settings?.requiredAccuracy ?? 95);
        }
        // Level 1 Standard (MEDIUM/EASY) Benchmark
        return wpm >= (settings?.level1Wpm ?? 30) && accuracy >= Math.max(80, (settings?.requiredAccuracy ?? 95) - 5);
    };

    // 7. CSV Export Matrix Routine
    const handleExportCSV = () => {
        if (students.length === 0) return;

        const currentIntake = intakes.find(i => i.id === selectedIntakeId)?.name || 'N/A';
        const currentSection = allSections.find(s => s.id === selectedSectionId)?.name || 'N/A';

        // CSV Headers
        const headers = ['Student Name', 'Username', 'Email', 'Intake', 'Section', ...uniqueDates];

        // CSV Rows
        const rows = students.map(student => {
            const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';
            
            const rowData = [
                studentName,
                student.username,
                student.email || 'N/A',
                currentIntake,
                currentSection
            ];

            // Append performance score under each date
            uniqueDates.forEach(date => {
                const perf = getStudentDataForDate(student.id, date);
                if (perf) {
                    const benchmarkHit = doesMeetBenchmark(perf.bestWpm, perf.bestAccuracy, perf.difficulty) ? 'PASSED' : 'FAILED';
                    rowData.push(
                        `${perf.bestWpm} WPM (${perf.bestAccuracy}% Acc) [${perf.attempts}x attempts - Best: ${perf.testTitle} - Benchmark: ${benchmarkHit}]`
                    );
                } else {
                    rowData.push('No Attempts');
                }
            });

            return rowData;
        });

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Typespire_Performance_${currentSection.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    const currentIntakeName = intakes.find(i => i.id === selectedIntakeId)?.name || 'Select Intake';
    const currentSectionName = allSections.find(s => s.id === selectedSectionId)?.name || 'Select Section';

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 lg:px-10 overflow-y-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 dark:border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#094A71] dark:text-[#33B974] mb-2">Student Performance</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-base font-medium">
                        Audit student progress tiers or analyze class cohorts through an interactive date-matrix ledger.
                    </p>
                </div>


                
                {activeTab === 'ledger' && (
                    <button
                        onClick={handleExportCSV}
                    disabled={students.length === 0 || uniqueDates.length === 0}
                    className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all border shrink-0 ${
                        students.length === 0 || uniqueDates.length === 0
                            ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500 hover:border-emerald-600 hover:-translate-y-0.5 cursor-pointer shadow-emerald-500/10'
                    }`}
                >
                    <Download className="w-4 h-4" />
                        Export CSV Ledger
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-8 bg-slate-100/50 dark:bg-[#061824]/50 p-1 rounded-xl w-fit border border-slate-200/50 dark:border-white/5">
                <button
                    onClick={() => setActiveTab('audit')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-black transition-all ${activeTab === 'audit' ? 'bg-white dark:bg-[#0A2536] text-[#094A71] dark:text-[#33B974] shadow-sm border border-slate-200/50 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Live Auditing Center
                </button>
                <button
                    onClick={() => setActiveTab('ledger')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-black transition-all ${activeTab === 'ledger' ? 'bg-white dark:bg-[#0A2536] text-[#094A71] dark:text-[#33B974] shadow-sm border border-slate-200/50 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Calendar View
                </button>
            </div>

            {activeTab === 'audit' && (
            <div className="mb-8">
                {/* Live Audit Metrics Grid */}
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
                                    <span>Auditing Summary: showing {filteredStudents.length} of {auditedStudents.length} student compliance profiles</span>
                                    <span className="text-slate-400 font-semibold">Requirements Met: {filteredStudents.filter(s => s.milestoneStatus === 'Passed').length} students</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            )}

            {activeTab === 'ledger' && (
                <>
            {/* Filter Control Dashboard Card */}
            <div className="bg-white dark:bg-[#0A2536] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm mb-8 transition-all">
                <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                    <Filter className="w-5 h-5 text-admin-primary" />
                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">Active Cohort Filtering</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Intake selector */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Academic Intake</label>
                        <div className="relative">
                            <select
                                value={selectedIntakeId}
                                onChange={(e) => setSelectedIntakeId(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#061824] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-admin-primary outline-none transition-colors cursor-pointer appearance-none"
                            >
                                <option value="" disabled>Select Academic Intake</option>
                                {intakes.map(intake => (
                                    <option key={intake.id} value={intake.id}>{intake.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Section selector */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Class Cohort Section</label>
                        <div className="relative">
                            <select
                                value={selectedSectionId}
                                onChange={(e) => setSelectedSectionId(e.target.value)}
                                disabled={filteredSections.length === 0}
                                className="w-full bg-slate-50 dark:bg-[#061824] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-admin-primary outline-none transition-colors cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {filteredSections.length === 0 ? (
                                    <option value="">No Sections in Intake</option>
                                ) : (
                                    filteredSections.map(sec => (
                                        <option key={sec.id} value={sec.id}>{sec.name}</option>
                                    ))
                                )}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Level selector */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Difficulty / Curriculum Level</label>
                        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-[#061824] rounded-xl border border-slate-200/50 dark:border-white/5 w-fit h-[46px] items-center">
                            {(['ALL', '1', '2'] as const).map(lvl => (
                                <button
                                    key={lvl}
                                    onClick={() => setSelectedLevel(lvl)}
                                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                        selectedLevel === lvl
                                            ? 'bg-[#094A71] dark:bg-[#33B974] text-white shadow-sm'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {lvl === 'ALL' ? 'All Levels' : `Level ${lvl}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Benchmark Legend Alert */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-[#094A71]/10 border border-blue-100 dark:border-admin-primary/10 rounded-xl">
                    <div className="flex gap-3">
                        <Award className="w-5 h-5 text-[#094A71] dark:text-[#33B974] shrink-0 mt-0.5" />
                        <div className="text-xs">
                            <span className="font-extrabold text-[#094A71] dark:text-white uppercase tracking-wider block mb-1">Curriculum Performance Benchmarks</span>
                            <span className="text-slate-600 dark:text-slate-400 font-medium">
                                Scores are automatically checked. Met targets highlight cells in <strong className="text-emerald-600 dark:text-emerald-400">Green</strong>.
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 font-semibold text-[10px] uppercase font-mono">
                        <span className="px-2.5 py-1 rounded bg-white dark:bg-[#061824] border border-slate-200 dark:border-white/5 text-slate-500">
                            Lvl 1: <strong className="text-[#094A71] dark:text-[#33B974]">{settings?.level1Wpm ?? 30} WPM / {Math.max(80, (settings?.requiredAccuracy ?? 95) - 5)}% Acc</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded bg-white dark:bg-[#061824] border border-slate-200 dark:border-white/5 text-slate-500">
                            Lvl 2: <strong className="text-[#094A71] dark:text-[#33B974]">{settings?.level2Wpm ?? 50} WPM / {settings?.requiredAccuracy ?? 95}% Acc</strong>
                        </span>
                    </div>
                </div>
            </div>

            {/* Performance Ledger Matrix Section */}
            <div className="bg-white dark:bg-[#0A2536] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-all">
                {/* Table Header Row info */}
                <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#081e2b] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-admin-primary" />
                        <div>
                            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Calendar View</h3>
                            <p className="text-xs text-slate-400 mt-0.5 font-medium">{currentIntakeName} • {currentSectionName}</p>
                        </div>
                    </div>
                    {students.length > 0 && uniqueDates.length > 0 && (
                        <span className="bg-slate-200/50 dark:bg-white/5 text-slate-500 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            {uniqueDates.length} Active {uniqueDates.length === 1 ? 'Date' : 'Dates'} Mapped
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-10 h-10 rounded-full border-4 border-admin-primary/20 border-t-admin-primary animate-spin mb-4"></div>
                        <p className="text-slate-500 text-sm font-bold">Synchronizing Calendar View...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="p-16 text-center">
                        <ListFilter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">No Students Found</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto">This section currently has no active student accounts registered under it.</p>
                    </div>
                ) : uniqueDates.length === 0 ? (
                    <div className="p-16 text-center">
                        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">No Test Attempts Yet</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto">Students in this cohort have not submitted any typing test results matching your filter.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-100/50 dark:bg-[#1a1f36]/40 border-b border-slate-200 dark:border-[#323b67]/30 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">
                                    <th className="py-4 px-6 sticky left-0 bg-white dark:bg-[#0A2536] shadow-[2px_0_5px_rgba(0,0,0,0.05)] z-10 w-64 border-r border-slate-200/50 dark:border-[#323b67]/20">Student Details</th>
                                    {uniqueDates.map(date => (
                                        <th key={date} className="py-4 px-6 text-center border-r border-slate-100 dark:border-white/5 font-mono">
                                            {date}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {students.map(student => {
                                    const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';
                                    
                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                            {/* Student Stick column */}
                                            <td className="py-4 px-6 sticky left-0 bg-white dark:bg-[#0A2536] shadow-[2px_0_5px_rgba(0,0,0,0.03)] z-10 font-bold text-slate-800 dark:text-white border-r border-slate-200/50 dark:border-[#323b67]/20">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-admin-primary/10 text-admin-primary flex items-center justify-center shrink-0">
                                                        <User className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-slate-800 dark:text-slate-200 font-extrabold text-sm">{studentName}</div>
                                                        <div className="text-[10px] text-slate-400 font-medium">{student.email || student.username}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date Columns */}
                                            {uniqueDates.map(date => {
                                                const perf = getStudentDataForDate(student.id, date);
                                                const isHovered = hoveredCell?.studentId === student.id && hoveredCell?.date === date;

                                                if (!perf) {
                                                    return (
                                                        <td key={date} className="py-4 px-6 text-center text-slate-300 dark:text-slate-700 font-mono border-r border-slate-100 dark:border-white/5">
                                                            -
                                                        </td>
                                                    );
                                                }

                                                const isPassing = doesMeetBenchmark(perf.bestWpm, perf.bestAccuracy, perf.difficulty);

                                                return (
                                                    <td 
                                                        key={date} 
                                                        className="py-3 px-4 text-center border-r border-slate-100 dark:border-white/5 relative"
                                                        onMouseEnter={() => setHoveredCell({ studentId: student.id, date })}
                                                        onMouseLeave={() => setHoveredCell(null)}
                                                    >
                                                        <div className={`inline-flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                                                            isPassing
                                                                ? 'bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-500/20 shadow-sm'
                                                                : 'bg-slate-50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-white/5'
                                                        } min-w-[90px]`}>
                                                            <div className="text-sm font-black tracking-tight">{perf.bestWpm} WPM</div>
                                                            <div className="text-[10px] font-bold opacity-80 mt-0.5">{perf.bestAccuracy}% Accuracy</div>
                                                            {perf.attempts > 1 && (
                                                                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full mt-1.5 uppercase ${
                                                                    isPassing 
                                                                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                                                }`}>
                                                                    {perf.attempts} attempts
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Hover info tooltip */}
                                                        {isHovered && (
                                                            <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-slate-900 text-white rounded-xl text-[10px] leading-relaxed shadow-xl border border-white/10 w-48 text-left whitespace-normal">
                                                                <div className="font-extrabold text-[#33B974] mb-1 truncate">{perf.testTitle}</div>
                                                                {perf.assignmentTitle && (
                                                                    <div className="text-slate-400 mb-1 font-medium truncate">Test: {perf.assignmentTitle}</div>
                                                                )}
                                                                <div className="flex justify-between text-slate-400 mt-1 border-t border-white/5 pt-1">
                                                                    <span>Difficulty:</span>
                                                                    <span className="font-mono text-white">{perf.difficulty === 'HARD' ? 'Level 2' : 'Level 1'}</span>
                                                                </div>
                                                                <div className="flex justify-between text-slate-400">
                                                                    <span>Benchmark:</span>
                                                                    <span className={`font-bold ${isPassing ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                                        {isPassing ? 'PASSED ✓' : 'FAILED ✗'}
                                                                    </span>
                                                                </div>
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900"></div>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
                </>
            )}
        </div>
    );
};

export default StudentPerformance;
