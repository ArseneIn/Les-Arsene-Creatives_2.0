import { View, Text } from 'react-native';

export default function DashboardHeader() {
    return (
        <View className="px-6 pt-4 pb-6 bg-white rounded-b-[3rem] shadow-sm z-10">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 bg-gold rounded-2xl items-center justify-center shadow-lg shadow-gold/30">
                        <Text className="font-heading text-onyx font-bold text-lg">SC</Text>
                    </View>
                    <View>
                        <Text className="text-[11px] font-heading font-semibold text-gray-400 uppercase tracking-tight">Good Morning,</Text>
                        <Text className="text-xl font-heading font-bold tracking-tight text-onyx">Smart Shop</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <View className="w-2 h-2 bg-green-500 rounded-full shadow-sm" />
                    <Text className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Online</Text>
                </View>
            </View>
        </View>
    );
}
