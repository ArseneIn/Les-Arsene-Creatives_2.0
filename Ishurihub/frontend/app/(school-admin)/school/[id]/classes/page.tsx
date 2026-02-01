"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal";
import { useForm } from "react-hook-form";
import ClassStudentsModal from "./ClassStudentsModal";

// Types
interface Classroom {
    id: string;
    name: string;
    year: string;
    stream: string;
    level: string;
    schoolId: string;
    _count?: {
        students: number;
    };
}

interface CreateClassFormData {
    name: string;
    year: string;
    stream: string;
    level: string;
}

interface RandomizeFormData {
    year: string;
    numberOfStreams: number;
    streamNames: string; // Comma separated
}

interface SchoolProfile {
    combinations?: { name: string; isActive: boolean }[];
}

const O_LEVEL_YEARS = ['S1', 'S2', 'S3'];
const A_LEVEL_YEARS = ['S4', 'S5', 'S6'];

const ClassCard = ({ cls, onDelete, onEdit, onSync, onClick }: { cls: Classroom, onDelete: (id: string) => void, onEdit: (cls: Classroom) => void, onSync: (id: string) => void, onClick: () => void }) => (
    <div onClick={onClick} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer transition-all group relative">
        <div className="flex gap-2 absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onSync(cls.id);
                }}
                className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-all"
                title="Sync Students (Fix mismatch)"
            >
                <span className="material-symbols-outlined text-[20px]">sync</span>
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(cls);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all"
                title="Edit Class"
            >
                <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this class?')) {
                        onDelete(cls.id);
                    }
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                title="Delete Class"
            >
                <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
        </div>

        <div className="flex items-start justify-between mb-3">
            <div className={`size-10 rounded-full flex items-center justify-center ${cls.level === 'A-Level' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                <span className="material-symbols-outlined">meeting_room</span>
            </div>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-xs font-bold text-gray-600 dark:text-gray-300">
                {cls.year}
            </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{cls.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{cls.level} • {cls.level === 'A-Level' ? 'Combination' : 'Stream'} {cls.stream}</p>

        <div className="flex items-center gap-2 text-xs text-primary font-medium group-hover:underline">
            <span>View Students</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </div>
    </div>
);

export default function ClassesPage() {
    const [classes, setClasses] = useState<Classroom[]>([]);
    const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Add Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addModalLevel, setAddModalLevel] = useState<'O-Level' | 'A-Level'>('O-Level');

    const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
    const [editingClass, setEditingClass] = useState<Classroom | null>(null);

    const params = useParams();
    const schoolId = params.id as string;

    const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, watch: watchAdd, setValue: setValueAdd } = useForm<CreateClassFormData>();


    // Watch year to auto-suggest name
    const watchedYear = watchAdd('year');
    const watchedStream = watchAdd('stream');

    // Academic Year State
    const [academicYear, setAcademicYear] = useState<any>(null);

    useEffect(() => {
        const fetchActiveYear = async () => {
            try {
                const res = await api.get('/academic-years', { params: { schoolId } });
                const active = res.data.find((y: any) => y.isActive);
                setAcademicYear(active);
            } catch (err) {
                console.error("Failed to fetch academic year");
            }
        };
        if (schoolId) fetchActiveYear();
    }, [schoolId]);

    // Separate state for optional A-Level stream suffix (e.g. "A" in "S4 MCE A")
    const [aLevelSuffix, setALevelSuffix] = useState("");

    useEffect(() => {
        if (watchedYear) {
            let constructedName = watchedYear;
            if (watchedStream) {
                constructedName += ` ${watchedStream}`;
            }
            if (addModalLevel === 'A-Level' && aLevelSuffix) {
                constructedName += ` ${aLevelSuffix}`;
            }
            setValueAdd('name', constructedName);
        }
    }, [watchedYear, watchedStream, aLevelSuffix, addModalLevel, setValueAdd]);


    const fetchClasses = useCallback(async () => {
        setIsLoading(true);
        try {
            const [classesRes, schoolRes] = await Promise.all([
                api.get('/classes', { params: { schoolId } }),
                api.get(`/schools/${schoolId}`)
            ]);
            setClasses(classesRes.data);
            setSchoolProfile(schoolRes.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        if (schoolId) fetchClasses();
    }, [schoolId, fetchClasses]);

    const openAddModal = (level: 'O-Level' | 'A-Level') => {
        setEditingClass(null);
        setAddModalLevel(level);
        setALevelSuffix("");
        resetAdd({
            year: '',
            stream: '',
            name: ''
        });
        setIsAddModalOpen(true);
    };

    const openEditModal = (cls: Classroom) => {
        setEditingClass(cls);
        setAddModalLevel(cls.level as 'O-Level' | 'A-Level');

        // Try to parse suffix if possible, but simplest is to just load year/stream
        // Note: cls.stream might contain the full combination "MCE A" or "MPC"

        // For A-Level, we might need to split it if we want to show suffix separate, 
        // OR we can just put the whole thing in "stream" and let user edit
        // But our form logic constructs name from year + stream + suffix. 
        // Restoring exact state is hard without saving suffix separately.
        // Simplified approach: Just duplicate current stream into stream field, empty suffix.

        setValueAdd('year', cls.year);
        // For A-Level, if we want to support editing Combination & Suffix separately we need better parsing
        // For now, let's treat the existing stream value as the "stream" (Combo)
        setValueAdd('stream', cls.stream);
        setValueAdd('name', cls.name);

        setIsAddModalOpen(true);
    };

    const handleCreateClass = async (data: CreateClassFormData) => {
        try {
            if (!academicYear) {
                alert("Please set an active Academic Year in System Settings first.");
                return;
            }

            const payload = {
                ...data,
                stream: addModalLevel === 'A-Level' && aLevelSuffix ? `${data.stream} ${aLevelSuffix}` : data.stream,
                level: addModalLevel,
                schoolId,
                academicYearId: academicYear.id
            };

            if (editingClass) {
                await api.patch(`/classes/${editingClass.id}`, payload);
            } else {
                await api.post('/classes', payload);
            }

            await fetchClasses();
            setIsAddModalOpen(false);
            resetAdd();
            setEditingClass(null);
        } catch (error: any) {
            console.error("Failed to save class:", error);
            alert(error.response?.data?.message || "Failed to save class");
        }
    };

    const handleDeleteClass = async (id: string) => {
        try {
            await api.delete(`/classes/${id}`);
            await fetchClasses();
        } catch (error) {
            console.error("Failed to delete class:", error);
            alert("Failed to delete class.");
        }
    };

    const handleSyncClass = async (id: string) => {
        try {
            await api.post(`/classes/${id}/sync`);
            alert("Sync started. Students matching the class name will be linked.");
            await fetchClasses();
        } catch (error) {
            console.error("Failed to sync:", error);
            alert("Failed to sync students.");
        }
    };

    const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

    const activeCombinations = schoolProfile?.combinations?.filter(c => c.isActive) || [];

    return (
        <div className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-end gap-3 pb-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Class Management</h1>
                            {academicYear && (
                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                                    {academicYear.name}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">Organize students into streams.</p>
                    </div>
                </div>

                {/* Grid */}
                {classes.length === 0 && !isLoading ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">school</span>
                        <p className="text-gray-500 font-medium pb-4">No classes found. Add one to get started.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => openAddModal('O-Level')} className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm">Add O-Level Class</button>
                            <button onClick={() => openAddModal('A-Level')} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm">Add A-Level Class</button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* O-Level Column */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                                    <span className="material-symbols-outlined text-primary">school</span>
                                    O-Level (S1-S3)
                                </h2>
                                <button
                                    onClick={() => openAddModal('O-Level')}
                                    className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                    Add Class
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {classes.filter(c => c.level === 'O-Level').map(cls => (
                                    <ClassCard key={cls.id} cls={cls} onDelete={handleDeleteClass} onEdit={openEditModal} onSync={handleSyncClass} onClick={() => setSelectedClass(cls)} />
                                ))}
                                {classes.filter(c => c.level === 'O-Level').length === 0 && (
                                    <p className="text-gray-400 italic text-sm">No O-Level classes.</p>
                                )}
                            </div>
                        </div>

                        {/* A-Level Column */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                                    <span className="material-symbols-outlined text-purple-500">science</span>
                                    A-Level (S4-S6)
                                </h2>
                                <button
                                    onClick={() => openAddModal('A-Level')}
                                    className="px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                    Add Class
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {classes.filter(c => c.level === 'A-Level').map(cls => (
                                    <ClassCard key={cls.id} cls={cls} onDelete={handleDeleteClass} onEdit={openEditModal} onSync={handleSyncClass} onClick={() => setSelectedClass(cls)} />
                                ))}
                                {classes.filter(c => c.level === 'A-Level').length === 0 && (
                                    <p className="text-gray-400 italic text-sm">No A-Level classes.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {selectedClass && (
                <ClassStudentsModal
                    isOpen={!!selectedClass}
                    onClose={() => setSelectedClass(null)}
                    classId={selectedClass.id}
                    className={selectedClass.name}
                />
            )}

            {/* Add Class Modal - Context Aware */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={editingClass ? `Edit ${editingClass.name}` : `Create ${addModalLevel} Class`}
                size="md"
            >
                <form onSubmit={handleSubmitAdd(handleCreateClass)} className="space-y-4">
                    {/* Hidden Name Field - we generate it */}
                    <input type="hidden" {...registerAdd('name')} />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-1">Class Name Preview</label>
                            <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-gray-500">
                                {watchedYear} {watchedStream || (addModalLevel === 'A-Level' ? '(Combination)' : '(Stream)')}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Year</label>
                            <select {...registerAdd('year', { required: true })} className={inputClasses}>
                                <option value="">Select...</option>
                                {(addModalLevel === 'O-Level' ? O_LEVEL_YEARS : A_LEVEL_YEARS).map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">
                                {addModalLevel === 'A-Level' ? 'Combination' : 'Stream'}
                            </label>
                            {addModalLevel === 'A-Level' ? (
                                <select {...registerAdd('stream', { required: true })} className={inputClasses}>
                                    <option value="">Select...</option>
                                    {activeCombinations.length > 0 ? (
                                        activeCombinations.map((combo, idx) => (
                                            <option key={idx} value={combo.name}>{combo.name}</option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No active combinations found</option>
                                    )}
                                </select>
                            ) : (
                                <input {...registerAdd('stream', { required: false })} className={inputClasses} placeholder="e.g. A (Optional)" />
                            )}

                            {/* Optional A-Level Stream Suffix Input */}
                            {addModalLevel === 'A-Level' && (
                                <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                                    <label className="block text-xs font-bold mb-1 text-gray-500">Stream Suffix (Optional)</label>
                                    <input
                                        type="text"
                                        value={aLevelSuffix}
                                        onChange={(e) => setALevelSuffix(e.target.value)}
                                        className={inputClasses}
                                        placeholder="e.g. A"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Useful if you have multiple streams for the same combination (e.g. S4 MCE A, S4 MCE B)</p>
                                </div>
                            )}

                            {addModalLevel === 'A-Level' && activeCombinations.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">Please add combinations in System Settings first.</p>
                            )}
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg">{editingClass ? 'Update Class' : 'Create Class'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
