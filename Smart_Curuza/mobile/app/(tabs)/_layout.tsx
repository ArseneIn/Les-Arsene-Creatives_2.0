import React, { useState, useEffect, useRef } from 'react';
import { Tabs, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, FileText, BarChart, Users, LogOut, ShoppingCart } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../lib/theme/ThemeContext';
import { useAuth } from '../../lib/auth/AuthContext';
import CloseShiftModal from '../../components/CloseShiftModal';
import { ApiClient } from '../../lib/api_client';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CurvedBackground = ({ color, height }: { color: string; height: number }) => {
    const notchWidth = 80;
    const radius = 40;

    // Path for a smooth semi-circle with "soft shoulders" at the transition points
    const d = `
        M 0 0
        H ${(SCREEN_WIDTH - notchWidth) / 2 - 10}
        C ${(SCREEN_WIDTH - notchWidth) / 2 - 2} 0 ${(SCREEN_WIDTH - notchWidth) / 2} 2 ${(SCREEN_WIDTH - notchWidth) / 2} 10
        A ${radius - 10} ${radius - 10} 0 0 0 ${(SCREEN_WIDTH + notchWidth) / 2} 10
        C ${(SCREEN_WIDTH + notchWidth) / 2} 2 ${(SCREEN_WIDTH + notchWidth) / 2 + 2} 0 ${(SCREEN_WIDTH + notchWidth) / 2 + 10} 0
        H ${SCREEN_WIDTH}
        V ${height}
        H 0
        Z
    `;

    return (
        <View style={[StyleSheet.absoluteFill, { height, backgroundColor: 'transparent' }]}>
            <Svg width={SCREEN_WIDTH} height={height}>
                <Path d={d} fill={color} />
            </Svg>
        </View>
    );
};

export default function TabLayout() {
    const router = useRouter();
    const { isDarkMode, colors } = useTheme();
    const { user, logout, isLoading } = useAuth();
    const insets = useSafeAreaInsets();
    const [showCloseShift, setShowCloseShift] = useState(false);
    const [currentShiftId, setCurrentShiftId] = useState<string | null>(null);

    const isCashier = user?.role === 'CASHIER';

    // Attraction Animation for Quick Sale Button
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.08,
                    duration: 1500,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [pulseAnim]);

    useEffect(() => {
        if (isCashier && !isLoading) {
            ApiClient.getCurrentShift().then(shift => {
                if (shift) setCurrentShiftId(shift.id);
            }).catch(() => { });
        }
    }, [isCashier, isLoading]);

    if (isLoading) return null;

    const handleSignOutPress = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        if (isCashier && currentShiftId) {
            Alert.alert(
                'Close Shift & Sign Out',
                'You have an active shift. You must close it before signing out.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Close Shift',
                        style: 'destructive',
                        onPress: () => setShowCloseShift(true)
                    }
                ]
            );
        } else {
            Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Sign Out', style: 'destructive', onPress: logout }
                ]
            );
        }
    };

    const activeColor = isDarkMode ? colors.brandGold : '#0B0C0C';
    // Inactive icons now use the same prominent color as active ones
    const inactiveColor = activeColor;
    const barHeight = 65 + insets.bottom;

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: activeColor,
                    tabBarInactiveTintColor: inactiveColor,
                    tabBarLabelStyle: {
                        fontFamily: 'Montserrat_700Bold',
                        fontSize: 10,
                        marginBottom: 4,
                    },
                    tabBarStyle: {
                        backgroundColor: 'transparent',
                        borderTopWidth: 0,
                        height: barHeight,
                        paddingBottom: insets.bottom,
                        paddingTop: 8,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        elevation: 0,
                    },
                    tabBarBackground: () => (
                        <CurvedBackground
                            color={isDarkMode ? colors.card : colors.brandGold}
                            height={barHeight}
                        />
                    )
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarLabel: ({ focused }) => focused ? null : <Text style={[styles.tabLabel, { color: inactiveColor }]}>Home</Text>,
                        tabBarIcon: ({ color, focused }) => (
                            <View style={styles.tabIconContainer}>
                                <Home
                                    size={24}
                                    color={color}
                                    strokeWidth={focused ? 2.5 : 2}
                                    style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}
                                />
                                {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: 'History',
                        tabBarLabel: ({ focused }) => focused ? null : <Text style={[styles.tabLabel, { color: inactiveColor }]}>History</Text>,
                        tabBarIcon: ({ color, focused }) => (
                            <View style={styles.tabIconContainer}>
                                <FileText
                                    size={24}
                                    color={color}
                                    strokeWidth={focused ? 2.5 : 2}
                                    style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}
                                />
                                {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="sales_placeholder"
                    options={{
                        title: '',
                        tabBarLabel: () => null,
                        tabBarButton: () => (
                            <TouchableOpacity
                                style={styles.quickSaleButton}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                                    router.push('/sales' as any);
                                }}
                                activeOpacity={0.8}
                            >
                                <Animated.View style={[styles.quickSaleInner, {
                                    backgroundColor: isDarkMode ? '#1A1D21' : '#000000ff',
                                    marginTop: -52,
                                    transform: [{ scale: pulseAnim }]
                                }]}>
                                    <ShoppingCart size={24} color="#fbe134" />
                                </Animated.View>
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="reports"
                    options={{
                        title: 'Reports',
                        href: isCashier ? null : undefined,
                        tabBarLabel: ({ focused }) => focused ? null : <Text style={[styles.tabLabel, { color: inactiveColor }]}>Reports</Text>,
                        tabBarIcon: ({ color, focused }) => (
                            <View style={styles.tabIconContainer}>
                                <BarChart
                                    size={24}
                                    color={color}
                                    strokeWidth={focused ? 2.5 : 2}
                                    style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}
                                />
                                {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarLabel: ({ focused }) => focused ? null : <Text style={[styles.tabLabel, { color: inactiveColor }]}>Profile</Text>,
                        tabBarIcon: ({ color, focused }) => (
                            <View style={styles.tabIconContainer}>
                                <Users
                                    size={24}
                                    color={color}
                                    strokeWidth={focused ? 2.5 : 2}
                                    style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}
                                />
                                {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="signout"
                    options={{
                        title: 'Exit',
                        href: !isCashier ? null : undefined,
                        tabBarLabel: ({ focused }) => focused ? null : <Text style={[styles.tabLabel, { color: inactiveColor }]}>Exit</Text>,
                        tabBarIcon: ({ color, focused }) => (
                            <View style={styles.tabIconContainer}>
                                <LogOut
                                    size={24}
                                    color={color}
                                    strokeWidth={focused ? 2.5 : 2}
                                    style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}
                                />
                                {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
                            </View>
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            handleSignOutPress();
                        }
                    }}
                />
                <Tabs.Screen name="team" options={{ href: null }} />
            </Tabs>

            {currentShiftId && (
                <CloseShiftModal
                    visible={showCloseShift}
                    shiftId={currentShiftId}
                    fromLogout={true}
                    onClose={() => setShowCloseShift(false)}
                    onSuccess={() => {
                        setShowCloseShift(false);
                        setCurrentShiftId(null);
                        logout();
                    }}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    quickSaleButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickSaleInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 12,
        borderWidth: 4,
        borderColor: '#fbe134',
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 4,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 6,
        position: 'absolute',
        bottom: -10,
    },
    tabLabel: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 10,
        marginTop: 4,
    },
});
