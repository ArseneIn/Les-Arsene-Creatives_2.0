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
        if (token) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    setEvents(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [token]);

    if (loading) return <div>Loading events...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Events</h1>
                <Link
                    href={`/school/${schoolId}/dashboard/events/create`}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Create Event
                </Link>
            </div>

            <div className="grid gap-4">
                {events.map((event) => (
                    <Link
                        key={event.id}
                        href={`/school/${schoolId}/dashboard/events/${event.id}`}
                        className="block bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-primary transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                                <p className="text-sm text-gray-400">{event.eventType}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-300">
                                    {new Date(event.startDate).toLocaleDateString()}
                                </p>
                                {event.isRecurring && (
                                    <span className="inline-block bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded mt-1">
                                        Recurring
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
                {events.length === 0 && (
                    <p className="text-gray-400 text-center py-8">No events found.</p>
                )}
            </div>
        </div>
    );
}
