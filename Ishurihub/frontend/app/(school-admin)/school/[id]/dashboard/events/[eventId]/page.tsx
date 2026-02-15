'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface EventOccurrence {
    id: string;
    date: string;
    status: string;
}

interface SchoolEvent {
    id: string;
    title: string;
    description: string;
    eventType: string;
    isRecurring: boolean;
    occurrences: EventOccurrence[];
}

export default function EventDetailsPage({ params }: { params: { schoolId: string; eventId: string } }) {
    const { schoolId, eventId } = params;
    const { token } = useAuth();
    const [event, setEvent] = useState<SchoolEvent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token && eventId) {
            // Fetch event and occurrences
            Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/occurrences`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ])
                .then(async ([resEvent, resOccurrences]) => {
                    if (!resEvent.ok) throw new Error('Failed to fetch event');
                    const eventData = await resEvent.json();

                    let occurrencesData = [];
                    if (resOccurrences.ok) {
                        occurrencesData = await resOccurrences.json();
                    }

                    setEvent({ ...eventData, occurrences: Array.isArray(occurrencesData) ? occurrencesData : [] });
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [token, eventId]);

    if (loading) return (
        <div className="flex items-center justify-center p-12 min-h-screen bg-[#0f172a]">
            <div className="flex flex-col items-center gap-3">
                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm">Loading details...</p>
            </div>
        </div>
    );

    if (!event) return (
        <div className="p-12 text-center min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
            <div className="size-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gray-500 text-3xl">event_busy</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
            <Link href={`/school/${schoolId}/dashboard/events`} className="text-primary hover:text-white transition-colors">
                ← Back to Events
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] p-6">
            <div className="max-w-5xl mx-auto">
                <Link
                    href={`/school/${schoolId}/dashboard/events`}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors group"
                >
                    <span className="material-symbols-outlined rounded-full p-1 bg-slate-800 group-hover:bg-primary group-hover:text-white transition-colors text-lg">arrow_back</span>
                    Back to Events
                </Link>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column: Event Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-purple-500"></div>
                            <div className="p-8">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex gap-2 mb-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                                {event.eventType}
                                            </span>
                                            {event.isRecurring && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    <span className="material-symbols-outlined text-[14px]">autorenew</span>
                                                    Recurring
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">{event.title}</h1>
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none text-gray-300 bg-[#0f172a] p-6 rounded-xl border border-slate-700/50">
                                    {event.description || <span className="italic text-gray-500">No description provided.</span>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">calendar_month</span>
                                Occurrences
                            </h2>
                            <div className="grid gap-3">
                                {event.occurrences?.map((occurrence) => (
                                    <div
                                        key={occurrence.id}
                                        className="group flex flex-col sm:flex-row justify-between items-center bg-[#1e293b] p-4 rounded-xl border border-slate-700/50 hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                                            <div className="size-12 rounded-lg bg-slate-800 flex flex-col items-center justify-center border border-slate-700 text-gray-300">
                                                <span className="text-xs font-bold uppercase">{new Date(occurrence.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                                <span className="text-lg font-bold text-white">{new Date(occurrence.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">
                                                    {new Date(occurrence.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric' })}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`size-2 rounded-full ${occurrence.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{occurrence.status || 'SCHEDULED'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-auto">
                                            <Link
                                                href={`/school/${schoolId}/dashboard/events/attendance/${occurrence.id}`}
                                                className="block w-full sm:w-auto text-center bg-slate-800 hover:bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-700 hover:border-primary transition-all shadow-sm"
                                            >
                                                Take Attendance
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {!event.occurrences?.length && (
                                    <div className="text-center p-8 bg-[#1e293b] rounded-xl border border-slate-700/50 border-dashed">
                                        <p className="text-gray-400">No occurrences found for this event.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats or Actions */}
                    <div className="space-y-6">
                        <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full text-left px-4 py-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-gray-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-3">
                                    <span className="material-symbols-outlined">edit</span>
                                    Edit Event
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-xl bg-[#0f172a] hover:bg-red-500/10 text-gray-300 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-colors flex items-center gap-3">
                                    <span className="material-symbols-outlined">delete</span>
                                    Delete Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
