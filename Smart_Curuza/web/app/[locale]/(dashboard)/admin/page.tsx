'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Users, Store, Settings, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import MerchantsTable from '@/components/admin/MerchantsTable';
import LiveMap from '@/components/LiveMap';
import TransactionFeed from '@/components/TransactionFeed';

interface AdminStats {
    totalUsers: number;
    activeMerchants: number;
    totalMerchants: number;
    systemHealth: number;
    pendingRequests: number;
}

interface ActivityItem {
    type: string;
    description: string;
    time: string;
    status: string;
}

interface AlertItem {
    title: string;
    time: string;
    type: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [merchants, setMerchants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsData, activityData, alertsData, merchantsData] = await Promise.all([
                api.get<AdminStats>('/super-admin/stats'),
                api.get<ActivityItem[]>('/super-admin/activity'),
                api.get<AlertItem[]>('/super-admin/alerts'),
                api.get<any[]>('/super-admin/merchants')
            ]);

            setStats(statsData || null);
            setActivity(activityData || []);
            setAlerts(alertsData || []);
            setMerchants(merchantsData || []);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-jet-700">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-jet font-heading">Superadmin Dashboard</h1>
                <p className="text-jet-700 mt-1">System overview and management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="flex items-center p-6 border-l-4 border-green-500">
                    <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
                        <Store size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Active Merchants</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-jet">{stats?.activeMerchants}</p>
                            <span className="text-xs text-gray-400">/ {stats?.totalMerchants} Total</span>
                        </div>
                    </div>
                </Card>

                <Card className="flex items-center p-6 border-l-4 border-blue-500">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">System Health</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-jet">{stats?.systemHealth}%</p>
                            <span className="text-xs text-green-600 font-medium">Stable</span>
                        </div>
                    </div>
                </Card>

                <Card className="flex items-center p-6 border-l-4 border-red-500">
                    <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Critical Alerts</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-jet">3</p>
                            <span className="text-xs text-red-600 font-medium">Action Required</span>
                        </div>
                    </div>
                </Card>

                <Card className="flex items-center p-6 border-l-4 border-gold">
                    <div className="p-3 rounded-full bg-gold/10 text-gold-700 mr-4">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">New Signups</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-jet">{stats?.pendingRequests}</p>
                            <span className="text-xs text-gray-400">This Week</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Live Monitoring Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Map Section - Takes up 8 columns */}
                <div className="lg:col-span-8">
                    <LiveMap />
                </div>

                {/* Feed Section - Takes up 4 columns */}
                <div className="lg:col-span-4">
                    <TransactionFeed />
                </div>
            </div>

            {/* Merchants Table */}
            <MerchantsTable merchants={merchants} onUpdate={fetchData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-jet mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {activity.length === 0 ? (
                            <p className="text-gray-500">No recent activity.</p>
                        ) : (
                            activity.map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium text-jet">{item.description}</p>
                                        <p suppressHydrationWarning className="text-sm text-gray-500">{new Date(item.time).toLocaleString()}</p>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">{item.status}</span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-xl font-bold text-jet mb-4">System Alerts</h3>
                    <div className="space-y-4">
                        {alerts.length === 0 ? (
                            <p className="text-gray-500">No active alerts.</p>
                        ) : (
                            alerts.map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium text-jet">{item.title}</p>
                                        <p suppressHydrationWarning className="text-sm text-gray-500">{new Date(item.time).toLocaleString()}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${item.type === 'Warning' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                        }`}>{item.type}</span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
