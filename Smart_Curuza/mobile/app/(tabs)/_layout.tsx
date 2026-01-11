import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, History, BarChart3, User, ShoppingCart, ScanLine } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TabLayout() {
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#fbe134', // Gold
                tabBarInactiveTintColor: '#9CA3AF', // Gray-400
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.tabItem}>
                            <Home size={24} color={color} />
                            <Text style={[styles.tabLabel, { color: focused ? '#fbe134' : '#9CA3AF' }]}>Home</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.tabItem}>
                            <History size={24} color={color} />
                            <Text style={[styles.tabLabel, { color: focused ? '#fbe134' : '#9CA3AF' }]}>History</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="sales_placeholder"
                options={{
                    tabBarButton: (props) => (
                        <View style={styles.quickSaleContainer}>
                            <TouchableOpacity
                                style={styles.quickSaleButton}
                                onPress={() => router.push('/sales')}
                                activeOpacity={0.9}
                            >
                                <ScanLine size={28} color="#0b0c0c" strokeWidth={2.5} />
                            </TouchableOpacity>
                            <Text style={styles.quickSaleLabel}>Quick Sale</Text>
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
                        <View style={styles.tabItem}>
                            <BarChart3 size={24} color={color} />
                            <Text style={[styles.tabLabel, { color: focused ? '#fbe134' : '#9CA3AF' }]}>Reports</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.tabItem}>
                            <User size={24} color={color} />
                            <Text style={[styles.tabLabel, { color: focused ? '#fbe134' : '#9CA3AF' }]}>Profile</Text>
                        </View>
                    ),
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
        backgroundColor: '#fbe134', // Gold
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 6,
        borderColor: '#e9eaec', // Platinum (Matches Screen Background for cutout effect)
    },
    quickSaleLabel: {
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        color: '#fbe134', // Gold text to pop against dark bg (or could be white)
        marginTop: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
