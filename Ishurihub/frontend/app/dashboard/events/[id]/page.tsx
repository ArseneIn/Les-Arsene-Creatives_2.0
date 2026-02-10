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

export default function EventDetailsPage({ params }: { params: { schoolId: string; id: string } }) {
    const { schoolId, id } = params;
    const { token } = useAuth();
    const [event, setEvent] = useState<SchoolEvent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token && id) {
            // Fetch event and occurrences
            Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}/occurrences`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ])
                .then(async ([resEvent, resOccurrences]) => {
                    const eventData = await resEvent.json();
                    const occurrencesData = await resOccurrences.json();
                    setEvent({ ...eventData, occurrences: occurrencesData });
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [token, id]);

    if (loading) return <div>Loading details...</div>;
    if (!event) return <div>Event not found</div>;

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link href={`/school/${schoolId}/dashboard/events`} className="text-gray-400 hover:text-white text-sm mb-4 block">
                    ← Back to Events
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                <div className="flex gap-2 mb-4">
                    <span className="bg-slate-700 text-white px-2 py-1 rounded text-sm">{event.eventType}</span>
                    {event.isRecurring && <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Recurring</span>}
                </div>
                <p className="text-gray-300 bg-slate-800 p-4 rounded-lg">{event.description || 'No description provided.'}</p>
            </div>

            <h2 className="text-xl font-bold text-white mb-4">Occurrences</h2>
            <div className="grid gap-4">
                {event.occurrences?.map((occurrence) => (
                    <div
                        key={occurrence.id}
                        className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700"
                    >
                        <div>
                            <p className="text-white font-medium">
                                {new Date(occurrence.date).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <p className="text-sm text-gray-400">Status: {occurrence.status}</p>
                        </div>
                        <div>
                            <Link
                                href={`/school/${schoolId}/dashboard/events/attendance/${occurrence.id}`}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition-colors text-sm"
                            >
                                Take Attendance
                            </Link>
                        </div>
                    </div>
                ))}
                {!event.occurrences?.length && (
                    <p className="text-gray-400">No occurrences found for this event.</p>
                )}
            </div>
        </div>
    );
}
