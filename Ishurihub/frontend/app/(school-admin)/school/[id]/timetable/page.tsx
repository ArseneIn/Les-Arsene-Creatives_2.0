"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from '@/lib/api';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = [
    { id: 1, type: "class", time: "08:00 - 08:50" },
    { id: 2, type: "class", time: "08:50 - 09:40" },
    { id: 3, type: "class", time: "09:40 - 10:30" },
    { id: 4, type: "break", time: "10:30 - 10:50", label: "Break" },
    { id: 5, type: "class", time: "10:50 - 11:40" },
    { id: 6, type: "class", time: "11:40 - 12:30" },
    { id: 7, type: "break", time: "12:30 - 13:30", label: "Lunch Break" },
    { id: 8, type: "class", time: "13:30 - 14:20" },
    { id: 9, type: "class", time: "14:20 - 15:10" },
];

interface ScheduleItem {
    id: string;
    day: string;
    periodId: number;
    subject: string;
    teacher: string;
    room: string;
    color: string;
}

export default function TimetablePage() {
    const params = useParams();
    const schoolId = params.id as string;
    const [selectedClass, setSelectedClass] = useState("S3-A");
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSchedule = useCallback(async () => {
        if (!schoolId) return;
        setIsLoading(true);
        try {
            const response = await api.get('/timetable', {
                params: { schoolId, classId: selectedClass }
            });
            setSchedule(response.data);
        } catch (error) {
            console.error("Failed to fetch timetable:", error);
        } finally {
            setIsLoading(false);
        }
    }, [schoolId, selectedClass]);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    const getScheduleForCell = (day: string, periodId: number) => {
        return schedule.find(s => s.day === day && s.periodId === periodId);
    };

    return (
        <div className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1400px] px-6">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 pb-4">
                    <Link href={`/school/${schoolId}/dashboard`} className="text-[#4c4c9a] dark:text-gray-400 text-sm font-medium hover:text-primary">Home</Link>
                    <span className="text-[#4c4c9a] dark:text-gray-600 text-sm font-medium">/</span>
                    <span className="text-black dark:text-white text-sm font-bold">Timetable</span>
                </div>

                {/* Header */}
                <div className="flex flex-wrap justify-between items-end gap-3 pb-6">
                    <div className="flex min-w-72 flex-col gap-1">
                        <h1 className="text-black dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Class Timetables</h1>
                        <p className="text-[#4c4c9a] dark:text-gray-400 text-base font-normal">View and manage weekly schedules.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="h-11 rounded-lg border border-[#cfcfe7] dark:border-white/10 bg-white dark:bg-white/5 px-4 text-sm font-bold text-black dark:text-white focus:ring-2 focus:ring-primary outline-none appearance-none"
                        >
                            <option>S1-A</option>
                            <option>S1-B</option>
                            <option>S2-A</option>
                            <option>S3-A</option>
                            <option>S4-MCB</option>
                            <option>S6-PCB</option>
                        </select>
                        <button className="flex min-w-[120px] items-center justify-center rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all">
                            <span className="material-symbols-outlined text-[18px] mr-2">edit_calendar</span>
                            Edit Schedule
                        </button>
                    </div>
                </div>

                {/* Timetable View */}
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#cfcfe7] dark:border-gray-700 shadow-sm overflow-hidden min-h-[500px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 bg-gray-50 dark:bg-[#151e2d] border-b border-r border-gray-200 dark:border-gray-700 min-w-[120px] text-left sticky left-0 z-10">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Day / Time</span>
                                        </th>
                                        {periods.map(period => (
                                            <th key={period.id} className="p-2 bg-gray-50 dark:bg-[#151e2d] border-b border-r border-gray-200 dark:border-gray-700 min-w-[140px]">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xs font-bold text-gray-700 dark:text-white uppercase">{period.label || `Period ${period.id}`}</span>
                                                    <span className="text-[10px] font-medium text-gray-400">{period.time}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {days.map(day => (
                                        <tr key={day}>
                                            <td className="p-4 bg-gray-50 dark:bg-[#151e2d] border-b border-r border-gray-200 dark:border-gray-700 font-bold text-sm text-gray-900 dark:text-white sticky left-0 z-10">
                                                {day}
                                            </td>
                                            {periods.map(period => {
                                                if (period.type === 'break') {
                                                    return (
                                                        <td key={period.id} className="p-0 border-b border-r border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 text-center align-middle relative">
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="writing-vertical-lr text-xs font-bold text-gray-400 tracking-widest uppercase opacity-50 select-none rotate-180">
                                                                    {period.label}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    );
                                                }

                                                const scheduleItem = getScheduleForCell(day, period.id);

                                                return (
                                                    <td key={period.id} className="p-1 border-b border-r border-gray-200 dark:border-gray-700 h-[100px] align-top">
                                                        {scheduleItem ? (
                                                            <div className={`flex flex-col h-full w-full rounded-lg p-2 border ${scheduleItem.color || 'bg-blue-50 text-blue-700 border-blue-100'} transition-all hover:scale-[1.02] cursor-pointer shadow-sm`}>
                                                                <span className="font-bold text-sm leading-tight mb-1">{scheduleItem.subject}</span>
                                                                <div className="mt-auto flex flex-col gap-0.5">
                                                                    <div className="flex items-center gap-1 text-[10px] opacity-90 font-medium">
                                                                        <span className="material-symbols-outlined !text-[12px]">person</span>
                                                                        <span className="truncate">{scheduleItem.teacher}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-[10px] opacity-80 font-medium">
                                                                        <span className="material-symbols-outlined !text-[12px]">location_on</span>
                                                                        <span>{scheduleItem.room}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center group">
                                                                <button className="hidden group-hover:flex size-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-primary hover:bg-primary/10 transition-all">
                                                                    <span className="material-symbols-outlined !text-lg">add</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
