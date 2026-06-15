import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, ChevronDown, MoreHorizontal, Upload, X, CloudUpload, FileText, PlusCircle, Activity, Edit } from 'lucide-react';
import { useInstitution } from '../context/InstitutionContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import type { Intake, Student, TestResult } from '../types/institution';

const InstitutionIntakes: React.FC = () => {
    const { user } = useAuth();
    const { intakes, addIntake, addSection, facilitators, assignFacilitatorToSection } = useInstitution();
    const [expandedIntake, setExpandedIntake] = useState<string | null>('1');
    const [showNewIntakeModal, setShowNewIntakeModal] = useState(false);
    const [showMasterUploadModal, setShowMasterUploadModal] = useState(false);
    const [editIntakeModal, setEditIntakeModal] = useState<{ id: string; name: string; startDate: string; endDate: string } | null>(null);
    const [showBulkUploadModal, setShowBulkUploadModal] = useState<{ sectionId: string, intakeName: string, sectionName: string } | null>(null);
    const [assignFacilitatorModal, setAssignFacilitatorModal] = useState<{ sectionId: string, currentFacilitatorId?: string } | null>(null);
    const [selectedFacilitatorId, setSelectedFacilitatorId] = useState('');
    const [showRosterModal, setShowRosterModal] = useState<{ sectionId: string, sectionName: string, students: Student[] } | null>(null);
    const [results, setResults] = useState<TestResult[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                if (user?.institutionId) {
                    const res = await api.get(`/test-result/institution/${user.institutionId}`);
                    setResults(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch test results for roster:", error);
            }
        };
        fetchResults();
    }, [user?.institutionId]);

    const getStudentStatus = (studentId: string) => {
        const studentResults = results.filter(r => r.user.id === studentId);
        if (!studentResults.length) return 'Practicing';

        let currentStatus = 'Practicing';
        studentResults.forEach(r => {
            const title = (r.test?.title || r.assignment?.title || '').toLowerCase();
            const passed = r.wpm >= 20 && r.accuracy >= 70;
            const isPractice = title.includes('practice') || title.includes('drill');

            if (!isPractice) {
                if (title.includes('level 2') && passed) {
                    currentStatus = 'Passed';
                } else if ((title.includes('level 1') && passed) || title.includes('level 2')) {
                    currentStatus = 'Level 2';
                } else {
                    currentStatus = 'Level 1';
                }
            }
        });
        return currentStatus;
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Passed':
                return 'bg-[#33B974]/15 text-[#33B974] border-[#33B974]/20';
            case 'Level 2':
                return 'bg-blue-500/15 text-blue-500 border-blue-500/20';
            case 'Level 1':
                return 'bg-orange-500/15 text-orange-500 border-orange-500/20';
            default:
                return 'bg-indigo-500/15 text-indigo-500 border-indigo-500/20';
        }
    };

    // Form States
    const [newIntakeName, setNewIntakeName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [newSectionName, setNewSectionName] = useState('');
    const [selectedIntakeForSection, setSelectedIntakeForSection] = useState<string | null>(null);

    const toggleIntake = (id: string) => {
        setExpandedIntake(expandedIntake === id ? null : id);
    };

    const handleCreateIntake = (e: React.FormEvent) => {
        e.preventDefault();
        const newIntake: Intake = {
            id: Date.now().toString(),
            name: newIntakeName,
            startDate: startDate,
            endDate: endDate,
            status: 'Upcoming',
            facilitators: [],
            sections: []
        };
        addIntake(newIntake);
        setNewIntakeName('');
        setStartDate('');
        setEndDate('');
        setShowNewIntakeModal(false);
    };

    const handleAddSection = (intakeId: string) => {
        if (!newSectionName.trim()) return;
        addSection(intakeId, newSectionName);
        setNewSectionName('');
        setSelectedIntakeForSection(null);
    };

    const handleAssignFacilitator = async () => {
        if (assignFacilitatorModal && selectedFacilitatorId) {
            await assignFacilitatorToSection(assignFacilitatorModal.sectionId, selectedFacilitatorId);
            setAssignFacilitatorModal(null);
            setSelectedFacilitatorId('');
        }
    };

    return (
        <>
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-[#0d1b17] text-3xl font-bold leading-tight">Intake Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Create intakes, organize sections, and assign students.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowMasterUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-[#0d1b17] border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Upload className="w-4 h-4 text-gray-500" />
                        Import Master Roster
                    </button>
                    <button
                        onClick={() => setShowNewIntakeModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0d1b17] text-white rounded-lg text-sm font-bold hover:bg-[#1a2e28] transition-colors shadow-lg shadow-gray-200"
                    >
                        <Plus className="w-5 h-5" />
                        New Intake
                    </button>
                </div>
            </header>

            {/* Intakes List */}
            <div className="flex flex-col gap-6">
                {intakes.map((intake) => (
                    <div key={intake.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200">
                        {/* Intake Header */}
                        <div
                            className={`p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${expandedIntake === intake.id ? 'bg-gray-50 border-b border-gray-100' : ''}`}
                            onClick={() => toggleIntake(intake.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${intake.status === 'Active' ? 'bg-[#22c55e]' :
                                    intake.status === 'Upcoming' ? 'bg-[#eab308]' : 'bg-gray-400'
                                    }`}>
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-[#0d1b17] text-lg font-bold">{intake.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium flex-wrap">
                                        <span>{intake.startDate} — {intake.endDate || 'Ongoing'}</span>
                                        {!intake.endDate && (
                                            <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold text-[10px] border border-amber-200 animate-pulse">
                                                ⚠️ Missing End Date
                                            </span>
                                        )}
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span className={`${intake.status === 'Active' ? 'text-green-600' :
                                            intake.status === 'Upcoming' ? 'text-yellow-600' : 'text-gray-500'
                                            }`}>{intake.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setEditIntakeModal({ id: intake.id, name: intake.name, startDate: intake.startDate, endDate: intake.endDate || '' })}
                                    className="p-1.5 text-gray-400 hover:text-[#0d1b17] rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                                    title="Edit Intake Dates"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <ChevronDown 
                                    className={`text-gray-400 transition-transform duration-200 cursor-pointer ${expandedIntake === intake.id ? 'rotate-180' : ''}`} 
                                    onClick={() => toggleIntake(intake.id)}
                                />
                            </div>
                        </div>

                        {/* Intake Body (Sections) */}
                        {expandedIntake === intake.id && (
                            <div className="p-6 bg-[#f8fcfa]">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Sections</h4>
                                    {selectedIntakeForSection === intake.id ? (
                                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Section Name (e.g. Section C)"
                                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none"
                                                value={newSectionName}
                                                onChange={(e) => setNewSectionName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddSection(intake.id)}
                                            />
                                            <button
                                                onClick={() => handleAddSection(intake.id)}
                                                className="px-3 py-1.5 bg-[#0d1b17] text-white text-xs font-bold rounded-lg hover:bg-[#1a2e28]"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setSelectedIntakeForSection(null)}
                                                className="p-1.5 text-gray-400 hover:text-red-500"
                                            >
                                                <X className="w-[18px] h-[18px]" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedIntakeForSection(intake.id)}
                                            className="text-xs font-bold text-[#0d1b17] hover:underline flex items-center gap-1"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                            Add Section
                                        </button>
                                    )}
                                </div>

                                {intake.sections.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {intake.sections.map(section => (
                                            <div key={section.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 transition-colors group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h5 className="font-bold text-[#0d1b17]">{section.name}</h5>
                                                    <button className="text-gray-300 hover:text-[#0d1b17]">
                                                        <MoreHorizontal className="w-[18px] h-[18px]" />
                                                    </button>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Facilitator</p>
                                                    {section.facilitator ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-[#0d1b17]">
                                                                {section.facilitator.name.charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-700 truncate">{section.facilitator.name}</span>
                                                            <button
                                                                onClick={() => {
                                                                    setAssignFacilitatorModal({ sectionId: section.id, currentFacilitatorId: section.facilitator?.id });
                                                                    setSelectedFacilitatorId(section.facilitator?.id || '');
                                                                }}
                                                                className="ml-auto text-xs text-blue-600 hover:underline"
                                                            >
                                                                Change
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setAssignFacilitatorModal({ sectionId: section.id });
                                                                setSelectedFacilitatorId('');
                                                            }}
                                                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#0d1b17] border border-dashed border-gray-300 rounded px-2 py-1 w-full justify-center hover:border-gray-400 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                            Assign Facilitator
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-end justify-between pt-3 border-t border-gray-50">
                                                    <button
                                                        onClick={() => setShowRosterModal({ sectionId: section.id, sectionName: section.name, students: section.students })}
                                                        className="text-left hover:opacity-85 transition-opacity"
                                                    >
                                                        <span className="text-2xl font-bold text-gray-800 hover:text-primary transition-colors">{section.students.length}</span>
                                                        <span className="text-xs text-gray-500 ml-1 hover:underline block md:inline">Students</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setShowBulkUploadModal({ sectionId: section.id, intakeName: intake.name, sectionName: section.name })}
                                                        className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded border border-gray-200 hover:bg-gray-100 hover:text-[#0d1b17] transition-colors flex items-center gap-1"
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                        Bulk Add
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                                        <p className="text-gray-400 text-sm">No sections created yet.</p>
                                        <button
                                            onClick={() => setSelectedIntakeForSection(intake.id)}
                                            className="mt-2 text-[#0d1b17] text-sm font-bold hover:underline"
                                        >
                                            Create the first section
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* New Intake Modal */}
            {showNewIntakeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#0d1b17]">Create New Intake</h3>
                            <button onClick={() => setShowNewIntakeModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateIntake} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Intake Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none"
                                    placeholder="e.g. Summer 2025"
                                    value={newIntakeName}
                                    onChange={(e) => setNewIntakeName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none text-gray-600"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none text-gray-600"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowNewIntakeModal(false)}
                                    className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#0d1b17] text-white font-bold rounded-lg hover:bg-[#1a2e28] shadow-lg shadow-[#0d1b17]/20"
                                >
                                    Create Intake
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Facilitator Modal */}
            {assignFacilitatorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#0d1b17]">Assign Facilitator</h3>
                            <button onClick={() => setAssignFacilitatorModal(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Select Facilitator</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none bg-white"
                                    value={selectedFacilitatorId}
                                    onChange={(e) => setSelectedFacilitatorId(e.target.value)}
                                >
                                    <option value="">Select a facilitator...</option>
                                    {facilitators.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-2 flex justify-end gap-3">
                                <button
                                    onClick={() => setAssignFacilitatorModal(null)}
                                    className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssignFacilitator}
                                    disabled={!selectedFacilitatorId}
                                    className="px-6 py-2 bg-[#0d1b17] text-white font-bold rounded-lg hover:bg-[#1a2e28] shadow-lg shadow-[#0d1b17]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Assign
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {showBulkUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-[#0d1b17]">Bulk Add Students</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Adding to <span className="font-bold text-[#0d1b17]">{showBulkUploadModal.intakeName}</span> / <span className="font-bold text-[#0d1b17]">{showBulkUploadModal.sectionName}</span>
                            </p>
                        </div>
                        <div className="p-8 flex flex-col items-center justify-center gap-4 border-b border-gray-100 bg-gray-50/50">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
                                <CloudUpload className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">CSV (max 5MB)</p>
                            </div>
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                id="bulk-upload-input"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const text = await file.text();
                                    const lines = text.split('\n');
                                    const students: { name: string; email?: string; username?: string; password?: string }[] = [];

                                    // Check headers
                                    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
                                    const idIndex = headers.findIndex(h => h.includes('id') || h.includes('username') || h.includes('registration'));
                                    const nameIndex = headers.findIndex(h => h.includes('name'));
                                    const emailIndex = headers.findIndex(h => h.includes('email'));

                                    // If no headers match, assume default order: Student ID, Name, Email
                                    const hasHeaders = idIndex !== -1 || nameIndex !== -1 || emailIndex !== -1;
                                    const startIndex = hasHeaders ? 1 : 0;
                                    const finalIdIdx = idIndex !== -1 ? idIndex : 0;
                                    const finalNameIdx = nameIndex !== -1 ? nameIndex : 1;
                                    const finalEmailIdx = emailIndex !== -1 ? emailIndex : 2;

                                    for (let i = startIndex; i < lines.length; i++) {
                                        const line = lines[i].trim();
                                        if (!line) continue;

                                        const parts = line.split(',');
                                        if (parts.length >= 1) {
                                            const username = parts[finalIdIdx]?.trim();
                                            const name = parts[finalNameIdx]?.trim();
                                            const email = parts[finalEmailIdx]?.trim();

                                            if (name) {
                                                students.push({
                                                    name,
                                                    email: email || undefined,
                                                    username: username || undefined
                                                });
                                            }
                                        }
                                    }

                                    if (students.length > 0) {
                                        try {
                                            await api.post(`/section/${showBulkUploadModal.sectionId}/students/bulk`, { students });
                                            alert(`Successfully processed ${students.length} students.`);
                                            setShowBulkUploadModal(null);
                                            // Refresh data
                                            window.location.reload();
                                        } catch (error) {
                                            console.error('Bulk upload failed', error);
                                            alert('Failed to upload students. Please check the file format.');
                                        }
                                    } else {
                                        alert('No valid students found in the file.');
                                    }
                                }}
                            />
                            <label
                                htmlFor="bulk-upload-input"
                                className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                                Select File
                            </label>
                        </div>
                        <div className="p-6 bg-white">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Template</h4>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-green-600 w-6 h-6" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">student_import_template.csv</p>
                                        <p className="text-xs text-gray-400">Student ID, Name, Email</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const csvContent = "data:text/csv;charset=utf-8,Student ID,Name,Email\nSTU001,John Doe,john@example.com";
                                        const encodedUri = encodeURI(csvContent);
                                        const link = document.createElement("a");
                                        link.setAttribute("href", encodedUri);
                                        link.setAttribute("download", "student_import_template.csv");
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="text-blue-600 hover:underline text-xs font-bold"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                            <button
                                onClick={() => setShowBulkUploadModal(null)}
                                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Roster Modal */}
            {showRosterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-[#0d1b17]">{showRosterModal.sectionName} — Roster</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Manage student onboarding details, track milestones, and reset credentials.</p>
                            </div>
                            <button onClick={() => setShowRosterModal(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[450px] overflow-y-auto">
                            {showRosterModal.students.length > 0 ? (
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                            <th className="pb-3 w-1/6">Student ID</th>
                                            <th className="pb-3 w-1/4">Name</th>
                                            <th className="pb-3 w-1/4">Email</th>
                                            <th className="pb-3 w-1/6 text-center">Milestone Status</th>
                                            <th className="pb-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {showRosterModal.students.map((student) => {
                                            const status = getStudentStatus(student.id);
                                            return (
                                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-3.5 font-mono text-xs text-gray-600 font-bold">
                                                        {student.username || student.id.substring(0, 8).toUpperCase()}
                                                    </td>
                                                    <td className="py-3.5 font-bold text-[#0d1b17]">{student.name}</td>
                                                    <td className="py-3.5 text-gray-600 font-medium">
                                                        {student.email || <span className="text-gray-400 italic">No email</span>}
                                                    </td>
                                                    <td className="py-3.5 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(status)}`}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 text-right flex items-center justify-end gap-2">
                                                        <Link
                                                            to={`/admin/performance?studentId=${student.id}`}
                                                            className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors flex items-center gap-1"
                                                        >
                                                            <Activity className="w-3 h-3" />
                                                            Performance
                                                        </Link>
                                                        <button
                                                            onClick={async () => {
                                                                const newPin = prompt(`Enter a new password/PIN for ${student.name} (leave empty to reset to default "1234"):`);
                                                                if (newPin === null) return; // user cancelled
                                                                
                                                                try {
                                                                    await api.patch(`/section/${showRosterModal.sectionId}/students/${student.id}/reset-password`, {
                                                                        password: newPin || '1234'
                                                                    });
                                                                    alert(`Successfully reset password for ${student.name} to "${newPin || '1234'}".`);
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    alert(`Failed to reset password: ${err instanceof Error ? err.message : 'Unknown error'}`);
                                                                }
                                                            }}
                                                            className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors"
                                                        >
                                                            Reset PIN
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    No students enrolled in this section.
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50">
                            <button
                                onClick={() => setShowRosterModal(null)}
                                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Master Roster Import Modal */}
            {showMasterUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-[#0d1b17]">Import Master Roster</h3>
                                <p className="text-xs text-gray-500 mt-1">Upload a master CSV sheet of students across multiple cohorts and sections.</p>
                            </div>
                            <button onClick={() => setShowMasterUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 bg-amber-50 border-b border-amber-100/55 flex gap-3 text-amber-800 text-xs">
                            <span className="font-bold text-sm">⚠️</span>
                            <div>
                                <span className="font-bold">Cohort Creation Reminder</span>: If a cohort (intake) specified in the sheet does not exist in the database, the system will automatically create it as <span className="font-bold">ACTIVE</span> with no end date. Remember to configure their start/end dates under Intake Management later.
                            </div>
                        </div>
                        <div className="p-8 flex flex-col items-center justify-center gap-4 border-b border-gray-100 bg-gray-50/50">
                            <div className="w-16 h-16 bg-[#0d1b17]/5 text-[#0d1b17] rounded-full flex items-center justify-center mb-2">
                                <CloudUpload className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">CSV (max 5MB)</p>
                            </div>
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                id="master-upload-input"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    try {
                                        const text = await file.text();
                                        const lines = text.split('\n');
                                        const students: { studentId?: string; name: string; email?: string; intakeName: string; sectionName: string }[] = [];

                                        if (lines.length < 2) {
                                            alert('The file is empty.');
                                            return;
                                        }

                                        // Parse headers
                                        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
                                        const idIndex = headers.findIndex(h => h.includes('id') || h.includes('username') || h.includes('registration'));
                                        const nameIndex = headers.findIndex(h => h.includes('name') || h.includes('student name'));
                                        const emailIndex = headers.findIndex(h => h.includes('email') || h.includes('student email'));
                                        const intakeIndex = headers.findIndex(h => h.includes('intake') || h.includes('cohort'));
                                        const sectionIndex = headers.findIndex(h => h.includes('section'));

                                        // Fallback if index not found
                                        const finalIdIdx = idIndex !== -1 ? idIndex : 0;
                                        const finalNameIdx = nameIndex !== -1 ? nameIndex : 1;
                                        const finalEmailIdx = emailIndex !== -1 ? emailIndex : 2;
                                        const finalIntakeIdx = intakeIndex !== -1 ? intakeIndex : 3;
                                        const finalSectionIdx = sectionIndex !== -1 ? sectionIndex : 4;

                                        for (let i = 1; i < lines.length; i++) {
                                            const line = lines[i].trim();
                                            if (!line) continue;

                                            const parts = line.split(',');
                                            const studentId = parts[finalIdIdx]?.trim();
                                            const name = parts[finalNameIdx]?.trim();
                                            const email = parts[finalEmailIdx]?.trim();
                                            const intakeName = parts[finalIntakeIdx]?.trim();
                                            const sectionName = parts[finalSectionIdx]?.trim();

                                            if (name && intakeName && sectionName) {
                                                students.push({
                                                    studentId: studentId || undefined,
                                                    name,
                                                    email: email || undefined,
                                                    intakeName,
                                                    sectionName
                                                });
                                            }
                                        }

                                        if (students.length > 0) {
                                            if (user?.institutionId) {
                                                await api.post(`/institution/${user.institutionId}/students/import-master`, { students });
                                                alert(`Successfully imported ${students.length} students across cohorts and sections.`);
                                                setShowMasterUploadModal(false);
                                                window.location.reload();
                                            } else {
                                                alert('Error: No active institution scope found.');
                                            }
                                        } else {
                                            alert('No valid rows found in the CSV. Make sure headers for "Name", "Intake", and "Section" exist.');
                                        }
                                    } catch (error) {
                                        console.error('Master import failed', error);
                                        alert('Failed to import master roster. Check console for details.');
                                    }
                                }}
                            />
                            <label
                                htmlFor="master-upload-input"
                                className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                                Select File
                            </label>
                        </div>
                        <div className="p-6 bg-white">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Template</h4>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-green-600 w-6 h-6" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">master_roster_template.csv</p>
                                        <p className="text-xs text-gray-400">Student ID, Student Name, Student Email, Intake, Section</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const csvContent = "data:text/csv;charset=utf-8,Student ID,Student Name,Student Email,Intake,Section\nSTU001,John Doe,john@example.com,Cohort Jan 2026,Section A\nSTU002,Jane Smith,jane@example.com,Cohort Jan 2026,Section B";
                                        const encodedUri = encodeURI(csvContent);
                                        const link = document.createElement("a");
                                        link.setAttribute("href", encodedUri);
                                        link.setAttribute("download", "master_roster_template.csv");
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="text-blue-600 hover:underline text-xs font-bold"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                            <button
                                onClick={() => setShowMasterUploadModal(false)}
                                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Intake Dates Modal */}
            {editIntakeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-[#0d1b17]">Edit Cohort Dates</h3>
                                <p className="text-xs text-gray-500 mt-1">Update the start and end dates for cohort <span className="font-bold text-[#0d1b17]">{editIntakeModal.name}</span>.</p>
                            </div>
                            <button onClick={() => setEditIntakeModal(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    await api.patch(`/intake/${editIntakeModal.id}`, {
                                        startDate: new Date(editIntakeModal.startDate).toISOString(),
                                        endDate: editIntakeModal.endDate ? new Date(editIntakeModal.endDate).toISOString() : null,
                                    });
                                    alert('Cohort dates updated successfully.');
                                    setEditIntakeModal(null);
                                    window.location.reload();
                                } catch (err) {
                                    console.error('Failed to update cohort dates', err);
                                    alert('Failed to update cohort dates.');
                                }
                            }}
                            className="p-6 flex flex-col gap-4"
                        >
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none text-gray-600"
                                    value={editIntakeModal.startDate}
                                    onChange={(e) => setEditIntakeModal({ ...editIntakeModal, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-bold text-gray-700">End Date</label>
                                    <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1 py-0.5 rounded border border-amber-100 animate-pulse">Required for accurate tracking</span>
                                </div>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none text-gray-600"
                                    value={editIntakeModal.endDate}
                                    onChange={(e) => setEditIntakeModal({ ...editIntakeModal, endDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditIntakeModal(null)}
                                    className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#0d1b17] text-white font-bold rounded-lg hover:bg-[#1a2e28] shadow-lg shadow-[#0d1b17]/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstitutionIntakes;

