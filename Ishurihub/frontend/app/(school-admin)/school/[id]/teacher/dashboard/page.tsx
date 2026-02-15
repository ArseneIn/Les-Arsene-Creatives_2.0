"use client";

import TeacherClasses from "@/components/teacher/TeacherClasses";
import { useAuth } from "@/hooks/useAuth";

export default function TeacherDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <header className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
                <p className="text-slate-500">Welcome back, {user?.name}. Here are your assigned classes.</p>
            </header>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">My Classes</h3>
                </div>
                <TeacherClasses />
            </section>
        </div>
    );
}
