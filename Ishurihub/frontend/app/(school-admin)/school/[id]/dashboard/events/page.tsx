'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface SchoolEvent {
    id: string;
    title: string;
    eventType: string;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
}

export default function EventsPage({ params }: { params: { schoolId: string } }) {
    const { schoolId } = params;
    const { token } = useAuth();
    const [events, setEvents] = useState<SchoolEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token && schoolId && schoolId !== 'undefined') {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?schoolId=${schoolId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        console.error('Fetch Error Response:', res.status, res.statusText, errData);
                        throw new Error(`Failed to fetch events: ${res.status} ${JSON.stringify(errData)}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    if (Array.isArray(data)) {
                        setEvents(data);
                    } else {
                        console.error('Events data is not an array:', data);
                        setEvents([]);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setEvents([]);
                    setLoading(false);
                });
        }
    }, [token, schoolId]);

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm">Loading events...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Events</h1>
                    <p className="text-gray-400 mt-1">Manage school events, assemblies, and activities</p>
                </div>
                <Link
                    href={`/school/${schoolId}/dashboard/events/create`}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Create Event
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(events) && events.map((event) => (
                    <Link
                        key={event.id}
                        href={`/school/${schoolId}/dashboard/events/${event.id}`}
                        className="group bg-[#1e293b] rounded-2xl border border-slate-700/50 hover:border-primary/50 overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 relative"
                    >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-primary w-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-gray-300 border border-slate-700">
                                    {event.eventType}
                                </span>
                                {event.isRecurring && (
                                    <span className="material-symbols-outlined text-blue-400 text-lg" title="Recurring Event">
                                        autorenew
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">{event.title}</h3>

                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                <span className="material-symbols-outlined text-gray-500 text-lg">event</span>
                                <span>{new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                <span className="text-xs font-medium text-gray-500 hover:text-white transition-colors">View Details →</span>
                            </div>
                        </div>
                    </Link>
                ))}
                {events.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
                        <div className="size-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-gray-500 text-3xl">event_busy</span>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">No events found</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">Get started by creating your first school event.</p>
                        <Link
                            href={`/school/${schoolId}/dashboard/events/create`}
                            className="text-primary hover:text-white font-medium text-sm transition-colors"
                        >
                            Create New Event
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
