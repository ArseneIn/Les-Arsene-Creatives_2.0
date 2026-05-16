import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Linking, Alert } from 'react-native';
import { Search, User, Users, Phone, PhoneCall, AlertTriangle, CheckCircle, ChevronRight, RefreshCw, UserPlus, CreditCard } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';
import SkeletonLoader from './SkeletonLoader';
import { useAuth } from '../lib/auth/AuthContext';
import CreateCustomerModal from './CreateCustomerModal';
import ClientHistoryModal from './ClientHistoryModal';
import DebtRepaymentModal from './DebtRepaymentModal';
import { useTheme } from '../lib/theme/ThemeContext';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    summaryContainer: {
        marginBottom: 20,
    },
    summaryCardMain: {
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 12,
        borderWidth: 1,
        position: 'relative',
    },
    addClientHeaderBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    summaryLabel: {
        fontSize: 11,
        fontFamily: 'Montserrat_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },
    summaryValueMain: {
        fontSize: 32,
        fontFamily: 'Poppins_700Bold',
        color: '#EF4444', 
    },
    summaryCardSub: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderWidth: 1,
    },
    subItem: {
        alignItems: 'center',
    },
    subLabel: {
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold',
    },
    subValue: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
    subDivider: {
        width: 1,
        height: '100%',
    },
    commandBar: {
        marginBottom: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 54,
        borderRadius: 16,
        borderWidth: 1,
        borderTopWidth: 3,
        borderTopColor: '#fbe134',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 20,
        gap: 16,
    },
    clientCard: {
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
    },
    clientName: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
    },
    clientPhone: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
    },
    debtBadge: {
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    debtBadgeText: {
        fontSize: 9,
        fontFamily: 'Montserrat_800ExtraBold',
        color: '#EF4444',
    },
    clearBadge: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    clearBadgeText: {
        fontSize: 9,
        fontFamily: 'Montserrat_800ExtraBold',
        color: '#10B981',
    },
    financialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    finItem: {
        flex: 1,
    },
    finItemRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    finLabel: {
        fontSize: 9,
        fontFamily: 'Montserrat_700Bold',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    finValue: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
    },
    currency: {
        fontSize: 9,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fbe134',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    actionButtonText: {
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
    },
    repayButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    repayButtonText: {
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    actionButtonGhost: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginTop: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    emptyStateIconBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        marginBottom: 8,
    },
    emptyStateDesc: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 20,
    },
    emptyStateButton: {
        backgroundColor: '#fbe134', 
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyStateButtonText: {
        fontSize: 13,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
    }
});

interface ClientRecord {
    id: string;
    name: string;
    phone: string;
    lifetimeValue: number;
    outstandingDebt: number;
    lastActive: string;
}

const CRMSkeleton = () => {
    return (
        <View style={{ gap: 16 }}>
            <SkeletonLoader height={140} borderRadius={24} style={{ marginBottom: 16 }} />
            <View style={styles.summaryCardSub}>
                <SkeletonLoader width="45%" height={60} borderRadius={16} />
                <SkeletonLoader width="45%" height={60} borderRadius={16} />
            </View>
            <SkeletonLoader height={54} borderRadius={16} style={{ marginTop: 12, marginBottom: 20 }} />
            {[1, 2, 3].map(k => (
                <SkeletonLoader key={k} height={100} borderRadius={24} style={{ marginBottom: 12 }} />
            ))}
        </View>
    );
};

export default function CRMModule() {
    const { user } = useAuth();
    const { colors, isDarkMode } = useTheme();
    const isCashier = user?.role === 'CASHIER';
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [clients, setClients] = useState<ClientRecord[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<{ id: string; name: string; debt?: number } | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showRepayModal, setShowRepayModal] = useState(false);

    const handleViewHistory = (client: ClientRecord) => {
        setSelectedClient({ id: client.id, name: client.name });
        setShowHistoryModal(true);
    };

    const handleOpenRepay = (client: ClientRecord) => {
        setSelectedClient({ id: client.id, name: client.name, debt: client.outstandingDebt });
        setShowRepayModal(true);
    };

    const fetchCustomers = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const data = await ApiClient.getCustomers(showRefresh);
            const mappedClients: ClientRecord[] = data.map((c: any) => ({
                id: c.id,
                name: c.name,
                phone: c.phone || 'No Phone',
                lifetimeValue: Number(c.lifetime_value) || 0,
                outstandingDebt: Number(c.total_debt) || 0,
                lastActive: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'New'
            }));
            setClients(mappedClients);
        } catch (error) {
            console.error('CRMModule: Error fetching customers:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRepayment = async (amount: number) => {
        if (!selectedClient) return;
        setLoading(true);
        try {
            await ApiClient.recordRepayment(selectedClient.id, amount);
            Alert.alert("Success", "Repayment recorded successfully");
            setShowRepayModal(false);
            fetchCustomers(true);
        } catch (error) {
            console.error('CRMModule: Repayment failed', error);
            Alert.alert("Error", "Could not record repayment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCall = (phone: string) => {
        const url = `tel:${phone.replace(/\s/g, '')}`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert("Error", "Your device does not support phone calls");
            }
        });
    };

    const handleSendReminder = async (client: ClientRecord) => {
        try {
            setLoading(true);
            const shopProfile = await ApiClient.getMerchantProfile();
            const shopName = shopProfile.businessName || 'Smart Curuza Shop';
            
            await ApiClient.sendReminder(client.id, shopName);
            Alert.alert("Success", `Reminder sent to ${client.name}`);
        } catch (error) {
            console.error('CRMModule: Reminder failed', error);
            Alert.alert("Error", "Could not send reminder. Please check your SMS configuration.");
        } finally {
            setLoading(false);
        }
    };

    const totalClients = clients.length;
    const totalDebt = clients.reduce((sum, client) => sum + client.outstandingDebt, 0);
    const clientsWithDebt = clients.filter(c => c.outstandingDebt > 0).length;

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.phone.includes(searchQuery)
    );

    const renderClientCard = ({ item }: { item: ClientRecord }) => (
        <View style={styles.clientCard}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarRow}>
                    <View style={styles.avatarBox}>
                        <User size={20} color="#fbe134" />
                    </View>
                    <View>
                        <Text style={styles.clientName}>{item.name}</Text>
                        <Text style={styles.clientPhone}>{item.phone}</Text>
                    </View>
                </View>
                
                {item.outstandingDebt > 0 ? (
                    <View style={styles.debtBadge}>
                         <Text style={styles.debtBadgeText}>OWES MONEY</Text>
                    </View>
                ) : (
                    <View style={styles.clearBadge}>
                        <Text style={styles.clearBadgeText}>CLEARED</Text>
                    </View>
                )}
            </View>

            {!isCashier && (
                <View style={styles.financialRow}>
                    <View style={styles.finItem}>
                        <Text style={styles.finLabel}>Lifetime Value</Text>
                        <Text style={styles.finValue}>{item.lifetimeValue.toLocaleString()} <Text style={styles.currency}>RWF</Text></Text>
                    </View>
                    
                    <View style={styles.finItemRight}>
                        <Text style={styles.finLabel}>Debt</Text>
                        <Text style={[
                            styles.finValue, 
                            item.outstandingDebt > 0 ? { color: '#EF4444' } : { color: '#10B981' }
                        ]}>
                            {item.outstandingDebt.toLocaleString()} <Text style={styles.currency}>RWF</Text>
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.actionRow}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleCall(item.phone)}
                >
                    <PhoneCall size={16} color="#0b0c0c" />
                    <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>

                {item.outstandingDebt > 0 && (
                    <TouchableOpacity 
                        style={styles.repayButton}
                        onPress={() => handleOpenRepay(item)}
                    >
                        <Text style={styles.repayButtonText}>REPAY</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity 
                    style={styles.actionButtonGhost}
                    onPress={() => item.outstandingDebt > 0 ? handleSendReminder(item) : handleViewHistory(item)}
                >
                    {item.outstandingDebt > 0 ? (
                        <AlertTriangle size={18} color="#EF4444" />
                    ) : (
                        <ChevronRight size={18} color="#6B7280" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconBox}>
                <Users size={32} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyStateTitle}>No Clients Found</Text>
            <Text style={styles.emptyStateDesc}>
                {searchQuery 
                    ? `We couldn't find any clients matching "${searchQuery}".` 
                    : "Your CRM is currently empty. Start building your client roster to track debts and value."}
            </Text>
            {!searchQuery && (
                <TouchableOpacity 
                    style={styles.emptyStateButton}
                    onPress={() => setShowCreateModal(true)}
                >
                    <Text style={styles.emptyStateButtonText}>Add First Client</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading && clients.length === 0) {
        return (
            <View style={styles.container}>
                <CRMSkeleton />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.summaryContainer}>
                {!isCashier ? (
                    <View style={[styles.summaryCardMain, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: isDarkMode ? '#000' : colors.border }]}>
                        <TouchableOpacity 
                            style={[styles.addClientHeaderBtn, { backgroundColor: colors.overlay }]}
                            onPress={() => setShowCreateModal(true)}
                        >
                            <UserPlus size={18} color={colors.brandGold} />
                        </TouchableOpacity>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Outstanding Debt</Text>
                        <Text style={styles.summaryValueMain}>{totalDebt.toLocaleString()} <Text style={{fontSize: 14, color: colors.textSecondary}}>RWF</Text></Text>
                    </View>
                ) : (
                    <View style={[styles.summaryCardMain, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: isDarkMode ? '#000' : colors.border }]}>
                        <TouchableOpacity 
                            style={[styles.addClientHeaderBtn, { backgroundColor: colors.overlay }]}
                            onPress={() => setShowCreateModal(true)}
                        >
                            <UserPlus size={18} color={colors.brandGold} />
                        </TouchableOpacity>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Client Database</Text>
                        <Text style={[styles.summaryValueMain, { color: colors.brandGold }]}>{totalClients} <Text style={{fontSize: 14, color: colors.textSecondary}}>Clients</Text></Text>
                    </View>
                )}

                {!isCashier && (
                    <View style={[styles.summaryCardSub, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.subItem}>
                            <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Total Clients</Text>
                            <Text style={[styles.subValue, { color: colors.textPrimary }]}>{totalClients}</Text>
                        </View>
                        <View style={[styles.subDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.subItem}>
                            <Text style={[styles.subLabel, { color: colors.textSecondary }]}>In Debt</Text>
                            <Text style={[styles.subValue, { color: colors.danger }]}>{clientsWithDebt}</Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.commandBar}>
                <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Search size={18} color={colors.textSecondary} />
                    <TextInput 
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        placeholder="Search clients..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {refreshing ? (
                        <ActivityIndicator size="small" color={colors.brandGold} />
                    ) : (
                        <TouchableOpacity onPress={() => fetchCustomers(true)}>
                            <RefreshCw size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList 
                data={filteredClients}
                renderItem={({ item }) => (
                    <View style={[styles.clientCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: isDarkMode ? '#000' : colors.border }]}>
                        <View style={styles.cardHeader}>
                            <View style={styles.avatarRow}>
                                <View style={[styles.avatarBox, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                                    <User size={20} color={colors.brandGold} />
                                </View>
                                <View>
                                    <Text style={[styles.clientName, { color: colors.textPrimary }]}>{item.name}</Text>
                                    <Text style={[styles.clientPhone, { color: colors.textSecondary }]}>{item.phone}</Text>
                                </View>
                            </View>
                            
                            {item.outstandingDebt > 0 ? (
                                <View style={styles.debtBadge}>
                                     <Text style={styles.debtBadgeText}>OWES MONEY</Text>
                                </View>
                            ) : (
                                <View style={styles.clearBadge}>
                                    <Text style={styles.clearBadgeText}>CLEARED</Text>
                                </View>
                            )}
                        </View>

                        {!isCashier && (
                            <View style={[styles.financialRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <View style={styles.finItem}>
                                    <Text style={[styles.finLabel, { color: colors.textSecondary }]}>Lifetime Value</Text>
                                    <Text style={[styles.finValue, { color: colors.textPrimary }]}>{item.lifetimeValue.toLocaleString()} <Text style={styles.currency}>RWF</Text></Text>
                                </View>
                                
                                <View style={styles.finItemRight}>
                                    <Text style={[styles.finLabel, { color: colors.textSecondary }]}>Debt</Text>
                                    <Text style={[
                                        styles.finValue, 
                                        item.outstandingDebt > 0 ? { color: colors.danger } : { color: colors.brandGreen }
                                    ]}>
                                        {item.outstandingDebt.toLocaleString()} <Text style={styles.currency}>RWF</Text>
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.actionRow}>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={() => handleCall(item.phone)}
                            >
                                <PhoneCall size={16} color="#0b0c0c" />
                                <Text style={styles.actionButtonText}>Call</Text>
                            </TouchableOpacity>

                            {item.outstandingDebt > 0 && (
                                <TouchableOpacity 
                                    style={styles.repayButton}
                                    onPress={() => handleOpenRepay(item)}
                                >
                                    <Text style={styles.repayButtonText}>REPAY</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity 
                                style={[styles.actionButtonGhost, { backgroundColor: colors.overlay }]}
                                onPress={() => item.outstandingDebt > 0 ? handleSendReminder(item) : handleViewHistory(item)}
                            >
                                {item.outstandingDebt > 0 ? (
                                    <AlertTriangle size={18} color={colors.danger} />
                                ) : (
                                    <ChevronRight size={18} color={colors.textSecondary} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ListEmptyComponent={() => (
                    <View style={[styles.emptyStateContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={[styles.emptyStateIconBox, { backgroundColor: colors.overlay }]}>
                            <Users size={32} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>No Clients Found</Text>
                        <Text style={[styles.emptyStateDesc, { color: colors.textSecondary }]}>
                            {searchQuery 
                                ? `We couldn't find any clients matching "${searchQuery}".` 
                                : "Your CRM is currently empty. Start building your client roster to track debts and value."}
                        </Text>
                        {!searchQuery && (
                            <TouchableOpacity 
                                style={styles.emptyStateButton}
                                onPress={() => setShowCreateModal(true)}
                            >
                                <Text style={styles.emptyStateButtonText}>Add First Client</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />

            <CreateCustomerModal 
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={() => {
                    setShowCreateModal(false);
                    fetchCustomers(true);
                }}
            />
            <ClientHistoryModal 
                visible={showHistoryModal}
                client={selectedClient}
                onClose={() => setShowHistoryModal(false)}
            />
            <DebtRepaymentModal
                visible={showRepayModal}
                customerName={selectedClient?.name || ''}
                currentDebt={selectedClient?.debt || 0}
                isLoading={loading}
                onClose={() => setShowRepayModal(false)}
                onConfirm={handleRepayment}
            />
        </View>
    );
}
