import { View, Text } from 'react-native';
import { CreditCard, Package, Users } from 'lucide-react-native';

export default function DashboardStats() {
    return (
        <View>
            {/* KPI Card - Today's Sales */}
            <View className="bg-white p-6 rounded-[2rem] border-t-4 border-gold shadow-xl shadow-gray-200/50 mb-3">
                <View className="flex-row justify-between items-start">
                    <View>
                        <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Sales</Text>
                        <View className="flex-row items-baseline mt-1">
                            <Text className="text-3xl font-heading font-extrabold text-onyx">45,200</Text>
                            <Text className="text-lg font-medium text-gray-400 ml-1">RWF</Text>
                        </View>
                    </View>
                    <View className="w-12 h-12 bg-gold/10 rounded-2xl items-center justify-center">
                        <CreditCard size={24} color="#fbe134" />
                    </View>
                </View>
                <View className="flex-row items-center gap-1.5 mt-4 px-3 py-1 bg-green-50 w-self rounded-full self-start">
                    <Text className="text-xs font-bold text-green-600">12% more than yesterday</Text>
                </View>
            </View>

            {/* Secondary KPIs */}
            <View className="flex-row gap-3 mb-8">
                <View className="flex-1 bg-white p-4 rounded-[2rem] border-t-4 border-blue-500 shadow-md">
                    <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mb-2">
                        <Package size={20} color="#3B82F6" />
                    </View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Stock</Text>
                    <Text className="text-xl font-heading font-bold mt-1 text-onyx">1,248</Text>
                </View>

                <View className="flex-1 bg-white p-4 rounded-[2rem] border-t-4 border-red-500 shadow-md">
                    <View className="w-10 h-10 bg-red-50 rounded-xl items-center justify-center mb-2">
                        <Users size={20} color="#EF4444" />
                    </View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Debt</Text>
                    <Text className="text-xl font-heading font-bold mt-1 text-red-500">50,900</Text>
                    <Text className="text-[10px] text-red-400 mt-1">3 Pending</Text>
                </View>
            </View>
        </View>
    );
}
