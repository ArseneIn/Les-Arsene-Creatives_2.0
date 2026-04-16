import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Search, User, Users, Phone, PhoneCall, AlertTriangle, CheckCircle, ChevronRight, TrendingUp } from 'lucide-react-native';
import SkeletonLoader from './SkeletonLoader';

interface ClientRecord {
    id: string;
    name: string;
    phone: string;
    lifetimeValue: number;
    outstandingDebt: number;
    lastActive: string;
}

const CRMSkeleton = () => (
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

export default function CRMModule() {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a brief local load to show skeleton during tab switch
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    // Simulated local client state (since backend CRM routes are pending)
    const [clients] = useState<ClientRecord[]>([
        { id: 'c1', name: 'Alain Ndayishimiye', phone: '+250 788 123 456', lifetimeValue: 450000, outstandingDebt: 25000, lastActive: '2 days ago' },
        { id: 'c2', name: 'Belyse Uwamahoro', phone: '+250 782 456 789', lifetimeValue: 1200000, outstandingDebt: 0, lastActive: 'Today' },
        { id: 'c3', name: 'Patrick Kigali Store', phone: '+250 733 987 654', lifetimeValue: 890000, outstandingDebt: 150000, lastActive: '5 days ago' },
        { id: 'c4', name: 'Jeanne D\'arc', phone: '+250 799 111 222', lifetimeValue: 50000, outstandingDebt: 0, lastActive: '1 week ago' },
        { id: 'c5', name: 'Eric Construction', phone: '+250 788 555 444', lifetimeValue: 3100000, outstandingDebt: 450000, lastActive: 'Yesterday' },
        { id: 'c6', name: 'Mama Sarah', phone: '+250 722 333 444', lifetimeValue: 15000, outstandingDebt: 2000, lastActive: 'Today' },
    ]);

    // Derived statistics
    const totalClients = clients.length;
    const totalDebt = clients.reduce((sum, client) => sum + client.outstandingDebt, 0);
    const clientsWithDebt = clients.filter(c => c.outstandingDebt > 0).length;

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.phone.includes(searchQuery)
    );

    const renderClientCard = ({ item }: { item: ClientRecord }) => (
        <View style={styles.clientCard}>
            {/* Top Info */}
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
            <View style={styles.financialRow}>
                <View style={styles.finItem}>
                    <Text style={styles.finLabel}>Lifetime Value</Text>
                    <Text style={styles.finValue}>{item.lifetimeValue.toLocaleString()} <Text style={styles.currency}>RWF</Text></Text>
                </View>
                
                <View style={styles.finItemRight}>
                    <Text style={styles.finLabel}>Outstanding Debt</Text>
                    <Text style={[
                        styles.finValue, 
                        item.outstandingDebt > 0 ? { color: '#EF4444' } : { color: '#10B981' }
                    ]}>
                        {item.outstandingDebt.toLocaleString()} <Text style={styles.currency}>RWF</Text>
                    </Text>
                </View>
            </View>

            {/* Action Row */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton}>
                    <PhoneCall size={16} color="#2a2e34" />
                    <Text style={styles.actionButtonText}>Call Client</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButtonLight}>
                    <Text style={styles.actionButtonLightText}>View History</Text>
                    <ChevronRight size={16} color="#6B7280" />
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
                <TouchableOpacity style={styles.emptyStateButton}>
                    <Text style={styles.emptyStateButtonText}>Add First Client</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Macro Debt Summary Header */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryCardMain}>
                    <Text style={styles.summaryLabel}>Total Outstanding Debt</Text>
                    <Text style={styles.summaryValueMain}>{totalDebt.toLocaleString()} <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.5)'}}>RWF</Text></Text>
                </View>

                <View style={styles.summaryCardSub}>
                    <View style={styles.subItem}>
                        <Text style={styles.subLabel}>Total Clients</Text>
                        <Text style={styles.subValue}>{totalClients}</Text>
                    </View>
                    <View style={styles.subDivider} />
                    <View style={styles.subItem}>
                        <Text style={styles.subLabel}>In Debt</Text>
                        <Text style={[styles.subValue, { color: '#EF4444' }]}>{clientsWithDebt}</Text>
                    </View>
                </View>
            </View>

            {/* Command Bar (Search) */}
            <View style={styles.commandBar}>
                <View style={styles.searchBox}>
                    <Search size={18} color="#6B7280" />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Search clients by name or phone..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
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
        </View>
    );
}

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
        backgroundColor: '#f3f4f6', 
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    subItem: {
        alignItems: 'center',
    },
    subLabel: {
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    subValue: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    subDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#E5E7EB',
    },
    commandBar: {
        marginBottom: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 16,
        height: 54,
        borderRadius: 16,
        borderTopWidth: 3,
        borderTopColor: '#fbe134', // Gold handle
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
        color: '#2a2e34',
    },
    listContent: {
        paddingBottom: 20,
        gap: 16,
    },
    clientCard: {
        backgroundColor: '#f3f4f6', // Light grey receipt aesthetic
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
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
        backgroundColor: '#2a2e34',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    clientName: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    clientPhone: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    debtBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    debtBadgeText: {
        fontSize: 9,
        fontFamily: 'Montserrat_800ExtraBold',
        color: '#B91C1C',
    },
    clearBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    clearBadgeText: {
        fontSize: 9,
        fontFamily: 'Montserrat_800ExtraBold',
        color: '#15803D',
    },
    financialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
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
    },
    finValue: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    currency: {
        fontSize: 9,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
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
        color: '#2a2e34',
    },
    actionButtonLight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonLightText: {
        fontSize: 13,
        fontFamily: 'Montserrat_700Bold',
        color: '#4B5563',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    emptyStateIconBox: {
        width: 64,
        height: 64,
        backgroundColor: '#E5E7EB',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
        marginBottom: 8,
    },
    emptyStateDesc: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 20,
    },
    emptyStateButton: {
        backgroundColor: '#2a2e34', // Jet 
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyStateButtonText: {
        fontSize: 13,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    }
});
