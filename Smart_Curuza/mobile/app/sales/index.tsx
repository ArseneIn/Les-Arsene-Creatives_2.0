import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, SafeAreaView, ActivityIndicator, ImageBackground, Text, TouchableOpacity, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ApiClient } from '../../lib/api_client';
import { Product, CartItem } from '../../lib/types';
import ProductGrid from '../../components/ProductGrid';
import CartSidebar from '../../components/CartSidebar';
import CheckoutModal from '../../components/CheckoutModal';
import POSHeader from '../../components/POSHeader';
import SkeletonLoader from '../../components/SkeletonLoader';
import { ShoppingCart } from 'lucide-react-native';

export default function SalesScreen() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [cartVisible, setCartVisible] = useState(false);
    const [checkoutVisible, setCheckoutVisible] = useState(false);
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    const showToast = (message: string) => {
        setToast({ message, visible: true });
    };

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
        if (product.stock <= 0) {
            Alert.alert('Out of Stock', `${product.name} is currently out of stock.`);
            return;
        }

        setCart(currentCart => {
            const currentItem = currentCart.find(item => item.id === product.id);
            
            // Check stock using the most up-to-date cart state
            if (currentItem && currentItem.quantity >= product.stock) {
                showToast(`Limit reached. Only ${product.stock} in stock.`);
                return currentCart;
            }

            let newQuantity = 1;
            let newCart;

            if (currentItem) {
                newQuantity = currentItem.quantity + 1;
                newCart = currentCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                newCart = [...currentCart, { ...product, quantity: 1 }];
            }

            const unitLabel = product.unit ? ` ${product.unit}` : '';
            showToast(`Added ${product.name} - Total: ${newQuantity}${unitLabel}`);
            return newCart;
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(currentCart => {
            const itemInCart = currentCart.find(item => item.id === productId);
            if (!itemInCart) return currentCart;

            // Check stock limit for increase
            if (delta > 0 && itemInCart.quantity + delta > itemInCart.stock) {
                showToast(`Limit reached. Only ${itemInCart.stock} in stock.`);
                return currentCart;
            }

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

    const handleCheckout = async (method: 'CASH' | 'MOBILE_MONEY' | 'CREDIT', details?: { phone?: string, clientName?: string }) => {
        try {
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            console.log('Processing payment:', method, details);

            await ApiClient.createSale({
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: totalAmount,
                paymentMethod: method === 'CREDIT' ? 'Credit' : method,
                // Appending CRM details for Debt/MoMo hooking on backend
                clientName: details?.clientName,
                clientPhone: details?.phone,
            });

            setCheckoutVisible(false);
            setCart([]);

            const successMessage = method === 'MOBILE_MONEY'
                ? 'Payment request sent to your phone!'
                : method === 'CREDIT' 
                    ? `Ideni recorded for ${details?.clientName}`
                    : 'Sale completed successfully';

            Alert.alert('Success', successMessage, [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Checkout error:', error);
            
            let errorMessage = 'Failed to process sale';
            if (error.message && error.message.includes('{')) {
                try {
                    const jsonPart = error.message.substring(error.message.indexOf('{'));
                    const errorObj = JSON.parse(jsonPart);
                    errorMessage = errorObj.message || errorMessage;
                } catch (e) {
                    errorMessage = error.message;
                }
            } else {
                errorMessage = error.message || errorMessage;
            }

            // If it's a stock error, refresh products to sync UI with backend
            if (errorMessage.toLowerCase().includes('stock')) {
                loadProducts();
            }

            Alert.alert('Error', Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
        }
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (loading) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <StatusBar style="light" />
                <POSHeader />
                <ImageBackground source={require('../../assets/doodle-bg.png')} style={styles.backgroundImage} resizeMode="cover">
                    <View style={styles.gridContainer}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {[1, 2, 3, 4, 5, 6].map(key => (
                                <View key={key} style={{ width: '48%', marginBottom: 16, height: 180, backgroundColor: '#2a2e34', borderRadius: 20, padding: 16, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                                    <SkeletonLoader width={40} height={40} borderRadius={12} />
                                    <View style={{ gap: 8 }}>
                                        <SkeletonLoader width="90%" height={14} />
                                        <SkeletonLoader width="60%" height={14} />
                                    </View>
                                    <SkeletonLoader width="100%" height={36} borderRadius={12} />
                                </View>
                            ))}
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            <POSHeader />

            <ImageBackground
                source={require('../../assets/doodle-bg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.content}>
                    <View style={styles.gridContainer}>
                        <ProductGrid
                            products={products}
                            onAddToCart={addToCart}
                        />
                    </View>
                </View>

                {/* Floating Cart Button */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setCartVisible(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.fabContent}>
                        <ShoppingCart size={24} color="#0b0c0c" />
                        {totalItems > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{totalItems}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </ImageBackground>

            {/* Unified Cart & Checkout Modal */}
            <Modal
                visible={cartVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCartVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <CartSidebar
                            cart={cart}
                            onUpdateQuantity={updateQuantity}
                            onRemoveItem={removeItem}
                            onCheckout={() => {
                                setCartVisible(false);
                                setTimeout(() => setCheckoutVisible(true), 300);
                            }} 
                            onClose={() => setCartVisible(false)}
                        />
                    </View>
                </View>
            </Modal>

            {/* Toast Notification */}
            {toast.visible && (
                <View style={styles.toastContainer}>
                    <Text style={styles.toastText}>{toast.message}</Text>
                </View>
            )}

            <CheckoutModal
                visible={checkoutVisible}
                totalAmount={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                onClose={() => setCheckoutVisible(false)}
                onConfirm={handleCheckout}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1d21', // Match true dark bg
    },
    backgroundImage: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1d21',
    },
    content: {
        flex: 1,
        flexDirection: 'column',
    },
    gridContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fbe134', // Gold
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 50,
    },
    fabContent: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#EF4444', // Red
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#fbe134',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '80%', 
        backgroundColor: '#1a1d21',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
    },
    toastContainer: {
        position: 'absolute',
        top: 100, // Below header
        alignSelf: 'center',
        backgroundColor: '#10B981', // Success Green
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 100,
    },
    toastText: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
    },
});
