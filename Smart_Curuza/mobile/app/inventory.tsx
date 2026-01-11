import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, Switch, Alert } from 'react-native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, Switch, Alert } from 'react-native';
import { Search, Filter, Plus, ArrowLeft, Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import { ApiClient } from '../lib/api_client';
import { Product } from '../lib/types';
import AddProductModal from '../components/AddProductModal';

export default function InventoryScreen() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await ApiClient.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            Alert.alert('Error', 'Failed to load inventory');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const toggleProductStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        // Optimistic update
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, status: newStatus as 'active' | 'inactive' } : p
        ));

        try {
            await ApiClient.toggleProductStatus(id, newStatus);
        } catch (error) {
            console.error('Failed to toggle status:', error);
            // Revert on error
            setProducts(prev => prev.map(p =>
                p.id === id ? { ...p, status: currentStatus as 'active' | 'inactive' } : p
            ));
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.barcode && product.barcode.includes(searchQuery));
        const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockCount = products.filter(p => p.stock < 10).length;

    const renderProductItem = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <View style={styles.productHeader}>
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productBarcode}>{item.barcode || 'No Barcode'}</Text>
                </View>
                <Switch
                    trackColor={{ false: "#E5E7EB", true: "#fbe134" }}
                    thumbColor={item.status === 'active' ? "#FFFFFF" : "#F9FAFB"}
                    ios_backgroundColor="#E5E7EB"
                    onValueChange={() => toggleProductStatus(item.id, item.status || 'active')}
                    value={item.status === 'active'}
                />
            </View>

            <View style={styles.productDetails}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Price</Text>
                    <Text style={styles.detailValue}>{item.price.toLocaleString()} RWF</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Stock</Text>
                    <Text style={[
                        styles.detailValue,
                        item.stock < 10 && styles.lowStockText
                    ]}>
                        {item.stock} {item.unit}
                    </Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Value</Text>
                    <Text style={styles.detailValue}>{(item.price * item.stock).toLocaleString()} RWF</Text>
                </View>
            </View>
        </View>
    );

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Inventory</Text>
                <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
                    <Plus size={24} color="#111827" />
                </TouchableOpacity>
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Value</Text>
                    <Text style={styles.summaryValue}>{totalValue.toLocaleString()} RWF</Text>
                </View>
                <View style={styles.summaryCard}>
                    <View style={styles.row}>
                        <Text style={styles.summaryLabel}>Low Stock</Text>
                        <AlertTriangle size={14} color="#DC2626" style={{ marginLeft: 4 }} />
                    </View>
                    <Text style={[styles.summaryValue, { color: '#DC2626' }]}>{lowStockCount} Items</Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => {
                        const next = filterStatus === 'all' ? 'active' : filterStatus === 'active' ? 'inactive' : 'all';
                        setFilterStatus(next);
                    }}
                >
                    <Filter size={20} color={filterStatus === 'all' ? "#6B7280" : "#fbe134"} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#fbe134" />
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Package size={48} color="#D1D5DB" />
                            <Text style={styles.emptyText}>No products found</Text>
                        </View>
                    }
                />
            )}

            <AddProductModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleRefresh}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    addButton: {
        padding: 4,
        backgroundColor: '#fbe134',
        borderRadius: 8,
    },
    summaryContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 16,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#6B7280',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        color: '#111827',
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
        gap: 12,
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#111827',
        marginBottom: 2,
    },
    productBarcode: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        color: '#6B7280',
    },
    productDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    detailItem: {
        alignItems: 'flex-start',
    },
    detailLabel: {
        fontSize: 11,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#374151',
    },
    lowStockText: {
        color: '#DC2626',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        marginTop: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    },
});
