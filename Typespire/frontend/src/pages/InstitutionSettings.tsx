import React, { useState, useEffect } from 'react';
import { Zap, Info, BadgeCheck, Check, Star, Sliders } from 'lucide-react';

import { useInstitution } from '../context/InstitutionContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { PRACTICE_STAGES } from '../data/practiceModules';

const InstitutionSettings: React.FC = () => {
    const { settings, updateSettings } = useInstitution();
    const { user } = useAuth();
    
    // Local states for general standards to prevent premature propagation
    const [localLevel1Wpm, setLocalLevel1Wpm] = useState<number>(settings.level1Wpm);
    const [localLevel2Wpm, setLocalLevel2Wpm] = useState<number>(settings.level2Wpm);
    const [localRequiredAccuracy, setLocalRequiredAccuracy] = useState<number>(settings.requiredAccuracy);
    const [savingGeneral, setSavingGeneral] = useState<boolean>(false);
    const [showGeneralSuccess, setShowGeneralSuccess] = useState<boolean>(false);

    const [stageRequirements, setStageRequirements] = useState<Record<string, { wpm: number; accuracy: number }>>({});
    const [savingStageId, setSavingStageId] = useState<string | null>(null);
    const [selectedModuleNum, setSelectedModuleNum] = useState<number>(1);
    const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);

    // Sync local states if settings are updated
    useEffect(() => {
        setLocalLevel1Wpm(settings.level1Wpm);
        setLocalLevel2Wpm(settings.level2Wpm);
        setLocalRequiredAccuracy(settings.requiredAccuracy);
    }, [settings]);

    const handleSaveGeneral = () => {
        setSavingGeneral(true);
        setTimeout(() => {
            updateSettings({
                level1Wpm: localLevel1Wpm,
                level2Wpm: localLevel2Wpm,
                requiredAccuracy: localRequiredAccuracy
            });
            setSavingGeneral(false);
            setShowGeneralSuccess(true);
            setTimeout(() => setShowGeneralSuccess(false), 3000);
        }, 600);
    };

    useEffect(() => {
        if (user?.institutionId) {
            api.get(`/requirements/institution/${user.institutionId}`)
                .then(res => {
                    const reqs: Record<string, { wpm: number; accuracy: number }> = {};
                    res.data.forEach((r: any) => {
                        reqs[r.stageId] = { wpm: r.wpm, accuracy: r.accuracy };
                    });
                    
                    // Pre-fill missing with defaults from PRACTICE_STAGES
                    const initial: Record<string, { wpm: number; accuracy: number }> = {};
                    PRACTICE_STAGES.forEach(stage => {
                        initial[stage.id] = reqs[stage.id] || { 
                            wpm: stage.defaultWpm || 20, 
                            accuracy: stage.defaultAccuracy || 90 
                        };
                    });
                    setStageRequirements(initial);
                })
                .catch(err => {
                    console.error("Failed to load institution stage requirements", err);
                    const initial: Record<string, { wpm: number; accuracy: number }> = {};
                    PRACTICE_STAGES.forEach(stage => {
                        initial[stage.id] = { 
                            wpm: stage.defaultWpm || 20, 
                            accuracy: stage.defaultAccuracy || 90 
                        };
                    });
                    setStageRequirements(initial);
                });
        }
    }, [user?.institutionId]);

    const handleStageChange = (stageId: string, field: 'wpm' | 'accuracy', value: number) => {
        setStageRequirements(prev => ({
            ...prev,
            [stageId]: {
                ...prev[stageId],
                [field]: value
            }
        }));
    };

    const handleSaveStage = async (stageId: string) => {
        if (!user?.institutionId) return;
        setSavingStageId(stageId);
        try {
            await api.post(`/requirements/institution/${user.institutionId}`, {
                stageId,
                wpm: stageRequirements[stageId].wpm,
                accuracy: stageRequirements[stageId].accuracy
            });
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to save curriculum stage requirements:", err);
            alert("Failed to save stage requirements. Please try again.");
        } finally {
            setSavingStageId(null);
        }
    };

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 lg:px-10 overflow-y-auto">
            {/* Page Heading */}
            <div className="mb-10 border-b border-slate-200 dark:border-white/10 pb-6">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Proficiency & Benchmarks</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-3xl text-base font-medium">
                    Configure the academic speed and accuracy targets used globally across classroom sections, matrix score highlight grids, and practice sub-levels.
                </p>
            </div>

            <div className="flex flex-col gap-8">
                {/* Section: General Benchmark Configuration */}
                <div className="bg-white dark:bg-[#0A2536] rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-white/5">
                        <div className="p-2 rounded-lg bg-admin-primary/10 text-admin-primary shrink-0">
                            <BadgeCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">General Passing Standards</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Set the baseline speed standards that define Level 1 and Level 2 proficiency status.</p>
                        </div>
                    </div>

                    {showGeneralSuccess && (
                        <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold text-center animate-fade-in">
                            General passing standards saved successfully!
                        </div>
                    )}

                    <div className="flex flex-col gap-6">
                        {/* Two Columns for Level 1 and Level 2 Benchmarks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Level 1 Card */}
                            <div className="p-5 rounded-2xl border border-slate-205 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col justify-between gap-4">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <label className="text-sm font-extrabold text-slate-800 dark:text-white" htmlFor="level1">
                                            Level 1: Basic Proficiency
                                        </label>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                            System Default: 30 WPM
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                                        Minimum speed required for students to pass the beginner level curriculum.
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <Zap className="text-slate-400 w-4 h-4" />
                                    </div>
                                    <input 
                                        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-admin-primary focus:border-admin-primary block w-full ps-10 p-3 font-semibold font-mono" 
                                        id="level1" 
                                        placeholder="30" 
                                        type="number" 
                                        value={localLevel1Wpm}
                                        onChange={(e) => setLocalLevel1Wpm(parseInt(e.target.value) || 0)}
                                    />
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
                                        <span className="text-xs text-slate-500 font-bold">WPM</span>
                                    </div>
                                </div>
                            </div>

                            {/* Level 2 Card */}
                            <div className="p-5 rounded-2xl border border-slate-205 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col justify-between gap-4">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <label className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2" htmlFor="level2">
                                            Level 2: Advanced Mastery
                                            <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 text-[8px] font-black text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20 uppercase tracking-wider">Target</span>
                                        </label>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                            System Default: 50 WPM
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                                        Target speed benchmarks students must attain to pass Level 2 classes.
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <Star className="text-emerald-600 dark:text-emerald-500 w-4 h-4" />
                                    </div>
                                    <input 
                                        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-admin-primary focus:border-admin-primary block w-full ps-10 p-3 font-semibold font-mono" 
                                        id="level2" 
                                        placeholder="50" 
                                        type="number" 
                                        value={localLevel2Wpm}
                                        onChange={(e) => setLocalLevel2Wpm(parseInt(e.target.value) || 0)}
                                    />
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
                                        <span className="text-xs text-slate-500 font-bold">WPM</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Full Width Required Accuracy slider Card */}
                        <div className="p-6 rounded-2xl border border-slate-205 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                                <div>
                                    <label className="text-sm font-extrabold text-slate-800 dark:text-white" htmlFor="accuracy">
                                        Required Accuracy Standard
                                    </label>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                        The strict accuracy percentage requirement applied across all grading modules.
                                    </p>
                                </div>
                                <span className="text-xs font-black text-admin-primary dark:text-white bg-admin-primary/10 dark:bg-admin-primary/20 px-3 py-1.5 rounded-lg border border-admin-primary/25 self-start sm:self-auto shrink-0">
                                    {localRequiredAccuracy}% Accuracy Target
                                </span>
                            </div>
                            <input 
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-admin-primary mt-2" 
                                id="accuracy" 
                                max="100" 
                                min="80" 
                                type="range" 
                                value={localRequiredAccuracy}
                                onChange={(e) => setLocalRequiredAccuracy(parseInt(e.target.value))}
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2.5">
                                <span>80% (Lenient Standards)</span>
                                <span>90% (Average Passing)</span>
                                <span>95% (High Standards)</span>
                                <span>100% (Perfect Accuracy)</span>
                            </div>
                        </div>

                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl p-4 mt-8 flex gap-3">
                        <Info className="text-blue-600 dark:text-blue-400 w-5 h-5 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
                            General proficiency values configure the passing targets utilized on the Student Matrix ledger, class supervision report pages, and practice checkpoints.
                        </p>
                    </div>

                    {/* Persist/Save Trigger Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                        <div className="text-xs text-slate-400 font-medium italic">
                            * Changes will instantly update all matrix grids and active test checkpoints upon saving.
                        </div>
                        <button
                            disabled={savingGeneral}
                            onClick={handleSaveGeneral}
                            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-white text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
                                savingGeneral ? 'bg-slate-400 cursor-not-allowed' : 'bg-admin-primary hover:bg-admin-primary shadow-lg shadow-admin-primary/10'
                            }`}
                        >
                            {savingGeneral ? (
                                'Saving Standards...'
                            ) : (
                                <>
                                    <Check className="w-4 h-4 stroke-[3px]" /> Save General Standards
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Section: Curriculum Stage Benchmarks */}
                <div className="bg-white dark:bg-[#0A2536] rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                        <div className="p-2 rounded-lg bg-admin-primary/10 text-admin-primary shrink-0">
                            <Sliders className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Curriculum Stage Benchmarks</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Configure passing speed and accuracy targets for each individual learning stage. Saves instantly across all sections.</p>
                        </div>
                    </div>

                    {/* Success indicator alert */}
                    {showSaveSuccess && (
                        <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold text-center animate-fade-in">
                            Stage benchmark target configurations saved successfully!
                        </div>
                    )}

                    {/* Module Tabs Selector */}
                    <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-slate-50 dark:bg-[#061824] rounded-xl border border-slate-100 dark:border-white/5 w-fit">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                onClick={() => setSelectedModuleNum(num)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    selectedModuleNum === num
                                        ? 'bg-admin-primary text-white shadow-sm font-black'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {num === 9 ? 'Capstone Test' : `Module ${num}`}
                            </button>
                        ))}
                    </div>

                    {/* Curriculum Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PRACTICE_STAGES.filter(stage => {
                            if (selectedModuleNum === 9) {
                                return stage.id === 'stage-capstone';
                            }
                            return stage.id.includes(`-${selectedModuleNum}-`) || stage.id === `stage-${selectedModuleNum}-shift`;
                        }).map(stage => {
                            const req = stageRequirements[stage.id] || { 
                                wpm: stage.defaultWpm || 20, 
                                accuracy: stage.defaultAccuracy || 90 
                            };
                            const isSaving = savingStageId === stage.id;
                            
                            return (
                                <div key={stage.id} className="flex flex-col justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-[#323b67] bg-slate-50/30 dark:bg-[#232948]/20 hover:border-admin-primary/45 transition-colors">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h4 className="font-extrabold text-slate-800 dark:text-white text-base">Stage {stage.stageNumber}: {stage.title}</h4>
                                            <span className="px-2 py-0.5 rounded-full bg-admin-primary/10 text-admin-primary font-bold text-[9px] uppercase tracking-wider">
                                                {stage.isFunctionalKey ? 'Functional' : stage.practiceType || 'Words'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-[#929bc9] leading-relaxed line-clamp-2 mb-2">
                                            {stage.description || 'Focus on speed and accuracy benchmarks for keyboard mastery.'}
                                        </p>
                                    </div>
                                    <div className="flex items-end justify-between pt-4 border-t border-slate-100 dark:border-[#323b67]/30">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Target WPM</label>
                                                <input 
                                                    type="number" 
                                                    value={req.wpm}
                                                    onChange={(e) => handleStageChange(stage.id, 'wpm', Number(e.target.value))}
                                                    className="w-20 px-2 py-1.5 rounded-lg bg-white dark:bg-[#1a1f36] border border-slate-300 dark:border-[#323b67] text-sm font-bold font-mono text-center text-slate-900 dark:text-white focus:ring-1 focus:ring-admin-primary focus:border-transparent outline-none"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Target Acc %</label>
                                                <input 
                                                    type="number" 
                                                    value={req.accuracy}
                                                    onChange={(e) => handleStageChange(stage.id, 'accuracy', Number(e.target.value))}
                                                    className="w-20 px-2 py-1.5 rounded-lg bg-white dark:bg-[#1a1f36] border border-slate-300 dark:border-[#323b67] text-sm font-bold font-mono text-center text-slate-900 dark:text-white focus:ring-1 focus:ring-admin-primary focus:border-transparent outline-none"
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            disabled={isSaving}
                                            onClick={() => handleSaveStage(stage.id)}
                                            className={`px-4 py-2.5 rounded-xl text-white text-xs font-black flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
                                                isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-admin-primary hover:bg-admin-primary shadow-sm'
                                            }`}
                                        >
                                            {isSaving ? (
                                                'Saving...'
                                            ) : (
                                                <>
                                                    <Check className="w-3.5 h-3.5 stroke-[3px]" /> Save Stage
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionSettings;
