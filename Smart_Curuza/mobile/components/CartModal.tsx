import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { CartItem } from '../lib/types';
import { X, Minus, Plus, Trash2 } from 'lucide-react-native';

interface CartModalProps {
    visible: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateQuantity: (productId: string, delta: number) => void;
    onRemoveItem: (productId: string) => void;
    onCheckout: () => void;
    total: number;
}

export default function CartModal({
    visible,
    onClose,
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
    total
}: CartModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl h-[80%] shadow-2xl">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
                        <Text className="font-heading font-bold text-xl text-onyx">Current Order</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-50 rounded-full">
                            <X size={24} color="#0b0c0c" />
                        </TouchableOpacity>
                    </View>

                    {/* Cart Items */}
                    <ScrollView className="flex-1 p-5">
                        {cartItems.length === 0 ? (
                            <View className="items-center justify-center py-10">
                                <Text className="text-gray-400 text-lg">Cart is empty</Text>
                            </View>
                        ) : (
                            cartItems.map((item) => (
                                <View key={item.id} className="flex-row justify-between items-center mb-4 bg-gray-50 p-3 rounded-xl">
                                    <View className="flex-1">
                                        <Text className="font-bold text-onyx text-base">{item.name}</Text>
                                        <Text className="text-gold font-bold">{(item.price * item.quantity).toLocaleString()} RWF</Text>
                                    </View>

                                    <View className="flex-row items-center gap-3 bg-white px-2 py-1 rounded-lg shadow-sm">
                                        <TouchableOpacity onPress={() => onUpdateQuantity(item.id, -1)}>
                                            <Minus size={20} color={item.quantity === 1 ? "#ef4444" : "#0b0c0c"} />
                                        </TouchableOpacity>
                                        <Text className="font-bold text-lg w-6 text-center">{item.quantity}</Text>
                                        <TouchableOpacity onPress={() => onUpdateQuantity(item.id, 1)}>
                                            <Plus size={20} color="#0b0c0c" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {/* Footer */}
                    <View className="p-5 border-t border-gray-100 bg-white pb-10">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-500 font-medium">Total Amount</Text>
                            <Text className="font-heading font-bold text-2xl text-onyx">{total.toLocaleString()} RWF</Text>
                        </View>

                        <TouchableOpacity
                            onPress={onCheckout}
                            disabled={cartItems.length === 0}
                            className={`py-4 rounded-xl items-center shadow-md ${cartItems.length === 0 ? 'bg-gray-200' : 'bg-gold active:bg-yellow-400'}`}
                        >
                            <Text className={`font-bold uppercase tracking-wider ${cartItems.length === 0 ? 'text-gray-400' : 'text-onyx'}`}>
                                Confirm Payment
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
