import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react-native';
import { CartItem } from '../lib/types';

interface CartSidebarProps {
    cart: CartItem[];
    onUpdateQuantity: (productId: string, delta: number) => void;
    onRemoveItem: (productId: string) => void;
    onCheckout: () => void;
}

export default function CartSidebar({ cart, onUpdateQuantity, onRemoveItem, onCheckout }: CartSidebarProps) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Cart is empty</Text>
                <Text style={styles.emptySubText}>Select products to start a sale</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Current Sale</Text>
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
                                <Minus size={16} color="#0b0c0c" />
                            </TouchableOpacity>

                            <Text style={styles.quantity}>{item.quantity}</Text>

                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => onUpdateQuantity(item.id, 1)}
                            >
                                <Plus size={16} color="#0b0c0c" />
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

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>{total.toLocaleString()} RWF</Text>
                </View>

                <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
                    <Text style={styles.checkoutText}>Checkout</Text>
                    <ArrowRight size={20} color="#0b0c0c" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
        overflow: 'hidden', // Ensure header radius is respected
    },
    header: {
        backgroundColor: '#2a2e34', // Jet
        padding: 24,
        paddingBottom: 32,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF', // White text on dark header
    },
    itemList: {
        flex: 1,
        marginTop: -20, // Overlap with header
        backgroundColor: '#FFFFFF',
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
        borderBottomColor: '#F3F4F6',
    },
    itemInfo: {
        flex: 1,
        marginRight: 12,
    },
    itemName: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#0b0c0c',
    },
    itemPrice: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
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
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#FEF2F2',
        marginLeft: 8,
    },
    quantity: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
        minWidth: 20,
        textAlign: 'center',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 16,
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
        color: '#0b0c0c',
    },
    checkoutButton: {
        backgroundColor: '#fbe134', // Gold
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
