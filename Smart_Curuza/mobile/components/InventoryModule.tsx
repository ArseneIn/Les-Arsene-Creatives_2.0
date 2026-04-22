import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { Search, Package, AlertTriangle, ChevronRight, Plus, Archive, Filter, Barcode } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';
import AddProductModal from './AddProductModal';
import RestockModal from './RestockModal';
import SkeletonLoader from './SkeletonLoader';
import { useTheme } from '../lib/theme/ThemeContext';

interface InventoryItem {
    id: string;
    barcode: string | null;
    name: string;
    category: string;
    stock: number;
    unit: string;
    cost_price: number;
    price: number;
    itemClsCd?: string;
    taxTyCd?: string;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const InventorySkeleton = () => {
    const { colors } = useTheme();
    return (
        <View style={{ gap: 16 }}>
            {[1, 2, 3, 4, 5].map((key) => (
                <View key={key} style={[styles.itemCard, { backgroundColor: colors.card }]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconRow}>
                            <View style={[styles.iconBox, { borderWidth: 0 }]}>
                                <SkeletonLoader width={44} height={44} borderRadius={12} />
                            </View>
                            <View style={{ flex: 1, gap: 8 }}>
                                <SkeletonLoader width="70%" height={16} />
                                <SkeletonLoader width="40%" height={12} />
                            </View>
                        </View>
                        <SkeletonLoader width={40} height={20} borderRadius={8} />
                    </View>
                    
                    <View style={[styles.financialRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.overlay }]}>
                        <View style={{ gap: 6 }}>
                            <SkeletonLoader width={50} height={10} />
                            <SkeletonLoader width={60} height={16} />
                        </View>
                        <View style={styles.finItemDivider} />
                        <View style={{ gap: 6, alignItems: 'center' }}>
                            <SkeletonLoader width={50} height={10} />
                            <SkeletonLoader width={60} height={16} />
                        </View>
                        <View style={styles.finItemDivider} />
                        <View style={{ gap: 6, alignItems: 'flex-end' }}>
                            <SkeletonLoader width={50} height={10} />
                            <SkeletonLoader width={60} height={16} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default function InventoryModule() {
    const { colors, isDarkMode } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showRestock, setShowRestock] = useState(false);

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
    const [batches, setBatches] = useState<any[]>([]);
    const [loadingBatches, setLoadingBatches] = useState(false);

    const toggleExpand = async (productId: string) => {
        if (expandedProductId === productId) {
            setExpandedProductId(null);
            setBatches([]);
        } else {
            setExpandedProductId(productId);
            setLoadingBatches(true);
            try {
                const data = await ApiClient.getBatches(productId);
                setBatches(data);
            } catch (error) {
                console.error('Error fetching batches:', error);
            } finally {
                setLoadingBatches(false);
            }
        }
    };

    const fetchInventory = async (bypassCache = false) => {
        const cachedData = ApiClient.getCached('/products');
        if ((!inventory.length && !cachedData) || bypassCache) {
            setLoading(true);
        }
        try {
            const data = await ApiClient.getProducts(bypassCache);
            const formatted = data.map((p: any) => ({
                id: p.id,
                barcode: p.barcode,
                name: p.name,
                category: p.parent?.name || 'Uncategorized',
                stock: p.stock !== undefined ? parseFloat(p.stock) : 0,
                unit: p.unit || 'pcs',
                cost_price: p.cost_price !== undefined ? parseFloat(p.cost_price) : 0,
                price: p.price !== undefined ? parseFloat(p.price) : 0,
                itemClsCd: p.itemClsCd,
                taxTyCd: p.taxTyCd,
                status: (p.stock > 10) ? 'In Stock' : (p.stock > 0 ? 'Low Stock' : 'Out of Stock')
            })) as InventoryItem[];
            setInventory(formatted);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchInventory(true);
        setExpandedProductId(null);
    }, [inventory]);

    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
    const inventoryValue = inventory.reduce((acc, item) => acc + (item.stock * item.price), 0);
    const potentialProfit = inventory.reduce((acc, item) => acc + (item.stock * (item.price - item.cost_price)), 0);

    const filteredInventory = inventory.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.barcode && i.barcode.includes(searchQuery))
    );

    const renderInventoryCard = ({ item }: { item: InventoryItem }) => (
        <TouchableOpacity 
            style={[styles.itemCard, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#000' : '#E5E7EB' }]}
            onPress={() => toggleExpand(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.iconRow}>
                    <View style={[styles.iconBox, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                        <Package size={20} color="#fbe134" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.itemName, { color: colors.textPrimary }]} numberOfLines={1}>{item.name}</Text>
                        <Text style={[styles.itemCategory, { color: colors.textSecondary }]}>{item.category} {item.barcode ? `• ${item.barcode}` : ''}</Text>
                    </View>
                </View>
                
                {item.status === 'Low Stock' && (
                    <View style={styles.badgeOrange}>
                        <Text style={styles.badgeTextOrange}>LOW</Text>
                    </View>
                )}
                {item.status === 'Out of Stock' && (
                    <View style={styles.badgeRed}>
                        <Text style={styles.badgeTextRed}>OUT</Text>
                    </View>
                )}
                {item.status === 'In Stock' && (
                    <View style={styles.badgeGreen}>
                        <Text style={styles.badgeTextGreen}>OK</Text>
                    </View>
                )}
            </View>

            <View style={[styles.financialRow, { backgroundColor: colors.overlay }]}>
                <View style={styles.finItem}>
                    <Text style={[styles.finLabel, { color: colors.textSecondary }]}>Stock Level</Text>
                    <Text style={[styles.finValue, { color: colors.textPrimary }, item.stock <= 10 && { color: colors.danger }]}>{item.stock} <Text style={[styles.currency, { color: colors.textSecondary }]}>{item.unit}</Text></Text>
                </View>
                <View style={[styles.finItemDivider, { backgroundColor: colors.border }]} />
                <View style={styles.finItemMid}>
                    <Text style={[styles.finLabel, { color: colors.textSecondary }]}>Unit Cost</Text>
                    <Text style={[styles.finValue, { color: colors.textPrimary }]}>{item.cost_price.toLocaleString()} <Text style={[styles.currency, { color: colors.textSecondary }]}>RWF</Text></Text>
                </View>
                <View style={[styles.finItemDivider, { backgroundColor: colors.border }]} />
                <View style={styles.finItemRight}>
                    <Text style={[styles.finLabel, { color: colors.textSecondary }]}>Unit Price</Text>
                    <Text style={[styles.finValue, { color: colors.brandGold }]}>{item.price.toLocaleString()} <Text style={[styles.currency, { color: colors.textSecondary }]}>RWF</Text></Text>
                </View>
            </View>
            
            {expandedProductId === item.id && (
                <View style={[styles.expandedSection, { borderTopColor: colors.border }]}>
                    <View style={styles.expandedTitleRow}>
                        <Text style={[styles.expandedTitle, { color: colors.brandGold }]}>Active Batches</Text>
                        {loadingBatches && <ActivityIndicator size="small" color={colors.brandGold} />}
                    </View>
                    
                    {!loadingBatches && batches.length === 0 && (
                        <Text style={[styles.noBatchesText, { color: colors.textSecondary }]}>No batch details available.</Text>
                    )}
                    
                    {batches.map((batch, index) => (
                        <View key={batch.id || index} style={[styles.batchItem, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                            <View style={styles.batchMainInfo}>
                                <Text style={[styles.batchNumber, { color: colors.textPrimary }]}>#{batch.batch_number || 'Batch ' + (index + 1)}</Text>
                                <Text style={[styles.batchQty, { color: colors.brandGreen }]}>{batch.current_quantity} {item.unit} left</Text>
                            </View>
                            <View style={styles.batchSubInfo}>
                                <Text style={[styles.batchDetail, { color: colors.textSecondary }]}>Cost: {Number(batch.buying_price_per_unit || 0).toLocaleString()} RWF</Text>
                                <Text style={[styles.batchDetail, { color: colors.textSecondary }, batch.expiry_date && { color: '#F59E0B' }]}>
                                    {batch.expiry_date ? `Exp: ${new Date(batch.expiry_date).toLocaleDateString()}` : 'No Expiry'}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {(item.taxTyCd || item.itemClsCd) && (
                <View style={[styles.rraBar, { borderTopColor: colors.border }]}>
                    <Text style={[styles.rraText, { color: colors.textSecondary }]}>RRA Tax: {item.taxTyCd || 'N/A'} • Class: {item.itemClsCd || 'Auto'}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Macro Summary */}
            <View style={styles.summaryContainer}>
                <View style={[styles.summaryCardMain, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Projected Revenue</Text>
                    <Text style={[styles.summaryValueMain, { color: colors.textPrimary }]}>{inventoryValue.toLocaleString()} <Text style={{fontSize: 14, color: colors.textSecondary}}>RWF</Text></Text>
                    <Text style={[styles.summaryLabelSub, { color: colors.brandGreen }]}>Margin: {potentialProfit.toLocaleString()} RWF</Text>
                </View>

                <View style={[styles.summaryCardSub, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.subItem}>
                        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Total SKUs</Text>
                        <Text style={[styles.subValue, { color: colors.textPrimary }]}>{totalItems}</Text>
                    </View>
                    <View style={[styles.subDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.subItem}>
                        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Alerts</Text>
                        <Text style={[styles.subValue, { color: colors.danger }]}>{lowStockItems}</Text>
                    </View>
                </View>
            </View>

            {/* Actions Bar */}
            <View style={styles.actionRow}>
                <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Search size={18} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search Inventory..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity 
                    style={[styles.filterIconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => setShowRestock(true)}
                    activeOpacity={0.7}
                >
                    <Archive size={20} color={isDarkMode ? '#FFFFFF' : '#111827'} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.filterIconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => setShowAddProduct(true)}
                    activeOpacity={0.7}
                >
                    <Plus size={22} color={colors.brandGold} />
                </TouchableOpacity>
            </View>

            {/* List */}
            {loading ? (
                <View style={{ marginTop: 20 }}>
                     <InventorySkeleton />
                </View>
            ) : (
                <FlatList 
                    data={filteredInventory}
                    renderItem={renderInventoryCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brandGold} />}
                    ListEmptyComponent={
                        <View style={[styles.emptyStateContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Package size={32} color={colors.textSecondary} />
                            <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>No Products Found</Text>
                            <Text style={[styles.emptyStateDesc, { color: colors.textSecondary }]}>Try adjusting your search or scan a barcode.</Text>
                        </View>
                    }
                />
            )}

            <AddProductModal 
                visible={showAddProduct}
                onClose={() => setShowAddProduct(false)}
                onSuccess={() => fetchInventory(true)}
            />
            
            <RestockModal 
                visible={showRestock}
                onClose={() => setShowRestock(false)}
                onSuccess={() => fetchInventory(true)}
                availableProducts={inventory} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    summaryContainer: { marginBottom: 16 },
    summaryCardMain: {
        backgroundColor: '#2a2e34',
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
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    summaryLabel: { fontSize: 12, fontFamily: 'Montserrat_700Bold', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    summaryValueMain: { fontSize: 32, fontFamily: 'Poppins_700Bold', color: '#FFFFFF' },
    summaryLabelSub: { fontSize: 11, fontFamily: 'Montserrat_600SemiBold', color: '#10B981', marginTop: 4 },
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
    subItem: { alignItems: 'center' },
    subLabel: { fontSize: 11, fontFamily: 'Montserrat_600SemiBold', color: '#9CA3AF' },
    subValue: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: '#FFFFFF' },
    subDivider: { width: 1, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2e34', 
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
    },
    filterIconButton: {
        width: 52,
        height: 52,
        backgroundColor: '#2a2e34', 
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    listContent: { paddingBottom: 20, gap: 16 },
    itemCard: {
        backgroundColor: '#1a1d21', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    iconRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
    iconBox: { width: 44, height: 44, backgroundColor: '#2a2e34', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    itemName: { fontSize: 15, fontFamily: 'Poppins_700Bold', color: '#FFFFFF' },
    itemCategory: { fontSize: 11, fontFamily: 'Montserrat_600SemiBold', color: '#9CA3AF' },
    badgeGreen: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 1, borderColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeTextGreen: { fontSize: 9, fontFamily: 'Montserrat_800ExtraBold', color: '#10B981' },
    badgeOrange: { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 1, borderColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeTextOrange: { fontSize: 9, fontFamily: 'Montserrat_800ExtraBold', color: '#F59E0B' },
    badgeRed: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeTextRed: { fontSize: 9, fontFamily: 'Montserrat_800ExtraBold', color: '#EF4444' },
    financialRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#2a2e34', padding: 16, borderRadius: 16 },
    finItem: { flex: 1, alignItems: 'flex-start' },
    finItemMid: { flex: 1, alignItems: 'center' },
    finItemRight: { flex: 1, alignItems: 'flex-end' },
    finItemDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
    finLabel: { fontSize: 10, fontFamily: 'Montserrat_600SemiBold', color: '#9CA3AF', marginBottom: 2 },
    finValue: { fontSize: 13, fontFamily: 'Poppins_700Bold', color: '#FFFFFF' },
    currency: { fontSize: 9, fontFamily: 'Montserrat_600SemiBold', color: '#9CA3AF' },
    rraBar: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
    rraText: { fontSize: 10, fontFamily: 'Montserrat_500Medium', color: '#6B7280' },
    emptyStateContainer: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#1a1d21', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed' },
    emptyStateTitle: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#FFFFFF', marginTop: 12, marginBottom: 8 },
    emptyStateDesc: { fontSize: 12, fontFamily: 'Montserrat_500Medium', color: '#9CA3AF', textAlign: 'center' },
    expandedSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    expandedTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    expandedTitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#fbe134',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    noBatchesText: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 10,
    },
    batchItem: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    batchMainInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    batchNumber: {
        fontSize: 13,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    batchQty: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#10B981',
    },
    batchSubInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    batchDetail: {
        fontSize: 11,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    },
});
