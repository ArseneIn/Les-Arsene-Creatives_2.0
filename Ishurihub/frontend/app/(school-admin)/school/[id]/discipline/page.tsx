"use client";

import { useState, useEffect, useCallback } from 'react';
import DisciplineList from '@/components/discipline/DisciplineList';
import AddDisciplineForm from '@/components/discipline/AddDisciplineForm';
import { DisciplineRecord } from '@/data/discipline';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function DisciplinePage() {
    const [records, setRecords] = useState<DisciplineRecord[]>([]);
    const [students, setStudents] = useState<any[]>([]); // Using any for Student to avoid importing conflicts if strictly typed
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const params = useParams();
    const schoolId = params.id as string;

    const fetchData = useCallback(async () => {
        if (!schoolId) return;
        try {
            const [recordsRes, studentsRes] = await Promise.all([
                api.get('/discipline', { params: { schoolId } }),
                api.get('/students', { params: { schoolId } })
            ]);
            setRecords(recordsRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddRecord = async (data: Omit<DisciplineRecord, 'id'>) => {
        try {
            await api.post('/discipline', { ...data, schoolId });
            await fetchData();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to add record:", error);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discipline & Conduct</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage student behavior records, merits, and sanctions.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span className="font-bold sm:inline">Add Record</span>
                </button>
            </div>

            {records.length === 0 && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined">info</span>
                    <span>No discipline records found. Add a new record to get started.</span>
                </div>
            )}

            <DisciplineList records={records} />

            {isAddModalOpen && (
                <AddDisciplineForm
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddRecord}
                    students={students}
                />
            )}
        </div>
    );
}
