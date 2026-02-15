'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        schoolId: schoolId,
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
        <div className="min-h-screen bg-[#0f172a] p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href={`/school/${schoolId}/dashboard/events`}
                        className="p-2 rounded-full hover:bg-slate-800 text-gray-400 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Create New Event</h1>
                        <p className="text-gray-400 text-sm">Schedule a school-wide or class-specific event</p>
                    </div>
                </div>

                <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 opacity-20"></div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Info Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-700 pb-2">
                                <span className="material-symbols-outlined text-primary">info</span>
                                Event Details
                            </h2>

                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Event Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Annual Sports Day"
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Event Type</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                value={formData.eventType}
                                                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                            >
                                                <option value="ACADEMIC">Academic</option>
                                                <option value="SPORTS">Sports</option>
                                                <option value="CULTURAL">Cultural</option>
                                                <option value="ADMINISTRATIVE">Administrative</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-3 text-gray-500 pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Audience</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                value={formData.targetAudience}
                                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                            >
                                                <option value="ALL">Whole School</option>
                                                <option value="STUDENTS">Students Only</option>
                                                <option value="TEACHERS">Teachers Only</option>
                                                <option value="PARENTS">Parents Only</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-3 text-gray-500 pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                    <textarea
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y min-h-[100px]"
                                        placeholder="Describe the event details..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Schedule Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-700 pb-2">
                                <span className="material-symbols-outlined text-primary">calendar_month</span>
                                Date & Time
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Starts</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="date"
                                                required
                                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            />
                                            <input
                                                type="time"
                                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ends</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="date"
                                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            />
                                            <input
                                                type="time"
                                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                value={formData.endTime}
                                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-700 pb-2">
                                <span className="material-symbols-outlined text-primary">settings</span>
                                Settings
                            </h2>

                            <div className="grid gap-4">
                                {/* Detailed Toggle for Recurring */}
                                <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.isRecurring ? 'bg-primary/10 border-primary/50' : 'bg-[#0f172a] border-slate-700 hover:border-slate-600'}`}
                                    onClick={() => setFormData({ ...formData, isRecurring: !formData.isRecurring })}
                                >
                                    <div className={`mt-1 flex items-center justify-center size-5 rounded border ${formData.isRecurring ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                                        {formData.isRecurring && <span className="material-symbols-outlined text-white text-xs">check</span>}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium">Recurring Event</h3>
                                        <p className="text-sm text-gray-400">Repeats on a schedule (e.g. Daily Assembly, Weekly Mass)</p>

                                        {formData.isRecurring && (
                                            <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                                                <div className="relative max-w-xs">
                                                    <select
                                                        className="w-full bg-[#1e293b] border border-slate-600 rounded-lg p-2 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                                        value={formData.recurrencePattern.type}
                                                        onChange={(e) => setFormData({ ...formData, recurrencePattern: { ...formData.recurrencePattern, type: e.target.value } })}
                                                    >
                                                        <option value="DAILY">Repeat Daily</option>
                                                        <option value="WEEKLY">Repeat Weekly</option>
                                                        <option value="MONTHLY">Repeat Monthly</option>
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-2 top-2 text-gray-400 text-sm pointer-events-none">expand_more</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Detailed Toggle for Mandatory */}
                                <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.isMandatory ? 'bg-red-500/10 border-red-500/50' : 'bg-[#0f172a] border-slate-700 hover:border-slate-600'}`}
                                    onClick={() => setFormData({ ...formData, isMandatory: !formData.isMandatory })}
                                >
                                    <div className={`mt-1 flex items-center justify-center size-5 rounded border ${formData.isMandatory ? 'bg-red-500 border-red-500' : 'border-gray-500'}`}>
                                        {formData.isMandatory && <span className="material-symbols-outlined text-white text-xs">check</span>}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium">Mandatory Attendance</h3>
                                        <p className="text-sm text-gray-400">Students are required to attend and must be scanned in.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-700">
                            <Link
                                href={`/school/${schoolId}/dashboard/events`}
                                className="px-6 py-2.5 rounded-xl text-gray-300 hover:bg-slate-700 hover:text-white font-medium transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">add_circle</span>
                                        Create Event
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
