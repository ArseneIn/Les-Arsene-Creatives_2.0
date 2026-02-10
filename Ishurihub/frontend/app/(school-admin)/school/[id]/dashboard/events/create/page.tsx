'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CreateEventPage({ params }: { params: { schoolId: string } }) {
    const { schoolId } = params;
    const { token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventType: 'ACADEMIC',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        isRecurring: false,
        recurrencePattern: { type: 'DAILY' }, // Default
        isMandatory: false,
        targetAudience: 'ALL',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push(`/school/${schoolId}/dashboard/events`);
            } else {
                alert('Failed to create event');
            }
        } catch (err) {
            console.error(err);
            alert('Error creating event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Create New Event</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Title</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white mt-1"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white mt-1"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Start Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white mt-1"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">End Date</label>
                        <input
                            type="date"
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white mt-1"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Start Time</label>
                        <input
                            type="time"
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white mt-1"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">End Time</label>
                        <input
                            type="time"
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white mt-1"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700"
                    />
                    <label htmlFor="isRecurring" className="text-sm font-medium text-gray-300">Recurring Event</label>
                </div>

                {formData.isRecurring && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Recurrence Pattern</label>
                        <select
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white mt-1"
                            value={formData.recurrencePattern.type}
                            onChange={(e) => setFormData({ ...formData, recurrencePattern: { ...formData.recurrencePattern, type: e.target.value } })}
                        >
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                        </select>
                        {formData.recurrencePattern.type === 'WEEKLY' && (
                            <p className="text-xs text-yellow-500 mt-1">Note: Weekday selection not implemented in UI yet. Will recur every week.</p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isMandatory"
                        checked={formData.isMandatory}
                        onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700"
                    />
                    <label htmlFor="isMandatory" className="text-sm font-medium text-gray-300">Mandatory Attendance</label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors mt-6"
                >
                    {loading ? 'Creating...' : 'Create Event'}
                </button>
            </form>
        </div>
    );
}
