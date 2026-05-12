import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { Product, CartItem } from '../lib/types';
import ProductCard from './ProductCard';
import { useTheme } from '../lib/theme/ThemeContext';

interface ProductGridProps {
    products: Product[];
    cart: CartItem[];
    onAddToCart: (product: Product) => void;
    onDecrement: (productId: string) => void;
}

export default function ProductGrid({ products, cart, onAddToCart, onDecrement }: ProductGridProps) {
    const { colors } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const availableProducts = products.filter(p => p.stock > 0);
    const uniqueCategories = [...new Set(availableProducts.map(p => p.category).filter((c): c is string => Boolean(c)))];
    const categories = uniqueCategories.length > 0 ? ['All', ...uniqueCategories] : [];

    const filteredProducts = availableProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p.barcode?.includes(searchQuery);
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCartQty = (productId: string) => {
        const item = cart.find(i => i.id === productId);
        return item ? item.quantity : 0;
    };

    const renderHeader = () => (
        <View>
            {/* Search */}
            <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Search size={18} color={colors.textSecondary} style={{ marginRight: 10 }} />
                <TextInput
                    style={[styles.searchInput, { color: colors.textPrimary }]}
                    placeholder="Search products..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    selectionColor={colors.brandGold}
                />
            </View>

            {/* Category chips */}
            {categories.length > 1 && (
                <View style={styles.categoriesRow}>
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item}
                        contentContainerStyle={{ gap: 8, paddingRight: 4 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.chip,
                                    { backgroundColor: colors.card, borderColor: colors.border },
                                    selectedCategory === item && { backgroundColor: 'rgba(251,225,52,0.1)', borderColor: '#fbe134' }
                                ]}
                                onPress={() => setSelectedCategory(item)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.chipText,
                                    { color: colors.textSecondary },
                                    selectedCategory === item && { color: '#fbe134' }
                                ]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredProducts}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <ProductCard
                            product={item}
                            cartQty={getCartQty(item.id)}
                            onAddToCart={onAddToCart}
                            onDecrement={onDecrement}
                        />
                    </View>
                )}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Search size={40} color={colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: colors.textPrimary }]}>No products found</Text>
                        <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>Try adjusting your search</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 44,
        marginBottom: 12,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
    },
    categoriesRow: { marginBottom: 16 },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
    },
    listContent: { paddingBottom: 140 },
    row: { justifyContent: 'space-between', marginBottom: 0 },
    cardWrapper: { width: '48.5%' },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 8 },
    emptyText: { fontSize: 17, fontFamily: 'Poppins_700Bold', marginTop: 8 },
    emptySubText: { fontSize: 13, fontFamily: 'Montserrat_500Medium' },
});
