import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Modal } from 'react-native';
import { ShieldCheck, UserCheck, UserX, Clock, User, Banknote, X, TrendingUp, ShoppingBag, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../../lib/theme/ThemeContext';
import { ApiClient } from '../../lib/api_client';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function TeamScreen() {
    const { colors, isDarkMode } = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    const [pendingLogins, setPendingLogins] = useState<any[]>([]);
    const [teamProgress, setTeamProgress] = useState<any[]>([]);

    // Staff sales modal state
    const [salesModal, setSalesModal] = useState<{ staff: any; data: any } | null>(null);
    const [loadingSales, setLoadingSales] = useState(false);
    const [salesPreset, setSalesPreset] = useState<'all' | 'today' | 'week' | 'month'>('all');

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
            // Suppress alert to prevent annoying popups during background polling
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

    const handleViewSales = async (staff: any, preset: 'all' | 'today' | 'week' | 'month' = 'all') => {
        setLoadingSales(true);
        setSalesPreset(preset);
        if (preset === 'all') setSalesModal({ staff, data: null });
        try {
            let query = '';
            const now = new Date();
            if (preset === 'today') {
                const d = now.toISOString().split('T')[0];
                query = `?startDate=${d}&endDate=${d}`;
            } else if (preset === 'week') {
                const start = new Date(now); start.setDate(now.getDate() - 6);
                query = `?startDate=${start.toISOString().split('T')[0]}&endDate=${now.toISOString().split('T')[0]}`;
            } else if (preset === 'month') {
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                query = `?startDate=${start.toISOString().split('T')[0]}&endDate=${now.toISOString().split('T')[0]}`;
            }
            const data = await ApiClient._request(`/merchants/staff/${staff.id}/sales${query}`);
            setSalesModal({ staff, data });
        } catch (error) {
            Alert.alert('Error', 'Failed to load sales data.');
            setSalesModal(null);
        } finally {
            setLoadingSales(false);
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
                                        style={[styles.actionBtn, { backgroundColor: colors.brandGreen }]}
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
                        <Banknote size={20} color={colors.brandGreen} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today's Progress</Text>
                    </View>

                    {teamProgress.map((staff) => (
                        <View key={staff.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={styles.cardInfo}>
                                <View style={[styles.avatar, { backgroundColor: staff.shiftOpen ? 'rgba(34,197,94,0.1)' : colors.overlay }]}>
                                    {staff.shiftOpen ? <Clock size={20} color={colors.brandGreen} /> : <User size={20} color={colors.textSecondary} />}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{staff.name}</Text>
                                    <Text style={[styles.cardSubtitle, { color: staff.shiftOpen ? colors.brandGreen : colors.textSecondary }]}>
                                        {staff.shiftOpen ? 'Active Shift' : 'Offline'}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Today's Sales</Text>
                                    <Text style={[styles.cardAmount, { color: colors.textPrimary }]}>RWF {staff.totalSales.toLocaleString()}</Text>
                                    <TouchableOpacity onPress={() => handleViewSales(staff)} style={{ marginTop: 6 }}>
                                        <Text style={{ color: colors.brandGold, fontFamily: 'Montserrat_600SemiBold', fontSize: 11 }}>View Sales →</Text>
                                    </TouchableOpacity>
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

            {/* Sales Modal */}
            <Modal visible={salesModal !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSalesModal(null)}>
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{salesModal?.staff?.name}'s Sales</Text>
                            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>All-time transaction history</Text>
                        </View>
                        <TouchableOpacity onPress={() => setSalesModal(null)} style={[styles.closeBtn, { backgroundColor: colors.overlay }]}>
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {loadingSales || !salesModal?.data ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={colors.brandGold} />
                        </View>
                    ) : (
                        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                            {/* Date preset filter */}
                            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                                {(['all', 'today', 'week', 'month'] as const).map(preset => (
                                    <TouchableOpacity
                                        key={preset}
                                        onPress={() => handleViewSales(salesModal!.staff, preset)}
                                        style={[styles.presetBtn, salesPreset === preset ? { backgroundColor: colors.brandGold } : { backgroundColor: colors.overlay, borderColor: colors.border, borderWidth: 1 }]}
                                    >
                                        <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 11, color: salesPreset === preset ? '#1a1a1a' : colors.textSecondary }}>
                                            {preset === 'all' ? 'All' : preset === 'today' ? 'Today' : preset === 'week' ? '7 Days' : 'Month'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* KPI Summary */}
                            <View style={styles.kpiRow}>
                                <View style={[styles.kpiCard, { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.2)' }]}>
                                    <TrendingUp size={16} color="#16a34a" />
                                    <Text style={[styles.kpiValue, { color: '#15803d' }]}>RWF {Number(salesModal.data.summary.totalRevenue).toLocaleString()}</Text>
                                    <Text style={[styles.kpiLabel, { color: '#16a34a' }]}>Total Revenue</Text>
                                </View>
                                <View style={[styles.kpiCard, { backgroundColor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)' }]}>
                                    <ShoppingBag size={16} color="#2563eb" />
                                    <Text style={[styles.kpiValue, { color: '#1d4ed8' }]}>{salesModal.data.summary.totalSales}</Text>
                                    <Text style={[styles.kpiLabel, { color: '#2563eb' }]}>Sales</Text>
                                </View>
                                <View style={[styles.kpiCard, { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' }]}>
                                    <RotateCcw size={16} color="#dc2626" />
                                    <Text style={[styles.kpiValue, { color: '#b91c1c' }]}>{salesModal.data.summary.refunds}</Text>
                                    <Text style={[styles.kpiLabel, { color: '#dc2626' }]}>Refunds</Text>
                                </View>
                            </View>

                            {/* Sale list */}
                            {salesModal.data.sales.length === 0 ? (
                                <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 32, fontFamily: 'Montserrat_500Medium' }}>No sales recorded yet.</Text>
                            ) : salesModal.data.sales.map((sale: any) => (
                                <View key={sale.id} style={[styles.saleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                                                <View style={[styles.badge, { backgroundColor: sale.status === 'COMPLETED' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)' }]}>
                                                    <Text style={{ fontSize: 10, fontFamily: 'Montserrat_700Bold', color: sale.status === 'COMPLETED' ? '#16a34a' : '#dc2626' }}>{sale.status}</Text>
                                                </View>
                                                <View style={[styles.badge, { backgroundColor: colors.overlay }]}>
                                                    <Text style={{ fontSize: 10, fontFamily: 'Montserrat_600SemiBold', color: colors.textSecondary }}>{sale.payment_method}</Text>
                                                </View>
                                            </View>
                                            <Text style={{ fontSize: 11, color: colors.textSecondary, fontFamily: 'Montserrat_400Regular', marginTop: 4 }}>
                                                {new Date(sale.created_at).toLocaleString()}
                                            </Text>
                                            {sale.items?.length > 0 && (
                                                <Text style={{ fontSize: 11, color: colors.textSecondary, fontFamily: 'Montserrat_400Regular', marginTop: 2 }}>
                                                    {sale.items.map((i: any) => i.productName).join(', ')}
                                                </Text>
                                            )}
                                        </View>
                                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: sale.status === 'REFUNDED' ? colors.danger : colors.textPrimary, textDecorationLine: sale.status === 'REFUNDED' ? 'line-through' : 'none' }}>
                                            RWF {Number(sale.total).toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </ScreenWrapper>
    );
}

// Unused but imported icons suppressed by usage in JSX above

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
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
    },
    modalSubtitle: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 13,
        marginTop: 2,
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    kpiRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    kpiCard: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 1,
        padding: 12,
        alignItems: 'center',
        gap: 4,
    },
    kpiValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 13,
        textAlign: 'center',
    },
    kpiLabel: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 10,
        textAlign: 'center',
    },
    saleCard: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
        marginBottom: 10,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
    },
    presetBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
    },
});
