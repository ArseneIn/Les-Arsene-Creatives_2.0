"use client";

import { useState, useEffect } from 'react';
import { DisciplineType, SeverityLevel, DisciplineRecord } from '@/data/discipline';
import { Student } from '@/data/students';
import api from '@/lib/api';
import { DisciplinePolicy } from './ConstitutionTab';

interface AddDisciplineFormProps {
    onClose: () => void;
    onSubmit: (data: Omit<DisciplineRecord, 'id'>) => void;
    students: Student[];
    schoolId?: string; // Made optional for backward compatibility if needed
}

export default function AddDisciplineForm({ onClose, onSubmit, students, schoolId }: AddDisciplineFormProps) {
    const [policies, setPolicies] = useState<DisciplinePolicy[]>([]);
    
    const [formData, setFormData] = useState({
        studentId: '',
        type: 'Sanction' as DisciplineType, // Default to sanction
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        severity: 'Low' as SeverityLevel,
        points: 0,
        actionTaken: '',
        status: 'Pending' as const,
        reportedBy: 'School Admin' // Mocked default
    });

    useEffect(() => {
        if (!schoolId) return;
        const fetchPolicies = async () => {
            try {
                const res = await api.get('/discipline/policies', { params: { schoolId } });
                setPolicies(res.data);
            } catch (err) {
                console.error("Failed to fetch policies", err);
            }
        };
        fetchPolicies();
    }, [schoolId]);

    const handlePolicySelect = (policyId: string) => {
        const policy = policies.find(p => p.id === policyId);
        if (policy) {
            setFormData({
                ...formData,
                type: policy.type as DisciplineType,
                category: policy.name,
                points: policy.points,
                severity: (policy.severity as SeverityLevel) || 'Low',
                description: policy.description || ''
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate required fields
        if (!formData.studentId || !formData.category) {
            alert('Please select a student and an infraction/merit rule.');
            return;
        }

        console.log('Submitting Form Data:', formData);
        onSubmit(formData);
        onClose();
    };

    const filteredPolicies = policies.filter(p => p.type === formData.type);

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
                        <div className="flex gap-2">
                            <select
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                className="flex-1 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            >
                                <option value="">Select a student...</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.grade})
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => {
                                    const uid = prompt("Simulate NFC Scan: Enter Card UID");
                                    if (uid) {
                                        const student = students.find(s => s.cardUid === uid);
                                        if (student) {
                                            setFormData(prev => ({ ...prev, studentId: student.id }));
                                            alert(`Found student: ${student.name}`);
                                        } else {
                                            alert("Student not found!");
                                        }
                                    }
                                }}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <span className="material-symbols-outlined">nfc</span>
                                <span className="hidden sm:inline">Scan</span>
                            </button>
                        </div>
                    </div>

                    {/* Record Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Record Type</label>
                        <div className="flex gap-4">
                            {(['Merit', 'Sanction'] as const).map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type}
                                        checked={formData.type === type}
                                        onChange={(e) => {
                                            setFormData({ ...formData, type: e.target.value as DisciplineType, category: '', points: 0 });
                                        }}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Rule Selection & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Rule</label>
                            {policies.length > 0 ? (
                                <select
                                    onChange={(e) => handlePolicySelect(e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="">-- Choose a Rule --</option>
                                    {filteredPolicies.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="e.g. Late Arrival"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            )}
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description / Notes</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Details of the incident or achievement..."
                        ></textarea>
                    </div>

                    {/* Locked Automated Fields */}
                    {formData.type === 'Sanction' && formData.category && (
                        <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                            <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Automated Penalty Locked</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-red-700/50 dark:text-red-300/50 mb-1">Severity</label>
                                    <div className="w-full p-2.5 rounded-lg border border-red-200/50 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 font-medium">
                                        {formData.severity}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-red-700/50 dark:text-red-300/50 mb-1">Points Deducted</label>
                                    <div className="w-full p-2.5 rounded-lg border border-red-200/50 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 font-bold">
                                        -{formData.points}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action Taken (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.actionTaken}
                                    onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                                    className="w-full p-2.5 rounded-lg border border-red-200 dark:border-red-800/50 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="e.g. Detention assigned, Verbal warning"
                                />
                            </div>
                        </div>
                    )}

                    {formData.type === 'Merit' && formData.category && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                             <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Automated Reward Locked</span>
                            </div>
                            <label className="block text-sm font-medium text-green-700/50 dark:text-green-300/50 mb-1">Points Awarded</label>
                            <div className="w-full p-2.5 rounded-lg border border-green-200/50 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200 font-bold">
                                +{formData.points}
                            </div>
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
