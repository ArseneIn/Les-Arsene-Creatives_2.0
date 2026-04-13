"use client";

import { useState, useEffect, useCallback } from 'react';
import DisciplineList from '@/components/discipline/DisciplineList';
import AddDisciplineForm from '@/components/discipline/AddDisciplineForm';
import DisciplineKiosk from '@/components/discipline/DisciplineKiosk';
import { Student } from '@/data/students';
import { DisciplineRecord } from '@/data/discipline';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface Analytics {
    total: number;
    sanctions: number;
    merits: number;
    pending: number;
    resolved: number;
    topCategories: { category: string; count: number }[];
    atRiskStudents: { id: string; name: string; grade: string; points: number }[];
    monthlyData: { month: string; sanctions: number; merits: number }[];
}

export default function DisciplinePage() {
    const [records, setRecords] = useState<DisciplineRecord[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isKioskOpen, setIsKioskOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'at-risk'>('overview');
    const params = useParams();
    const schoolId = params.id as string;

    const fetchData = useCallback(async () => {
        if (!schoolId) return;
        try {
            const [recordsRes, studentsRes, analyticsRes] = await Promise.all([
                api.get('/discipline', { params: { schoolId } }),
                api.get('/students', { params: { schoolId } }),
                api.get('/discipline/analytics', { params: { schoolId } }),
            ]);
            setRecords(recordsRes.data);
            setStudents(studentsRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }, [schoolId]);

    useEffect(() => { void fetchData(); }, [fetchData]);

    const handleAddRecord = async (data: Omit<DisciplineRecord, 'id'>) => {
        try {
            await api.post('/discipline', { ...data, schoolId });
            await fetchData();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to add record:", error);
        }
    };

    const statCards = [
        { label: 'Total Records', value: analytics?.total ?? 0, icon: 'assignment', color: 'from-blue-500 to-blue-600', light: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
        { label: 'Sanctions', value: analytics?.sanctions ?? 0, icon: 'gavel', color: 'from-red-500 to-red-600', light: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
        { label: 'Merit Awards', value: analytics?.merits ?? 0, icon: 'stars', color: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Pending Review', value: analytics?.pending ?? 0, icon: 'pending', color: 'from-amber-500 to-amber-600', light: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discipline & Conduct</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">Monitor student behavior records, merits, and sanctions.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsKioskOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 font-medium"
                    >
                        <span className="material-symbols-outlined text-[20px]">contactless</span>
                        <span className="hidden sm:inline">Kiosk Mode</span>
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 font-medium"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="hidden sm:inline">Add Record</span>
                    </button>
                </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(({ label, value, icon, light, text }) => (
                    <div key={label} className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl ${light} flex items-center justify-center mb-3`}>
                            <span className={`material-symbols-outlined text-[22px] ${text}`}>{icon}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
                {(['overview', 'records', 'at-risk'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                            activeTab === tab
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        {tab === 'at-risk' ? '⚠️ At Risk' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Infraction Categories */}
                    <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Infraction Categories</h3>
                        {analytics.topCategories.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-6">No data yet</p>
                        ) : (
                            <div className="space-y-3">
                                {analytics.topCategories.map(({ category, count }, i) => {
                                    const pct = Math.round((count / analytics.total) * 100);
                                    const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-blue-500', 'bg-purple-500'];
                                    return (
                                        <div key={category}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 dark:text-gray-300 font-medium">{category}</span>
                                                <span className="text-gray-500">{count} records</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${colors[i]}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Trend (6 months)</h3>
                        <div className="space-y-3">
                            {analytics.monthlyData.map(({ month, sanctions, merits }) => (
                                <div key={month} className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 w-20 shrink-0">{month}</span>
                                    <div className="flex-1 flex gap-1 h-6 items-end">
                                        <div className="relative flex-1 bg-gray-100 dark:bg-gray-700 rounded h-5 overflow-hidden flex">
                                            <div className="bg-red-400 h-full transition-all" style={{ width: `${Math.min(100, sanctions * 10)}%` }} title={`${sanctions} sanctions`} />
                                            <div className="bg-emerald-400 h-full transition-all" style={{ width: `${Math.min(100 - sanctions * 10, merits * 10)}%` }} title={`${merits} merits`} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 text-xs text-gray-500 shrink-0">
                                        <span className="text-red-500">{sanctions}S</span>
                                        <span className="text-emerald-500">{merits}M</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-3 text-xs">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-400"/><span className="text-gray-500">Sanctions</span></div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-400"/><span className="text-gray-500">Merits</span></div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'records' && (
                <>
                    {records.length === 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl flex items-center gap-2">
                            <span className="material-symbols-outlined">info</span>
                            <span>No discipline records found. Add a new record to get started.</span>
                        </div>
                    )}
                    <DisciplineList records={records} />
                </>
            )}

            {activeTab === 'at-risk' && analytics && (
                <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">warning</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Students At Risk (Points &lt; 40)</h3>
                        <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                            {analytics.atRiskStudents.length}
                        </span>
                    </div>
                    {analytics.atRiskStudents.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <span className="material-symbols-outlined text-4xl text-green-400 block mb-2">check_circle</span>
                            No students are currently at risk. Great work!
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {analytics.atRiskStudents.map((student) => {
                                const pct = student.points;
                                const color = pct < 20 ? 'bg-red-500' : 'bg-orange-500';
                                return (
                                    <div key={student.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-bold text-sm">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{student.name}</p>
                                            <p className="text-xs text-gray-500">{student.grade}</p>
                                        </div>
                                        <div className="w-32">
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                                                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                                            </div>
                                            <p className="text-xs text-right text-gray-500">{pct}/100 pts</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            {isAddModalOpen && (
                <AddDisciplineForm onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddRecord} students={students} />
            )}
            {isKioskOpen && (
                <DisciplineKiosk onClose={() => setIsKioskOpen(false)} onSuccess={fetchData} />
            )}
        </div>
    );
}
