"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthContext } from '@/context/AuthContext';

interface DisciplineRecord {
    id: string;
    type: 'Merit' | 'Sanction' | 'Report';
    category: string;
    description: string;
    date: string;
    severity?: string;
    points?: number;
    status: string;
    actionTaken?: string;
    reportedBy: string;
}

export default function StudentDisciplinePage() {
    const params = useParams();
    const schoolId = params.id as string;
    const { user } = useAuthContext();

    const [points, setPoints] = useState(100);
    const [records, setRecords] = useState<DisciplineRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'merits' | 'sanctions'>('all');

    useEffect(() => {
        const fetchData = async () => {
            const studentRecordId = (user as { studentRecordId?: string })?.studentRecordId;
            if (!studentRecordId) {
                setError('Student record not linked. Please contact your administrator.');
                setIsLoading(false);
                return;
            }
            try {
                const res = await api.get(`/discipline/student/${studentRecordId}`);
                setPoints(res.data.points ?? 100);
                setRecords(res.data.records || []);
            } catch {
                setError('Unable to load your discipline records.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user, schoolId]);

    const filtered = records.filter(r => {
        if (activeTab === 'all') return true;
        if (activeTab === 'merits') return r.type === 'Merit';
        return r.type === 'Sanction' || r.type === 'Report';
    });

    const merits = records.filter(r => r.type === 'Merit').length;
    const sanctions = records.filter(r => r.type !== 'Merit').length;

    const pointsColor = points >= 80 ? 'from-emerald-500 to-teal-600' : points >= 50 ? 'from-amber-500 to-orange-600' : 'from-red-500 to-rose-600';
    const pointsLabel = points >= 80 ? 'Excellent' : points >= 50 ? 'Good Standing' : 'At Risk';
    const pointsTextColor = points >= 80 ? 'text-emerald-600' : points >= 50 ? 'text-amber-600' : 'text-red-600';
    const pointsBg = points >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20' : points >= 50 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20';

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center py-16">
                <span className="material-symbols-outlined text-6xl text-gray-300 block mb-4">gavel</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Records Unavailable</h2>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Conduct Record</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">Your discipline points and behavior history.</p>
            </div>

            {/* Points Hero */}
            <div className={`bg-gradient-to-br ${pointsColor} rounded-3xl p-8 text-white relative overflow-hidden shadow-xl`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="relative z-10 flex items-center gap-6">
                    <div className="relative">
                        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                            <circle
                                cx="50" cy="50" r="42" fill="none"
                                stroke="white" strokeWidth="10"
                                strokeDasharray={`${2 * Math.PI * 42}`}
                                strokeDashoffset={`${2 * Math.PI * 42 * (1 - points / 100)}`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black">{points}</span>
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">/ 100</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">Conduct Points</p>
                        <h2 className="text-3xl font-black">{pointsLabel}</h2>
                        <p className="text-white/70 text-sm mt-2">
                            {records.length} total incident{records.length !== 1 ? 's' : ''} recorded
                        </p>
                    </div>
                </div>
                <span className="material-symbols-outlined absolute bottom-4 right-6 text-[80px] text-white/10">shield_person</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className={`${pointsBg} rounded-2xl p-4 text-center`}>
                    <div className={`text-2xl font-black ${pointsTextColor}`}>{points}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Current Points</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{merits}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Merits Awarded</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-red-600 dark:text-red-400">{sanctions}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Sanctions</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
                {([['all', 'All Records'], ['merits', '🏆 Merits'], ['sanctions', '⚠️ Sanctions']] as const).map(([tab, label]) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Records */}
            <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">verified</span>
                        <p className="font-medium">No records found.</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {activeTab === 'merits' ? 'No merits have been recorded yet. Keep up the good work!' :
                             activeTab === 'sanctions' ? 'No sanctions on record. Excellent behavior!' :
                             'No discipline records found.'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {filtered.map((record) => {
                            const isMerit = record.type === 'Merit';
                            return (
                                <div key={record.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isMerit ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                        <span className={`material-symbols-outlined text-[20px] ${isMerit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {isMerit ? 'stars' : 'gavel'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${isMerit ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {record.type}
                                            </span>
                                            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{record.category}</span>
                                            {record.severity && (
                                                <span className="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">{record.severity}</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1.5 font-medium">{record.description}</p>
                                        {record.actionTaken && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                <span className="font-medium">Action taken:</span> {record.actionTaken}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1.5">
                                            Reported by {record.reportedBy} · {new Date(record.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        {record.points ? (
                                            <span className={`text-sm font-bold ${isMerit ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {isMerit ? '+' : '-'}{record.points} pts
                                            </span>
                                        ) : null}
                                        <div className={`mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-center ${
                                            record.status === 'Resolved'
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                                        }`}>
                                            {record.status}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
