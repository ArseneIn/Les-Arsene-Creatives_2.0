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

interface AttendanceStats {
    attendanceRate?: number;
}

interface FinanceStats {
    revenue?: number;
}

interface WeeklyAttendance {
    date: string;
    students: number;
}

import LoadingScreen from "../system/LoadingScreen";

export default function SchoolAdminDashboard() {
    const params = useParams();
    const schoolId = params.id as string;

    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
    const [financeStats, setFinanceStats] = useState<FinanceStats | null>(null);
    const [weeklyAttendance, setWeeklyAttendance] = useState<WeeklyAttendance[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!schoolId) return;
            try {
                const [studentsRes, teachersRes, attendanceRes, financeRes, weeklyRes] = await Promise.all([
                    api.get('/students', { params: { schoolId } }),
                    api.get('/teachers', { params: { schoolId } }),
                    api.get('/attendance/stats', { params: { schoolId } }),
                    api.get('/finance/payments/stats/monthly', { params: { schoolId } }),
                    api.get('/attendance/trends/weekly', { params: { schoolId } })
                ]);
                setStudents(studentsRes.data);
                setTeachers(teachersRes.data);
                setAttendanceStats(attendanceRes.data);
                setFinanceStats(financeRes.data);
                setWeeklyAttendance(weeklyRes.data);
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

    // Recent Students
    const recentStudents = [...students]
        .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
        })
        .slice(0, 5);

    // Prepare Attendance Data for Chart
    // Ensure we have data even if API returns empty
    const chartData = weeklyAttendance.length > 0 ? weeklyAttendance : [
        { date: 'Mon', students: 0 },
        { date: 'Tue', students: 0 },
        { date: 'Wed', students: 0 },
        { date: 'Thu', students: 0 },
        { date: 'Fri', students: 0 },
    ].map(d => ({ ...d, date: typeof d.date === 'string' && d.date.includes('-') ? new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }) : d.date }));

    // Format chart data dates if they are ISO strings
    const formattedChartData = chartData.map((d: WeeklyAttendance) => ({
        ...d,
        name: d.date.includes('-') ? new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }) : d.date
    }));


    if (isLoading) {
        return <LoadingScreen message="Aggregating school statistics..." fullScreen={false} />;
    }

    return (
        <div className="p-6 space-y-8 bg-gray-50 dark:bg-[#0f172a] min-h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Students */}
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg">
                            +2.5%
                            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{totalStudents}</h3>
                    </div>
                </div>

                {/* Teachers */}
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-purple-500/20 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">person_apron</span>
                        </div>
                        <span className="flex items-center text-xs font-bold text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                            Stable
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Teachers</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{totalTeachers}</h3>
                    </div>
                </div>

                {/* Attendance */}
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-amber-500/20 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">how_to_reg</span>
                        </div>
                        <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg">
                            Daily
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Rate</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                            {attendanceStats?.attendanceRate ? `${Math.round(attendanceStats.attendanceRate)}%` : '0%'}
                        </h3>
                    </div>
                </div>

                {/* Finance */}
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-green-500/20 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="flex items-center text-xs font-bold text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                            This Month
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                            ${financeStats?.revenue?.toLocaleString() || '0'}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Section */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Attendance Trends</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Weekly student attendance overview</p>
                        </div>
                        <select className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '3 3' }}
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="students"
                                    stroke="#4F46E5"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorStudents)"
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Demographics & Quick Actions */}
                <div className="space-y-6">
                    {/* Demographics */}
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Demographics</h3>
                        <div className="h-[200px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
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
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black text-gray-900 dark:text-white">{totalStudents}</span>
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Students</span>
                            </div>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            {genderData.map((item) => (
                                <div key={item.name} className="text-center">
                                    <div className="flex items-center gap-1.5 justify-center mb-1">
                                        <span className="size-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{item.name}</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions List */}
                    <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
                        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href={`/school/${schoolId}/students`} className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm cursor-pointer">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                                </div>
                                <span className="text-sm font-bold">Register Student</span>
                            </Link>
                            <Link href={`/school/${schoolId}/finance`} className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm cursor-pointer">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <span className="material-symbols-outlined text-[18px]">payments</span>
                                </div>
                                <span className="text-sm font-bold">Record Payment</span>
                            </Link>
                            <Link href={`/school/${schoolId}/attendance`} className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm cursor-pointer">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <span className="material-symbols-outlined text-[18px]">event_available</span>
                                </div>
                                <span className="text-sm font-bold">Take Attendance</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Students Table */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Enrollments</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Latest students added to the system</p>
                    </div>
                    <Link href={`/school/${schoolId}/students`} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                        View All
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student Profile</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID Number</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Class/Grade</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date Added</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {recentStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                                            <p className="text-sm font-medium">No recent enrollments found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                recentStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700 bg-gray-100"
                                                    style={{ backgroundImage: `url('${student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}')` }}
                                                ></div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{student.name}</p>
                                                    <p className="text-xs text-gray-500">{student.gender}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">{student.studentId}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {student.year || student.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${student.status === 'Active' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' :
                                                'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                                }`}>
                                                <span className={`size-1.5 rounded-full mr-1.5 ${student.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
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
        </div>
    );
}
