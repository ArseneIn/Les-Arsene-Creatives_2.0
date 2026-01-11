import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ApiClient } from '../../lib/api_client';
import { Product, CartItem } from '../../lib/types';
import ProductGrid from '../../components/ProductGrid';
import CartSidebar from '../../components/CartSidebar';
import CheckoutModal from '../../components/CheckoutModal';

export default function SalesScreen() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutVisible, setCheckoutVisible] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await ApiClient.getProducts();
            setProducts(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === product.id);
            if (existingItem) {
                return currentCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(currentCart => {
            return currentCart.map(item => {
                if (item.id === productId) {
                    const newQuantity = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const removeItem = (productId: string) => {
        setCart(currentCart => currentCart.filter(item => item.id !== productId));
    };

    const handleCheckout = async (method: 'CASH' | 'MOBILE_MONEY' | 'CREDIT') => {
        try {
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            await ApiClient.createSale({
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount,
                paymentMethod: method,
            });

            setCheckoutVisible(false);
            setCart([]);
            Alert.alert('Success', 'Sale completed successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to process sale');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fbe134" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'New Sale',
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTitleStyle: { fontFamily: 'Poppins_700Bold' },
                headerTintColor: '#0b0c0c',
            }} />

            <View style={styles.content}>
                <View style={styles.gridContainer}>
                    <ProductGrid
                        products={products}
                        onAddToCart={addToCart}
                    />
                </View>

                {/* Cart is always visible on tablet/desktop, but for mobile we might want a different UX.
                    For now, let's keep it simple: Split screen or Bottom Sheet.
                    Given the "Sidebar" naming, let's try a split view if space allows, 
                    or just put it at the bottom for now as a "Cart Summary" area.
                    Actually, let's make it a bottom sheet style container.
                */}
                <View style={styles.cartContainer}>
                    <CartSidebar
                        cart={cart}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeItem}
                        onCheckout={() => setCheckoutVisible(true)}
                    />
                </View>
            </View>

            <CheckoutModal
                visible={checkoutVisible}
                totalAmount={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                onClose={() => setCheckoutVisible(false)}
                onConfirm={handleCheckout}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        flexDirection: 'column', // Stack vertically on mobile
    },
    gridContainer: {
        flex: 1,
        padding: 16,
    },
    cartContainer: {
        height: '40%', // Take up bottom 40% of screen for cart
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
});
