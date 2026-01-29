"use client";

import { mockStudents } from "@/data/students";
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

export default function SchoolAdminDashboard() {
    // Mock Data for Charts
    // Calculate Gender Data from mockStudents
    const maleCount = mockStudents.filter(s => s.gender === 'Male').length;
    const femaleCount = mockStudents.filter(s => s.gender === 'Female').length;

    const genderData = [
        { name: 'Boys', value: maleCount, color: '#3B82F6' }, // Blue
        { name: 'Girls', value: femaleCount, color: '#EC4899' }, // Pink
    ];

    const attendanceData = [
        { name: 'Mon', students: 85, teachers: 90 },
        { name: 'Tue', students: 88, teachers: 92 },
        { name: 'Wed', students: 82, teachers: 88 },
        { name: 'Thu', students: 90, teachers: 94 },
        { name: 'Fri', students: 85, teachers: 90 },
        { name: 'Sat', students: 40, teachers: 50 },
    ];

    // Mock Top Performers (derived from mockStudents for demo)
    const topPerformers = mockStudents.slice(0, 4).map((s, i) => ({
        ...s,
        rank: i + 1,
        marks: 1000 - (i * 50),
        percentage: 98 - (i * 2)
    }));

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
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{mockStudents.length}</h3>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full mt-2">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            +12%
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
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">42</h3>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full mt-2">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            +4%
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
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">94%</h3>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full mt-2">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            +2%
                        </span>
                    </div>
                    <div className="size-12 rounded-full bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">event_available</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Top Performers) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Performers</h3>
                        <button className="text-sm text-primary font-medium hover:underline">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Student</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Number</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Year</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Marks</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Percentage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {topPerformers.map((student) => (
                                    <tr key={student.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700"
                                                    style={{ backgroundImage: `url('${student.avatarUrl}')` }}
                                                ></div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{student.name}</p>
                                                    <p className="text-xs text-gray-500">{student.grade}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">{student.studentId}</td>
                                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">{student.year}</td>
                                        <td className="py-4 text-sm font-bold text-gray-900 dark:text-white">{student.marks}</td>
                                        <td className="py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                                {student.percentage}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
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
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{mockStudents.length}</span>
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
                                    <span className="text-xs text-gray-400">({Math.round((item.value / mockStudents.length) * 100)}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row (Attendance Chart) */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Attendance Overview</h3>
                    <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary">
                        <option>This Week</option>
                        <option>Last Week</option>
                    </select>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
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
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                            <Area type="monotone" dataKey="teachers" stroke="#F472B6" strokeWidth={3} fillOpacity={1} fill="url(#colorTeachers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
