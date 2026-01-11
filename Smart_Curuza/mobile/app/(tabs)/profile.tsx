import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../lib/auth/AuthContext';
import { Bell, ChevronRight, User, Shield, CircleHelp, LogOut, Settings, Moon, Store, Users, FileText } from 'lucide-react-native';
import ShopSettingsModal from '../../components/ShopSettingsModal';

export default function Profile() {
    const { logout, user } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [showShopSettings, setShowShopSettings] = useState(false);

    const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
    const toggleDarkMode = () => setDarkMode(previousState => !previousState);

    const MenuSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    const MenuItem = ({ icon: Icon, label, value, onPress, isSwitch = false, switchValue, onSwitchChange }: any) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={isSwitch ? undefined : onPress}
            activeOpacity={isSwitch ? 1 : 0.7}
        >
            <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                    <Icon size={20} color="#4B5563" />
                </View>
                <Text style={styles.menuItemLabel}>{label}</Text>
            </View>
            {isSwitch ? (
                <Switch
                    trackColor={{ false: "#E5E7EB", true: "#fbe134" }}
                    thumbColor={switchValue ? "#FFFFFF" : "#F9FAFB"}
                    ios_backgroundColor="#E5E7EB"
                    onValueChange={onSwitchChange}
                    value={switchValue}
                />
            ) : (
                <View style={styles.menuItemRight}>
                    {value && <Text style={styles.menuItemValue}>{value}</Text>}
                    <ChevronRight size={20} color="#9CA3AF" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <Text style={styles.name}>{user?.name || 'User'}</Text>
                    <Text style={styles.role}>{user?.role || 'Merchant'}</Text>
                    <TouchableOpacity style={styles.editProfileButton}>
                        <Text style={styles.editProfileText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <MenuSection title="Business">
                        <MenuItem
                            icon={Store}
                            label="Shop Settings"
                            onPress={() => setShowShopSettings(true)}
                        />
                        <MenuItem
                            icon={Users}
                            label="Team Management"
                            onPress={() => Alert.alert('Coming Soon', 'Team management will be available in the next update.')}
                        />
                        <MenuItem
                            icon={FileText}
                            label="EBM Configuration"
                            onPress={() => Alert.alert('Coming Soon', 'EBM configuration will be available in the next update.')}
                        />
                    </MenuSection>

                    <MenuSection title="Preferences">
                        <MenuItem
                            icon={Bell}
                            label="Push Notifications"
                            isSwitch
                            switchValue={notificationsEnabled}
                            onSwitchChange={toggleNotifications}
                        />
                        <MenuItem
                            icon={Moon}
                            label="Dark Mode"
                            isSwitch
                            switchValue={darkMode}
                            onSwitchChange={toggleDarkMode}
                        />
                    </MenuSection>

                    <MenuSection title="Account">
                        <MenuItem
                            icon={User}
                            label="Personal Information"
                            onPress={() => { }}
                        />
                        <MenuItem
                            icon={Shield}
                            label="Security"
                            onPress={() => { }}
                        />
                        <MenuItem
                            icon={Settings}
                            label="App Settings"
                            onPress={() => { }}
                        />
                    </MenuSection>

                    <MenuSection title="Support">
                        <MenuItem
                            icon={CircleHelp}
                            label="Help & Support"
                            onPress={() => { }}
                        />
                    </MenuSection>

                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <LogOut size={20} color="#DC2626" />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>Version 1.0.0 (Build 100)</Text>
                </View>
            </ScrollView>

            <ShopSettingsModal
                visible={showShopSettings}
                onClose={() => setShowShopSettings(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // platinum/gray-100
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 32,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fbe134', // gold
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    avatarText: {
        fontSize: 32,
        fontFamily: 'Poppins_700Bold',
        color: '#0B0C0C', // onyx
    },
    name: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#6B7280',
        marginBottom: 16,
    },
    editProfileButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    editProfileText: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#374151',
    },
    content: {
        padding: 24,
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    sectionContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemLabel: {
        fontSize: 15,
        fontFamily: 'Montserrat_500Medium',
        color: '#1F2937',
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuItemValue: {
        fontSize: 14,
        color: '#6B7280',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FEF2F2', // red-50
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutText: {
        color: '#DC2626',
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 8,
        fontFamily: 'Montserrat_500Medium',
    },
});
