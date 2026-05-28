import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFacilitator } from '../context/FacilitatorContext';
import { useInstitution } from '../context/InstitutionContext';

const MOCK_LIBRARY_TEXTS = [
    {
        id: 'lib_1',
        title: 'The Velveteen Rabbit',
        source: 'Margery Williams',
        level: 1,
        complexity: 'Easy',
        wordCount: 182,
        estimatedTimeMin: 2,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: '"What is REAL?" asked the Rabbit one day, when they were lying side by side near the nursery fender...',
        content: '"What is REAL?" asked the Rabbit one day, when they were lying side by side near the nursery fender...'
    },
    {
        id: 'lib_2',
        title: 'The Scale of the Universe',
        source: 'NASA Science',
        level: 1,
        complexity: 'Medium',
        wordCount: 345,
        estimatedTimeMin: 3,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8-rmXu2ZtPul-xNuKjMxc7Q0pTR2COZUn8EQ6Pn22RALtntDwVBzHOkuS3FEDpjuEUqqZFi6r3scVmZJnx6II9ti_Nx6IRPO-FM7QmuiDkn_jWbiAbeXXiwyRApBiGIpG3xS7niw8MGsrKLbk5CkIGdBdG8FGzuY8Ls6OqAgk_G4iCmLU2T1JT50_LpmyvlhEmTkeCor3mGYalKar9ACq_2Q2jzZTXJx0VB4rUSWAEMb9aq6iDhGBudg0AbN8c7eVi4RhxmX4hiFv',
        excerpt: 'The universe is vast beyond comprehension. To understand its scale, we must first look at our own solar system as a mere speck...',
        content: 'The universe is vast beyond comprehension. To understand its scale, we must first look at our own solar system as a mere speck...'
    },
    {
        id: 'lib_3',
        title: 'Introduction to Python',
        source: 'Technical Typing',
        level: 2,
        complexity: 'Hard',
        wordCount: 410,
        estimatedTimeMin: 5,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'def calculate_area(radius): return 3.14159 * radius ** 2. This function demonstrates basic syntax in Python...',
        content: 'def calculate_area(radius): return 3.14159 * radius ** 2. This function demonstrates basic syntax in Python...'
    },
    {
        id: 'lib_4',
        title: 'Cybersecurity Principles',
        source: 'InfoSec Basics',
        level: 2,
        complexity: 'Hard',
        wordCount: 380,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'Authentication, Authorization, and Accounting (AAA) form the core of any secure system architecture...',
        content: 'Authentication, Authorization, and Accounting (AAA) form the core of any secure system architecture...'
    }
];

const FacilitatorTestLaunch: React.FC = () => {
    const navigate = useNavigate();
    const { publishAssignment, students, sections } = useFacilitator();
    const { settings } = useInstitution();

    const [testLevel, setTestLevel] = useState<1 | 2>(1);
    
    // Library vs Custom Mode
    const [sourceMode, setSourceMode] = useState<'library' | 'custom'>('library');
    const [selectedLibraryId, setSelectedLibraryId] = useState<string>('lib_1');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Custom Text State
    const [customTitle, setCustomTitle] = useState('');
    const [customContent, setCustomContent] = useState('');

    const [targetSection, setTargetSection] = useState('');
    const [assignmentMode, setAssignmentMode] = useState<'section' | 'students'>('section');
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [timeLimit, setTimeLimit] = useState('1');
    const [allowedTrials, setAllowedTrials] = useState('');
    const [accessWindow, setAccessWindow] = useState('1440'); // default: 1 day in minutes
    
    const [successPopup, setSuccessPopup] = useState<{show: boolean, count: number}>({show: false, count: 0});

    // Derived states
    const filteredLibrary = useMemo(() => {
        return MOCK_LIBRARY_TEXTS.filter(t => 
            t.level === testLevel && 
            t.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [testLevel, searchQuery]);

    const activeLibraryText = MOCK_LIBRARY_TEXTS.find(t => t.id === selectedLibraryId);
    
    // Reset selection if test level changes and current selection doesn't match
    React.useEffect(() => {
        const firstMatch = MOCK_LIBRARY_TEXTS.find(t => t.level === testLevel);
        if (firstMatch) {
            setSelectedLibraryId(firstMatch.id);
        }
    }, [testLevel]);

    const customWordCount = useMemo(() => {
        return customContent.trim() ? customContent.trim().split(/\s+/).length : 0;
    }, [customContent]);

    const customEstimatedTime = useMemo(() => {
        return Math.max(1, Math.ceil(customWordCount / 40));
    }, [customWordCount]);

    const handlePublish = (e: React.FormEvent) => {
        e.preventDefault();

        if (assignmentMode === 'section' && !targetSection) {
            alert('Please select a target section.');
            return;
        }

        if (assignmentMode === 'students' && selectedStudentIds.length === 0) {
            alert('Please select at least one student.');
            return;
        }

        // Ensure we have a payload
        let finalTitle = '';
        let finalContent = '';

        if (sourceMode === 'library') {
            if (!activeLibraryText) return alert("Please select a library text.");
            finalTitle = activeLibraryText.title;
            finalContent = activeLibraryText.content;
        } else {
            if (!customTitle.trim() || !customContent.trim()) {
                return alert("Please provide a Title and Text for your Custom Assignment.");
            }
            if (customWordCount < 10) {
                return alert("Custom text must be at least 10 words long.");
            }
            finalTitle = customTitle;
            finalContent = customContent;
        }

        let finalStudentIds: string[] | undefined = undefined;
        let finalSectionId: string | undefined = undefined;

        if (assignmentMode === 'section') {
            finalSectionId = targetSection;
            // BUSINESS LOGIC:
            // - Beginners (Practicing) = Level 0
            // - Completed Practice = Level 1
            // - High Performers = Level 2
            const eligibleStudents = students.filter(s => {
                if (s.sectionId !== targetSection) return false;
                
                let studentLevel = 0; // Beginner

                // If they have completed practice (mocked via levelProgress) or met the school's Level 1 threshold
                if (s.levelProgress >= 100 || s.currentWpm >= settings.level1Wpm) {
                    studentLevel = 1;
                }
                
                // If they have met the school's Level 2 threshold
                if (s.currentWpm >= settings.level2Wpm) {
                    studentLevel = 2;
                }

                // Strictly match the test level being assigned
                return studentLevel === testLevel;
            });

            if (eligibleStudents.length === 0) {
                alert(`Cannot publish. No students in this section match Level ${testLevel} criteria.`);
                return;
            }
            finalStudentIds = eligibleStudents.map(s => s.id);
        } else {
            finalStudentIds = selectedStudentIds;
        }

        publishAssignment({
            title: finalTitle,
            text: finalContent,
            sectionId: finalSectionId,
            studentIds: finalStudentIds,
            dueDate: new Date(Date.now() + parseInt(accessWindow) * 60 * 1000).toISOString(),
            level: testLevel,
            duration: timeLimit === '0' ? 0 : parseInt(timeLimit) * 60,
            maxAttempts: allowedTrials ? parseInt(allowedTrials) : undefined
        });

        setSuccessPopup({ show: true, count: finalStudentIds.length });
    };

    return (
        <>
            {successPopup.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0b1e2d] p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full mb-5 bg-[#33B974]/10 text-[#33B974]">
                            <span className="material-symbols-outlined text-5xl">check_circle</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Published Successfully</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            This test has been successfully dispatched to <strong className="text-slate-900 dark:text-white">{successPopup.count}</strong> eligible students.
                        </p>
                        <button
                            onClick={() => navigate('/facilitator')}
                            className="w-full bg-[#094A71] hover:bg-[#094A71]/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">
                <Link to="/facilitator" className="hover:text-primary transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-slate-900 dark:text-white">New Test</span>
            </div>

            {/* Page Heading */}
            <div className="flex flex-wrap justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex min-w-72 flex-col gap-1.5">
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight font-heading">Configure Test Session</h1>
                    <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base font-normal">Select coordinates, student segments, and speed metrics for launching.</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
                {/* LEFT COLUMN: Content Selection */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Tabs */}
                    <div className="border-b border-slate-200 dark:border-[#323b67]">
                        <div className="flex gap-6">
                            <button 
                                onClick={() => setSourceMode('library')}
                                className={`flex items-center gap-2 border-b-2 pb-3 px-1 font-bold text-sm transition-all ${sourceMode === 'library' ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-400 dark:text-[#929bc9] hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-lg">library_books</span>
                                <span>Text Library</span>
                            </button>
                            <button 
                                onClick={() => setSourceMode('custom')}
                                className={`flex items-center gap-2 border-b-2 pb-3 px-1 font-bold text-sm transition-all ${sourceMode === 'custom' ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-400 dark:text-[#929bc9] hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-lg">edit_note</span>
                                <span>Custom Text</span>
                            </button>
                        </div>
                    </div>

                    {sourceMode === 'library' ? (
                        <>
                            {/* Search Bar */}
                            <div className="flex flex-col gap-3">
                                <div className="relative flex w-full items-stretch rounded-xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark focus-within:border-primary/60 transition-all p-1 shadow-sm">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#929bc9] text-[20px]">search</span>
                                    <input 
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-transparent text-slate-900 dark:text-white focus:outline-0 placeholder:text-slate-400 dark:placeholder:text-[#929bc9] text-sm font-normal" 
                                        placeholder={`Search Level ${testLevel} library texts by title...`}
                                    />
                                </div>
                            </div>

                            {/* Library Content List */}
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest">Level {testLevel} Recommended Texts</p>
                                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-[#323b67] text-slate-500 dark:text-[#929bc9] px-2 py-0.5 rounded-full">{filteredLibrary.length} available</span>
                                </div>
                                
                                {filteredLibrary.map(test => (
                                    <div
                                        key={test.id}
                                        onClick={() => setSelectedLibraryId(test.id)}
                                        className={`relative group flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border transition-all duration-300 cursor-pointer hover-scale active-scale shadow-sm hover:shadow-md ${
                                            selectedLibraryId === test.id 
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/5' 
                                                    : 'border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark'
                                        }`}
                                    >
                                        {selectedLibraryId === test.id && (
                                            <div className="absolute top-4 right-4">
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[#111422] shadow-sm">
                                                    <span className="material-symbols-outlined text-sm font-black">check</span>
                                                </div>
                                            </div>
                                        )}
                                        <div
                                            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-slate-100 dark:bg-[#323b67] bg-cover bg-center border border-slate-200/50 dark:border-[#323b67]/50 shadow-sm"
                                            style={{ backgroundImage: `url('${test.coverImg}')` }}
                                        ></div>
                                        <div className="flex flex-col gap-1.5 flex-1 pr-8">
                                            <h3 className="text-slate-900 dark:text-white font-bold text-lg group-hover:text-primary transition-colors duration-200 tracking-tight font-heading">{test.title}</h3>
                                            <p className="text-slate-400 dark:text-[#929bc9] text-xs font-semibold">by {test.source}</p>
                                            <div className="flex flex-wrap items-center gap-3.5 mt-2">
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm ${
                                                    test.complexity === 'Easy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                    test.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400' :
                                                    'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                                                }`}>
                                                    {test.complexity}
                                                </span>
                                                <span className="text-xs text-slate-400 dark:text-[#929bc9] flex items-center gap-1 font-bold">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span> {test.estimatedTimeMin} min
                                                </span>
                                                <span className="text-xs text-slate-400 dark:text-[#929bc9] font-bold">{test.wordCount} words</span>
                                            </div>
                                            <p className={`text-slate-500 dark:text-[#929bc9]/80 text-sm mt-3 line-clamp-2 leading-relaxed ${test.level === 2 ? 'font-mono text-[13px] bg-slate-50 dark:bg-black/20 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800' : ''}`}>
                                                {test.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {filteredLibrary.length === 0 && (
                                    <div className="p-8 text-center text-slate-400 dark:text-[#929bc9] border border-dashed border-slate-200 dark:border-[#323b67] rounded-xl bg-slate-50/50 dark:bg-[#232948]/50">
                                        No texts found for Level {testLevel} matching your search.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Custom Text Mode */}
                            <div className="flex flex-col gap-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-[#323b67] p-6 rounded-2xl shadow-sm">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">Custom Text Editor</h3>
                                    <p className="text-sm text-slate-500 dark:text-[#929bc9]">Provide your own content for the typing test. The system will automatically calculate the metrics.</p>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Test Title</label>
                                    <input 
                                        type="text"
                                        required
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                        placeholder="e.g., Weekly Custom Assessment"
                                        className="w-full rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-3 px-4 text-sm font-semibold outline-none focus:border-primary/60 transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Text Content</label>
                                    <textarea 
                                        required
                                        value={customContent}
                                        onChange={(e) => setCustomContent(e.target.value)}
                                        placeholder="Paste or type the text you want students to type here..."
                                        rows={8}
                                        className="w-full rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-3 px-4 text-sm font-mono outline-none focus:border-primary/60 transition-colors custom-scrollbar"
                                    ></textarea>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-[#232948] rounded-xl border border-slate-100 dark:border-[#323b67]">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest">Word Count</span>
                                        <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{customWordCount}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <span className="text-[10px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest">Estimated Time</span>
                                        <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{customEstimatedTime} min</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* RIGHT COLUMN: Configuration Form */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Settings Card - Premium Glassmorphism control center */}
                    <div className="bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-slate-200 dark:border-[#323b67] p-6 sticky top-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-[#323b67]/45 pb-4">
                            <span className="material-symbols-outlined text-primary text-xl font-bold">tune</span>
                            <h3 className="text-slate-900 dark:text-white font-black text-lg tracking-tight font-heading">Session Parameters</h3>
                        </div>
                        <form className="flex flex-col gap-6" onSubmit={handlePublish}>
                            {/* Test Level */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Test Level</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setTestLevel(1)}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-left ${
                                            testLevel === 1
                                                ? 'border-[#094A71] bg-[#094A71]/5 dark:bg-[#094A71]/10'
                                                : 'border-slate-200 dark:border-[#323b67] hover:border-[#094A71]/30'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined text-xl ${testLevel === 1 ? 'text-[#094A71]' : 'text-slate-400'}`}>school</span>
                                        <span className={`text-xs font-bold ${testLevel === 1 ? 'text-[#094A71]' : 'text-slate-500 dark:text-slate-400'}`}>Level 1</span>
                                        <span className="text-[9px] text-slate-400 font-medium">Standard Test</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTestLevel(2)}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-left ${
                                            testLevel === 2
                                                ? 'border-red-500 bg-red-500/5 dark:bg-red-500/10'
                                                : 'border-slate-200 dark:border-[#323b67] hover:border-red-300'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined text-xl ${testLevel === 2 ? 'text-red-500' : 'text-slate-400'}`}>flash_on</span>
                                        <span className={`text-xs font-bold ${testLevel === 2 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>Level 2</span>
                                        <span className="text-[9px] text-slate-400 font-medium">Survival Mode</span>
                                    </button>
                                </div>
                                {testLevel === 2 && (
                                    <p className="text-[10px] text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">
                                        ⚡ Students get 60s, no backspace, and only 3 errors allowed.
                                    </p>
                                )}
                            </div>

                            {/* Assignment Mode */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Assign Target</label>
                                <div className="flex bg-slate-100 dark:bg-[#232948] p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-inner">
                                    <button
                                        type="button"
                                        onClick={() => setAssignmentMode('section')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 hover-scale active-scale ${
                                            assignmentMode === 'section' 
                                                ? 'bg-white dark:bg-card-dark text-primary shadow-md' 
                                                : 'text-slate-500 dark:text-[#929bc9] hover:text-slate-950 dark:hover:text-white'
                                        }`}
                                    >
                                        Entire Section
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAssignmentMode('students')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 hover-scale active-scale ${
                                            assignmentMode === 'students' 
                                                ? 'bg-white dark:bg-card-dark text-primary shadow-md' 
                                                : 'text-slate-500 dark:text-[#929bc9] hover:text-slate-950 dark:hover:text-white'
                                        }`}
                                    >
                                        Select Students
                                    </button>
                                </div>
                            </div>

                            {/* Target Section (Conditional) */}
                            {assignmentMode === 'section' && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Target Section</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] focus:border-primary/60 text-slate-900 dark:text-white py-3 px-4 pr-10 text-sm font-semibold outline-none"
                                            value={targetSection}
                                            onChange={(e) => setTargetSection(e.target.value)}
                                            required={assignmentMode === 'section'}
                                        >
                                            <option disabled value="">Select a class section...</option>
                                            {sections?.map(section => (
                                                <option key={section.id} value={section.id}>
                                                    {section.intakeName ? `${section.intakeName} - ` : ''}{section.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-[#929bc9]">
                                            <span className="material-symbols-outlined">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Specific Students (Conditional) */}
                            {assignmentMode === 'students' && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Select Students</label>
                                    <div className="max-h-48 overflow-y-auto bg-slate-50 dark:bg-[#232948] rounded-xl border border-slate-200 dark:border-[#323b67] p-2 flex flex-col gap-1">
                                        {students.map(student => (
                                            <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-card-dark rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-primary focus:ring-primary bg-white dark:bg-card-dark border-slate-300 dark:border-slate-800"
                                                    checked={selectedStudentIds.includes(student.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedStudentIds(prev => [...prev, student.id]);
                                                        } else {
                                                            setSelectedStudentIds(prev => prev.filter(id => id !== student.id));
                                                        }
                                                    }}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</span>
                                                    <span className="text-[10px] text-slate-400 dark:text-[#929bc9] uppercase font-bold">{student.major} - {student.sectionId}</span>
                                                </div>
                                            </label>
                                        ))}
                                        {students.length === 0 && (
                                            <p className="text-xs text-slate-400 dark:text-[#929bc9] p-4 text-center">No active student records.</p>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 dark:text-[#929bc9] text-right font-black uppercase tracking-wider">{selectedStudentIds.length} students selected</p>
                                </div>
                            )}

                            {/* Time Limit */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider flex justify-between">
                                    <span>Time Limit</span>
                                    <span className="text-[10px] font-black text-slate-400/80">Default: 1 min</span>
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] focus:border-primary/60 text-slate-900 dark:text-white py-3 px-4 pr-10 text-sm font-semibold outline-none"
                                        value={timeLimit}
                                        onChange={(e) => setTimeLimit(e.target.value)}
                                    >
                                        <option value="1">1 Minute</option>
                                        <option value="2">2 Minutes</option>
                                        <option value="3">3 Minutes</option>
                                        <option value="5">5 Minutes</option>
                                        <option value="0">Unlimited</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-[#929bc9]">
                                        <span className="material-symbols-outlined text-sm">timer</span>
                                    </div>
                                </div>
                            </div>

                            {/* Allowed Trials */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider flex items-center gap-1">
                                    <span>Allowed Attempts</span>
                                    <span className="material-symbols-outlined text-sm text-slate-400 cursor-help" title="Number of attempts allowed for this test session">info</span>
                                </label>
                                <div className="flex items-center bg-slate-50 dark:bg-[#232948] rounded-xl px-4 py-1.5 border border-slate-200 dark:border-[#323b67] focus-within:border-primary/60">
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-bold text-sm py-2 focus:outline-none"
                                        min="1"
                                        placeholder="Unlimited Attempts"
                                        type="number"
                                        value={allowedTrials}
                                        onChange={(e) => setAllowedTrials(e.target.value)}
                                    />
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black shrink-0 ml-2">Attempts</span>
                                </div>
                            </div>

                            {/* Access Window */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider flex items-center gap-1">
                                    <span>Access Window</span>
                                    <span className="material-symbols-outlined text-sm text-slate-400 cursor-help" title="How long students have to access and complete this test from now">info</span>
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] focus:border-primary/60 text-slate-900 dark:text-white py-3 px-4 pr-10 text-sm font-semibold outline-none"
                                        value={accessWindow}
                                        onChange={(e) => setAccessWindow(e.target.value)}
                                    >
                                        <option value="10">10 Minutes</option>
                                        <option value="30">30 Minutes</option>
                                        <option value="60">1 Hour</option>
                                        <option value="180">3 Hours</option>
                                        <option value="1440">1 Day</option>
                                        <option value="4320">3 Days</option>
                                        <option value="10080">1 Week</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-[#929bc9]">
                                        <span className="material-symbols-outlined text-sm">event_available</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 dark:text-[#929bc9] font-semibold">After this period, the test locks and marks absent students as <span className="text-rose-500 font-black">Missing</span>.</p>
                            </div>

                            {/* Divider */}
                            <hr className="border-slate-100 dark:border-[#323b67]/45 my-1" />

                            {/* Summary Box - Premium preview design */}
                            <div className="flex flex-col gap-2 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/15">
                                <p className="text-[10px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest">Live Summary</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {sourceMode === 'library' ? (activeLibraryText?.title || 'No Selection') : (customTitle || 'Custom Text Title')}
                                </p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] font-bold bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-[#929bc9]">
                                        {sourceMode === 'library' ? activeLibraryText?.wordCount || 0 : customWordCount} words
                                    </span>
                                    <span className="text-[10px] font-bold bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-[#929bc9]">
                                        {sourceMode === 'library' ? activeLibraryText?.complexity || 'N/A' : 'Custom'}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 mt-2">
                                <button 
                                    type="submit" 
                                    className="flex w-full items-center justify-center rounded-xl bg-primary py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-emerald-600 transition-all hover-scale active-scale glow-primary font-heading"
                                >
                                    Publish Test
                                </button>
                                <Link 
                                    to="/facilitator" 
                                    className="flex w-full items-center justify-center rounded-xl bg-transparent border border-slate-300 dark:border-[#323b67] py-3.5 px-4 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover-scale active-scale font-heading"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Footer Spacer */}
            <div className="h-20"></div>
        </>
    );
};

export default FacilitatorTestLaunch;
