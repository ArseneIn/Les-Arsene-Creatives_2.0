import React, { useState, useEffect, useCallback } from 'react';
import * as RN from 'react-native';
const { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, ScrollView, Modal, Platform } = RN;
import { Search, Filter, Download, Calendar, ArrowRight, Check, Clock, AlertTriangle, CreditCard, Banknote, Smartphone, X } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { ApiClient } from '../../lib/api_client';
import SaleDetailsModal from '../../components/SaleDetailsModal';
import ExportSalesModal from '../../components/ExportSalesModal';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme/ThemeContext';

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
    const { colors, isDarkMode } = useTheme();
    const insets = useSafeAreaInsets();
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
            style={[styles.saleCard, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#000': '#E5E7EB', borderColor: colors.border, borderWidth: 1 }]}
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

            <View style={[styles.cardBody, { borderBottomColor: colors.border }]}>
                <View style={styles.customerInfo}>
                    <Text style={[styles.customerName, { color: colors.textPrimary }]}>{item.customer?.name || 'Walk-in Customer'}</Text>
                    <Text style={styles.itemsSummary}>
                        {item.items.length} items • {item.items.slice(0, 1).map(i => i.name).join(', ')}
                        {item.items.length > 1 ? '...' : ''}
                    </Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={[styles.amountText, { color: colors.textPrimary }]}>{Number(item.total).toLocaleString()} <Text style={{fontSize: 10, color: '#6B7280', fontFamily: 'Montserrat_500Medium'}}>RWF</Text></Text>
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

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const totalItems = filteredSales.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filteredSales.slice(startIndex, startIndex + pageSize);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedStatuses, selectedPayments]);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    return (
        <ScreenWrapper safeArea={false} style={{ backgroundColor: colors.background }}>
            {/* Header Area */}
            <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: isDarkMode ? colors.card : colors.brandGold, shadowColor: isDarkMode ? '#000': '#E5E7EB' }]}>
                <View>
                    <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>Sales Ledger</Text>
                    <Text style={[styles.headerSub, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#4B5563' }]}>Analyzing {totalItems} Transactions</Text>
                </View>
                <TouchableOpacity
                    style={[styles.exportButton, { backgroundColor: isDarkMode ? colors.brandGold : '#111827' }]}
                    onPress={() => setShowExportModal(true)}
                >
                    <Download size={20} color={isDarkMode ? '#0b0c0c' : colors.brandGold} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Unified Command Bar (V5) */}
                <View style={styles.actionRow}>
                    <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Search size={18} color={colors.textSecondary} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.textPrimary }]}
                            placeholder="Search ID or Customer..."
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity 
                        style={[styles.filterIconButton, { backgroundColor: colors.card, borderColor: colors.border }, (selectedStatuses.length > 0 || selectedPayments.length > 0) && styles.filterIconButtonActive]}
                        onPress={() => setShowFilters(true)}
                    >
                        <Filter size={20} color={(selectedStatuses.length > 0 || selectedPayments.length > 0) ? "#000000" : colors.textPrimary} />
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
                    <>
                        <FlatList
                            data={paginatedData}
                            renderItem={renderSaleItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.listContent}
                            style={styles.flatList}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbe134" />
                            }
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <AlertTriangle size={48} color={colors.textSecondary} />
                                    <Text style={[styles.emptyText, { color: colors.textPrimary }]}>No matching records</Text>
                                    <TouchableOpacity onPress={clearFilters}>
                                        <Text style={styles.clearFiltersText}>Reset All Filters</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                        
                        {/* Pagination Bar */}
                        <View style={[styles.paginationBar, { backgroundColor: isDarkMode ? colors.card : '#FFFFFF', borderTopColor: isDarkMode ? colors.border : '#fbe134' }]}>
                            <View style={styles.paginationInfo}>
                                <Text style={[styles.paginationText, { color: colors.textSecondary }]}>
                                    Page <Text style={[styles.paginationHighlight, { color: colors.textPrimary }]}>{currentPage}</Text> of <Text style={[styles.paginationHighlight, { color: colors.textPrimary }]}>{totalPages || 1}</Text>
                                </Text>
                                <Text style={[styles.paginationSubText, { color: colors.textSecondary }]}>
                                    Showing {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, totalItems)}
                                </Text>
                            </View>
                            
                            <View style={styles.paginationControls}>
                                <TouchableOpacity 
                                    style={[styles.pageButton, { borderColor: colors.border }, currentPage === 1 && styles.pageButtonDisabled]}
                                    onPress={handlePrevPage}
                                    disabled={currentPage === 1}
                                >
                                    <ArrowRight size={20} color={currentPage === 1 ? colors.textSecondary : colors.brandGold} style={{ transform: [{ rotate: '180deg' }] }} />
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[styles.pageButton, { borderColor: colors.border }, (currentPage === totalPages || totalPages === 0) && styles.pageButtonDisabled]}
                                    onPress={handleNextPage}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <ArrowRight size={20} color={(currentPage === totalPages || totalPages === 0) ? colors.textSecondary : colors.brandGold} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </View>
            
            {/* Advanced Filters Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Advanced Search</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <X size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Transaction Status</Text>
                            <View style={styles.filterGrid}>
                                {STATUS_OPTIONS.map(status => (
                                    <TouchableOpacity 
                                        key={status} 
                                        style={[styles.filterChip, { backgroundColor: colors.overlay, borderColor: colors.border }, selectedStatuses.includes(status) && styles.filterChipActive]}
                                        onPress={() => toggleStatus(status)}
                                    >
                                        <Text style={[styles.filterChipText, { color: colors.textSecondary }, selectedStatuses.includes(status) && styles.filterChipTextActive]}>{status}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Payment Method</Text>
                            <View style={styles.filterGrid}>
                                {PAYMENT_OPTIONS.map(method => (
                                    <TouchableOpacity 
                                        key={method} 
                                        style={[styles.filterChip, { backgroundColor: colors.overlay, borderColor: colors.border }, selectedPayments.includes(method) && styles.filterChipActive]}
                                        onPress={() => togglePayment(method)}
                                    >
                                        <Text style={[styles.filterChipText, { color: colors.textSecondary }, selectedPayments.includes(method) && styles.filterChipTextActive]}>{method}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={clearFilters}>
                                <Text style={[styles.resetButtonText, { color: colors.textPrimary }]}>Reset Selection</Text>
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
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
        zIndex: 100,
    },
    content: {
        flex: 1,
    },
    flatList: {
        flex: 1,
        marginTop: -32,
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
        shadowColor: 'rgba(251, 225, 52, 0.4)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
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
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
    },
    filterIconButton: {
        width: 54,
        height: 54,
        backgroundColor: '#2a2e34', 
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 3,
        borderTopColor: '#fbe134', // Gold Handle
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
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
        borderColor: '#2a2e34', 
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
        gap: 16,
    },
    saleCard: {
        backgroundColor: '#2a2e34', 
        borderRadius: 20,
        padding: 20,
        borderTopWidth: 4,
        borderTopColor: '#fbe134',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
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
        color: '#9CA3AF',
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
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF', 
        marginBottom: 2,
    },
    itemsSummary: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF', 
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
        color: '#9CA3AF',
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
    paginationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    paginationInfo: {
        flex: 1,
    },
    paginationText: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
    },
    paginationHighlight: {
        fontFamily: 'Montserrat_700Bold',
    },
    paginationSubText: {
        fontSize: 10,
        fontFamily: 'Montserrat_500Medium',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    paginationControls: {
        flexDirection: 'row',
        gap: 12,
    },
    pageButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    pageButtonDisabled: {
        opacity: 0.3,
    },
});
