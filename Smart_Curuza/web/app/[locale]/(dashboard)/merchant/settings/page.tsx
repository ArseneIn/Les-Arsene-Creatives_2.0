'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Save, Store, MapPin, Phone, FileText } from 'lucide-react';

interface MerchantProfile {
    business_name: string;
    address: string;
    phone: string;
    tin: string;
}

import TeamManager from '@/components/TeamManager';
import EbmConfiguration from '@/components/EbmConfiguration';

export default function SettingsPage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'ebm'>('profile');
    const [profile, setProfile] = useState<MerchantProfile>({
        business_name: '',
        address: '',
        phone: '',
        tin: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await api.get<MerchantProfile>('/merchants/profile');
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            showToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/merchants/profile', profile);
            showToast('Settings saved successfully', 'success');
        } catch (error: any) {
            console.error('Error saving profile:', error);
            console.error('Error details:', error.response?.data);
            showToast('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-jet-700">Loading settings...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-platinum-200 rounded-full flex items-center justify-center">
                    <Store className="h-6 w-6 text-jet" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-jet font-heading">Shop Settings</h1>
                    <p className="text-jet-700">Manage your business profile and team</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-platinum-600 mb-6">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'profile' ? 'text-gold' : 'text-jet-600 hover:text-jet'
                        }`}
                >
                    Shop Profile
                    {activeTab === 'profile' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'team' ? 'text-gold' : 'text-jet-600 hover:text-jet'
                        }`}
                >
                    Team Management
                    {activeTab === 'team' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('ebm')}
                    className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'ebm' ? 'text-gold' : 'text-jet-600 hover:text-jet'
                        }`}
                >
                    EBM Configuration
                    {activeTab === 'ebm' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-t-full" />
                    )}
                </button>
            </div>

            {activeTab === 'profile' ? (
                <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-xl shadow-sm border border-platinum-600 space-y-6 animate-in fade-in slide-in-from-left-4 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Business Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-jet mb-1">Business Name</label>
                            <div className="relative">
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-jet-500" />
                                <input
                                    type="text"
                                    name="business_name"
                                    value={profile.business_name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-platinum-300 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-jet transition-all"
                                    placeholder="Enter your shop name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-jet mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-jet-500" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-platinum-300 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-jet transition-all"
                                    placeholder="+250..."
                                    required
                                />
                            </div>
                        </div>

                        {/* TIN */}
                        <div>
                            <label className="block text-sm font-medium text-jet mb-1">TIN Number</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-jet-500" />
                                <input
                                    type="text"
                                    name="tin"
                                    value={profile.tin}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-platinum-300 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-jet transition-all"
                                    placeholder="Tax Identification Number"
                                    required
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-jet mb-1">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-jet-500" />
                                <textarea
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-platinum-300 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-jet resize-none transition-all"
                                    placeholder="Shop location..."
                                    required
                                />
                            </div>
                        </div>

                    </div>

                    <div className="pt-4 border-t border-platinum-600 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-gold text-onyx rounded-lg font-bold hover:bg-gold/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : activeTab === 'team' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                    <TeamManager />
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                    <EbmConfiguration />
                </div>
            )}
        </div>
    );
}
