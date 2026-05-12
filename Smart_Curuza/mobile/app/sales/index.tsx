import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, ActivityIndicator, Animated,
    KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { ShoppingCart, ArrowLeft, CheckCircle2, Banknote, Smartphone, FileText, Minus, Plus, Trash2, Share2, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme/ThemeContext';
import { ApiClient } from '../../lib/api_client';
import { Product, CartItem, CreateSaleDto } from '../../lib/types';
import ProductGrid from '../../components/ProductGrid';
import SkeletonLoader from '../../components/SkeletonLoader';
import { generateTextReceipt } from '../../lib/receipt_generator';
import { Share } from 'react-native';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const POSSkeleton = () => {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12, gap: 14 }}>
            <SkeletonLoader height={44} borderRadius={12} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <SkeletonLoader width="48%" height={150} borderRadius={16} />
                <SkeletonLoader width="48%" height={150} borderRadius={16} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <SkeletonLoader width="48%" height={150} borderRadius={16} />
                <SkeletonLoader width="48%" height={150} borderRadius={16} />
            </View>
        </View>
    );
};

type Screen = 'products' | 'cart' | 'checkout' | 'success';
type PayMethod = 'CASH' | 'MOBILE_MONEY' | 'CREDIT';

// ── Main POS Screen ───────────────────────────────────────────────────────────
export default function POSScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { colors, isDarkMode } = useTheme();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [screen, setScreen] = useState<Screen>('products');
    const [processing, setProcessing] = useState(false);

    // Checkout form
    const [method, setMethod] = useState<PayMethod>('CASH');
    const [phone, setPhone] = useState('');
    const [clientName, setClientName] = useState('');
    const [shopName, setShopName] = useState('Smart Curuza Shop');

    // Toast
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = () => {
        if (toastTimeout.current) clearTimeout(toastTimeout.current);
        Animated.sequence([
            Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.delay(1200),
            Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
    };

    const fetchProducts = useCallback(async (bypass = false) => {
        try {
            const data = await ApiClient.getProducts(bypass);
            setProducts(data.map((p: any) => ({
                id: p.id, name: p.name, barcode: p.barcode ?? '',
                price: Number(p.price) || 0, stock: Number(p.stock) || 0,
                category: p.parent?.name ?? p.category ?? undefined,
                unit: p.unit ?? 'pcs', status: p.status,
            })));
        } catch { /* offline – keep stale */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchProducts();
        ApiClient.getMerchantProfile().then(p => { if (p.businessName) setShopName(p.businessName); }).catch(() => {});
    }, [fetchProducts]);

    // ── Cart helpers ──────────────────────────────────────────────────────────
    const addToCart = (product: Product) => {
        if (product.stock <= 0) { Alert.alert('Out of Stock', `${product.name} is out of stock.`); return; }
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    Alert.alert('Stock Limit', `Only ${product.stock} ${product.unit ?? 'pcs'} available.`);
                    return prev;
                }
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        showToast();
    };

    const decrement = (id: string) => setCart(prev =>
        prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0)
    );
    const removeItem = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

    // ── Checkout ──────────────────────────────────────────────────────────────
    const canConfirm = () => {
        if (method === 'MOBILE_MONEY' && phone.length < 10) return false;
        if (method === 'CREDIT' && (clientName.trim() === '' || phone.length < 10)) return false;
        return true;
    };

    const handleCheckout = async () => {
        if (!canConfirm()) return;
        setProcessing(true);
        try {
            const dto: CreateSaleDto = {
                items: cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
                total: cartTotal, paymentMethod: method,
                clientName: method === 'CREDIT' ? clientName : undefined,
                clientPhone: (method === 'MOBILE_MONEY' || method === 'CREDIT') ? phone : undefined,
            };
            await ApiClient.createSale(dto);
            fetchProducts(true);
            setScreen('success');
        } catch (err: any) {
            Alert.alert('Sale Failed', err?.message ?? 'Could not process the sale.');
        } finally { setProcessing(false); }
    };

    const handleShareReceipt = async () => {
        const receipt = generateTextReceipt(cart, cartTotal, shopName, method === 'CREDIT' ? 'Debt (Ideni)' : method, clientName);
        try { await Share.share({ message: receipt, title: 'Digital Receipt' }); } catch {}
    };

    const handleNewSale = () => {
        setCart([]); setPhone(''); setClientName(''); setMethod('CASH'); setScreen('products');
    };

    // ── Dynamic colors ────────────────────────────────────────────────────────
    const bg = colors.background;
    const card = colors.card;
    const border = colors.border;
    const textPrimary = colors.textPrimary;
    const textSecondary = colors.textSecondary;
    const gold = '#fbe134';

    // ── Header ────────────────────────────────────────────────────────────────
    const headerTitle =
        screen === 'cart' ? 'Your Cart' :
        screen === 'checkout' ? 'Payment' :
        screen === 'success' ? 'Sale Complete' : 'Quick Sale';

    const headerBack = () => {
        if (screen === 'cart') setScreen('products');
        else if (screen === 'checkout') setScreen('cart');
        else router.back();
    };

    return (
        <View style={[styles.root, { paddingTop: insets.top, backgroundColor: bg }]}>
            {/* ── Header ── */}
            <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
                <TouchableOpacity onPress={headerBack} style={[styles.headerBack, { backgroundColor: colors.overlay, borderColor: border }]}>
                    <ArrowLeft size={20} color={textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, { color: textPrimary }]}>{headerTitle}</Text>
                    {screen === 'products' && (
                        <Text style={[styles.headerSub, { color: textSecondary }]}>Tap + to add items</Text>
                    )}
                </View>
                {screen === 'products' && (
                    <TouchableOpacity style={styles.cartBtn} onPress={() => setScreen('cart')} activeOpacity={0.85}>
                        <ShoppingCart size={20} color="#0b0c0c" />
                        {cartCount > 0 && (
                            <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* ── Toast – pointerEvents none so it never blocks taps ── */}
            <Animated.View pointerEvents="none" style={[styles.toast, { opacity: toastOpacity, backgroundColor: isDarkMode ? '#2a2e34' : '#1a1d21' }]}>
                <CheckCircle2 size={14} color="#10B981" />
                <Text style={styles.toastText}>Added to cart</Text>
            </Animated.View>

            {/* ── SCREEN: Products ── */}
            {screen === 'products' && (
                <View style={styles.flex}>
                    {loading ? <POSSkeleton /> : (
                        <View style={styles.gridWrap}>
                            <ProductGrid products={products} cart={cart} onAddToCart={addToCart} onDecrement={decrement} />
                        </View>
                    )}
                    {cartCount > 0 && (
                        <TouchableOpacity
                            style={[styles.fab, { bottom: Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 8) + 16 }]}
                            onPress={() => setScreen('cart')}
                            activeOpacity={0.85}
                        >
                            <ShoppingCart size={18} color="#0b0c0c" />
                            <Text style={styles.fabText}>{cartTotal.toLocaleString()} RWF</Text>
                            <View style={styles.fabBadge}><Text style={styles.fabBadgeText}>{cartCount}</Text></View>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* ── SCREEN: Cart ── */}
            {screen === 'cart' && (
                <View style={styles.flex}>
                    <ScrollView style={styles.flex} contentContainerStyle={{ padding: 16, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
                        {cart.length === 0 ? (
                            <View style={styles.emptyCart}>
                                <ShoppingCart size={48} color={textSecondary} />
                                <Text style={[styles.emptyTitle, { color: textPrimary }]}>Cart is empty</Text>
                                <TouchableOpacity onPress={() => setScreen('products')} style={[styles.continueBtn, { borderColor: gold }]}>
                                    <Text style={[styles.continueBtnText, { color: gold }]}>Browse Products</Text>
                                </TouchableOpacity>
                            </View>
                        ) : cart.map(item => (
                            <View key={item.id} style={[styles.cartItem, { backgroundColor: card, borderColor: border }]}>
                                <View style={styles.cartItemLeft}>
                                    <Text style={[styles.cartItemName, { color: textPrimary }]} numberOfLines={1}>{item.name}</Text>
                                    <Text style={[styles.cartItemPrice, { color: gold }]}>{(item.price * item.quantity).toLocaleString()} RWF</Text>
                                </View>
                                <View style={styles.cartControls}>
                                    <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: colors.overlay }]} onPress={() => decrement(item.id)}>
                                        <Minus size={13} color={textPrimary} />
                                    </TouchableOpacity>
                                    <Text style={[styles.qtyNum, { color: textPrimary }]}>{item.quantity}</Text>
                                    <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: colors.overlay }]} onPress={() => addToCart(item)}>
                                        <Plus size={13} color={textPrimary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.delBtn, { backgroundColor: 'rgba(239,68,68,0.1)' }]} onPress={() => removeItem(item.id)}>
                                        <Trash2 size={13} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {cart.length > 0 && (
                        <View style={[styles.cartFooter, { backgroundColor: card, borderTopColor: border, paddingBottom: insets.bottom + 16 }]}>
                            <View style={styles.totalRow}>
                                <Text style={[styles.totalLabel, { color: textSecondary }]}>TOTAL</Text>
                                <Text style={[styles.totalAmount, { color: textPrimary }]}>{cartTotal.toLocaleString()} <Text style={{ color: gold, fontSize: 14 }}>RWF</Text></Text>
                            </View>
                            <TouchableOpacity style={styles.checkoutBtn} onPress={() => setScreen('checkout')} activeOpacity={0.85}>
                                <Text style={styles.checkoutBtnText}>Proceed to Payment</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {/* ── SCREEN: Checkout ── */}
            {screen === 'checkout' && (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
                    <ScrollView style={styles.flex} contentContainerStyle={{ padding: 20, paddingBottom: 140 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        {/* Order summary */}
                        <View style={[styles.summaryCard, { backgroundColor: card, borderColor: border }]}>
                            <Text style={[styles.sectionLabel, { color: textSecondary }]}>ORDER TOTAL</Text>
                            <Text style={[styles.bigAmount, { color: textPrimary }]}>{cartTotal.toLocaleString()} <Text style={{ color: gold, fontSize: 18 }}>RWF</Text></Text>
                            <Text style={[styles.itemCount, { color: textSecondary }]}>{cartCount} item{cartCount !== 1 ? 's' : ''}</Text>
                        </View>

                        {/* Payment method */}
                        <Text style={[styles.sectionLabel, { color: textSecondary, marginTop: 24, marginBottom: 12 }]}>PAYMENT METHOD</Text>
                        {(['CASH', 'MOBILE_MONEY', 'CREDIT'] as PayMethod[]).map((m) => {
                            const icons = { CASH: Banknote, MOBILE_MONEY: Smartphone, CREDIT: FileText };
                            const labels = { CASH: 'Cash', MOBILE_MONEY: 'Mobile Money (MoMo)', CREDIT: 'Debt (Ideni)' };
                            const Icon = icons[m];
                            const active = method === m;
                            return (
                                <TouchableOpacity key={m} style={[styles.methodRow, { backgroundColor: card, borderColor: active ? gold : border }]} onPress={() => setMethod(m)} activeOpacity={0.8}>
                                    <View style={[styles.methodIcon, { backgroundColor: active ? 'rgba(251,225,52,0.1)' : colors.overlay }]}>
                                        <Icon size={20} color={active ? gold : textSecondary} />
                                    </View>
                                    <Text style={[styles.methodLabel, { color: active ? textPrimary : textSecondary, fontFamily: active ? 'Poppins_700Bold' : 'Montserrat_500Medium' }]}>{labels[m]}</Text>
                                    {active && <CheckCircle2 size={18} color={gold} />}
                                </TouchableOpacity>
                            );
                        })}

                        {/* Extra fields */}
                        {method === 'CREDIT' && (
                            <View style={[styles.field, { backgroundColor: card, borderColor: border }]}>
                                <Text style={[styles.fieldLabel, { color: textSecondary }]}>Client Name *</Text>
                                <TextInput style={[styles.fieldInput, { color: textPrimary }]} placeholder="Enter full name" placeholderTextColor={textSecondary} value={clientName} onChangeText={setClientName} />
                            </View>
                        )}
                        {(method === 'MOBILE_MONEY' || method === 'CREDIT') && (
                            <View style={[styles.field, { backgroundColor: card, borderColor: border }]}>
                                <Text style={[styles.fieldLabel, { color: textSecondary }]}>Phone Number *</Text>
                                <TextInput style={[styles.fieldInput, { color: textPrimary }]} placeholder="078..." placeholderTextColor={textSecondary} keyboardType="phone-pad" value={phone} onChangeText={setPhone} maxLength={10} />
                            </View>
                        )}
                    </ScrollView>

                    <View style={[styles.cartFooter, { backgroundColor: card, borderTopColor: border, paddingBottom: insets.bottom + 16 }]}>
                        <TouchableOpacity style={[styles.checkoutBtn, !canConfirm() && { opacity: 0.45 }]} onPress={handleCheckout} disabled={!canConfirm() || processing} activeOpacity={0.85}>
                            {processing ? <ActivityIndicator color="#0b0c0c" /> : <Text style={styles.checkoutBtnText}>Confirm &amp; Complete Sale</Text>}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )}

            {/* ── SCREEN: Success ── */}
            {screen === 'success' && (
                <View style={[styles.flex, styles.successView]}>
                    <View style={styles.successCircle}><CheckCircle2 size={52} color="#10B981" /></View>
                    <Text style={[styles.successTitle, { color: textPrimary }]}>Sale Complete!</Text>
                    <Text style={[styles.successSub, { color: textSecondary }]}>Transaction recorded successfully.</Text>

                    <View style={[styles.receiptCard, { backgroundColor: card, borderColor: border }]}>
                        <View style={styles.receiptRow}><Text style={[styles.receiptLabel, { color: textSecondary }]}>Total</Text><Text style={[styles.receiptValue, { color: textPrimary }]}>{cartTotal.toLocaleString()} RWF</Text></View>
                        <View style={[styles.divider, { backgroundColor: border }]} />
                        <View style={styles.receiptRow}><Text style={[styles.receiptLabel, { color: textSecondary }]}>Method</Text><Text style={[styles.receiptValue, { color: textPrimary }]}>{method === 'CREDIT' ? 'Debt (Ideni)' : method}</Text></View>
                        {clientName ? <><View style={[styles.divider, { backgroundColor: border }]} /><View style={styles.receiptRow}><Text style={[styles.receiptLabel, { color: textSecondary }]}>Client</Text><Text style={[styles.receiptValue, { color: textPrimary }]}>{clientName}</Text></View></> : null}
                    </View>

                    <View style={styles.successActions}>
                        <TouchableOpacity style={[styles.shareBtn, { borderColor: gold }]} onPress={handleShareReceipt}>
                            <Share2 size={18} color={gold} />
                            <Text style={[styles.shareBtnText, { color: gold }]}>Share Receipt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.newSaleBtn} onPress={handleNewSale}>
                            <Text style={styles.newSaleBtnText}>New Sale</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    flex: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, gap: 12 },
    headerBack: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    headerTitle: { fontSize: 20, fontFamily: 'Poppins_700Bold' },
    headerSub: { fontSize: 11, fontFamily: 'Montserrat_500Medium', marginTop: 1 },
    cartBtn: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#fbe134', alignItems: 'center', justifyContent: 'center', shadowColor: '#fbe134', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 },
    badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#EF4444', borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff', paddingHorizontal: 3 },
    badgeText: { fontSize: 9, fontFamily: 'Poppins_700Bold', color: '#fff' },
    toast: { position: 'absolute', top: 80, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 10 },
    toastText: { fontSize: 13, fontFamily: 'Montserrat_700Bold', color: '#fff' },
    gridWrap: { flex: 1, paddingHorizontal: 12, paddingTop: 10 },
    fab: { position: 'absolute', left: 16, right: 16, backgroundColor: '#fbe134', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 18, gap: 10, shadowColor: '#fbe134', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 10 },
    fabText: { fontSize: 15, fontFamily: 'Poppins_700Bold', color: '#0b0c0c', flex: 1, textAlign: 'center' },
    fabBadge: { backgroundColor: '#0b0c0c', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
    fabBadgeText: { fontSize: 12, fontFamily: 'Poppins_700Bold', color: '#fbe134' },
    emptyCart: { flex: 1, alignItems: 'center', paddingTop: 80, gap: 12 },
    emptyTitle: { fontSize: 18, fontFamily: 'Poppins_700Bold', marginTop: 8 },
    continueBtn: { marginTop: 8, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 },
    continueBtnText: { fontSize: 14, fontFamily: 'Montserrat_700Bold' },
    cartItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1 },
    cartItemLeft: { flex: 1, marginRight: 10 },
    cartItemName: { fontSize: 14, fontFamily: 'Montserrat_700Bold' },
    cartItemPrice: { fontSize: 12, fontFamily: 'Montserrat_600SemiBold', marginTop: 2 },
    cartControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    qtyBtn: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    qtyNum: { fontSize: 14, fontFamily: 'Poppins_700Bold', minWidth: 20, textAlign: 'center' },
    delBtn: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 2 },
    cartFooter: { paddingHorizontal: 16, paddingTop: 14, borderTopWidth: 1 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 },
    totalLabel: { fontSize: 11, fontFamily: 'Montserrat_700Bold', letterSpacing: 1 },
    totalAmount: { fontSize: 26, fontFamily: 'Poppins_700Bold' },
    checkoutBtn: { backgroundColor: '#fbe134', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#fbe134', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    checkoutBtnText: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#0b0c0c' },
    summaryCard: { borderRadius: 18, padding: 20, alignItems: 'center', borderWidth: 1, marginBottom: 4 },
    sectionLabel: { fontSize: 10, fontFamily: 'Montserrat_700Bold', letterSpacing: 1.5, textTransform: 'uppercase' },
    bigAmount: { fontSize: 36, fontFamily: 'Poppins_700Bold', marginTop: 6 },
    itemCount: { fontSize: 12, fontFamily: 'Montserrat_500Medium', marginTop: 2 },
    methodRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 16, padding: 14, marginBottom: 10, gap: 14 },
    methodIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    methodLabel: { flex: 1, fontSize: 15 },
    field: { borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 12 },
    fieldLabel: { fontSize: 11, fontFamily: 'Montserrat_600SemiBold', marginBottom: 8 },
    fieldInput: { fontSize: 15, fontFamily: 'Montserrat_500Medium' },
    successView: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
    successCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(16,185,129,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    successTitle: { fontSize: 26, fontFamily: 'Poppins_700Bold' },
    successSub: { fontSize: 13, fontFamily: 'Montserrat_500Medium', marginBottom: 16 },
    receiptCard: { width: '100%', borderRadius: 18, padding: 18, borderWidth: 1, gap: 4 },
    receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
    receiptLabel: { fontSize: 13, fontFamily: 'Montserrat_500Medium' },
    receiptValue: { fontSize: 14, fontFamily: 'Poppins_700Bold' },
    divider: { height: 1 },
    successActions: { width: '100%', gap: 12, marginTop: 16 },
    shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: 14, paddingVertical: 14, gap: 8 },
    shareBtnText: { fontSize: 15, fontFamily: 'Poppins_700Bold' },
    newSaleBtn: { backgroundColor: '#fbe134', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
    newSaleBtnText: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#0b0c0c' },
});
