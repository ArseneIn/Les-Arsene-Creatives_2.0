"use client";

import TeacherClasses from "@/components/teacher/TeacherClasses";
import TeacherStats from "@/components/teacher/TeacherStats";
import TeacherSchedule from "@/components/teacher/TeacherSchedule";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function TeacherDashboard() {
    const { user } = useAuth();

    return (
        <div className="p-6 space-y-8 bg-gray-50 dark:bg-[#0f172a] min-h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Welcome back, {user?.name || 'Teacher'}. Here&apos;s what&apos;s happening today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative hidden md:block">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-64 shadow-sm"
                        />
                    </div>
                    <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="hidden sm:inline">Quick Action</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <section>
                <TeacherStats />
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Classes Column */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Classes</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Overview of your assigned classes and activities</p>
                        </div>
                    </div>
                    <TeacherClasses />
                </div>
                
                {/* Schedule & Actions Column */}
                <div className="space-y-6 lg:col-span-1">
                    <TeacherSchedule />
                    
                    {/* Quick Actions List */}
                    <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
                        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link 
                                href={`/school/${user?.schoolId}/teacher/attendance`} 
                                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm cursor-pointer"
                            >
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <span className="material-symbols-outlined text-[18px]">event_available</span>
                                </div>
                                <span className="text-sm font-bold">Take Attendance</span>
                            </Link>
                            <Link 
                                href={`#`} 
                                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm cursor-pointer"
                            >
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <span className="material-symbols-outlined text-[18px]">assignment</span>
                                </div>
                                <span className="text-sm font-bold">Create Assignment</span>
                            </Link>
                            <Link 
                                href={`#`} 
                                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm cursor-pointer"
                            >
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <span className="material-symbols-outlined text-[18px]">campaign</span>
                                </div>
                                <span className="text-sm font-bold">Post Announcement</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
