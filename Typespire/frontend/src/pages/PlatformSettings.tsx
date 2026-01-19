import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const PlatformSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'billing'>('general');
    const [settings, setSettings] = useState({
        siteName: 'Typespire',
        supportEmail: 'support@typespire.com',
        maintenanceMode: false,
        minPasswordLength: 8,
        requireSpecialChar: true,
        enable2FA: false,
        sessionTimeout: 30,
        emailSenderName: 'Typespire Team',
        emailReplyTo: 'no-reply@typespire.com'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                if (response.data) {
                    setSettings(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch settings', error);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            await api.patch('/settings', settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings', error);
            alert('Failed to save settings');
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage global configuration and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-admin-primary hover:bg-admin-primary/90 text-navy-blue font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-admin-primary/20 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">save</span>
                    Save Changes
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <nav className="flex flex-col p-2">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-slate-100 dark:bg-slate-700 text-admin-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                            >
                                <span className="material-symbols-outlined">tune</span>
                                General
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-slate-100 dark:bg-slate-700 text-admin-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                            >
                                <span className="material-symbols-outlined">security</span>
                                Security
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-slate-100 dark:bg-slate-700 text-admin-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                Notifications
                            </button>
                            <button
                                onClick={() => setActiveTab('billing')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-slate-100 dark:bg-slate-700 text-admin-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                            >
                                <span className="material-symbols-outlined">credit_card</span>
                                Billing & Plans
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h2 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">General Information</h2>
                                <div className="grid gap-6 max-w-2xl">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Platform Name</label>
                                        <input
                                            type="text"
                                            value={settings.siteName}
                                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-admin-primary/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Support Email</label>
                                        <input
                                            type="email"
                                            value={settings.supportEmail}
                                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-admin-primary/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h2 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">System Status</h2>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-slate-900 dark:text-white">Maintenance Mode</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Prevent users from accessing the platform during updates.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.maintenanceMode}
                                            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary/30 dark:peer-focus:ring-admin-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h2 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">Password Policy</h2>
                                <div className="grid gap-6 max-w-2xl">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Minimum Password Length</label>
                                        <input
                                            type="number"
                                            value={settings.minPasswordLength}
                                            onChange={(e) => setSettings({ ...settings, minPasswordLength: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-admin-primary/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-slate-900 dark:text-white">Require Special Characters</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Passwords must contain at least one special character.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={settings.requireSpecialChar}
                                                onChange={(e) => setSettings({ ...settings, requireSpecialChar: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary/30 dark:peer-focus:ring-admin-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h2 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">Access Control</h2>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="font-medium text-slate-900 dark:text-white">Enforce 2FA for Admins</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Require Two-Factor Authentication for all administrative accounts.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.enable2FA}
                                            onChange={(e) => setSettings({ ...settings, enable2FA: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary/30 dark:peer-focus:ring-admin-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-primary"></div>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Session Timeout (Minutes)</label>
                                    <input
                                        type="number"
                                        value={settings.sessionTimeout}
                                        onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-admin-primary/50 outline-none transition-all max-w-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h2 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">Email Configuration</h2>
                                <div className="grid gap-6 max-w-2xl">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Sender Name</label>
                                        <input
                                            type="text"
                                            value={settings.emailSenderName}
                                            onChange={(e) => setSettings({ ...settings, emailSenderName: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-admin-primary/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Reply-To Email</label>
                                        <input
                                            type="email"
                                            value={settings.emailReplyTo}
                                            onChange={(e) => setSettings({ ...settings, emailReplyTo: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-admin-primary/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-slate-400">credit_card_off</span>
                            </div>
                            <h2 className="text-xl font-bold mb-2">Billing Module Not Active</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                The billing and subscription management module is currently disabled or not configured for this environment.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;
