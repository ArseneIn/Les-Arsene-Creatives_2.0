import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { Product } from '../lib/types';

interface ProductGridProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode?.includes(searchQuery)
    );

    const renderItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onAddToCart(item)}
            activeOpacity={0.7}
        >
            <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>{item.name.substring(0, 2).toUpperCase()}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString()} RWF</Text>
                <Text style={[styles.stockText, item.stock < 5 ? styles.textRed : styles.textGray]}>
                    {item.stock} in stock
                </Text>
            </View>
            <View style={styles.addButton}>
                <Plus size={20} color="#0b0c0c" />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#9CA3AF"
                />
            </View>
            <FlatList
                data={filteredProducts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No products found</Text>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#0b0c0c',
    },
    listContent: {
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        width: '48%',
        backgroundColor: '#F3F4F6', // Light Gray
        borderRadius: 24,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB', // Slightly darker border
        position: 'relative',
    },
    imagePlaceholder: {
        width: '100%',
        height: 110,
        backgroundColor: '#FFFFFF', // White placeholder for contrast
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    placeholderText: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#E5E7EB',
    },
    infoContainer: {
        gap: 4,
    },
    productName: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#1F2937', // Gray-800
        height: 36,
        lineHeight: 18,
    },
    productPrice: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c', // Onyx
    },
    stockText: {
        fontSize: 10,
        fontFamily: 'Montserrat_500Medium',
    },
    textGray: { color: '#9CA3AF' },
    textRed: { color: '#EF4444' },
    addButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 36,
        height: 36,
        backgroundColor: '#fbe134', // Gold
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    emptyText: {
        color: '#9CA3AF',
        fontFamily: 'Montserrat_500Medium',
    },
});
