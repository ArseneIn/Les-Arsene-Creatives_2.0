import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../lib/types';
import { Plus } from 'lucide-react-native';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={styles.iconCircle}>
                    <Text style={styles.placeholderText}>{product.name.substring(0, 2).toUpperCase()}</Text>
                </View>
                <View style={[styles.stockBadge, product.stock < 5 ? styles.badgeRed : styles.badgeGreen]}>
                    <Text style={styles.badgeText}>
                        {product.stock} {product.unit || 'Pcs'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View>
                    <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                    <Text style={styles.categoryName}>{product.category || 'General'}</Text>
                </View>
                
                <View style={styles.cardFooter}>
                    <Text style={styles.productPrice}>{product.price.toLocaleString()} <Text style={styles.currency}>RWF</Text></Text>
                    <TouchableOpacity
                        onPress={() => onAddToCart(product)}
                        style={styles.addButton}
                        activeOpacity={0.7}
                    >
                        <Plus size={20} color="#0b0c0c" strokeWidth={3} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#2a2e34',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconCircle: {
        width: 38,
        height: 38,
        backgroundColor: '#1a1d21',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: 'rgba(255, 255, 255, 0.3)',
    },
    stockBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        flexShrink: 1,
        marginLeft: 8,
    },
    badgeGreen: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    badgeRed: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    badgeText: {
        fontSize: 9,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    cardBody: {
        gap: 8,
    },
    productName: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        color: '#FFFFFF',
        lineHeight: 18,
    },
    categoryName: {
        fontSize: 10,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 4,
    },
    productPrice: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#fbe134',
        flex: 1,
    },
    currency: {
        fontSize: 10,
        color: 'rgba(251, 225, 52, 0.7)',
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#fbe134',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginLeft: 8,
    },
});
