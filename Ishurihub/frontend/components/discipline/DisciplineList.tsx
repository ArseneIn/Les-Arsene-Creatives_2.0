"use client";

import { useState } from 'react';
import { DisciplineRecord, DisciplineType } from '@/data/discipline';

interface DisciplineListProps {
    records: DisciplineRecord[];
}

export default function DisciplineList({ records }: DisciplineListProps) {
    const [filter, setFilter] = useState<DisciplineType | 'All'>('All');

    const filteredRecords = records.filter(record =>
        filter === 'All' ? true : record.type === filter
    );

    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Records</h3>

                <div className="flex gap-2">
                    {(['All', 'Merit', 'Sanction', 'Report'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === type
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action / Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((record) => {
                                const student = record.student;
                                return (
                                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                            {record.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            {student ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700"
                                                        style={{ backgroundImage: `url('${student.avatarUrl}')` }}>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{student.name}</p>
                                                        <p className="text-xs text-gray-500">{student.grade}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">Unknown Student</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${record.type === 'Merit'
                                                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                : record.type === 'Sanction'
                                                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                    : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                }`}>
                                                {record.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {record.category}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={record.description}>
                                            {record.description}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {record.actionTaken ? (
                                                <span className="text-gray-600 dark:text-gray-400">{record.actionTaken}</span>
                                            ) : (
                                                <span className={`font-bold ${record.points && record.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {record.points && record.points > 0 ? '+' : ''}{record.points} pts
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-4xl">inbox</span>
                                        <p>No records found matching this filter.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
