import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { ShieldCheck, UserCheck, UserX, User, Lock, Clock } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../lib/theme/ThemeContext';
import { ApiClient } from '../lib/api_client';
import { useAuth } from '../lib/auth/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GlobalApprovalModal() {
    const { colors, isDarkMode } = useTheme();
    const { user } = useAuth();
    const [pendingLogins, setPendingLogins] = useState<any[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Only owners/managers should poll for approvals
    const isOwner = user?.role !== 'CASHIER' && user?.role !== null;

    useEffect(() => {
        if (!isOwner) return;

        const checkApprovals = async () => {
            try {
                const logins = await ApiClient.getPendingLogins(true);
                // Ensure we only show if there are actual pending requests
                setPendingLogins(logins || []);
            } catch (error) {
                // Fail silently in background
            }
        };

        // Check immediately
        checkApprovals();

        // Then poll every 5 seconds for faster responsiveness
        const interval = setInterval(checkApprovals, 5000);
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

    // We only show the first request to keep it focused
    const request = pendingLogins[0];
    const expiryDate = new Date(request.expires_at);
    const timeStr = expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Modal transparent visible animationType="fade" statusBarTranslucent>
            <BlurView 
                intensity={Platform.OS === 'ios' ? 40 : 80} 
                tint={isDarkMode ? 'dark' : 'light'} 
                style={styles.fullScreen}
            >
                <View style={styles.container}>
                    <View style={[styles.card, { backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)', borderColor: colors.border }]}>
                        {/* Header Decoration */}
                        <View style={[styles.iconHalo, { backgroundColor: isDarkMode ? 'rgba(251, 225, 52, 0.1)' : 'rgba(251, 225, 52, 0.15)' }]}>
                            <Lock size={32} color={colors.brandGold} />
                        </View>

                        <Text style={[styles.title, { color: colors.textPrimary }]}>Access Requested</Text>
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            A team member is trying to sign in to your shop. Please verify their identity before granting access.
                        </Text>

                        {/* Request Card */}
                        <View style={[styles.userBox, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                            <View style={[styles.avatar, { backgroundColor: colors.brandGold }]}>
                                <User size={24} color="#000" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.userName, { color: colors.textPrimary }]}>{request.cashier?.name || 'Staff Member'}</Text>
                                <View style={styles.timeRow}>
                                    <Clock size={12} color={colors.danger} />
                                    <Text style={[styles.timeText, { color: colors.danger }]}>Expires at {timeStr}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <TouchableOpacity 
                                style={[styles.rejectBtn, { borderColor: colors.danger }]}
                                onPress={() => handleReject(request.id)}
                                disabled={processingId === request.id}
                            >
                                {processingId === request.id ? (
                                    <ActivityIndicator size="small" color={colors.danger} />
                                ) : (
                                    <>
                                        <UserX size={20} color={colors.danger} />
                                        <Text style={[styles.rejectText, { color: colors.danger }]}>Reject</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.approveBtn, { backgroundColor: colors.brandGreen }]}
                                onPress={() => handleApprove(request.id)}
                                disabled={processingId === request.id}
                            >
                                {processingId === request.id ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <>
                                        <UserCheck size={20} color="#FFF" />
                                        <Text style={styles.approveText}>Approve Access</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        {pendingLogins.length > 1 && (
                            <Text style={[styles.moreText, { color: colors.textSecondary }]}>
                                + {pendingLogins.length - 1} other pending requests
                            </Text>
                        )}
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 32,
        padding: 32,
        borderWidth: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 20,
    },
    iconHalo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 28,
    },
    userBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 32,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    userName: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    timeText: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 12,
    },
    actions: {
        width: '100%',
        gap: 16,
    },
    approveBtn: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    approveText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#FFF',
    },
    rejectBtn: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        gap: 10,
    },
    rejectText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
    },
    moreText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 12,
        marginTop: 20,
    },
});
