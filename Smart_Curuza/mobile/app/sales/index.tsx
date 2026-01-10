import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Filter, ShoppingCart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function Sales() {
    const router = useRouter();

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
                <ScrollView className="flex-1 p-4">
                    <Text className="text-center text-gray-400 mt-10">Product Grid Coming Soon</Text>
                </ScrollView>
            </View>

            {/* Bottom Cart Bar */}
            <View className="bg-white p-4 shadow-2xl border-t border-gray-100">
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-400 font-medium">Total (0 items)</Text>
                    <Text className="font-heading font-bold text-xl text-onyx">0 RWF</Text>
                </View>
                <TouchableOpacity className="bg-gold py-4 rounded-xl items-center shadow-md active:bg-yellow-400">
                    <Text className="font-bold text-onyx uppercase tracking-wider">Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
