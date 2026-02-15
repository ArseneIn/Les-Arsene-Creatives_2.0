"use client";

import { useEffect, useState, use } from "react";
// import { useAuth } from "@/hooks/useAuth"; // unused
import AttendanceStats from "@/components/attendance/AttendanceStats";
import AttendanceManagement from "@/components/attendance/AttendanceManagement";
import api from "@/lib/api";

interface AttendancePageProps {
    params: Promise<{
        id: string; // School ID
    }>;
    searchParams: Promise<{
        classId?: string;
    }>;
}

export default function AttendancePage({ params, searchParams }: AttendancePageProps) {
    // const { user } = useAuth(); // unused
    const { id: schoolId } = use(params);
    const { classId } = use(searchParams);

    const [activeTab, setActiveTab] = useState(classId ? "manage" : "overview");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get(`/attendance/stats?schoolId=${schoolId}`);
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        if (schoolId) {
            fetchStats();
        }
    }, [schoolId]);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
            </div>

            <div className="space-y-4">
                {/* Simple Tab List */}
                <div className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === "overview" ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50" : "hover:bg-white/50 dark:hover:bg-slate-950/50"}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("manage")}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === "manage" ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50" : "hover:bg-white/50 dark:hover:bg-slate-950/50"}`}
                    >
                        Manage Attendance
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="space-y-4">
                        {loading ? (
                            <div>Loading stats...</div>
                        ) : stats ? (
                            <AttendanceStats stats={stats} />
                        ) : (
                            <div>No stats available.</div>
                        )}
                    </div>
                )}

                {activeTab === "manage" && (
                    <div className="space-y-4">
                        <AttendanceManagement schoolId={schoolId} initialClassId={classId} />
                    </div>
                )}
            </div>
        </div>
    );
}
