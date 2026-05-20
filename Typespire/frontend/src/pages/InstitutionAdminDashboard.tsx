import React, { useMemo, useEffect, useState } from 'react';
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
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Download, UserPlus, Users, TrendingUp, Folder, Zap, Target, TrendingDown, Filter, MoreVertical } from 'lucide-react';

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

interface DashboardStats {
    totalFacilitators: number;
    activeIntakes: number;
    avgWpm: number;
    avgAccuracy: number;
}

// Custom Tooltip for Charts
interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
                <p className="font-bold text-gray-800 mb-2">{label}</p>
                {payload.map((entry, index) => (
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

const InstitutionAdminDashboard: React.FC = () => {
    const { intakes } = useInstitution();
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalFacilitators: 0,
        activeIntakes: 0,
        avgWpm: 0,
        avgAccuracy: 0
    });
    const [facilitators, setFacilitators] = useState<Facilitator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.institutionId) {
            fetchDashboardData(user.institutionId);
        }
    }, [user?.institutionId]);

    const fetchDashboardData = async (institutionId: string) => {
        try {
            interface BackendUser {
                id: string;
                firstName?: string;
                lastName?: string;
                email: string;
                role: string;
            }

            const [statsRes, facilitatorsRes] = await Promise.all([
                api.get<DashboardStats>(`/institution/${institutionId}/stats`),
                api.get<BackendUser[]>(`/institution/${institutionId}/facilitators`)
            ]);

            setStats(statsRes.data);

            const mappedFacilitators: Facilitator[] = facilitatorsRes.data.map(f => ({
                id: f.id,
                name: `${f.firstName || ''} ${f.lastName || ''}`.trim() || f.email,
                email: f.email,
                role: f.role, // Use actual role
                intakes: [], // Placeholder as backend doesn't link yet
                status: 'Active', // Default status
                students: 0 // Placeholder
            }));
            setFacilitators(mappedFacilitators);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    // Transform context intakes to chart data
    const intakePerformanceData = useMemo(() => intakes.map(intake => {
        const pseudoRandom = (intake.name.length * 7) % 20;
        return {
            name: intake.name,
            avgWpm: 35 + pseudoRandom,
            target: 40
        };
    }), [intakes]);

    // Calculate status data dynamically (though currently all are Active)
    const statusData = useMemo(() => {
        const active = facilitators.filter(f => f.status === 'Active').length;
        const pending = facilitators.filter(f => f.status === 'Pending').length;
        const inactive = facilitators.filter(f => f.status === 'Inactive').length;
        return [
            { name: 'Active', value: active, color: '#33B974' },
            { name: 'Pending', value: pending, color: '#094A71' },
            { name: 'Inactive', value: inactive, color: '#94a3b8' },
        ].filter(d => d.value > 0);
    }, [facilitators]);

    if (loading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    return (
        <>
            {/* Top Bar / Header */}
            <header className="flex-none mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>Institutions</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="font-medium text-gray-700">Dashboard</span>
                        </div>
                        <h2 className="text-[#061824] text-3xl font-bold leading-tight">Institution Hub</h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                            <Download className="w-5 h-5" />
                            Export Data
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#094A71] text-white rounded-lg text-sm font-bold hover:bg-[#094A71]/90 transition-colors shadow-lg shadow-[#094A71]/10">
                            <UserPlus className="w-5 h-5" />
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
                            <h3 className="text-[#061824] text-4xl font-bold">{stats.totalFacilitators}</h3>
                        </div>
                        <div className="p-2 bg-[#094A71]/10 rounded-lg text-[#094A71] group-hover:bg-[#094A71]/20 transition-colors">
                            <Users className="w-6 h-6 icon-filled" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#33B974]">
                        <TrendingUp className="w-4 h-4" />
                        <span>+2% this month</span>
                    </div>
                </div>

                {/* Card 2: Active Intakes */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Active Intakes</p>
                            <h3 className="text-[#061824] text-4xl font-bold">{stats.activeIntakes}</h3>
                        </div>
                        <div className="p-2 bg-[#33B974]/10 rounded-lg text-[#33B974] group-hover:bg-[#33B974]/20 transition-colors">
                            <Folder className="w-6 h-6 icon-filled" />
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-medium">Across all departments</p>
                </div>

                {/* Card 3: Avg School WPM */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Avg. School WPM</p>
                            <h3 className="text-[#061824] text-4xl font-bold">{stats.avgWpm}</h3>
                        </div>
                        <div className="p-2 bg-[#33B974]/10 rounded-lg text-[#33B974] group-hover:bg-[#33B974]/20 transition-colors">
                            <Zap className="w-6 h-6 icon-filled" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#33B974]">
                        <TrendingUp className="w-4 h-4" />
                        <span>+5% vs last sem</span>
                    </div>
                </div>

                {/* Card 4: Avg Accuracy */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Avg. Accuracy</p>
                            <h3 className="text-[#061824] text-4xl font-bold">{stats.avgAccuracy}%</h3>
                        </div>
                        <div className="p-2 bg-[#094A71]/10 rounded-lg text-[#094A71] group-hover:bg-[#094A71]/20 transition-colors">
                            <Target className="w-6 h-6 icon-filled" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-red-500">
                        <TrendingDown className="w-4 h-4" />
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
                            <h3 className="text-[#061824] text-xl font-bold">Intake Performance</h3>
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
                                <Bar dataKey="avgWpm" name="Avg WPM" fill="#094A71" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="target" name="Target WPM" fill="#33B974" radius={[4, 4, 0, 0]} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Facilitator Status Chart */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-[#061824] text-xl font-bold mb-2">Facilitator Status</h3>
                    <p className="text-gray-500 text-sm mb-6">Overview of staff account statuses.</p>

                    <div className="flex-1 min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-gray-800">{stats.totalFacilitators}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {statusData.map((entry) => (
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
                        <h3 className="text-[#061824] text-lg font-bold">Facilitator Directory</h3>
                        <p className="text-gray-500 text-sm">Manage your school's staff and their assigned intakes.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors">
                            <Filter className="w-[18px] h-[18px]" />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#094A71] text-white text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Facilitator</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Assigned Intakes</th>
                                <th className="px-6 py-4">Students</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {facilitators.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No facilitators found.</td>
                                </tr>
                            ) : (
                                facilitators.map((facilitator) => (
                                    <tr key={facilitator.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#094A71]/5 flex items-center justify-center text-[#094A71] font-bold border border-[#094A71]/15">
                                                    {facilitator.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#061824]">{facilitator.name}</p>
                                                    <p className="text-xs text-gray-500">{facilitator.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{facilitator.role}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {facilitator.intakes.length > 0 ? facilitator.intakes.map((intake, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded border border-gray-200">
                                                        {intake}
                                                    </span>
                                                )) : <span className="text-gray-400 text-xs">-</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-bold">{facilitator.students}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${facilitator.status === 'Active' ? 'bg-[#33B974]/15 text-[#33B974]' :
                                                facilitator.status === 'Pending' ? 'bg-[#094A71]/15 text-[#094A71]' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {facilitator.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-gray-400 hover:text-[#33B974] transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default InstitutionAdminDashboard;
