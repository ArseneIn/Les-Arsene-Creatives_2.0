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
        <div className="p-6 space-y-8 bg-gray-50 dark:bg-[#0f172a] min-h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">My Conduct Record</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Your discipline points and behavior history.</p>
                </div>
            </div>

            {/* Points Hero */}
            <div className={`bg-gradient-to-br ${pointsColor} rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-primary/20`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="relative z-10 flex items-center gap-6">
                    <div className="relative">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                            <circle
                                cx="50" cy="50" r="42" fill="none"
                                stroke="white" strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 42}`}
                                strokeDashoffset={`${2 * Math.PI * 42 * (1 - points / 100)}`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black">{points}</span>
                            <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">/ 100</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">Conduct Points</p>
                        <h2 className="text-2xl font-black">{pointsLabel}</h2>
                        <p className="text-white/70 text-xs mt-2 font-medium">
                            {records.length} total incident{records.length !== 1 ? 's' : ''} recorded
                        </p>
                    </div>
                </div>
                <span className="material-symbols-outlined absolute bottom-4 right-6 text-[80px] text-white/10">shield_person</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Current Points */}
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 ${pointsBg} ${pointsTextColor} rounded-xl group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined">shield_person</span>
                        </div>
                        <span className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-lg ${pointsBg} ${pointsTextColor}`}>
                            {pointsLabel}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Points</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{points}</h3>
                    </div>
                </div>

                {/* Card 2: Merits */}
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-emerald-500/20 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">stars</span>
                        </div>
                        <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                            Positive
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Merits Awarded</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{merits}</h3>
                    </div>
                </div>

                {/* Card 3: Sanctions */}
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-rose-500/20 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">gavel</span>
                        </div>
                        <span className="flex items-center text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-lg">
                            Incidents
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sanctions & Reports</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{sanctions}</h3>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-xl p-1 w-fit border border-gray-200/50 dark:border-white/5">
                {([['all', 'All Records'], ['merits', '🏆 Merits'], ['sanctions', '⚠️ Sanctions']] as const).map(([tab, label]) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === tab
                                ? 'bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Records List Container */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">verified</span>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">No records found.</p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                            {activeTab === 'merits' ? 'No merits have been recorded yet. Keep up the good work!' :
                             activeTab === 'sanctions' ? 'No sanctions on record. Excellent behavior!' :
                             'No discipline records found.'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {filtered.map((record) => {
                            const isMerit = record.type === 'Merit';
                            return (
                                <div key={record.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isMerit ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                        <span className={`material-symbols-outlined text-[20px] ${isMerit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {isMerit ? 'stars' : 'gavel'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${isMerit ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {record.type}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{record.category}</span>
                                            {record.severity && (
                                                <span className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">{record.severity}</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-2 font-medium">{record.description}</p>
                                        {record.actionTaken && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                <span className="font-medium">Action taken:</span> {record.actionTaken}
                                            </p>
                                        )}
                                        <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                            Reported by {record.reportedBy} · {new Date(record.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        {record.points ? (
                                            <span className={`text-sm font-bold ${isMerit ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {isMerit ? '+' : '-'}{record.points} pts
                                            </span>
                                        ) : null}
                                        <div className={`mt-1.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full text-center ${
                                            record.status === 'Resolved'
                                                ? 'bg-gray-100 dark:bg-white/5 text-gray-500'
                                                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600'
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
