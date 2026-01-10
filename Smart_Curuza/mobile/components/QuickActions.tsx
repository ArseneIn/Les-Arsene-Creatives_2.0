import { View, Text, TouchableOpacity } from 'react-native';
import { ShoppingCart, Plus, Users, RefreshCw } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';

export default function QuickActions() {
    const router = useRouter();

    return (
        <View>
            <Text className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.15em] mb-4 ml-1">Merchant Operations</Text>
            <View className="flex-row flex-wrap justify-between gap-y-4">
                <TouchableOpacity
                    className="w-[48%] bg-white p-5 rounded-[2.5rem] items-center gap-3 shadow-sm border border-gray-100 active:bg-gray-50"
                    onPress={() => router.push('/sales')}
                >
                    <View className="w-14 h-14 bg-amber-50 rounded-2xl items-center justify-center">
                        <ShoppingCart size={28} color="#F59E0B" />
                    </View>
                    <View className="items-center">
                        <Text className="font-bold text-sm text-onyx">New Sale</Text>
                        <Text className="text-[10px] text-gray-400 font-medium">Create checkout</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className="w-[48%] bg-white p-5 rounded-[2.5rem] items-center gap-3 shadow-sm border border-gray-100 active:bg-gray-50">
                    <View className="w-14 h-14 bg-blue-50 rounded-2xl items-center justify-center">
                        <Plus size={28} color="#3B82F6" />
                    </View>
                    <View className="items-center">
                        <Text className="font-bold text-sm text-onyx">Add Product</Text>
                        <Text className="text-[10px] text-gray-400 font-medium">Update inventory</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className="w-[48%] bg-white p-5 rounded-[2.5rem] items-center gap-3 shadow-sm border border-gray-100 active:bg-gray-50">
                    <View className="w-14 h-14 bg-purple-50 rounded-2xl items-center justify-center">
                        <Users size={28} color="#A855F7" />
                    </View>
                    <View className="items-center">
                        <Text className="font-bold text-sm text-onyx">Customers</Text>
                        <Text className="text-[10px] text-gray-400 font-medium">Manage loyalty</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className="w-[48%] bg-white p-5 rounded-[2.5rem] items-center gap-3 shadow-sm border border-gray-100 active:bg-gray-50">
                    <View className="w-14 h-14 bg-emerald-50 rounded-2xl items-center justify-center">
                        <RefreshCw size={28} color="#10B981" />
                    </View>
                    <View className="items-center">
                        <Text className="font-bold text-sm text-onyx">Sync Data</Text>
                        <Text className="text-[10px] text-gray-400 font-medium">Cloud backup</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
