import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, ScrollView, Modal, Platform } from 'react-native';
import { Search, Filter, Download, Calendar, ArrowRight, Check, Clock, AlertTriangle, CreditCard, Banknote, Smartphone, X } from 'lucide-react-native';
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

const STATUS_OPTIONS = ['Completed', 'Pending', 'Failed'];
const PAYMENT_OPTIONS = ['Cash', 'Mobile Money', 'Credit'];

export default function History() {
    const [sales, setSales] = useState<SaleRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Advanced Filters State
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

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

    const toggleStatus = (status: string) => {
        setSelectedStatuses(current => 
            current.includes(status) 
                ? current.filter(s => s !== status) 
                : [...current, status]
        );
    };

    const togglePayment = (method: string) => {
        setSelectedPayments(current => 
            current.includes(method) 
                ? current.filter(m => m !== method) 
                : [...current, method]
        );
    };

    const clearFilters = () => {
        setSelectedStatuses([]);
        setSelectedPayments([]);
        setSearchQuery('');
    };

    const filteredSales = sales.filter(sale => {
        const matchesSearch =
            sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (sale.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(sale.sync_status);
        const matchesPayment = selectedPayments.length === 0 || selectedPayments.includes(sale.payment_method);

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
                        {item.items.length} items • {item.items.slice(0, 1).map(i => i.name).join(', ')}
                        {item.items.length > 1 ? '...' : ''}
                    </Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>{Number(item.total).toLocaleString()} <Text style={{fontSize: 10, color: '#6B7280', fontFamily: 'Montserrat_500Medium'}}>RWF</Text></Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.paymentBadge}>
                    <Text style={styles.paymentText}>{item.payment_method}</Text>
                </View>
                <ArrowRight size={14} color="rgba(0, 0, 0, 0.15)" />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            {/* Header Area */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Sales Ledger</Text>
                    <Text style={styles.headerSub}>Analyzing {filteredSales.length} Transactions</Text>
                </View>
                <TouchableOpacity
                    style={styles.exportButton}
                    onPress={() => setShowExportModal(true)}
                >
                    <Download size={20} color="#0b0c0c" />
                </TouchableOpacity>
            </View>

            {/* Unified Command Bar (V5) */}
            <View style={styles.actionRow}>
                <View style={styles.searchBar}>
                    <Search size={18} color="#6B7280" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search ID or Customer..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity 
                    style={[styles.filterIconButton, (selectedStatuses.length > 0 || selectedPayments.length > 0) && styles.filterIconButtonActive]}
                    onPress={() => setShowFilters(true)}
                >
                    <Filter size={20} color={(selectedStatuses.length > 0 || selectedPayments.length > 0) ? "#000000" : "#2a2e34"} />
                    {(selectedStatuses.length > 0 || selectedPayments.length > 0) && (
                        <View style={styles.filterDot} />
                    )}
                </TouchableOpacity>
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
                            <AlertTriangle size={48} color="rgba(255, 255, 255, 0.1)" />
                            <Text style={styles.emptyText}>No matching records</Text>
                            <TouchableOpacity onPress={clearFilters}>
                                <Text style={styles.clearFiltersText}>Reset All Filters</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

            {/* Advanced Filters Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Advanced Search</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <X size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.filterLabel}>Transaction Status</Text>
                            <View style={styles.filterGrid}>
                                {STATUS_OPTIONS.map(status => (
                                    <TouchableOpacity 
                                        key={status} 
                                        style={[styles.filterChip, selectedStatuses.includes(status) && styles.filterChipActive]}
                                        onPress={() => toggleStatus(status)}
                                    >
                                        <Text style={[styles.filterChipText, selectedStatuses.includes(status) && styles.filterChipTextActive]}>{status}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.filterLabel}>Payment Method</Text>
                            <View style={styles.filterGrid}>
                                {PAYMENT_OPTIONS.map(method => (
                                    <TouchableOpacity 
                                        key={method} 
                                        style={[styles.filterChip, selectedPayments.includes(method) && styles.filterChipActive]}
                                        onPress={() => togglePayment(method)}
                                    >
                                        <Text style={[styles.filterChipText, selectedPayments.includes(method) && styles.filterChipTextActive]}>{method}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.resetButton} onPress={clearFilters}>
                                <Text style={styles.resetButtonText}>Reset Selection</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilters(false)}>
                                <Text style={styles.applyButtonText}>Apply Combinations</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
        backgroundColor: '#1a1d21', 
    },
    header: {
        backgroundColor: '#2a2e34', 
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
        zIndex: 50,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    headerSub: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: -4,
    },
    exportButton: {
        position: 'absolute',
        right: 24,
        top: 64,
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#fbe134',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 20,
        marginBottom: 20,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6', // Unified Light Grey
        paddingHorizontal: 16,
        height: 54,
        borderRadius: 14,
        borderTopWidth: 3,
        borderTopColor: '#fbe134', // Gold Handle
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
        color: '#2a2e34',
    },
    filterIconButton: {
        width: 54,
        height: 54,
        backgroundColor: '#f3f4f6', // Unified Light Grey
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 3,
        borderTopColor: '#fbe134', // Gold Handle
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    filterIconButtonActive: {
        backgroundColor: '#fbe134',
        borderTopColor: '#000', // Inverse handle when active
    },
    filterDot: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 8,
        height: 8,
        backgroundColor: '#fbe134',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#f3f4f6', 
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
        gap: 16,
    },
    saleCard: {
        backgroundColor: '#f3f4f6', 
        borderRadius: 20,
        padding: 20,
        borderTopWidth: 4,
        borderTopColor: '#fbe134',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 11,
        fontFamily: 'Montserrat_700Bold',
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bgGreen: { backgroundColor: '#DCFCE7' },
    bgOrange: { backgroundColor: '#FFEDD5' },
    bgRed: { backgroundColor: '#FEE2E2' },
    textGreen: { color: '#15803D' },
    textOrange: { color: '#C2410C' },
    textRed: { color: '#B91C1C' },
    statusText: {
        fontSize: 9,
        fontFamily: 'Montserrat_800ExtraBold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        color: '#2a2e34', 
        marginBottom: 2,
    },
    itemsSummary: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#2a2e34', 
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    paymentText: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#6B7280',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#2a2e34',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingBottom: Platform.OS === 'ios' ? 44 : 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    modalBody: {
        padding: 24,
    },
    filterLabel: {
        fontSize: 13,
        fontFamily: 'Montserrat_700Bold',
        color: 'rgba(255, 255, 255, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    filterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 36,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    filterChipActive: {
        backgroundColor: 'rgba(251, 225, 52, 0.15)',
        borderColor: '#fbe134',
    },
    filterChipText: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
        color: 'rgba(255, 255, 255, 0.5)',
    },
    filterChipTextActive: {
        color: '#fbe134',
    },
    modalFooter: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 16,
    },
    resetButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat_700Bold',
        fontSize: 14,
    },
    applyButton: {
        flex: 1.8,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#fbe134',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    applyButtonText: {
        color: '#0b0c0c',
        fontFamily: 'Montserrat_700Bold',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 120,
        gap: 16,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    clearFiltersText: {
        color: '#fbe134',
        fontFamily: 'Montserrat_700Bold',
        fontSize: 14,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
