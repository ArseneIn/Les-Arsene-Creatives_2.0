import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { ShieldCheck, UserCheck, UserX, User } from 'lucide-react-native';
import { useTheme } from '../lib/theme/ThemeContext';
import { ApiClient } from '../lib/api_client';
import { useAuth } from '../lib/auth/AuthContext';

export default function GlobalApprovalModal() {
    const { colors, isDarkMode } = useTheme();
    const { user } = useAuth();
    const [pendingLogins, setPendingLogins] = useState<any[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Only owners/managers should poll for approvals
    const isOwner = user?.role !== 'CASHIER';

    useEffect(() => {
        if (!isOwner) return;

        const checkApprovals = async () => {
            try {
                const logins = await ApiClient.getPendingLogins(true);
                setPendingLogins(logins);
            } catch (error) {
                // Fail silently in background
            }
        };

        // Check immediately
        checkApprovals();

        // Then poll every 10 seconds
        const interval = setInterval(checkApprovals, 10000);
        return () => clearInterval(interval);
    }, [isOwner]);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await ApiClient.approveLogin(id);
            setPendingLogins(prev => prev.filter(req => req.id !== id));
        } catch (error) {
            console.error('Failed to approve', error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        try {
            await ApiClient.rejectLogin(id);
            setPendingLogins(prev => prev.filter(req => req.id !== id));
        } catch (error) {
            console.error('Failed to reject', error);
        } finally {
            setProcessingId(null);
        }
    };

    if (!isOwner || pendingLogins.length === 0) return null;

    return (
        <Modal transparent visible animationType="fade">
            <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.header}>
                        <ShieldCheck size={24} color={colors.brandGold} />
                        <Text style={[styles.title, { color: colors.textPrimary }]}>Login Approval Required</Text>
                    </View>
                    
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {pendingLogins.length} team member(s) waiting for access.
                    </Text>

                    {pendingLogins.slice(0, 3).map(request => (
                        <View key={request.id} style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <View style={styles.cardInfo}>
                                <View style={[styles.avatar, { backgroundColor: colors.overlay }]}>
                                    <User size={20} color={colors.brandGold} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{request.cashier?.name}</Text>
                                    <Text style={[styles.cardTime, { color: colors.danger }]}>
                                        Expires at {new Date(request.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.actionRow}>
                                <TouchableOpacity 
                                    style={[styles.actionBtn, { backgroundColor: 'rgba(239,68,68,0.1)' }]} 
                                    onPress={() => handleReject(request.id)}
                                    disabled={processingId === request.id}
                                >
                                    {processingId === request.id ? <ActivityIndicator size="small" color={colors.danger} /> : <UserX size={18} color={colors.danger} />}
                                    <Text style={[styles.actionText, { color: colors.danger }]}>Reject</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.actionBtn, { backgroundColor: colors.brandGreen }]}
                                    onPress={() => handleApprove(request.id)}
                                    disabled={processingId === request.id}
                                >
                                    {processingId === request.id ? <ActivityIndicator size="small" color="#FFF" /> : <UserCheck size={18} color="#FFF" />}
                                    <Text style={[styles.actionText, { color: '#FFF' }]}>Approve</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 9999,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
    },
    subtitle: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        marginBottom: 20,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
    },
    cardTime: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 12,
        marginTop: 4,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 14,
    },
});
