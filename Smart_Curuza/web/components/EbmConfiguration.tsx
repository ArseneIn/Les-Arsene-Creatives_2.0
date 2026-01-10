import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Server, CheckCircle, AlertTriangle, RefreshCw, FileText } from 'lucide-react';

export default function EbmConfiguration() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'initialized' | 'not_initialized'>('not_initialized');
    const [codes, setCodes] = useState<any>(null);
    const [merchantId, setMerchantId] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const profile = await api.get<any>('/merchants/profile');
            setMerchantId(profile.id);
            // In a real app, we would check if EBM is initialized from the profile or a specific endpoint
            // For now, we assume it's not initialized if no specific flag exists
            if (profile.ebm_initialized) {
                setStatus('initialized');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleInitialize = async () => {
        if (!merchantId) return;
        setLoading(true);
        try {
            await api.post(`/ebm/init/${merchantId}`, {});
            setStatus('initialized');
            showToast('EBM Initialized Successfully', 'success');
        } catch (error) {
            console.error('Error initializing EBM:', error);
            showToast('Failed to initialize EBM', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncCodes = async () => {
        setLoading(true);
        try {
            const data = await api.get('/ebm/codes');
            setCodes(data);
            showToast('RRA Codes Synced Successfully', 'success');
        } catch (error) {
            console.error('Error syncing codes:', error);
            showToast('Failed to sync codes', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="bg-surface p-6 rounded-xl shadow-sm border border-platinum-600">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${status === 'initialized' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            <Server className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-jet font-heading">EBM Integration Status</h2>
                            <p className="text-jet-700">Manage your connection with Rwanda Revenue Authority</p>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-bold text-sm ${status === 'initialized' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {status === 'initialized' ? 'Connected' : 'Not Connected'}
                    </div>
                </div>

                {status === 'not_initialized' ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-orange-800">Action Required</h3>
                                <p className="text-orange-700 text-sm mt-1">
                                    Your shop is not yet connected to the EBM system. Please initialize the connection to ensure tax compliance.
                                </p>
                                <button
                                    onClick={handleInitialize}
                                    disabled={loading}
                                    className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Initializing...' : 'Initialize EBM Connection'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-green-800">System Operational</h3>
                                <p className="text-green-700 text-sm mt-1">
                                    Your EBM connection is active. Sales are being synchronized automatically.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-t border-platinum-600 pt-6">
                    <h3 className="font-bold text-jet mb-4">Configuration Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={handleSyncCodes}
                            disabled={loading}
                            className="p-4 border border-platinum-600 rounded-lg hover:border-gold hover:bg-gold/5 transition-all text-left flex items-center gap-3 group"
                        >
                            <div className="bg-platinum-200 p-2 rounded-lg group-hover:bg-gold/20 transition-colors">
                                <RefreshCw className="h-5 w-5 text-jet group-hover:text-gold" />
                            </div>
                            <div>
                                <p className="font-bold text-jet">Sync RRA Codes</p>
                                <p className="text-xs text-jet-700">Update item classifications and tax types</p>
                            </div>
                        </button>

                        <button
                            className="p-4 border border-platinum-600 rounded-lg hover:border-gold hover:bg-gold/5 transition-all text-left flex items-center gap-3 group"
                        >
                            <div className="bg-platinum-200 p-2 rounded-lg group-hover:bg-gold/20 transition-colors">
                                <FileText className="h-5 w-5 text-jet group-hover:text-gold" />
                            </div>
                            <div>
                                <p className="font-bold text-jet">View EBM Reports</p>
                                <p className="text-xs text-jet-700">Check transmission logs and errors</p>
                            </div>
                        </button>
                    </div>
                </div>

                {codes && (
                    <div className="mt-6 bg-platinum-100 p-4 rounded-lg overflow-auto max-h-60">
                        <pre className="text-xs text-jet-700 font-mono">{JSON.stringify(codes, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
