import { View, Text, TouchableOpacity } from 'react-native';
import { Product } from '../lib/types';
import { Plus } from 'lucide-react-native';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <View className="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-100 flex-row justify-between items-center">
            <View className="flex-1">
                <Text className="font-heading font-bold text-onyx text-lg">{product.name}</Text>
                <Text className="text-gray-500 text-sm mb-1">{product.category || 'General'}</Text>
                <Text className="font-bold text-gold text-base">{product.price.toLocaleString()} RWF</Text>
            </View>

            <TouchableOpacity
                onPress={() => onAddToCart(product)}
                className="bg-platinum p-3 rounded-full active:bg-gray-200"
            >
                <Plus size={24} color="#0b0c0c" />
            </TouchableOpacity>
        </View>
    );
}
