"use client";

import { useState } from 'react';
import DisciplineList from '@/components/discipline/DisciplineList';
import AddDisciplineForm from '@/components/discipline/AddDisciplineForm';
import { mockDisciplineRecords } from '@/data/discipline';

export default function DisciplinePage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAddRecord = (data: any) => {
        // In a real app, we would send this to an API
        console.log('New Record:', data);
        // We could also update local state here if we weren't using static mock data
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

            {/* Implementation Check */}
            {mockDisciplineRecords.length === 0 && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined">warning</span>
                    <span>No records found. Please update data/discipline.ts or add a record.</span>
                </div>
            )}

            <DisciplineList />

            {isAddModalOpen && (
                <AddDisciplineForm
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddRecord}
                />
            )}
        </div>
    );
}
