"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface Classroom {
    id: string;
    name: string;
    level: string;
    stream: string;
    year: string;
}

export default function TeacherClasses() {
    const { user } = useAuth();
    const [classes, setClasses] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            if (!user) return;
            try {
                const res = await api.get('/teachers/my-classes');
                setClasses(res.data);
            } catch (error) {
                console.error("Failed to fetch my classes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [user]);

    if (loading) {
        return <div className="p-8 text-center">Loading your classes...</div>;
    }

    if (classes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                    <span className="material-symbols-outlined text-slate-500" style={{ fontSize: '32px' }}>school</span>
                </div>
                <h3 className="text-lg font-medium">No Classes Assigned</h3>
                <p className="text-slate-500 text-sm mt-1">You haven&apos;t been assigned to any classes yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
                <div key={cls.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>meeting_room</span>
                        </div>
                        <div className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
                            {cls.year}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold mb-1">{cls.name}</h3>
                    <p className="text-slate-500 text-sm mb-6">{cls.level} - {cls.stream || 'Main Stream'}</p>

                    <div className="flex gap-2">
                        <Link
                            href={`/school/${user?.schoolId}/teacher/classes/${cls.id}/attendance`}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>co_present</span>
                            Attendance
                        </Link>
                        {/* Future links: Grades, Students, etc. */}
                    </div>
                </div>
            ))}
        </div>
    );
}
