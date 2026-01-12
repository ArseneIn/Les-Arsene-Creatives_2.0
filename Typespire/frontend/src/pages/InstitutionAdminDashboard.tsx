import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { useInstitution } from '../context/InstitutionContext';

// --- Types ---
interface Facilitator {
    id: string;
    name: string;
    email: string;
    role: string;
    intakes: string[];
    status: 'Active' | 'Pending' | 'Inactive';
    students: number;
}

// --- Mock Data ---
const FACILITATORS: Facilitator[] = [
    { id: '1', name: 'Jane Doe', email: 'jane.doe@kepler.edu', role: 'Senior Facilitator', intakes: ['Fall 2023', 'Spring 2024'], status: 'Active', students: 124 },
    { id: '2', name: 'John Smith', email: 'john.smith@kepler.edu', role: 'Facilitator', intakes: ['Spring 2024'], status: 'Active', students: 85 },
    { id: '3', name: 'Alice Johnson', email: 'alice.j@kepler.edu', role: 'Assistant', intakes: ['Fall 2023'], status: 'Pending', students: 0 },
    { id: '4', name: 'Robert Brown', email: 'r.brown@kepler.edu', role: 'Facilitator', intakes: ['Spring 2024'], status: 'Inactive', students: 45 },
];

const STATUS_DATA = [
    { name: 'Active', value: 22, color: '#22c55e' },
    { name: 'Pending', value: 2, color: '#eab308' },
    { name: 'Inactive', value: 5, color: '#94a3b8' },
];

const COLORS = ['#22c55e', '#eab308', '#94a3b8'];

const InstitutionAdminDashboard: React.FC = () => {
    const { intakes } = useInstitution();

    // Transform context intakes to chart data
    // In a real app, this would calculate actual averages from student data
    const intakePerformanceData = intakes.map(intake => ({
        name: intake.name,
        avgWpm: Math.floor(Math.random() * (55 - 35) + 35), // Mock WPM between 35-55
        target: 40
    }));

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
                    <p className="font-bold text-gray-800 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-gray-500 capitalize">{entry.name}:</span>
                            <span className="font-bold text-gray-800">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {/* Top Bar / Header */}
            <header className="flex-none mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>Institutions</span>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="font-medium text-gray-700">Kepler College</span>
                        </div>
                        <h2 className="text-[#0d1b17] text-3xl font-bold leading-tight">Institution Hub</h2>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Export Data
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#0d1b17] text-white rounded-lg text-sm font-bold hover:bg-[#1a2e28] transition-colors shadow-lg shadow-gray-200">
                            <span className="material-symbols-outlined text-[20px]">person_add</span>
                            Invite Facilitator
                        </button>
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1: Total Facilitators */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Total Facilitators</p>
                            <h3 className="text-[#0d1b17] text-4xl font-bold">24</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <span className="material-symbols-outlined icon-filled">group</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>+2% this month</span>
                    </div>
                </div>

                {/* Card 2: Active Intakes */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Active Intakes</p>
                            <h3 className="text-[#0d1b17] text-4xl font-bold">{intakes.length}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors">
                            <span className="material-symbols-outlined icon-filled">folder_shared</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-medium">Across all departments</p>
                </div>

                {/* Card 3: Avg School WPM */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Avg. School WPM</p>
                            <h3 className="text-[#0d1b17] text-4xl font-bold">42</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors">
                            <span className="material-symbols-outlined icon-filled">speed</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>+5% vs last sem</span>
                    </div>
                </div>

                {/* Card 4: Avg Accuracy */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Avg. Accuracy</p>
                            <h3 className="text-[#0d1b17] text-4xl font-bold">96.5%</h3>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 group-hover:bg-yellow-100 transition-colors">
                            <span className="material-symbols-outlined icon-filled">target</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-red-500">
                        <span className="material-symbols-outlined text-sm">trending_down</span>
                        <span>-1% trend</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Intake Performance Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-[#0d1b17] text-xl font-bold">Intake Performance</h3>
                            <p className="text-gray-500 text-sm">Average WPM comparison across recent intakes.</p>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={intakePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                                <Bar dataKey="avgWpm" name="Avg WPM" fill="#0d1b17" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="target" name="Target WPM" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Facilitator Status Chart */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-[#0d1b17] text-xl font-bold mb-2">Facilitator Status</h3>
                    <p className="text-gray-500 text-sm mb-6">Overview of staff account statuses.</p>

                    <div className="flex-1 min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={STATUS_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {STATUS_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-gray-800">29</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {STATUS_DATA.map((entry, index) => (
                            <div key={entry.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                    <span className="font-medium text-gray-600">{entry.name}</span>
                                </div>
                                <span className="font-medium text-gray-800">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Facilitator Directory Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-10">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-[#0d1b17] text-lg font-bold">Facilitator Directory</h3>
                        <p className="text-gray-500 text-sm">Manage your school's staff and their assigned intakes.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">filter_list</span>
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0f253a] text-white text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Facilitator</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Assigned Intakes</th>
                                <th className="px-6 py-4">Students</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {FACILITATORS.map((facilitator) => (
                                <tr key={facilitator.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0d1b17] font-bold border border-gray-200">
                                                {facilitator.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#0d1b17]">{facilitator.name}</p>
                                                <p className="text-xs text-gray-500">{facilitator.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{facilitator.role}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {facilitator.intakes.map((intake, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded border border-gray-200">
                                                    {intake}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-bold">{facilitator.students}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${facilitator.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            facilitator.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {facilitator.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-[#0d1b17] transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default InstitutionAdminDashboard;
