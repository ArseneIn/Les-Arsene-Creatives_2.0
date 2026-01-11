import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';
import { Search, Filter, Download, Calendar, ArrowRight, Check, Clock, AlertTriangle, CreditCard, Banknote, Smartphone } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { ApiClient } from '../../lib/api_client';
import SaleDetailsModal from '../../components/SaleDetailsModal';
import ExportSalesModal from '../../components/ExportSalesModal';
import { useFocusEffect } from 'expo-router';

interface SaleRecord {
    id: string;
    created_at: string;
    customer?: { name: string };
    items: any[];
    total: number;
    payment_method: string;
    sync_status: string;
    status?: string;
    profit?: number;
}

export default function History() {
    const [sales, setSales] = useState<SaleRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [paymentFilter, setPaymentFilter] = useState<string | null>(null);

    const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);

    const fetchSales = async () => {
        try {
            const data = await ApiClient.getSalesHistory();
            setSales(data);
        } catch (error) {
            console.error('Failed to fetch sales:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSales();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchSales();
    };

    const filteredSales = sales.filter(sale => {
        const matchesSearch =
            sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (sale.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter ? sale.sync_status === statusFilter : true;
        const matchesPayment = paymentFilter ? sale.payment_method === paymentFilter : true;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    const renderSaleItem = ({ item }: { item: SaleRecord }) => (
        <TouchableOpacity
            style={styles.saleCard}
            onPress={() => setSelectedSale(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.dateText}>
                        {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    item.sync_status === 'Completed' ? styles.bgGreen :
                        item.sync_status === 'Pending' ? styles.bgOrange : styles.bgRed
                ]}>
                    {item.sync_status === 'Completed' && <Check size={12} color="#15803D" />}
                    {item.sync_status === 'Pending' && <Clock size={12} color="#C2410C" />}
                    {item.sync_status === 'Failed' && <AlertTriangle size={12} color="#B91C1C" />}
                    <Text style={[
                        styles.statusText,
                        item.sync_status === 'Completed' ? styles.textGreen :
                            item.sync_status === 'Pending' ? styles.textOrange : styles.textRed
                    ]}>{item.sync_status}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{item.customer?.name || 'Walk-in Customer'}</Text>
                    <Text style={styles.itemsSummary}>
                        {item.items.length} items • {item.items.slice(0, 2).map(i => i.name).join(', ')}
                        {item.items.length > 2 ? '...' : ''}
                    </Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>{Number(item.total).toLocaleString()} RWF</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={[
                    styles.paymentBadge,
                    item.payment_method === 'Mobile Money' ? styles.bgYellow :
                        item.payment_method === 'Credit' ? styles.bgRedLight : styles.bgBlueLight
                ]}>
                    {item.payment_method === 'Cash' && <Banknote size={12} color="#1E40AF" />}
                    {item.payment_method === 'Mobile Money' && <Smartphone size={12} color="#854D0E" />}
                    {item.payment_method === 'Credit' && <CreditCard size={12} color="#991B1B" />}
                    <Text style={[
                        styles.paymentText,
                        item.payment_method === 'Mobile Money' ? styles.textYellow :
                            item.payment_method === 'Credit' ? styles.textRedDark : styles.textBlue
                    ]}>{item.payment_method}</Text>
                </View>
                <ArrowRight size={16} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );

    return (

        <ScreenWrapper>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Sales History</Text>
                <TouchableOpacity
                    style={styles.exportButton}
                    onPress={() => setShowExportModal(true)}
                >
                    <Download size={20} color="#0b0c0c" />
                </TouchableOpacity>
            </View>

            {/* Search & Filter */}
            <View style={styles.filterSection}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by ID or Customer..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
                    <TouchableOpacity
                        style={[styles.chip, !statusFilter && !paymentFilter && styles.activeChip]}
                        onPress={() => { setStatusFilter(null); setPaymentFilter(null); }}
                    >
                        <Text style={[styles.chipText, !statusFilter && !paymentFilter && styles.activeChipText]}>All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.chip, statusFilter === 'Completed' && styles.activeChip]}
                        onPress={() => setStatusFilter(statusFilter === 'Completed' ? null : 'Completed')}
                    >
                        <Text style={[styles.chipText, statusFilter === 'Completed' && styles.activeChipText]}>Completed</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.chip, statusFilter === 'Pending' && styles.activeChip]}
                        onPress={() => setStatusFilter(statusFilter === 'Pending' ? null : 'Pending')}
                    >
                        <Text style={[styles.chipText, statusFilter === 'Pending' && styles.activeChipText]}>Pending</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={[styles.chip, paymentFilter === 'Mobile Money' && styles.activeChip]}
                        onPress={() => setPaymentFilter(paymentFilter === 'Mobile Money' ? null : 'Mobile Money')}
                    >
                        <Text style={[styles.chipText, paymentFilter === 'Mobile Money' && styles.activeChipText]}>Momo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.chip, paymentFilter === 'Cash' && styles.activeChip]}
                        onPress={() => setPaymentFilter(paymentFilter === 'Cash' ? null : 'Cash')}
                    >
                        <Text style={[styles.chipText, paymentFilter === 'Cash' && styles.activeChipText]}>Cash</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#fbe134" />
                </View>
            ) : (
                <FlatList
                    data={filteredSales}
                    renderItem={renderSaleItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbe134" />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Filter size={48} color="#D1D5DB" />
                            <Text style={styles.emptyText}>No sales found</Text>
                            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
                        </View>
                    }
                />
            )}

            <SaleDetailsModal
                visible={!!selectedSale}
                sale={selectedSale}
                onClose={() => setSelectedSale(null)}
                onRefundSuccess={onRefresh}
            />

            <ExportSalesModal
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />
        </ScreenWrapper>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F3F4F6', // Removed to show background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    exportButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fbe134', // Gold
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterSection: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        marginHorizontal: 24,
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        color: '#111827',
    },
    chipsContainer: {
        paddingHorizontal: 24,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeChip: {
        backgroundColor: '#111827', // Jet
        borderColor: '#111827',
    },
    chipText: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    activeChipText: {
        color: '#FFFFFF',
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 8,
        alignSelf: 'center',
    },
    listContent: {
        padding: 24,
        gap: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 64,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#374151',
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    },
    saleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#6B7280',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    bgGreen: { backgroundColor: '#DCFCE7' },
    bgOrange: { backgroundColor: '#FFEDD5' },
    bgRed: { backgroundColor: '#FEE2E2' },
    textGreen: { color: '#15803D' },
    textOrange: { color: '#C2410C' },
    textRed: { color: '#B91C1C' },
    statusText: {
        fontSize: 10,
        fontFamily: 'Montserrat_700Bold',
        textTransform: 'uppercase',
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: '#111827',
        marginBottom: 2,
    },
    itemsSummary: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#6B7280',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bgYellow: { backgroundColor: '#FEF9C3' },
    bgRedLight: { backgroundColor: '#FEE2E2' },
    bgBlueLight: { backgroundColor: '#DBEAFE' },
    textYellow: { color: '#854D0E' },
    textRedDark: { color: '#991B1B' },
    textBlue: { color: '#1E40AF' },
    paymentText: {
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold',
    },
});
