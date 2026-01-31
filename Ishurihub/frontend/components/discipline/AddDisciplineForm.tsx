"use client";

import { useState } from 'react';
import { DisciplineType, SeverityLevel, DisciplineRecord } from '@/data/discipline';
import { Student } from '@/data/students';

interface AddDisciplineFormProps {
    onClose: () => void;
    onSubmit: (data: Omit<DisciplineRecord, 'id'>) => void;
    students: Student[];
}

export default function AddDisciplineForm({ onClose, onSubmit, students }: AddDisciplineFormProps) {
    const [formData, setFormData] = useState({
        studentId: '',
        type: 'Merit' as DisciplineType,
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        severity: 'Low' as SeverityLevel,
        points: 0,
        actionTaken: '',
        status: 'Pending' as const,
        reportedBy: 'School Admin' // Mocked default
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate required fields
        if (!formData.studentId || !formData.category || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        console.log('Submitting Form Data:', formData);
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Record</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Student Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student</label>
                        <select
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        >
                            <option value="">Select a student...</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.name} ({student.grade})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Record Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Record Type</label>
                        <div className="flex gap-4">
                            {(['Merit', 'Sanction', 'Report'] as const).map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type}
                                        checked={formData.type === type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as DisciplineType })}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Category & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <input
                                type="text"
                                placeholder={formData.type === 'Merit' ? 'e.g. Volunteering' : 'e.g. Late Arrival'}
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Details of the incident or achievement..."
                            required
                        ></textarea>
                    </div>

                    {/* Conditional Fields: Sanction (Severity, Action) / Merit (Points) */}
                    {formData.type === 'Sanction' && (
                        <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity</label>
                                <select
                                    value={formData.severity}
                                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as SeverityLevel })}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                >
                                    {['Low', 'Medium', 'High', 'Critical'].map(lvl => (
                                        <option key={lvl} value={lvl}>{lvl}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action Taken</label>
                                <input
                                    type="text"
                                    value={formData.actionTaken}
                                    onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="e.g. Detention assigned, Verbal warning"
                                />
                            </div>
                        </div>
                    )}

                    {formData.type === 'Merit' && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Save Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
