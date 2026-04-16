import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Trash2, Minus, Plus, ArrowRight, ChevronDown } from 'lucide-react-native';
import { CartItem } from '../lib/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CartSidebarProps {
    cart: CartItem[];
    onUpdateQuantity: (productId: string, delta: number) => void;
    onRemoveItem: (productId: string) => void;
    onCheckout: () => void;
    onClose: () => void;
}

export default function CartSidebar({ cart, onUpdateQuantity, onRemoveItem, onCheckout, onClose }: CartSidebarProps) {
    const insets = useSafeAreaInsets();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Current Sale</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <ChevronDown size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <View style={styles.emptyContent}>
                    <Text style={styles.emptyText}>Cart is empty</Text>
                    <Text style={styles.emptySubText}>Select products to start a sale</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Current Sale</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <ChevronDown size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.itemList} showsVerticalScrollIndicator={false}>
                {cart.map(item => (
                    <View key={item.id} style={styles.itemCard}>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()} RWF</Text>
                        </View>

                        <View style={styles.controls}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => onUpdateQuantity(item.id, -1)}
                            >
                                <Minus size={16} color="#FFFFFF" />
                            </TouchableOpacity>

                            <Text style={styles.quantity}>{item.quantity}</Text>

                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => onUpdateQuantity(item.id, 1)}
                            >
                                <Plus size={16} color="#FFFFFF" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.iconButton, styles.deleteButton]}
                                onPress={() => onRemoveItem(item.id)}
                            >
                                <Trash2 size={16} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>{total.toLocaleString()} RWF</Text>
                </View>

                <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
                    <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                    <ArrowRight size={20} color="#0b0c0c" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1d21', 
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
        overflow: 'hidden',
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#1a1d21',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
    },
    emptyContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#9CA3AF',
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#D1D5DB',
        marginTop: 8,
    },
    header: {
        backgroundColor: '#2a2e34', 
        padding: 24,
        paddingBottom: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    closeButton: {
        padding: 4,
    },
    itemList: {
        flex: 1,
        marginTop: -20,
        backgroundColor: '#1a1d21',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    itemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    itemInfo: {
        flex: 1,
        marginRight: 12,
    },
    itemName: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
    },
    itemPrice: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#fbe134',
        marginTop: 2,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#2a2e34',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        marginLeft: 8,
    },
    quantity: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
        minWidth: 20,
        textAlign: 'center',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        paddingTop: 16,
        paddingHorizontal: 24,
        backgroundColor: '#1a1d21',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    totalAmount: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    checkoutButton: {
        backgroundColor: '#fbe134',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    checkoutText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
