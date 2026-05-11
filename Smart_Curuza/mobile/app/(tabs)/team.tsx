import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { ShieldCheck, UserCheck, UserX, Clock, User, Banknote } from 'lucide-react-native';
import { useTheme } from '../../lib/theme/ThemeContext';
import { ApiClient } from '../../lib/api_client';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function TeamScreen() {
    const { colors, isDarkMode } = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    const [pendingLogins, setPendingLogins] = useState<any[]>([]);
    const [teamProgress, setTeamProgress] = useState<any[]>([]);

    const fetchData = async (bypassCache = false) => {
        try {
            const [logins, progress] = await Promise.all([
                ApiClient.getPendingLogins(bypassCache),
                ApiClient.getTeamProgress(bypassCache),
            ]);
            setPendingLogins(logins);
            setTeamProgress(progress);
        } catch (error: any) {
            console.error('Error fetching team data:', error);
            if (bypassCache) {
                Alert.alert('Error', 'Failed to refresh team data.');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Set up polling for pending logins every 10 seconds
        const interval = setInterval(() => {
            fetchData(true);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData(true);
    };

    const handleApprove = async (requestId: string) => {
        try {
            await ApiClient.approveLogin(requestId);
            fetchData(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to approve login.');
        }
    };

    const handleReject = async (requestId: string) => {
        try {
            await ApiClient.rejectLogin(requestId);
            fetchData(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to reject login.');
        }
    };

    if (loading) {
        return (
            <ScreenWrapper>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.brandGold} />
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Team Management</Text>
            </View>

            <ScrollView 
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brandGold} />}
            >
                {/* PENDING LOGINS SECTION */}
                {pendingLogins.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ShieldCheck size={20} color={colors.brandGold} />
                            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Login Approvals</Text>
                        </View>
                        
                        {pendingLogins.map((request) => (
                            <View key={request.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <View style={styles.cardInfo}>
                                    <View style={[styles.avatar, { backgroundColor: colors.overlay }]}>
                                        <User size={20} color={colors.brandGold} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{request.cashier?.name}</Text>
                                        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Wants to log in</Text>
                                        <Text style={[styles.cardTime, { color: colors.danger }]}>
                                            Expires at {new Date(request.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.actionRow}>
                                    <TouchableOpacity 
                                        style={[styles.actionBtn, { backgroundColor: 'rgba(239,68,68,0.1)' }]} 
                                        onPress={() => handleReject(request.id)}
                                    >
                                        <UserX size={18} color={colors.danger} />
                                        <Text style={[styles.actionText, { color: colors.danger }]}>Reject</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.actionBtn, { backgroundColor: colors.success }]}
                                        onPress={() => handleApprove(request.id)}
                                    >
                                        <UserCheck size={18} color="#FFF" />
                                        <Text style={[styles.actionText, { color: '#FFF' }]}>Approve</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* TEAM PROGRESS SECTION */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Banknote size={20} color={colors.success} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today's Progress</Text>
                    </View>

                    {teamProgress.map((staff) => (
                        <View key={staff.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={styles.cardInfo}>
                                <View style={[styles.avatar, { backgroundColor: staff.shiftOpen ? 'rgba(34,197,94,0.1)' : colors.overlay }]}>
                                    {staff.shiftOpen ? <Clock size={20} color={colors.success} /> : <User size={20} color={colors.textSecondary} />}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{staff.name}</Text>
                                    <Text style={[styles.cardSubtitle, { color: staff.shiftOpen ? colors.success : colors.textSecondary }]}>
                                        {staff.shiftOpen ? 'Active Shift' : 'Offline'}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Today's Sales</Text>
                                    <Text style={[styles.cardAmount, { color: colors.textPrimary }]}>RWF {staff.totalSales.toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    {teamProgress.length === 0 && (
                        <View style={{ alignItems: 'center', padding: 20 }}>
                            <Text style={{ color: colors.textSecondary, fontFamily: 'Montserrat_500Medium' }}>No team members found.</Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
    },
    section: {
        padding: 24,
        paddingBottom: 0,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
        marginLeft: 8,
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
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
    },
    cardSubtitle: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 12,
        marginTop: 2,
    },
    cardTime: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 11,
        marginTop: 4,
    },
    cardAmount: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        marginTop: 2,
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
    }
});
