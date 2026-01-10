'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import {
    Store, MapPin, Phone, Mail, Calendar,
    CreditCard, Activity, Server, Smartphone,
    AlertTriangle, CheckCircle, Lock, Unlock,
    RefreshCw, Key, LogIn, FileText, Shield,
    Laptop, Tablet, Wifi, WifiOff, History
} from 'lucide-react';

// Mock Data - Super Admin View
const MOCK_MERCHANT = {
    id: '123',
    identity: {
        businessName: 'Kigali Electronics',
        tin: '123-456-789',
        ownerName: 'Jean Paul',
        phone: '+250 788 123 456',
        email: 'jean@example.com',
        address: 'Nyarugenge, Kigali',
        joinedDate: '2023-05-12'
    },
    technical: {
        appVersion: 'v2.4.1',
        lastSync: '2 mins ago',
        devices: [
            { id: 'd1', name: 'Main POS', type: 'Tablet', status: 'Online', lastSeen: 'Just now', version: 'v2.4.1', ip: '192.168.1.10' },
            { id: 'd2', name: 'Manager Phone', type: 'Mobile', status: 'Offline', lastSeen: '2 days ago', version: 'v2.3.0', ip: '192.168.1.15' },
            { id: 'd3', name: 'Back Office PC', type: 'Desktop', status: 'Online', lastSeen: '1 hour ago', version: 'v2.4.1', ip: '192.168.1.20' }
        ]
    },
    ebmCompliance: {
        rraConnection: 'Connected',
        backlogCount: 0,
        lastReport: 'Today, 08:00 AM',
        status: 'Compliant'
    },
    subscription: {
        plan: 'Premium (Yearly)',
        status: 'ACTIVE',
        expiryDate: '2024-12-31',
        history: [
            { date: '2023-12-31', amount: 120000, status: 'Paid', invoice: 'INV-001' },
            { date: '2022-12-31', amount: 100000, status: 'Paid', invoice: 'INV-000' }
        ]
    },
    usage: {
        lastSaleTime: '10 mins ago',
        activeStaff: 3,
        totalStaff: 5,
        avgDailySales: 450000
    },
    logs: [
        { id: 1, event: 'Shift Closed', user: 'Alice', time: '1 hour ago', type: 'info', details: 'Cash count matched' },
        { id: 2, event: 'Failed Login', user: 'Manager', time: '2 hours ago', type: 'warning', details: 'Incorrect PIN 3 times' },
        { id: 3, event: 'Stock Update', user: 'Jean Paul', time: 'Yesterday', type: 'info', details: 'Added 50 units of Samsung TV' },
        { id: 4, event: 'Device Synced', user: 'System', time: 'Yesterday', type: 'success', details: 'Full database sync completed' }
    ]
};

export default function MerchantDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [merchant] = useState(MOCK_MERCHANT);
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'devices', label: 'Devices & EBM', icon: Server },
        { id: 'subscription', label: 'Subscription', icon: CreditCard },
        { id: 'logs', label: 'Audit Logs', icon: History },
    ];

    return (
        <div className="min-h-screen bg-platinum-50">
            {/* 1. Unified Header (The "Passport") */}
            <div className="bg-white border-b border-platinum-200 px-8 py-6 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-gradient-to-br from-jet to-onyx rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Store className="h-8 w-8 text-gold" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-jet font-heading">{merchant.identity.businessName}</h1>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${merchant.subscription.status === 'ACTIVE'
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {merchant.subscription.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {merchant.identity.address}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span className="font-mono">TIN: {merchant.identity.tin}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${merchant.ebmCompliance.rraConnection === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        EBM: {merchant.ebmCompliance.rraConnection}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-jet text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                                <Lock className="h-4 w-4 text-gray-500" /> Lock
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-jet text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                                <Key className="h-4 w-4 text-gray-500" /> Reset PIN
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gold text-onyx rounded-lg text-sm font-bold hover:bg-gold/90 transition-colors shadow-md">
                                <LogIn className="h-4 w-4" /> Login As
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-8 mt-8 border-b border-gray-100">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                        ? 'text-gold border-b-2 border-gold'
                                        : 'text-gray-500 hover:text-jet'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Content Area (The "Workspace") */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Identity & Key Stats */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <Card className="p-5 border-l-4 border-blue-500">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Avg Daily Sales</p>
                                    <p className="text-xl font-bold text-jet">{merchant.usage.avgDailySales.toLocaleString()} RWF</p>
                                </Card>
                                <Card className="p-5 border-l-4 border-green-500">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Active Staff</p>
                                    <p className="text-xl font-bold text-jet">{merchant.usage.activeStaff} <span className="text-sm text-gray-400 font-normal">/ {merchant.usage.totalStaff}</span></p>
                                </Card>
                                <Card className="p-5 border-l-4 border-purple-500">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Last Sale</p>
                                    <p className="text-xl font-bold text-jet">{merchant.usage.lastSaleTime}</p>
                                </Card>
                            </div>

                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-jet mb-4">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Owner Name</p>
                                        <p className="font-medium text-jet">{merchant.identity.ownerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Email Address</p>
                                        <a href={`mailto:${merchant.identity.email}`} className="font-medium text-blue-600 hover:underline">{merchant.identity.email}</a>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                        <a href={`tel:${merchant.identity.phone}`} className="font-medium text-blue-600 hover:underline">{merchant.identity.phone}</a>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Joined Date</p>
                                        <p className="font-medium text-jet">{new Date(merchant.identity.joinedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right: Quick Actions & Status */}
                        <div className="space-y-6">
                            <Card className="p-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">System Health</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">App Version</span>
                                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{merchant.technical.appVersion}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Last Sync</span>
                                        <span className="text-sm font-medium text-green-600">{merchant.technical.lastSync}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">EBM Backlog</span>
                                        <span className={`text-sm font-bold ${merchant.ebmCompliance.backlogCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                            {merchant.ebmCompliance.backlogCount}
                                        </span>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                                    Run Health Check
                                </button>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'devices' && (
                    <Card className="overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-jet">Connected Devices</h3>
                            <button className="text-sm text-blue-600 hover:underline">Refresh List</button>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {merchant.technical.devices.map((device) => (
                                    <tr key={device.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {device.type === 'Tablet' ? <Tablet className="h-5 w-5 text-gray-400" /> :
                                                    device.type === 'Mobile' ? <Smartphone className="h-5 w-5 text-gray-400" /> :
                                                        <Laptop className="h-5 w-5 text-gray-400" />}
                                                <span className="font-medium text-jet">{device.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{device.ip}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.version}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${device.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {device.status === 'Online' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                                                {device.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{device.lastSeen}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                )}

                {activeTab === 'subscription' && (
                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-jet">Current Plan</h3>
                                    <p className="text-sm text-gray-500">Billing and subscription details</p>
                                </div>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                                    Change Plan
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-8">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Plan Name</p>
                                    <p className="text-xl font-bold text-jet">{merchant.subscription.plan}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {merchant.subscription.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Next Billing Date</p>
                                    <p className="text-xl font-bold text-jet">{merchant.subscription.expiryDate}</p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-jet">Payment History</h3>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {merchant.subscription.history.map((payment, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-jet">{payment.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{payment.invoice}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-jet">{payment.amount.toLocaleString()} RWF</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 hover:underline cursor-pointer">
                                                Download
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                )}

                {activeTab === 'logs' && (
                    <Card>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-jet">Audit Logs</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search logs..."
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-gold"
                                />
                                <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">Filter</button>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {merchant.logs.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-gray-50 flex items-start gap-4 transition-colors">
                                    <div className={`mt-1 p-2 rounded-full ${log.type === 'warning' ? 'bg-red-100 text-red-600' :
                                            log.type === 'success' ? 'bg-green-100 text-green-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        {log.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                                            log.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                                                <FileText className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <p className="font-medium text-jet">{log.event}</p>
                                            <span className="text-xs text-gray-500">{log.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{log.details}</p>
                                        <p className="text-xs text-gray-400 mt-1">User: {log.user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
