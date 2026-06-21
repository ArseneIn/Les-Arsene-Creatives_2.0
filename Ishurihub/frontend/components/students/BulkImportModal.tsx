"use client";

import { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import api from '@/lib/api';
import Modal from '@/components/Modal';

interface StudentCSVRow {
    fullName: string;
    studentId: string;
    level?: string;
    grade?: string;
    combination?: string;
    dob?: string;
    gender?: string;
    fatherName?: string;
    motherName?: string;
    primaryPhone?: string;
    emergencyPhone?: string;
    email?: string;
    cardUid?: string;
}

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    schoolId: string;
}

export default function BulkImportModal({ isOpen, onClose, onSuccess, schoolId }: BulkImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<unknown[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Global Category Selection
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");

    // Auto-set Level based on Grade
    useEffect(() => {
        if (['S1', 'S2', 'S3'].includes(selectedGrade)) {
            setSelectedLevel('O-Level');
        } else if (['S4', 'S5', 'S6'].includes(selectedGrade)) {
            setSelectedLevel('A-Level');
        } else if (!selectedGrade) {
            setSelectedLevel("");
        }
    }, [selectedGrade]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError("");
            parseFile(selectedFile);
        }
    };

    const parseFile = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length) {
                    setError(`Error parsing CSV: ${results.errors[0].message}`);
                    return;
                }
                // Validate headers
                const headers = results.meta.fields;
                // Required columns depend on whether global overrides are set
                const required = ['fullName', 'studentId'];
                if (!selectedLevel) required.push('level');
                if (!selectedGrade) required.push('grade');

                const missing = required.filter(h => !headers?.includes(h));

                if (missing.length > 0) {
                    setError(`Missing required columns: ${missing.join(', ')}. (Or select them above to make them optional in CSV)`);
                    setPreviewData([]);
                } else {
                    setPreviewData(results.data.slice(0, 5) as unknown[]); // Preview first 5
                }
            },
            error: (err) => {
                setError("Failed to read file.");
                console.error(err);
            }
        });
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const students = (results.data as StudentCSVRow[]).map((row: StudentCSVRow) => {
                    // Merge global selection with CSV data
                    const level = selectedLevel || row.level;
                    const grade = selectedGrade || row.grade;

                    return {
                        name: row.fullName,
                        studentId: row.studentId,
                        level: level,
                        year: grade, // Assuming Grade (S1) maps to Year
                        grade: grade,
                        combination: row.combination,
                        dob: row.dob || '2000-01-01',
                        gender: row.gender || 'Male',
                        fatherName: row.fatherName || 'Unknown',
                        motherName: row.motherName || 'Unknown',
                        primaryPhone: row.primaryPhone || '',
                        emergencyPhone: row.emergencyPhone || '',
                        email: row.email,
                        schoolId: schoolId,
                        status: 'Pending',
                        cardUid: row.cardUid || null,
                        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.fullName)}&background=random`
                    };
                });

                try {
                    await api.post('/students/bulk', students);
                    onSuccess();
                    onClose();
                } catch (err) {
                    setError("Failed to upload students. Check console for details.");
                    console.error(err);
                } finally {
                    setIsUploading(false);
                }
            }
        });
    };

    const downloadTemplate = () => {
        const headers = ["fullName", "studentId", "dob", "gender", "fatherName", "motherName", "primaryPhone", "emergencyPhone", "email", "cardUid"];

        // Dynamically add columns if not globally selected
        if (!selectedLevel) headers.push("level");
        if (!selectedGrade) headers.push("grade");
        if (selectedLevel === 'A-Level' || (!selectedLevel && !selectedGrade)) headers.push("combination"); // combination usually needed for A-Level

        // Reorder for better UX: essential first
        const essential = ["fullName", "studentId"];
        if (!selectedLevel) essential.push("level");
        if (!selectedGrade) essential.push("grade");

        const other = headers.filter(h => !essential.includes(h));
        const allHeaders = [...essential, ...other];

        // Sample data row
        const sampleRow = allHeaders.map(h => {
            if (h === 'fullName') return 'John Doe';
            if (h === 'studentId') return '2024-001';
            if (h === 'level') return 'O-Level';
            if (h === 'grade') return 'S1';
            if (h === 'dob') return '2010-01-01';
            if (h === 'gender') return 'Male';
            if (h === 'primaryPhone') return '0780000000';
            return '';
        });

        const csvContent = [allHeaders.join(','), sampleRow.join(',')].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_template_${selectedGrade || 'general'}.csv`;
        a.click();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Bulk Import Students">
            <div className="space-y-6">

                {/* Global Category Selectors */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Default Grade (Year)</label>
                        <select
                            value={selectedGrade}
                            onChange={(e) => {
                                setSelectedGrade(e.target.value);
                                if (file) setFile(null); // Reset file on change to force re-validation
                                setPreviewData([]);
                                setError("");
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        >
                            <option value="">-- Mixed / In CSV --</option>
                            <option value="S1">S1</option>
                            <option value="S2">S2</option>
                            <option value="S3">S3</option>
                            <option value="S4">S4</option>
                            <option value="S5">S5</option>
                            <option value="S6">S6</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Default Level</label>
                        <select
                            value={selectedLevel}
                            onChange={(e) => {
                                setSelectedLevel(e.target.value);
                                if (file) setFile(null);
                                setPreviewData([]);
                                setError("");
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        >
                            <option value="">-- Mixed / In CSV --</option>
                            <option value="O-Level">O-Level (S1-S3)</option>
                            <option value="A-Level">A-Level (S4-S6)</option>
                        </select>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20 text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-bold mb-1">Instructions:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Upload a CSV file containing student records.</li>
                        <li>
                            Required columns: <strong>fullName, studentId</strong>.
                            {!selectedLevel && <span>, <strong>level</strong></span>}
                            {!selectedGrade && <span>, <strong>grade</strong></span>}
                            .
                        </li>
                        <li>Ensure dates are in YYYY-MM-DD format.</li>
                    </ul>
                    <button onClick={downloadTemplate} className="mt-3 text-blue-600 dark:text-blue-400 underline hover:no-underline font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download Adapted CSV Template
                    </button>
                </div>

                {!file ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">upload_file</span>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">Click to select CSV file</p>
                        <p className="text-xs text-gray-400 mt-1">Maximum 5MB</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-500">description</span>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button onClick={() => { setFile(null); setPreviewData([]); setError(""); }} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        {previewData.length > 0 && !error && (
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 dark:bg-white/5 px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase">
                                    Preview (First 5 rows)
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs bg-white dark:bg-[#1e293b]">
                                        <thead>
                                            <tr className="border-b border-gray-100 dark:border-white/5">
                                                {Object.keys(previewData[0] as object).slice(0, 5).map(Key => (
                                                    <th key={Key} className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-300">{Key}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, i) => (
                                                <tr key={i} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                                                    {Object.values(row as Record<string, unknown>).slice(0, 5).map((val, j) => (
                                                        <td key={j} className="px-3 py-2 text-gray-700 dark:text-gray-400 whitespace-nowrap">{String(val ?? '')}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )} { /* ... footer ... */}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file || !!error || isUploading}
                        className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isUploading ? 'Importing...' : 'Import Students'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
