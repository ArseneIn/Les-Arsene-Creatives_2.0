import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ApiClient } from '../../lib/api_client';
import { Product, CartItem } from '../../lib/types';
import ProductCard from '../../components/ProductCard';
import CartModal from '../../components/CartModal';

export default function Sales() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartModalVisible, setCartModalVisible] = useState(false);
    const [processing, setProcessing] = useState(false);

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
            const existing = currentCart.find(item => item.id === product.id);
            if (existing) {
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
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            });
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(currentCart => currentCart.filter(item => item.id !== productId));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        setProcessing(true);
        try {
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            await ApiClient.createSale({
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount,
                paymentMethod: 'CASH', // Default for now
            });

            Alert.alert('Success', 'Sale completed successfully!', [
                {
                    text: 'OK', onPress: () => {
                        setCart([]);
                        setCartModalVisible(false);
                    }
                }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to process sale');
        } finally {
            setProcessing(false);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <SafeAreaView className="flex-1 bg-platinum">
            {/* Header */}
            <View className="px-4 py-3 bg-white shadow-sm flex-row items-center justify-between z-10">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-50 rounded-full">
                        <ArrowLeft size={24} color="#0b0c0c" />
                    </TouchableOpacity>
                    <Text className="font-heading text-lg font-bold text-onyx">New Sale</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity className="p-2 bg-gray-50 rounded-full">
                        <Search size={24} color="#0b0c0c" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View className="flex-1">
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#D4AF37" />
                    </View>
                ) : (
                    <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 100 }}>
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* Bottom Cart Bar */}
            <View className="bg-white p-4 shadow-2xl border-t border-gray-100">
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-400 font-medium">Total ({cartCount} items)</Text>
                    <Text className="font-heading font-bold text-xl text-onyx">{cartTotal.toLocaleString()} RWF</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setCartModalVisible(true)}
                    className="bg-gold py-4 rounded-xl items-center shadow-md active:bg-yellow-400 flex-row justify-center gap-2"
                >
                    <ShoppingCart size={20} color="#0b0c0c" />
                    <Text className="font-bold text-onyx uppercase tracking-wider">View Cart</Text>
                </TouchableOpacity>
            </View>

            <CartModal
                visible={cartModalVisible}
                onClose={() => setCartModalVisible(false)}
                cartItems={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                total={cartTotal}
            />
        </SafeAreaView>
    );
}
