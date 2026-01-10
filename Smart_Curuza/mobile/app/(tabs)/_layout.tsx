import { Tabs } from 'expo-router';
import { Home, History, BarChart3, User, ShoppingCart } from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#f3f4f6',
                    height: 90,
                    paddingTop: 10,
                    paddingBottom: 30,
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                },
                tabBarActiveTintColor: '#fbe134',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center">
                            <Home size={24} color={color} />
                            <Text className={`text-[10px] font-bold mt-1 ${focused ? 'text-gold' : 'text-gray-400'}`}>Home</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center">
                            <History size={24} color={color} />
                            <Text className={`text-[10px] font-bold mt-1 ${focused ? 'text-gold' : 'text-gray-400'}`}>History</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="sales_placeholder" // This is a dummy screen to show the button
                options={{
                    tabBarButton: (props) => (
                        <View className="items-center justify-end -mt-16 px-4">
                            <TouchableOpacity
                                className="bg-gold w-16 h-16 rounded-full items-center justify-center shadow-lg border-4 border-platinum active:scale-95"
                                onPress={() => {
                                    // Navigate to sales screen
                                    // We need to use router here, but props doesn't give it directly.
                                    // The onPress is overridden by the Link if we use it, or we can use a custom button.
                                    // For now, let's just make it a link or handle press.
                                    // Actually, better to use a listener or a real screen that redirects.
                                    // But for the visual "Quick Sale" button in the middle:
                                }}
                            >
                                <ShoppingCart size={28} color="#0b0c0c" strokeWidth={3} />
                            </TouchableOpacity>
                            <Text className="text-[10px] font-black text-onyx mt-2 uppercase tracking-tighter">Quick Sale</Text>
                        </View>
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('sales/index');
                    },
                })}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center">
                            <BarChart3 size={24} color={color} />
                            <Text className={`text-[10px] font-bold mt-1 ${focused ? 'text-gold' : 'text-gray-400'}`}>Reports</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center">
                            <User size={24} color={color} />
                            <Text className={`text-[10px] font-bold mt-1 ${focused ? 'text-gold' : 'text-gray-400'}`}>Profile</Text>
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
