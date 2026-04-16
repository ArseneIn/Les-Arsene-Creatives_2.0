import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { Search, Package, AlertTriangle, ChevronRight, Plus, Archive, Filter, Barcode } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';
import AddProductModal from './AddProductModal';
import RestockModal from './RestockModal';
import SkeletonLoader from './SkeletonLoader';

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
    return (
        <View style={{ gap: 16 }}>
            {[1, 2, 3, 4, 5].map((key) => (
                <View key={key} style={styles.itemCard}>
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
                    
                    <View style={[styles.financialRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
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
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showRestock, setShowRestock] = useState(false);

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchInventory = async (bypassCache = false) => {
        // IMPROVED: Check cache synchronously to avoid skeleton flash
        const cachedData = ApiClient.getCached('/products');
        if ((!inventory.length && !cachedData) || bypassCache) {
            setLoading(true);
        }
        try {
            const data = await ApiClient.getProducts(bypassCache);
            // Data mapping to UI interface
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
        <View style={styles.itemCard}>
            <View style={styles.cardHeader}>
                <View style={styles.iconRow}>
                    <View style={styles.iconBox}>
                        <Package size={20} color="#fbe134" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.itemCategory}>{item.category} {item.barcode ? `• ${item.barcode}` : ''}</Text>
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

            <View style={styles.financialRow}>
                <View style={styles.finItem}>
                    <Text style={styles.finLabel}>Stock Level</Text>
                    <Text style={[styles.finValue, item.stock <= 10 && { color: '#EF4444' }]}>{item.stock} <Text style={styles.currency}>{item.unit}</Text></Text>
                </View>
                <View style={styles.finItemDivider} />
                <View style={styles.finItemMid}>
                    <Text style={styles.finLabel}>Unit Cost</Text>
                    <Text style={styles.finValue}>{item.cost_price.toLocaleString()} <Text style={styles.currency}>RWF</Text></Text>
                </View>
                <View style={styles.finItemDivider} />
                <View style={styles.finItemRight}>
                    <Text style={styles.finLabel}>Unit Price</Text>
                    <Text style={[styles.finValue, { color: '#fbe134' }]}>{item.price.toLocaleString()} <Text style={styles.currency}>RWF</Text></Text>
                </View>
            </View>
            
            {/* RRA / Advanced Info Bar */}
            {(item.taxTyCd || item.itemClsCd) && (
                <View style={styles.rraBar}>
                    <Text style={styles.rraText}>RRA Tax: {item.taxTyCd || 'N/A'} • Class: {item.itemClsCd || 'Auto'}</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Macro Summary */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryCardMain}>
                    <Text style={styles.summaryLabel}>Total Projected Revenue</Text>
                    <Text style={styles.summaryValueMain}>{inventoryValue.toLocaleString()} <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.5)'}}>RWF</Text></Text>
                    <Text style={styles.summaryLabelSub}>Margin: {potentialProfit.toLocaleString()} RWF</Text>
                </View>

                <View style={styles.summaryCardSub}>
                    <View style={styles.subItem}>
                        <Text style={styles.subLabel}>Total SKUs</Text>
                        <Text style={styles.subValue}>{totalItems}</Text>
                    </View>
                    <View style={styles.subDivider} />
                    <View style={styles.subItem}>
                        <Text style={styles.subLabel}>Alerts</Text>
                        <Text style={[styles.subValue, { color: '#EF4444' }]}>{lowStockItems}</Text>
                    </View>
                </View>
            </View>

            {/* Actions Bar */}
            <View style={styles.actionsBar}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => setShowAddProduct(true)}
                >
                    <Plus size={16} color="#2a2e34" />
                    <Text style={styles.actionButtonText}>Add Product</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.actionButtonLight}
                    onPress={() => setShowRestock(true)}
                >
                    <Archive size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonLightText}>Stock Batches</Text>
                </TouchableOpacity>
            </View>

            {/* Command Bar (Search) */}
            <View style={styles.commandBar}>
                <View style={styles.searchBox}>
                    <Search size={18} color="#6B7280" />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Search items, barcode, or categories..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity>
                        <Barcode size={24} color="#fbe134" />
                    </TouchableOpacity>
                </View>
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
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbe134" />}
                    ListEmptyComponent={
                        <View style={styles.emptyStateContainer}>
                            <Package size={32} color="#9CA3AF" />
                            <Text style={styles.emptyStateTitle}>No Products Found</Text>
                            <Text style={styles.emptyStateDesc}>Try adjusting your search or scan a barcode.</Text>
                        </View>
                    }
                />
            )}

            {/* Modals */}
            <AddProductModal 
                visible={showAddProduct}
                onClose={() => setShowAddProduct(false)}
                onSuccess={fetchInventory}
            />
            
            <RestockModal 
                visible={showRestock}
                onClose={() => setShowRestock(false)}
                onSuccess={fetchInventory}
                availableProducts={inventory} // Mapping local interface to the modal prop matches exactly
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
        backgroundColor: '#f3f4f6', 
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    subItem: { alignItems: 'center' },
    subLabel: { fontSize: 11, fontFamily: 'Montserrat_600SemiBold', color: '#6B7280' },
    subValue: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: '#111827' },
    subDivider: { width: 1, height: '100%', backgroundColor: '#E5E7EB' },
    actionsBar: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    actionButton: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fbe134', paddingVertical: 14, borderRadius: 14, gap: 8,
    },
    actionButtonText: { fontSize: 13, fontFamily: 'Poppins_700Bold', color: '#2a2e34' },
    actionButtonLight: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#2a2e34', paddingVertical: 14, borderRadius: 14, gap: 8,
    },
    actionButtonLightText: { fontSize: 13, fontFamily: 'Poppins_700Bold', color: '#FFFFFF' },
    commandBar: { flexDirection: 'row', marginBottom: 20, gap: 12 },
    searchBox: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#f3f4f6', paddingHorizontal: 16, height: 54, borderRadius: 16, borderTopWidth: 3, borderTopColor: '#fbe134',
    },
    searchInput: { flex: 1, marginLeft: 12, fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: '#2a2e34' },
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
});
