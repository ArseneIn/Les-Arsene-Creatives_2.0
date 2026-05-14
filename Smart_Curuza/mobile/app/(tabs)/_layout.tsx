import React, { useState, useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LayoutDashboard, ReceiptText, BarChart3, User, LogOut, ScanLine } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../lib/theme/ThemeContext';
import { useAuth } from '../../lib/auth/AuthContext';
import CloseShiftModal from '../../components/CloseShiftModal';
import { ApiClient } from '../../lib/api_client';

const CustomTabButton = ({ label, icon: Icon, onPress, accessibilityState, colors, isDarkMode }: any) => {
    const focused = accessibilityState?.selected;
    const activeColor = isDarkMode ? colors.brandGold : '#FFFFFF';
    const inactiveColor = isDarkMode ? 'rgba(255, 255, 255, 0.4)' : '#111827'; // Darker inactive for better visibility
    
    return (
        <TouchableOpacity 
            onPress={onPress} 
            activeOpacity={0.7}
            style={styles.tabItem}
        >
            <View style={[
                styles.pillContainer,
                focused && { 
                    backgroundColor: isDarkMode ? 'rgba(251, 225, 52, 0.25)' : 'rgba(0, 0, 0, 0.3)', // Much more visible in light mode
                }
            ]}>
                <Icon 
                    size={22} 
                    color={focused ? activeColor : inactiveColor} 
                    fill={focused ? activeColor : inactiveColor} // Always filled
                    strokeWidth={0.5} // Minimize outline
                />
                <Text 
                    numberOfLines={1}
                    style={[
                        styles.tabLabel, 
                        { color: focused ? activeColor : inactiveColor }
                    ]}
                >
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default function TabLayout() {
    const router = useRouter();
    const { isDarkMode, colors } = useTheme();
    const { user, logout, isLoading } = useAuth();
    const [showCloseShift, setShowCloseShift] = useState(false);
    const [currentShiftId, setCurrentShiftId] = useState<string | null>(null);
    
    const isCashier = user?.role === 'CASHIER';

    useEffect(() => {
        if (isCashier && !isLoading) {
            ApiClient.getCurrentShift().then(shift => {
                if (shift) setCurrentShiftId(shift.id);
            }).catch(() => {});
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

    return (
        <>
            <Tabs
                screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: [styles.tabBar, { backgroundColor: isDarkMode ? colors.card : colors.brandGold, borderTopColor: colors.border }],
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarButton: (props) => <CustomTabButton {...props} label="Home" icon={LayoutDashboard} colors={colors} isDarkMode={isDarkMode} />
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarButton: (props) => <CustomTabButton {...props} label="History" icon={ReceiptText} colors={colors} isDarkMode={isDarkMode} />
                }}
            />
            <Tabs.Screen
                name="sales_placeholder"
                options={{
                    tabBarButton: () => (
                        <View style={styles.quickSaleContainer}>
                            <TouchableOpacity
                                style={[styles.quickSaleButton, { 
                                    backgroundColor: isDarkMode ? colors.brandGreen : '#111827', 
                                    shadowColor: isDarkMode ? colors.brandGreen : '#000',
                                    borderColor: isDarkMode ? colors.background : colors.brandGold
                                }]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                                    router.push('/sales' as any);
                                }}
                                activeOpacity={0.9}
                            >
                                <ScanLine size={28} color={isDarkMode ? "#FFFFFF" : colors.brandGold} strokeWidth={3} />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    tabBarButton: (props) => {
                        if (isCashier) return null;
                        return <CustomTabButton {...props} label="Reports" icon={BarChart3} colors={colors} isDarkMode={isDarkMode} />;
                    }
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarButton: (props) => <CustomTabButton {...props} label="Profile" icon={User} colors={colors} isDarkMode={isDarkMode} />
                }}
            />
            <Tabs.Screen
                name="signout"
                options={{
                    tabBarButton: (props) => {
                        if (!isCashier) return null;
                        const { onPress, ...rest } = props;
                        const sanitizedProps = Object.fromEntries(
                            Object.entries(rest).filter(([_, v]) => v !== null)
                        );
                        return (
                            <CustomTabButton 
                                {...sanitizedProps} 
                                label="Exit" 
                                icon={LogOut} 
                                colors={colors} 
                                isDarkMode={isDarkMode} 
                                onPress={handleSignOutPress}
                            />
                        );
                    }
                }}
            />
            <Tabs.Screen
                name="team"
                options={{
                    href: null,
                }}
            />
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
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 110,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderTopWidth: 0,
        paddingBottom: 40,
        paddingTop: 12,
        elevation: 25,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        borderWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 16,
    },
    tabLabel: {
        fontSize: 9, // Slightly smaller to prevent wrap
        fontFamily: 'Montserrat_700Bold',
        marginTop: 4,
    },
    quickSaleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickSaleButton: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
    },
});
