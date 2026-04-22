import React, { useState, useEffect, useCallback } from 'react';
import * as RN from 'react-native';
const { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Linking, Alert } = RN;
import { Search, User, Users, Phone, PhoneCall, AlertTriangle, CheckCircle, ChevronRight, TrendingUp, RefreshCw, UserPlus } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';
import SkeletonLoader from './SkeletonLoader';
import { useTheme } from '../lib/theme/ThemeContext';
import CreateCustomerModal from './CreateCustomerModal';
import ClientHistoryModal from './ClientHistoryModal';

// Styles moved up to prevent ReferenceErrors during module initialization
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    summaryContainer: {
        marginBottom: 20,
    },
    summaryCardMain: {
        backgroundColor: '#2a2e34', // Jet
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)', // Slight red hint for debt focus
        position: 'relative',
    },
    addClientHeaderBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    summaryLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },
    summaryValueMain: {
        fontSize: 32,
        fontFamily: 'Poppins_700Bold',
        color: '#EF4444', // Red for macro debt
    },
    summaryCardSub: {
        flexDirection: 'row',
        backgroundColor: '#2a2e34', 
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    subItem: {
        alignItems: 'center',
    },
    subLabel: {
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
    },
    subValue: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#f3f4f6',
    },
    subDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    commandBar: {
        marginBottom: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2e34',
        paddingHorizontal: 16,
        height: 54,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderTopWidth: 3,
        borderTopColor: '#fbe134', // Gold handle
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
        color: '#f3f4f6',
    },
    listContent: {
        paddingBottom: 20,
        gap: 16,
    },
    clientCard: {
        backgroundColor: '#2a2e34',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarBox: {
        width: 44,
        height: 44,
        backgroundColor: '#1a1d21',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(251, 225, 52, 0.2)', // Gold hint
    },
    clientName: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#f3f4f6',
    },
    clientPhone: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
    },
    debtBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    debtBadgeText: {
        fontSize: 9,
        fontFamily: 'Montserrat_800ExtraBold',
        color: '#EF4444',
    },
    clearBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    clearBadgeText: {
        fontSize: 9,
        fontFamily: 'Montserrat_800ExtraBold',
        color: '#10B981',
    },
    financialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1a1d21',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.03)',
    },
    finItem: {
        flex: 1,
    },
    finItemRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    finLabel: {
        fontSize: 10,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    finValue: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#f3f4f6',
    },
    currency: {
        fontSize: 9,
        fontFamily: 'Montserrat_600SemiBold',
        color: 'rgba(255, 255, 255, 0.3)',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fbe134', // Gold call to action
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 13,
        fontFamily: 'Poppins_700Bold',
        color: '#1a1d21',
    },
    actionButtonLight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonLightText: {
        fontSize: 13,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#2a2e34',
        borderRadius: 24,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(251, 225, 52, 0.1)',
        borderStyle: 'dashed',
    },
    emptyStateIconBox: {
        width: 64,
        height: 64,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#f3f4f6',
        marginBottom: 8,
    },
    emptyStateDesc: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
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
        color: '#1a1d21',
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
    const { colors } = useTheme();
    return (
        <View style={{ gap: 16 }}>
            <SkeletonLoader height={140} borderRadius={24} style={{ marginBottom: 16 }} />
            <View style={[styles.summaryCardSub, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
    const { colors, isDarkMode } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [clients, setClients] = useState<ClientRecord[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const handleViewHistory = (client: ClientRecord) => {
        setSelectedClient({ id: client.id, name: client.name });
        setShowHistoryModal(true);
    };

    const fetchCustomers = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const data = await ApiClient.getCustomers(showRefresh);
            // Map backend Customer to frontend ClientRecord
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

    // Derived statistics
    const totalClients = clients.length;
    const totalDebt = clients.reduce((sum, client) => sum + client.outstandingDebt, 0);
    const clientsWithDebt = clients.filter(c => c.outstandingDebt > 0).length;

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.phone.includes(searchQuery)
    );

    const renderClientCard = ({ item }: { item: ClientRecord }) => (
        <View style={[styles.clientCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: isDarkMode ? '#000': '#E5E7EB' }]}>
            {/* Top Info */}
            <View style={styles.cardHeader}>
                <View style={styles.avatarRow}>
                    <View style={[styles.avatarBox, { backgroundColor: colors.overlay }]}>
                        <User size={20} color={colors.brandGold} />
                    </View>
                    <View>
                        <Text style={[styles.clientName, { color: colors.textPrimary }]}>{item.name}</Text>
                        <Text style={[styles.clientPhone, { color: colors.textSecondary }]}>{item.phone}</Text>
                    </View>
                </View>
                
                {/* Debt Indicator Badge */}
                {item.outstandingDebt > 0 ? (
                    <View style={styles.debtBadge}>
                         <AlertTriangle size={12} color="#EF4444" style={{marginRight: 4}} />
                         <Text style={styles.debtBadgeText}>OWES MONEY</Text>
                    </View>
                ) : (
                    <View style={styles.clearBadge}>
                        <CheckCircle size={12} color="#10B981" style={{marginRight: 4}} />
                        <Text style={styles.clearBadgeText}>CLEARED</Text>
                    </View>
                )}
            </View>

            {/* Financial Status */}
            <View style={[styles.financialRow, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                <View style={styles.finItem}>
                    <Text style={[styles.finLabel, { color: colors.textSecondary }]}>Lifetime Value</Text>
                    <Text style={[styles.finValue, { color: colors.textPrimary }]}>{item.lifetimeValue.toLocaleString()} <Text style={[styles.currency, { color: colors.textSecondary }]}>RWF</Text></Text>
                </View>
                
                <View style={styles.finItemRight}>
                    <Text style={[styles.finLabel, { color: colors.textSecondary }]}>Outstanding Debt</Text>
                    <Text style={[
                        styles.finValue, 
                        item.outstandingDebt > 0 ? { color: '#EF4444' } : { color: '#10B981' }
                    ]}>
                        {item.outstandingDebt.toLocaleString()} <Text style={[styles.currency, { color: colors.textSecondary }]}>RWF</Text>
                    </Text>
                </View>
            </View>

            {/* Action Row */}
            <View style={styles.actionRow}>
                <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.brandGold }]}
                    onPress={() => handleCall(item.phone)}
                >
                    <PhoneCall size={16} color="#2a2e34" />
                    <Text style={styles.actionButtonText}>Call Client</Text>
                </TouchableOpacity>

                {item.outstandingDebt > 0 ? (
                    <TouchableOpacity 
                        style={[styles.actionButtonLight, { borderColor: '#EF4444' }]}
                        onPress={() => handleSendReminder(item)}
                    >
                        <Text style={[styles.actionButtonLightText, { color: '#EF4444' }]}>Send Reminder</Text>
                        <AlertTriangle size={16} color="#EF4444" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={[styles.actionButtonLight, { backgroundColor: colors.overlay, borderColor: colors.border }]}
                        onPress={() => handleViewHistory(item)}
                    >
                        <Text style={[styles.actionButtonLightText, { color: colors.textSecondary }]}>View History</Text>
                        <ChevronRight size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderEmptyState = () => (
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
            {/* Macro Debt Summary Header */}
            <View style={styles.summaryContainer}>
                <View style={[styles.summaryCardMain, { backgroundColor: colors.card }]}>
                    <TouchableOpacity 
                        style={[styles.addClientHeaderBtn, { backgroundColor: colors.overlay }]}
                        onPress={() => setShowCreateModal(true)}
                    >
                        <UserPlus size={18} color={colors.brandGold} />
                    </TouchableOpacity>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Outstanding Debt</Text>
                    <Text style={[styles.summaryValueMain, { color: colors.danger }]}>{totalDebt.toLocaleString()} <Text style={{fontSize: 14, color: colors.textSecondary}}>RWF</Text></Text>
                </View>

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
            </View>

            {/* Command Bar (Search) */}
            <View style={styles.commandBar}>
                <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border, borderTopColor: colors.brandGold }]}>
                    <Search size={18} color={colors.textSecondary} />
                    <TextInput 
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        placeholder="Search clients by name or phone..."
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

            {/* Client Roster list */}
            <FlatList 
                data={filteredClients}
                renderItem={renderClientCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false} // Disable nested scrolling since index is scrolling
                ListEmptyComponent={renderEmptyState}
            />

            {/* Registration Modal */}
            <CreateCustomerModal 
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={() => {
                    setShowCreateModal(false);
                    fetchCustomers(true);
                }}
            />
            {/* History Modal */}
            <ClientHistoryModal 
                visible={showHistoryModal}
                client={selectedClient}
                onClose={() => setShowHistoryModal(false)}
            />
        </View>
    );
}
