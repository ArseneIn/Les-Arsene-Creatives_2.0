"use client";

import Navbar from "@/components/Navbar";
import {
    BarChart,
    Clock,
    FileText,
    MessageSquare,
    Download,
    AlertCircle,
    TrendingUp,
    CreditCard
} from "lucide-react";
import Image from "next/image";

// Define simpler prop types to avoid 'any'
interface StatCardProps {
    label: string;
    value: string;
    subtext: string;
    icon: React.ReactNode;
}

interface TimelineItemProps {
    date: string;
    title: string;
    status: 'completed' | 'current' | 'upcoming';
}

interface FileItemProps {
    name: string;
    type: string;
    size: string;
    date: string;
}

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-space">
            <Navbar />

            <main className="pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Welcome back</p>
                            <h1 className="text-4xl md:text-5xl font-syne font-bold text-gray-900 dark:text-white">
                                TechFlow Inc.
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-bold border border-green-200 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Active Retainer
                            </span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatCard
                            label="Project Status"
                            value="85%"
                            subtext="Phase 3: Development"
                            icon={<BarChart className="w-6 h-6 text-primary" />}
                        />
                        <StatCard
                            label="Next Milestone"
                            value="Feb 15"
                            subtext="Beta Launch"
                            icon={<Clock className="w-6 h-6 text-purple-500" />}
                        />
                        <StatCard
                            label="Open Tasks"
                            value="3"
                            subtext="Pending Review"
                            icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
                        />
                        <StatCard
                            label="Monthly Traffic"
                            value="+24%"
                            subtext="vs Last Month"
                            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Column */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Active Project */}
                            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-syne font-bold">Current Project: SaaS Platform V2</h3>
                                    <button className="text-sm text-primary font-bold hover:underline">View Roadmap</button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span>Progress</span>
                                        <span>85%</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[85%] rounded-full relative overflow-hidden">
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-6">
                                    <TimelineItem
                                        date="Jan 28"
                                        title="Design System Approved"
                                        status="completed"
                                    />
                                    <TimelineItem
                                        date="Feb 02"
                                        title="Frontend Integration"
                                        status="current"
                                    />
                                    <TimelineItem
                                        date="Feb 15"
                                        title="Beta Release & Testing"
                                        status="upcoming"
                                    />
                                </div>
                            </div>

                            {/* Recent Files */}
                            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
                                <h3 className="text-xl font-syne font-bold mb-6">Recent Deliverables</h3>
                                <div className="space-y-3">
                                    <FileItem name="Brand_Guidelines_v2.pdf" type="PDF" size="4.2 MB" date="Jan 28" />
                                    <FileItem name="UI_Kit_Final.fig" type="Figma" size="12 MB" date="Jan 25" />
                                    <FileItem name="Q1_Strategy_Report.pdf" type="PDF" size="2.1 MB" date="Jan 15" />
                                </div>
                            </div>

                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">

                            {/* Action Center */}
                            <div className="bg-black text-white rounded-3xl p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl rounded-full"></div>
                                <h3 className="text-xl font-syne font-bold mb-4 relative z-10">Quick Actions</h3>
                                <div className="space-y-3 relative z-10">
                                    <button className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-3 transition-colors text-sm font-bold">
                                        <MessageSquare className="w-4 h-4" /> Open Support Ticket
                                    </button>
                                    <button className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-3 transition-colors text-sm font-bold">
                                        <CreditCard className="w-4 h-4" /> View Invoices
                                    </button>
                                </div>
                            </div>

                            {/* Account Manager */}
                            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">Your Team</h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"
                                            alt="Manager"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Sarah Connor</p>
                                        <p className="text-xs text-gray-500">Project Lead</p>
                                    </div>
                                </div>
                                <button className="mt-6 w-full py-2 rounded-full border border-gray-200 dark:border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                                    Schedule Review
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, subtext, icon }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-full bg-gray-50 dark:bg-white/10">{icon}</div>
                <span className="text-xs font-mono text-gray-400">...</span>
            </div>
            <div className="text-3xl font-syne font-bold mb-1">{value}</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">{label}</div>
            <div className="text-xs text-gray-500">{subtext}</div>
        </div>
    )
}

function TimelineItem({ date, title, status }: TimelineItemProps) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full border-2 ${status === 'completed' ? 'bg-primary border-primary' : status === 'current' ? 'bg-white border-primary animate-pulse' : 'bg-transparent border-gray-300 dark:border-white/20'}`}></div>
                <div className="w-[1px] h-full bg-gray-200 dark:bg-white/10 my-1 last:hidden"></div>
            </div>
            <div className="pb-6">
                <p className="text-xs font-mono text-gray-500 mb-1">{date}</p>
                <p className={`font-medium ${status === 'upcoming' ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>{title}</p>
            </div>
        </div>
    )
}

function FileItem({ name, type, size, date }: FileItemProps) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">{name}</p>
                    <p className="text-xs text-gray-400">{type} • {size} • {date}</p>
                </div>
            </div>
            <div className="text-gray-400 group-hover:text-primary transition-colors">
                <Download className="w-5 h-5" />
            </div>
        </div>
    )
}
