import { View, StyleSheet, Alert, SafeAreaView, ActivityIndicator, ImageBackground } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ApiClient } from '../../lib/api_client';
import { Product, CartItem } from '../../lib/types';
import ProductGrid from '../../components/ProductGrid';
import CartSidebar from '../../components/CartSidebar';
import CheckoutModal from '../../components/CheckoutModal';
import POSHeader from '../../components/POSHeader';

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

                    <View style={styles.cartContainer}>
                        <CartSidebar
                            cart={cart}
                            onUpdateQuantity={updateQuantity}
                            onRemoveItem={removeItem}
                            onCheckout={() => setCheckoutVisible(true)}
                        />
                    </View>
                </View>
            </ImageBackground>

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
        backgroundColor: '#2a2e34', // Match header bg for overscroll
    },
    backgroundImage: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2a2e34',
    },
    content: {
        flex: 1,
        flexDirection: 'column',
    },
    gridContainer: {
        flex: 1,
        padding: 16,
    },
    cartContainer: {
        height: '40%',
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
