import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../lib/types';
import { Plus, Minus } from 'lucide-react-native';
import { useTheme } from '../lib/theme/ThemeContext';

interface ProductCardProps {
    product: Product;
    cartQty: number;
    onAddToCart: (product: Product) => void;
    onDecrement: (productId: string) => void;
}

export default function ProductCard({ product, cartQty, onAddToCart, onDecrement }: ProductCardProps) {
    const { colors, isDarkMode } = useTheme();

    const isLowStock = product.stock < 5;
    const isInCart = cartQty > 0;

    return (
        <View style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: isInCart ? 'rgba(251,225,52,0.35)' : colors.border },
        ]}>
            {/* Product initials + stock badge */}
            <View style={styles.cardTop}>
                <View style={[styles.iconCircle, { backgroundColor: colors.overlay }]}>
                    <Text style={[styles.initials, { color: colors.textSecondary }]}>
                        {product.name.substring(0, 2).toUpperCase()}
                    </Text>
                </View>
                <View style={[styles.stockBadge, { backgroundColor: isLowStock ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)' }]}>
                    <Text style={[styles.badgeText, { color: isLowStock ? '#EF4444' : '#10B981' }]}>
                        {product.stock} {product.unit || 'pcs'}
                    </Text>
                </View>
            </View>

            {/* Name & category */}
            <Text style={[styles.productName, { color: colors.textPrimary }]} numberOfLines={2}>
                {product.name}
            </Text>
            {product.category ? (
                <Text style={[styles.categoryName, { color: colors.textSecondary }]}>{product.category}</Text>
            ) : null}

            {/* Price + add controls */}
            <View style={styles.cardFooter}>
                <Text style={[styles.price, { color: colors.brandGold }]} numberOfLines={1}>
                    {product.price.toLocaleString()}{' '}
                    <Text style={styles.currency}>RWF</Text>
                </Text>

                {isInCart ? (
                    <View style={[styles.qtyRow, { backgroundColor: colors.overlay }]}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => onDecrement(product.id)}>
                            <Minus size={14} color={colors.textPrimary} strokeWidth={3} />
                        </TouchableOpacity>
                        <Text style={[styles.qtyText, { color: colors.textPrimary }]}>{cartQty}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => onAddToCart(product)}>
                            <Plus size={14} color={colors.textPrimary} strokeWidth={3} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => onAddToCart(product)}
                        style={styles.addButton}
                        activeOpacity={0.75}
                    >
                        <Plus size={18} color="#0b0c0c" strokeWidth={3} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        fontSize: 13,
        fontFamily: 'Poppins_700Bold',
    },
    stockBadge: {
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 9,
        fontFamily: 'Montserrat_700Bold',
    },
    productName: {
        fontSize: 13,
        fontFamily: 'Montserrat_700Bold',
        lineHeight: 18,
        marginBottom: 2,
    },
    categoryName: {
        fontSize: 10,
        fontFamily: 'Montserrat_500Medium',
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    price: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        flex: 1,
        flexShrink: 1,
    },
    currency: {
        fontSize: 9,
        fontFamily: 'Montserrat_500Medium',
    },
    addButton: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#fbe134',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
        elevation: 3,
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 3,
        marginLeft: 6,
        gap: 4,
    },
    qtyBtn: {
        width: 26,
        height: 26,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        fontSize: 13,
        fontFamily: 'Poppins_700Bold',
        minWidth: 18,
        textAlign: 'center',
    },
});
