import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Easing, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Globe, Search, Bell, AlertTriangle, ChevronRight, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiClient } from '../lib/api_client';
import { useTheme } from '../lib/theme/ThemeContext';
import { useAuth } from '../lib/auth/AuthContext';
import { useSync } from '../lib/sync/SyncContext';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'crm', label: 'CRM' },
];

interface DashboardHeaderProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function DashboardHeader({ activeTab, onTabChange }: DashboardHeaderProps) {
    const insets = useSafeAreaInsets();
    const { colors, isDarkMode } = useTheme();
    const { user } = useAuth();
    const { isOffline, isSyncing, queueLength } = useSync();
    const [shopInfo, setShopInfo] = useState({ name: '...', logo: null, initials: '..' });
    const [alerts, setAlerts] = useState<any[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    
    const isCashier = user?.role === 'CASHIER';
    const filteredNavItems = NAV_ITEMS.filter(item => {
        if (isCashier && (item.id === 'expenses' || item.id === 'crm')) return false;
        return true;
    });
    
    // Animation value for the Bell ringing effect
    const bellAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await ApiClient.getMerchantProfile();
                const name = profile.business_name || profile.shopName || profile.name || 'My Shop';
                
                const initials = name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                setShopInfo({
                    name: name,
                    logo: profile.logo || profile.image || null,
                    initials: initials
                });
            } catch (error) {
                console.error('Failed to fetch shop info:', error);
                setShopInfo({ name: 'Smart Shop', logo: null, initials: 'SC' });
            }
        };

        const fetchAlerts = async () => {
            try {
                // 1. Fetch real notifications from database (Sales, Refunds, etc.)
                const dbNotifications = await ApiClient.getNotifications(true);
                const mappedDbAlerts = dbNotifications.map((n: any) => ({
                    id: n.id,
                    title: n.title,
                    description: n.message,
                    color: n.type === 'success' ? '#22C55E' : n.type === 'warning' ? '#F59E0B' : '#3B82F6',
                    type: n.type
                }));

                // 2. Fetch products for real-time low stock (local generation for immediate feedback)
                const products = await ApiClient.getProducts();
                const lowStockAlerts = products
                    .filter(p => p.stock < 10)
                    .map(p => ({
                        id: `stock-${p.id}`,
                        title: 'Low Stock Alert',
                        description: `${p.name} has only ${p.stock} units left. Restock soon.`,
                        color: '#EF4444', // Red
                        type: 'warning'
                    }));
                
                // Combine them
                const allAlerts = [...mappedDbAlerts, ...lowStockAlerts];
                setAlerts(allAlerts);
                
                // If there are alerts, trigger the continuous dancing animation
                if (allAlerts.length > 0) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    startRingingAnimation();
                }
            } catch (error) {
                console.error('Failed to fetch alerts:', error);
            }
        };

        fetchProfile();
        fetchAlerts();
    }, []);

    const startRingingAnimation = () => {
        // Reset to 0
        bellAnimation.setValue(0);
        
        Animated.loop(
            Animated.sequence([
                Animated.timing(bellAnimation, {
                    toValue: 1, // swing right
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(bellAnimation, {
                    toValue: -1, // swing left
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(bellAnimation, {
                    toValue: 0, // center
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                // Add a pause before shaking again
                Animated.timing(bellAnimation, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();
    };

    // Interpolate the bellAnimation value (-1 to 1) into degrees mapped for rotation
    const spin = bellAnimation.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-15deg', '15deg']
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16, backgroundColor: isDarkMode ? colors.card : colors.brandGold }]}>
            {/* Top Row: Brand & Utilities */}
            <View style={styles.topRow}>
                {/* Left: Avatar & Info */}
                <View style={styles.brandSection}>
                    <View style={[styles.avatar, { backgroundColor: isDarkMode ? colors.brandGold : '#FFFFFF' }]}>
                        {shopInfo.logo ? (
                            <Image source={{ uri: shopInfo.logo }} style={styles.logoImage} />
                        ) : (
                            <Text style={styles.avatarText}>{shopInfo.initials}</Text>
                        )}
                        <View style={[
                            styles.onlineBadge, 
                            { 
                                borderColor: isDarkMode ? colors.card : colors.brandGold,
                                backgroundColor: isOffline ? '#EF4444' : '#22C55E'
                            }
                        ]} />
                    </View>
                    <View style={styles.infoSection}>
                        <View style={styles.statusRow}>
                            <Text style={[styles.greeting, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }]}>
                                {isOffline ? 'Offline Mode' : 'Online'}
                            </Text>
                            {isSyncing && (
                                <View style={styles.syncIndicator}>
                                    <View style={styles.syncDot} />
                                    <Text style={styles.syncText}>Syncing {queueLength}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.shopName, { color: isDarkMode ? colors.textPrimary : '#111827' }]} numberOfLines={1}>{shopInfo.name}</Text>
                    </View>
                </View>

                {/* Right: Web Utilities */}
                <View style={styles.utilityRow}>
                    {/* Animated Bell Wrapper */}
                    <TouchableOpacity 
                        style={[styles.utilityButton, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }]} 
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setIsDropdownVisible(true);
                        }}
                    >
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <Bell size={22} color={isDarkMode ? '#FFFFFF' : '#111827'} />
                        </Animated.View>
                        {alerts.length > 0 && <View style={[styles.notifDot, { borderColor: isDarkMode ? colors.card : colors.brandGold }]} />}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Row: Horizontal Web-Style Nav */}
            <View style={styles.navContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.navScroll}
                >
                    {filteredNavItems.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            onPress={() => onTabChange(item.id)}
                            style={styles.navItem}
                        >
                            <Text style={[
                                styles.navText,
                                { color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' },
                                activeTab === item.id && [styles.navTextActive, { color: isDarkMode ? colors.brandGold : '#111827' }]
                            ]}>
                                {item.label}
                            </Text>
                            {activeTab === item.id && <View style={[styles.activeIndicator, { backgroundColor: isDarkMode ? colors.brandGold : '#111827' }]} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Transparent Overlay Modal for Notifications Dropdown */}
            <Modal
                visible={isDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDropdownVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalBackdrop} 
                    activeOpacity={1} 
                    onPress={() => setIsDropdownVisible(false)}
                >
                    <View style={[styles.dropdownContainer, { marginTop: insets.top + 70, backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={[styles.dropdownHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.dropdownTitle, { color: colors.textPrimary }]}>System Alerts</Text>
                            <TouchableOpacity onPress={() => setIsDropdownVisible(false)}>
                                <X size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        
                        {alerts.length > 0 ? (
                            <ScrollView style={styles.alertList} showsVerticalScrollIndicator={false}>
                                {alerts.map(alert => (
                                    <View key={alert.id} style={[styles.alertCard, { backgroundColor: colors.overlay }]}>
                                        <View style={styles.alertIconBox}>
                                            <AlertTriangle size={20} color={alert.color} />
                                        </View>
                                        <View style={styles.alertContent}>
                                            <Text style={[styles.alertTitle, { color: colors.textPrimary }]}>{alert.title}</Text>
                                            <Text style={[styles.alertDesc, { color: colors.textSecondary }]}>{alert.description}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>All clear! No system warnings.</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // paddingTop handled dynamically
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
        zIndex: 50,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    brandSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, 
        marginRight: 10,
    },
    avatar: {
        width: 48,
        height: 48,
        backgroundColor: '#fbe134', // gold
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    logoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 14,
    },
    avatarText: {
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
        fontSize: 18,
    },
    onlineBadge: {
        position: 'absolute',
        top: -1,
        right: -1,
        width: 10,
        height: 10,
        backgroundColor: '#22C55E',
        borderRadius: 5,
        borderWidth: 2,
        zIndex: 10,
    },
    infoSection: {
        justifyContent: 'center',
        flex: 1,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    syncIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 225, 52, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
        gap: 4,
    },
    syncDot: {
        width: 4,
        height: 4,
        backgroundColor: '#fbe134',
        borderRadius: 2,
    },
    syncText: {
        fontSize: 8,
        fontFamily: 'Montserrat_700Bold',
        color: '#fbe134',
        textTransform: 'uppercase',
    },
    greeting: {
        fontSize: 11,
        fontFamily: 'Montserrat_500Medium',
        color: 'rgba(255, 255, 255, 0.5)',
    },
    shopName: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    utilityRow: {
        flexDirection: 'row',
        gap: 10,
    },
    utilityButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notifDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        backgroundColor: '#EF4444',
        borderRadius: 4,
        borderWidth: 1.5,
    },
    navContainer: {
        paddingBottom: 12,
    },
    navScroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 32, // Slightly more gap for better touch targets when centered
    },
    navItem: {
        alignItems: 'center',
        paddingBottom: 4,
    },
    navText: {
        fontSize: 13,
        fontFamily: 'Montserrat_700Bold',
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: 0.5,
    },
    navTextActive: {
        color: '#fbe134', // Brand Gold
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -6,
        width: 20,
        height: 3,
        backgroundColor: '#fbe134',
        borderRadius: 2,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end', // Align dropdown to the right
    },
    dropdownContainer: {
        width: '85%',
        maxHeight: '60%',
        backgroundColor: '#2a2e34', // Executive Jet
        // marginTop handled dynamically
        marginRight: 24,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 16,
        marginBottom: 16,
    },
    dropdownTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    alertList: {
        gap: 12,
    },
    alertCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)', // Red tint for urgency
    },
    alertIconBox: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    alertContent: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    alertDesc: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        lineHeight: 18,
    },
    emptyState: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    }
});
