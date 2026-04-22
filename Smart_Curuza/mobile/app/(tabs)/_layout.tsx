import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LayoutDashboard, History, BarChart3, User, ShoppingCart, ScanLine } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme/ThemeContext';

export default function TabLayout() {
    const router = useRouter();
    const { isDarkMode, colors } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: isDarkMode ? colors.brandGold : '#111827', // Gold in dark, Black in light (for Gold BG)
                tabBarInactiveTintColor: isDarkMode ? colors.textSecondary : 'rgba(0, 0, 0, 0.4)', 
                tabBarShowLabel: true,
                tabBarLabelStyle: styles.tabLabel,
                tabBarStyle: [styles.tabBar, { backgroundColor: isDarkMode ? colors.card : colors.brandGold, borderTopColor: colors.border, shadowColor: isDarkMode ? '#000' : '#E5E7EB' }],
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
                    tabBarButton: () => (
                        <View style={styles.quickSaleContainer}>
                            <TouchableOpacity
                                style={[styles.quickSaleButton, { 
                                    backgroundColor: isDarkMode ? colors.brandGreen : '#111827', // Use dark button on Gold background
                                    shadowColor: isDarkMode ? colors.brandGreen : '#000',
                                    borderColor: isDarkMode ? colors.background : colors.brandGold // Halo matches surroundings
                                }]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                                    router.push('/sales' as any);
                                }}
                                activeOpacity={0.9}
                            >
                                <ScanLine size={28} color={isDarkMode ? "#FFFFFF" : colors.brandGold} strokeWidth={2.5} />
                            </TouchableOpacity>
                            <Text style={[styles.quickSaleLabel, { color: isDarkMode ? colors.brandGreen : '#111827' }]}>Quick Sale</Text>
                        </View>
                    ),
                }}
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
        borderTopWidth: 0,
        height: 90,
        paddingTop: 10,
        paddingBottom: 30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        elevation: 20,
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
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 6,
    },
    quickSaleLabel: {
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        marginTop: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
