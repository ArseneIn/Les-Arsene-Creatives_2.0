import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { PRACTICE_STAGES } from '../../data/practiceModules';

interface StageRequirementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectionId?: string;
    studentId?: string;
    title: string;
}

export const StageRequirementsModal: React.FC<StageRequirementsModalProps> = ({ isOpen, onClose, sectionId, studentId, title }) => {
    const [requirements, setRequirements] = useState<Record<string, { wpm: number; accuracy: number }>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        
        // Fetch existing requirements
        const url = studentId ? `/requirements/student/${studentId}` : `/requirements/section/${sectionId}`;
        api.get(url)
            .then(res => {
                const reqs: Record<string, { wpm: number; accuracy: number }> = {};
                res.data.forEach((r: any) => { reqs[r.stageId] = { wpm: r.wpm, accuracy: r.accuracy }; });
                
                // Pre-fill with defaults for missing stages
                const initial: Record<string, { wpm: number; accuracy: number }> = {};
                PRACTICE_STAGES.forEach(stage => {
                    initial[stage.id] = reqs[stage.id] || { wpm: stage.defaultWpm || 20, accuracy: stage.defaultAccuracy || 90 };
                });
                
                setRequirements(initial);
            })
            .catch(err => {
                console.error("Failed to load requirements", err);
                const initial: Record<string, { wpm: number; accuracy: number }> = {};
                PRACTICE_STAGES.forEach(stage => {
                    initial[stage.id] = { wpm: stage.defaultWpm || 20, accuracy: stage.defaultAccuracy || 90 };
                });
                setRequirements(initial);
            });
    }, [isOpen, sectionId, studentId]);

    const handleChange = (stageId: string, field: 'wpm' | 'accuracy', value: number) => {
        setRequirements(prev => ({
            ...prev,
            [stageId]: {
                ...prev[stageId],
                [field]: value
            }
        }));
    };

    const handleSave = async (stageId: string) => {
        setIsSaving(true);
        const url = studentId ? `/requirements/student/${studentId}` : `/requirements/section/${sectionId}`;
        try {
            await api.post(url, {
                stageId,
                wpm: requirements[stageId].wpm,
                accuracy: requirements[stageId].accuracy
            });
            alert(`Stage ${stageId} requirements saved!`);
        } catch (err) {
            console.error("Failed to save", err);
            alert("Failed to save requirements.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[100]">
            <div className="bg-white dark:bg-card-dark rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-[#323b67] overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 dark:border-[#323b67]/45 flex justify-between items-center bg-slate-50/40 dark:bg-[#323b67]/10 flex-shrink-0">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-emerald-600 text-xl font-bold">tune</span>
                        <h3 className="font-black text-lg tracking-tight font-heading">{title}</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <p className="text-sm text-slate-500 mb-6">
                        Adjust the passing benchmarks for the Practice Arena. Changes here will immediately require students to meet the new WPM and Accuracy targets to advance to the next stage.
                    </p>

                    <div className="flex flex-col gap-4">
                        {PRACTICE_STAGES.map(stage => (
                            <div key={stage.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-[#323b67] bg-slate-50/50 dark:bg-[#232948]">
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Stage {stage.stageNumber}: {stage.title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-[#929bc9] line-clamp-1">{stage.practiceText}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-400">Target WPM</label>
                                        <input 
                                            type="number" 
                                            value={requirements[stage.id]?.wpm ?? 20}
                                            onChange={(e) => handleChange(stage.id, 'wpm', Number(e.target.value))}
                                            className="w-20 px-2 py-1 rounded bg-white dark:bg-[#1a1f36] border border-slate-300 dark:border-[#323b67] text-sm font-mono text-center text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-400">Target Acc %</label>
                                        <input 
                                            type="number" 
                                            value={requirements[stage.id]?.accuracy ?? 90}
                                            onChange={(e) => handleChange(stage.id, 'accuracy', Number(e.target.value))}
                                            className="w-20 px-2 py-1 rounded bg-white dark:bg-[#1a1f36] border border-slate-300 dark:border-[#323b67] text-sm font-mono text-center text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="h-[14px]"></div>
                                        <button 
                                            disabled={isSaving}
                                            onClick={() => handleSave(stage.id)}
                                            className="px-3 py-1 rounded bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
