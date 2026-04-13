import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Easing, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Globe, Search, Bell, AlertTriangle, ChevronRight, X } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';

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
    const [shopInfo, setShopInfo] = useState({ name: '...', logo: null, initials: '..' });
    const [alerts, setAlerts] = useState<any[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    
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
                const products = await ApiClient.getProducts();
                // Filter items with low stock to generate alerts
                const lowStockAlerts = products
                    .filter(p => p.stock < 10)
                    .map(p => ({
                        id: `stock-${p.id}`,
                        title: 'Low Stock Alert',
                        description: `${p.name} has only ${p.stock} units left. Restock soon.`,
                        color: '#EF4444' // Red
                    }));
                
                setAlerts(lowStockAlerts);
                
                // If there are alerts, trigger the continuous dancing animation
                if (lowStockAlerts.length > 0) {
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
        <View style={styles.container}>
            {/* Top Row: Brand & Utilities */}
            <View style={styles.topRow}>
                {/* Left: Avatar & Info */}
                <View style={styles.brandSection}>
                    <View style={styles.avatar}>
                        {shopInfo.logo ? (
                            <Image source={{ uri: shopInfo.logo }} style={styles.logoImage} />
                        ) : (
                            <Text style={styles.avatarText}>{shopInfo.initials}</Text>
                        )}
                        <View style={styles.onlineBadge} />
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.shopName} numberOfLines={1}>{shopInfo.name}</Text>
                    </View>
                </View>

                {/* Right: Web Utilities */}
                <View style={styles.utilityRow}>
                    <TouchableOpacity style={styles.utilityButton}>
                        <Globe size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.utilityButton}>
                        <Search size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    {/* Animated Bell Wrapper */}
                    <TouchableOpacity 
                        style={styles.utilityButton} 
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setIsDropdownVisible(true);
                        }}
                    >
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <Bell size={22} color="#FFFFFF" />
                        </Animated.View>
                        {alerts.length > 0 && <View style={styles.notifDot} />}
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
                    {NAV_ITEMS.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            onPress={() => onTabChange(item.id)}
                            style={styles.navItem}
                        >
                            <Text style={[
                                styles.navText,
                                activeTab === item.id && styles.navTextActive
                            ]}>
                                {item.label}
                            </Text>
                            {activeTab === item.id && <View style={styles.activeIndicator} />}
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
                    <View style={styles.dropdownContainer}>
                        <View style={styles.dropdownHeader}>
                            <Text style={styles.dropdownTitle}>System Alerts</Text>
                            <TouchableOpacity onPress={() => setIsDropdownVisible(false)}>
                                <X size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                        
                        {alerts.length > 0 ? (
                            <ScrollView style={styles.alertList} showsVerticalScrollIndicator={false}>
                                {alerts.map(alert => (
                                    <View key={alert.id} style={styles.alertCard}>
                                        <View style={styles.alertIconBox}>
                                            <AlertTriangle size={20} color={alert.color} />
                                        </View>
                                        <View style={styles.alertContent}>
                                            <Text style={styles.alertTitle}>{alert.title}</Text>
                                            <Text style={styles.alertDesc}>{alert.description}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>All clear! No system warnings.</Text>
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
        paddingTop: 20,
        backgroundColor: '#2a2e34', // Jet (Dark Theme)
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
        borderColor: '#2a2e34',
        zIndex: 10,
    },
    infoSection: {
        justifyContent: 'center',
        flex: 1,
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
        borderColor: '#2a2e34',
    },
    navContainer: {
        paddingBottom: 12,
    },
    navScroll: {
        paddingHorizontal: 24,
        gap: 24,
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
        marginTop: 90, // Places it directly beneath the header icons
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
