import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LayoutDashboard, History, BarChart3, User, ShoppingCart, ScanLine } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TabLayout() {
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#fbe134', // Gold
                tabBarInactiveTintColor: '#9CA3AF', // Gray-400
                tabBarShowLabel: true,
                tabBarLabelStyle: styles.tabLabel,
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => (
                        <LayoutDashboard size={24} color={color} />
                    ),
                    tabBarLabel: 'Dashboard',
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ color }) => (
                        <History size={24} color={color} />
                    ),
                    tabBarLabel: 'History',
                }}
            />
            <Tabs.Screen
                name="sales_placeholder"
                options={{
                    tabBarButton: (props) => (
                        <View style={styles.quickSaleContainer}>
                            <TouchableOpacity
                                style={styles.quickSaleButton}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                                    router.push('/sales');
                                }}
                                activeOpacity={0.9}
                            >
                                <ScanLine size={28} color="#FFFFFF" strokeWidth={2.5} />
                            </TouchableOpacity>
                            <Text style={styles.quickSaleLabel}>Quick Sale</Text>
                        </View>
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        navigation.navigate('sales/index');
                    },
                })}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    tabBarIcon: ({ color }) => (
                        <BarChart3 size={24} color={color} />
                    ),
                    tabBarLabel: 'Reports',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => (
                        <User size={24} color={color} />
                    ),
                    tabBarLabel: 'Profile',
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2a2e34', // Jet (Dark Theme)
        borderTopWidth: 0,
        height: 90,
        paddingTop: 10,
        paddingBottom: 30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    tabLabel: {
        fontSize: 10,
        fontFamily: 'Montserrat_600SemiBold',
        marginBottom: 8,
    },
    quickSaleContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        top: -24, // Float above
        paddingHorizontal: 4,
    },
    quickSaleButton: {
        width: 64,
        height: 64,
        backgroundColor: '#10B981', // High-Conversion Bright Green
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 6,
        borderColor: '#e9eaec', // Platinum 
    },
    quickSaleLabel: {
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        color: '#10B981', // Match Green
        marginTop: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
