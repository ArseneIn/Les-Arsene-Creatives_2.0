import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Modal,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { ShoppingCart, X, ScanLine, Package, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme/ThemeContext';

import { ApiClient } from '../../lib/api_client';
import { Product, CartItem, CreateSaleDto } from '../../lib/types';
import ProductGrid from '../../components/ProductGrid';
import CartSidebar from '../../components/CartSidebar';
import CheckoutModal from '../../components/CheckoutModal';
import SkeletonLoader from '../../components/SkeletonLoader';

// ── Skeleton while products load ──────────────────────────────────────────────
const POSSkeleton = () => (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12, gap: 16 }}>
        <SkeletonLoader height={44} borderRadius={12} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
            <SkeletonLoader width="48%" height={140} borderRadius={16} />
            <SkeletonLoader width="48%" height={140} borderRadius={16} />
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
            <SkeletonLoader width="48%" height={140} borderRadius={16} />
            <SkeletonLoader width="48%" height={140} borderRadius={16} />
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
            <SkeletonLoader width="48%" height={140} borderRadius={16} />
            <SkeletonLoader width="48%" height={140} borderRadius={16} />
        </View>
    </View>
);

// ── Main POS Screen ───────────────────────────────────────────────────────────
export default function POSScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { colors, isDarkMode } = useTheme();

    // Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Cart State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [processingCheckout, setProcessingCheckout] = useState(false);
    const [saleSuccess, setSaleSuccess] = useState(false);

    // ─── Fetch products ───────────────────────────────────────────────────────
    const fetchProducts = useCallback(async (bypassCache = false) => {
        try {
            const data = await ApiClient.getProducts(bypassCache);
            const mapped: Product[] = data.map((p: any) => ({
                id: p.id,
                name: p.name,
                barcode: p.barcode ?? '',
                price: Number(p.price) || 0,
                stock: Number(p.stock) || 0,
                category: p.parent?.name ?? p.category ?? undefined,
                unit: p.unit ?? 'pcs',
                status: p.status,
            }));
            setProducts(mapped);
        } catch (err) {
            console.error('POS: failed to fetch products', err);
        } finally {
            setLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // ─── Cart helpers ─────────────────────────────────────────────────────────
    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            Alert.alert('Out of Stock', `${product.name} is currently out of stock.`);
            return;
        }
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    Alert.alert('Stock Limit', `Only ${product.stock} ${product.unit ?? 'pcs'} available.`);
                    return prev;
                }
                return prev.map(i =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        // Open cart drawer automatically on first add
        setShowCart(true);
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            return prev
                .map(i => i.id === productId ? { ...i, quantity: i.quantity + delta } : i)
                .filter(i => i.quantity > 0);
        });
    };

    const removeItem = (productId: string) => {
        setCart(prev => prev.filter(i => i.id !== productId));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    // ─── Checkout ─────────────────────────────────────────────────────────────
    const handleCheckoutConfirm = async (
        method: 'CASH' | 'MOBILE_MONEY' | 'CREDIT',
        details?: { phone?: string; clientName?: string },
    ) => {
        setProcessingCheckout(true);
        try {
            const saleDto: CreateSaleDto = {
                items: cart.map(i => ({
                    id: i.id,
                    name: i.name,
                    quantity: i.quantity,
                    price: i.price,
                })),
                total: cartTotal,
                paymentMethod: method,
                clientName: details?.clientName,
                clientPhone: details?.phone,
            };

            await ApiClient.createSale(saleDto);

            // Transition to success screen instead of closing
            setSaleSuccess(true);
            
            // Invalidate product cache to reflect updated stock
            fetchProducts(true);
        } catch (err: any) {
            console.error('POS: checkout failed', err);
            Alert.alert('Sale Failed', err?.message ?? 'Could not process the sale. Please try again.');
        } finally {
            setProcessingCheckout(false);
        }
    };

    const handleNewSale = () => {
        setShowCheckout(false);
        setShowCart(false);
        setSaleSuccess(false);
        clearCart();
    };

    const handleCloseCheckout = () => {
        if (saleSuccess) {
            handleNewSale();
        } else {
            setShowCheckout(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* ── Header ─────────────────────────────────────────────────── */}
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={[styles.backButton, { backgroundColor: colors.overlay, borderColor: colors.border }]}
                    >
                        <ArrowLeft size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Quick Sale</Text>
                        <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Select products to build order</Text>
                    </View>
                </View>

                {/* Cart button */}
                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() => setShowCart(true)}
                    activeOpacity={0.8}
                >
                    <ShoppingCart size={22} color="#0b0c0c" />
                    {cartCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* ── Product Grid ────────────────────────────────────────────── */}
            <View style={styles.gridContainer}>
                {loadingProducts ? (
                    <POSSkeleton />
                ) : products.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Package size={48} color={colors.textSecondary} />
                        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Products Yet</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Go to the Inventory tab to add your first product.</Text>
                    </View>
                ) : (
                    <ProductGrid products={products} onAddToCart={addToCart} />
                )}
            </View>

            {/* ── Cart Bottom Sheet ───────────────────────────────────────── */}
            <Modal
                visible={showCart}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCart(false)}
            >
                <View style={styles.cartOverlay}>
                    <TouchableOpacity
                        style={styles.cartBackdrop}
                        activeOpacity={1}
                        onPress={() => setShowCart(false)}
                    />
                    <View style={[styles.cartSheet, { paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
                        <CartSidebar
                            cart={cart}
                            onUpdateQuantity={updateQuantity}
                            onRemoveItem={removeItem}
                            onCheckout={() => {
                                setShowCart(false);
                                setShowCheckout(true);
                            }}
                            onClose={() => setShowCart(false)}
                        />
                    </View>
                </View>
            </Modal>

            {/* ── Checkout Modal ──────────────────────────────────────────── */}
            <CheckoutModal
                visible={showCheckout}
                totalAmount={cartTotal}
                items={cart}
                isSuccess={saleSuccess}
                onClose={handleCloseCheckout}
                onConfirm={handleCheckoutConfirm}
                onNewSale={handleNewSale}
            />

            {/* ── Processing overlay ──────────────────────────────────────── */}
            {processingCheckout && (
                <View style={styles.processingOverlay}>
                    <ActivityIndicator size="large" color="#fbe134" />
                    <Text style={styles.processingText}>Processing Sale…</Text>
                </View>
            )}

            {/* ── Floating Cart FAB (when cart has items & cart sheet closed) ── */}
            {cartCount > 0 && !showCart && !showCheckout && (
                <TouchableOpacity
                    style={[styles.fab, { bottom: insets.bottom + 100 }]}
                    onPress={() => setShowCart(true)}
                    activeOpacity={0.9}
                >
                    <ShoppingCart size={20} color="#0b0c0c" />
                    <Text style={styles.fabText}>{cartTotal.toLocaleString()} RWF</Text>
                    <View style={styles.fabBadge}>
                        <Text style={styles.fabBadgeText}>{cartCount}</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    headerSub: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        marginTop: 1,
    },
    cartButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#fbe134',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    cartBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#2a2e34',
        paddingHorizontal: 4,
    },
    cartBadgeText: {
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    gridContainer: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 13,
        fontFamily: 'Montserrat_500Medium',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    // Cart bottom sheet
    cartOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    cartBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    cartSheet: {
        height: '80%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
    },
    // Processing overlay
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.75)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    processingText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    // Floating Action Button
    fab: {
        position: 'absolute',
        left: 20,
        right: 20,
        backgroundColor: '#fbe134',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 20,
        gap: 10,
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
    },
    fabText: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
        flex: 1,
        textAlign: 'center',
    },
    fabBadge: {
        backgroundColor: '#0b0c0c',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    fabBadgeText: {
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        color: '#fbe134',
    },
});
