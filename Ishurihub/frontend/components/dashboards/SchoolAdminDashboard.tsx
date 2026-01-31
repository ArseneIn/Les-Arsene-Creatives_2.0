"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

interface Student {
    id: string;
    name: string;
    studentId: string;
    gender: string;
    grade: string;
    year: string;
    avatarUrl?: string;
    createdAt?: string;
    status: string;
}

interface Teacher {
    id: string;
    name: string;
}

export default function SchoolAdminDashboard() {
    const params = useParams();
    const schoolId = params.id as string;

    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!schoolId) return;
            try {
                const [studentsRes, teachersRes] = await Promise.all([
                    api.get('/students', { params: { schoolId } }),
                    api.get('/teachers', { params: { schoolId } })
                ]);
                setStudents(studentsRes.data);
                setTeachers(teachersRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [schoolId]);

    // Calculate Stats
    const totalStudents = students.length;
    const totalTeachers = teachers.length;

    const maleCount = students.filter(s => s.gender === 'Male').length;
    const femaleCount = students.filter(s => s.gender === 'Female').length;

    const genderData = [
        { name: 'Boys', value: maleCount, color: '#3B82F6' }, // Blue
        { name: 'Girls', value: femaleCount, color: '#EC4899' }, // Pink
    ];

    // Recent Students (Sort by createdAt descending if available, else just take first 5)
    const recentStudents = [...students]
        .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
        })
        .slice(0, 5);

    // Static Attendance Data (Placeholder for now as module not fully implemented with history)
    const attendanceData = [
        { name: 'Mon', students: 85, teachers: 90 },
        { name: 'Tue', students: 88, teachers: 92 },
        { name: 'Wed', students: 82, teachers: 88 },
        { name: 'Thu', students: 90, teachers: 94 },
        { name: 'Fri', students: 85, teachers: 90 },
        { name: 'Sat', students: 40, teachers: 50 },
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 dark:bg-[#0f172a] min-h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, Admin</p>
                </div>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                    </span>
                    <input
                        type="text"
                        placeholder="Search for students, teachers..."
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-sm focus:ring-2 focus:ring-primary outline-none w-full md:w-64"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Students Card */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalStudents}</h3>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full mt-2">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            <span>Active</span>
                        </span>
                    </div>
                    <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">groups</span>
                    </div>
                </div>

                {/* Teachers Card */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined">person_apron</span>
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Teachers</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalTeachers}</h3>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full mt-2">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            <span>Active</span>
                        </span>
                    </div>
                    <div className="size-12 rounded-full bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">cast_for_education</span>
                    </div>
                </div>

                {/* Attendance Card */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                                <span className="material-symbols-outlined">co_present</span>
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Rate</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--%</h3>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full mt-2">
                            Not available yet
                        </span>
                    </div>
                    <div className="size-12 rounded-full bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">event_available</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Recent Enrollments - formerly Top Performers) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Enrollments</h3>
                        <Link href={`/school/${schoolId}/students`} className="text-sm text-primary font-medium hover:underline">View All</Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Student</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Number</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Year/Grade</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {recentStudents.length === 0 ? (
                                    <tr><td colSpan={4} className="py-4 text-center text-gray-500">No students found.</td></tr>
                                ) : (
                                    recentStudents.map((student) => (
                                        <tr key={student.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="size-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700"
                                                        style={{ backgroundImage: `url('${student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}')` }}
                                                    ></div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{student.name}</p>
                                                        <p className="text-xs text-gray-500">{student.gender}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">{student.studentId}</td>
                                            <td className="py-4 text-sm text-gray-600 dark:text-gray-300">{student.year || student.grade}</td>
                                            <td className="py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${student.status === 'Active' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                                                        'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                                    }`}>
                                                    {student.status || 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column (Gender Chart) */}
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Student Body</h3>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-gray-400">more_horiz</span>
                        </button>
                    </div>

                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{totalStudents}</span>
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</span>
                        </div>
                    </div>

                    <div className="space-y-3 mt-4">
                        {genderData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                                    <span className="text-xs text-gray-400">({totalStudents > 0 ? Math.round((item.value / totalStudents) * 100) : 0}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row (Attendance Chart - Static for now) */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 opacity-50 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">Attendance Module Coming Soon</span>
                </div>
                <div className="flex items-center justify-between mb-6 blur-[2px]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Attendance Overview</h3>
                    <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary">
                        <option>This Week</option>
                        <option>Last Week</option>
                    </select>
                </div>

                <div className="h-[300px] w-full blur-[2px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                        <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F472B6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#F472B6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                            <Area type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                            <Area type="monotone" dataKey="teachers" stroke="#F472B6" strokeWidth={3} fillOpacity={1} fill="url(#colorTeachers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
