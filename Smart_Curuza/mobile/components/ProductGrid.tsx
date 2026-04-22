import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { Product } from '../lib/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Only show items with stock > 0
    const availableProducts = products.filter(p => p.stock > 0);

    // Filter out empty/null categories. No more "General" placeholder.
    const uniqueCategories = [...new Set(availableProducts.map(p => p.category).filter((c): c is string => Boolean(c)))];
    const categories = uniqueCategories.length > 0 ? ['All', ...uniqueCategories] : [];

    const filteredProducts = availableProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.barcode?.includes(searchQuery);
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.cardWrapper}>
            <ProductCard product={item} onAddToCart={onAddToCart} />
        </View>
    );

    const renderHeader = () => (
        <View>
            {/* Search Section */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Search size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#6B7280"
                        selectionColor="#2a2e34"
                    />
                </View>
            </View>

            {/* Categories Section - Only show if there are actual categories */}
            {categories.length > 1 && (
                <View style={styles.categoriesSection}>
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item}
                        contentContainerStyle={styles.categoryList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === item && styles.categoryChipActive
                                ]}
                                onPress={() => setSelectedCategory(item)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === item && styles.categoryTextActive
                                ]}>
                                    {item as string}
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
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Search size={40} color="#374151" />
                        </View>
                        <Text style={styles.emptyText}>No products found</Text>
                        <Text style={styles.emptySubText}>Try adjusting your search or filters</Text>
                    </View>
                }
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchSection: {
        paddingHorizontal: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2e34', // Dark surface
        borderRadius: 12, 
        paddingHorizontal: 16,
        height: 44, 
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#FFFFFF', // White text
    },
    categoriesSection: {
        marginBottom: 20,
    },
    categoryList: {
        paddingHorizontal: 2,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    categoryChipActive: {
        backgroundColor: 'rgba(251, 225, 52, 0.1)', // Subtle tinted glow instead of solid fill
        borderColor: '#fbe134',
    },
    categoryText: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
    },
    categoryTextActive: {
        color: '#fbe134', // Match the tint
    },
    listContent: {
        paddingBottom: 120,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    cardWrapper: {
        width: '48%',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    },
});
