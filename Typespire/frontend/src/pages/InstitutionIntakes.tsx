import React, { useState } from 'react';
import { useInstitution, type Intake } from '../context/InstitutionContext';

const InstitutionIntakes: React.FC = () => {
    const { intakes, addIntake, addSection } = useInstitution();
    const [expandedIntake, setExpandedIntake] = useState<string | null>('1');
    const [showNewIntakeModal, setShowNewIntakeModal] = useState(false);
    const [showBulkUploadModal, setShowBulkUploadModal] = useState<{ sectionId: string, intakeName: string, sectionName: string } | null>(null);

    // Form States
    const [newIntakeName, setNewIntakeName] = useState('');
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
            startDate: '2025-09-01', // Default for mock
            endDate: '2025-12-15',
            status: 'Upcoming',
            facilitators: [],
            sections: []
        };
        addIntake(newIntake);
        setNewIntakeName('');
        setShowNewIntakeModal(false);
    };

    const handleAddSection = (intakeId: string) => {
        if (!newSectionName.trim()) return;
        addSection(intakeId, newSectionName);
        setNewSectionName('');
        setSelectedIntakeForSection(null);
    };

    return (
        <>
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-[#0d1b17] text-3xl font-bold leading-tight">Intake Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Create intakes, organize sections, and assign students.</p>
                </div>
                <button
                    onClick={() => setShowNewIntakeModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0d1b17] text-white rounded-lg text-sm font-bold hover:bg-[#1a2e28] transition-colors shadow-lg shadow-gray-200"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Intake
                </button>
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
                                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                </div>
                                <div>
                                    <h3 className="text-[#0d1b17] text-lg font-bold">{intake.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                        <span>{intake.startDate} — {intake.endDate}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span className={`${intake.status === 'Active' ? 'text-green-600' :
                                            intake.status === 'Upcoming' ? 'text-yellow-600' : 'text-gray-500'
                                            }`}>{intake.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex flex-col items-end mr-4">
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Facilitators</span>
                                    <div className="flex -space-x-2 mt-1">
                                        {intake.facilitators.length > 0 ? (
                                            intake.facilitators.map((f, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-600" title={f}>
                                                    {f.charAt(0)}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">None assigned</span>
                                        )}
                                        <button className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors" title="Assign Facilitator">
                                            <span className="material-symbols-outlined text-[14px]">add</span>
                                        </button>
                                    </div>
                                </div>
                                <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${expandedIntake === intake.id ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
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
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedIntakeForSection(intake.id)}
                                            className="text-xs font-bold text-[#0d1b17] hover:underline flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">add_circle</span>
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
                                                        <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                                                    </button>
                                                </div>
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <span className="text-2xl font-bold text-gray-800">{section.students.length}</span>
                                                        <span className="text-xs text-gray-500 ml-1">Students</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowBulkUploadModal({ sectionId: section.id, intakeName: intake.name, sectionName: section.name })}
                                                        className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded border border-gray-200 hover:bg-gray-100 hover:text-[#0d1b17] transition-colors flex items-center gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">upload_file</span>
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
                                <span className="material-symbols-outlined">close</span>
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
                                    <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none text-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">End Date</label>
                                    <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d1b17]/20 outline-none text-gray-600" />
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
                                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">CSV, Excel (max 5MB)</p>
                            </div>
                            <button className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
                                Select File
                            </button>
                        </div>
                        <div className="p-6 bg-white">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Template</h4>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-green-600">description</span>
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">student_import_template.csv</p>
                                        <p className="text-xs text-gray-400">12KB</p>
                                    </div>
                                </div>
                                <button className="text-blue-600 hover:underline text-xs font-bold">Download</button>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                            <button
                                onClick={() => setShowBulkUploadModal(null)}
                                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-[#0d1b17] text-white font-bold rounded-lg hover:bg-[#1a2e28] shadow-lg shadow-[#0d1b17]/20 opacity-50 cursor-not-allowed"
                            >
                                Upload & Process
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstitutionIntakes;

