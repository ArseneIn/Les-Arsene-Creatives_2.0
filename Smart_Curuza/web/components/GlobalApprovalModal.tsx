'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { ShieldCheck, UserCheck, UserX, User, Clock, Bell, Lock, Activity } from 'lucide-react';

interface PendingLoginRequest {
    id: string;
    cashier?: { name?: string; email?: string; phone?: string };
    expires_at: string;
    status: string;
}

export default function GlobalApprovalModal() {
    const [pendingLogins, setPendingLogins] = useState<PendingLoginRequest[]>([]);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                // Only merchants/managers can approve logins
                setIsOwner(user.role === 'MERCHANT' || user.role === 'ADMIN');
            } catch (e) {
                setIsOwner(false);
            }
        }
    }, []);

    const fetchPendingLogins = useCallback(async () => {
        if (!isOwner) return;
        try {
            const data = await api.get<PendingLoginRequest[]>('/merchants/staff/pending-logins');
            setPendingLogins(data || []);
        } catch (error) {
            // Silently fail
        }
    }, [isOwner]);

    useEffect(() => {
        if (!isOwner) return;
        
        fetchPendingLogins();
        const interval = setInterval(fetchPendingLogins, 5000); // Faster polling (5s)
        return () => clearInterval(interval);
    }, [fetchPendingLogins, isOwner]);

    const handleApprove = async (requestId: string) => {
        setApprovingId(requestId);
        try {
            await api.post(`/auth/login/approve/${requestId}`, {});
            setPendingLogins(prev => prev.filter(req => req.id !== requestId));
        } catch (error) {
            console.error('Failed to approve login', error);
        } finally {
            setApprovingId(null);
        }
    };

    const handleReject = async (requestId: string) => {
        setApprovingId(requestId);
        try {
            await api.post(`/auth/login/reject/${requestId}`, {});
            setPendingLogins(prev => prev.filter(req => req.id !== requestId));
        } catch (error) {
            console.error('Failed to reject login', error);
        } finally {
            setApprovingId(null);
        }
    };

    if (!isOwner || pendingLogins.length === 0) return null;

    // Show the first request as primary focus
    const request = pendingLogins[0];
    const expiresAt = new Date(request.expires_at);
    const minutesLeft = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000));
    const isExpiring = minutesLeft <= 1;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
            {/* Immersive Backdrop */}
            <div className="absolute inset-0 bg-onyx/70 backdrop-blur-xl animate-in fade-in duration-500" />
            
            {/* Content Container */}
            <div className="relative w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-white rounded-[2rem] shadow-2xl border border-platinum-200 overflow-hidden">
                    {/* Header Decoration */}
                    <div className="bg-gold h-2 w-full" />
                    
                    <div className="p-8">
                        {/* Status Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center relative">
                                <Lock className="h-10 w-10 text-gold" />
                                <div className="absolute inset-0 rounded-full animate-ping bg-gold/20" />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-onyx mb-3 font-heading">Security Approval Required</h2>
                            <p className="text-jet-600 font-medium">
                                A staff member is attempting to access the Smart-Curuza POS system from a mobile device.
                            </p>
                        </div>

                        {/* Request Details Card */}
                        <div className="bg-platinum-50 rounded-2xl p-5 border border-platinum-200 mb-8 flex items-center gap-4">
                            <div className="w-14 h-14 bg-white rounded-full border border-platinum-200 flex items-center justify-center shadow-sm">
                                <User className="h-7 w-7 text-jet" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-onyx text-lg leading-tight">
                                    {request.cashier?.name || 'Team Member'}
                                </p>
                                <p className="text-sm text-jet-500 font-medium">
                                    {request.cashier?.phone || request.cashier?.email || 'Mobile Access'}
                                </p>
                                <div className={`flex items-center gap-1.5 text-xs mt-2 font-bold uppercase tracking-wider ${isExpiring ? 'text-red-500' : 'text-amber-600'}`}>
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>Expires in {isExpiring ? '< 1 min' : `${minutesLeft} mins`}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => handleApprove(request.id)}
                                disabled={approvingId !== null}
                                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {approvingId === request.id ? (
                                    <Activity className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <UserCheck className="h-6 w-6" />
                                        Grant Access Now
                                    </>
                                )}
                            </button>
                            
                            <button
                                onClick={() => handleReject(request.id)}
                                disabled={approvingId !== null}
                                className="w-full h-14 bg-white hover:bg-red-50 text-red-600 border-2 border-red-100 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <UserX className="h-6 w-6" />
                                Deny Access
                            </button>
                        </div>

                        {pendingLogins.length > 1 && (
                            <div className="mt-8 pt-6 border-t border-platinum-100 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-platinum-100 rounded-full">
                                    <Bell className="h-3.5 w-3.5 text-jet-600" />
                                    <span className="text-xs font-bold text-jet-700 uppercase tracking-tight">
                                        + {pendingLogins.length - 1} other pending requests
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
