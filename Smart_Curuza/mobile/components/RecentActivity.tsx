import { View, Text } from 'react-native';
import { History } from 'lucide-react-native';

export default function RecentActivity() {
    return (
        <View className="mt-8">
            <View className="flex-row justify-between items-center mb-4 px-1">
                <Text className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Recent Activity</Text>
                <Text className="text-gold text-[11px] font-bold uppercase tracking-wider">Show More</Text>
            </View>

            <View className="bg-white p-4 rounded-3xl flex-row justify-between items-center shadow-sm border border-gray-50 mb-3">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-gray-100 rounded-2xl items-center justify-center">
                        <History size={20} color="#6B7280" />
                    </View>
                    <View>
                        <Text className="font-bold text-sm text-onyx">Sale #84920</Text>
                        <Text className="text-[10px] text-gray-400 font-medium">10:45 AM • 2 items • Cash</Text>
                    </View>
                </View>
                <Text className="font-bold text-sm text-green-600">+12,500 RWF</Text>
            </View>

            <View className="bg-white p-4 rounded-3xl flex-row justify-between items-center shadow-sm border border-gray-50">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-gray-100 rounded-2xl items-center justify-center">
                        <History size={20} color="#6B7280" />
                    </View>
                    <View>
                        <Text className="font-bold text-sm text-onyx">Sale #84919</Text>
                        <Text className="text-[10px] text-gray-400 font-medium">09:12 AM • 1 item • Mobile</Text>
                    </View>
                </View>
                <Text className="font-bold text-sm text-green-600">+4,200 RWF</Text>
            </View>
        </View>
    );
}
