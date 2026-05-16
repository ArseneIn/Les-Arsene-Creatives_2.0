import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../lib/auth/AuthContext';
import { useRouter } from 'expo-router';
import { Bell, ChevronRight, User, Shield, CircleHelp, LogOut, Settings, Moon, Store, Users, FileText } from 'lucide-react-native';
import ShopSettingsModal from '../../components/ShopSettingsModal';
import PersonalInfoModal from '../../components/PersonalInfoModal';
import SecurityModal from '../../components/SecurityModal';
import CloseShiftModal from '../../components/CloseShiftModal';
import EbmConfigModal from '../../components/EbmConfigModal';
import ScreenWrapper from '../../components/ScreenWrapper';
import { ApiClient } from '../../lib/api_client';

import { useTheme } from '../../lib/theme/ThemeContext';

export default function Profile() {
    const { logout, user } = useAuth();
    const router = useRouter();
    const { colors, isDarkMode, toggleDarkMode } = useTheme();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showShopSettings, setShowShopSettings] = useState(false);
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showCloseShift, setShowCloseShift] = useState(false);
    const [isLogoutTriggered, setIsLogoutTriggered] = useState(false);
    const [showEbmConfig, setShowEbmConfig] = useState(false);
    const [currentShiftId, setCurrentShiftId] = useState<string | null>(null);

    const isCashier = user?.role === 'CASHIER';

    React.useEffect(() => {
        if (isCashier) {
            ApiClient.getCurrentShift().then(shift => {
                if (shift) setCurrentShiftId(shift.id);
            }).catch(() => {});
        }
    }, [isCashier]);

    const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);

    const MenuSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#000': '#E5E7EB' }]}>
                {children}
            </View>
        </View>
    );

    const MenuItem = ({ icon: Icon, label, value, onPress, isSwitch = false, switchValue, onSwitchChange }: any) => (
        <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={isSwitch ? undefined : onPress}
            activeOpacity={isSwitch ? 1 : 0.7}
        >
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.overlay }]}>
                    <Icon size={20} color={colors.textSecondary} />
                </View>
                <Text style={[styles.menuItemLabel, { color: colors.textPrimary }]}>{label}</Text>
            </View>
            {isSwitch ? (
                <Switch
                    trackColor={{ false: colors.overlay, true: "#fbe134" }}
                    thumbColor={switchValue ? (isDarkMode ? "#0b0c0c" : "#FFFFFF") : colors.textSecondary}
                    ios_backgroundColor={colors.overlay}
                    onValueChange={onSwitchChange}
                    value={switchValue}
                />
            ) : (
                <View style={styles.menuItemRight}>
                    {value && <Text style={[styles.menuItemValue, { color: colors.textSecondary }]}>{value}</Text>}
                    <ChevronRight size={20} color={colors.textSecondary} />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper style={{ backgroundColor: colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                    <View style={[styles.avatar, { shadowColor: isDarkMode ? '#000' : '#fbe134' }]}>
                        <Text style={styles.avatarText}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <Text style={[styles.name, { color: colors.textPrimary }]}>{user?.name || 'User'}</Text>
                    <Text style={[styles.role, { color: colors.textSecondary }]}>{user?.role || 'Merchant'}</Text>
                    <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                        <Text style={[styles.editProfileText, { color: colors.textSecondary }]}>Edit Profile</Text>
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
                            onPress={() => router.push('/team')}
                        />
                        <MenuItem
                            icon={FileText}
                            label="EBM Configuration"
                            onPress={() => setShowEbmConfig(true)}
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
                            switchValue={isDarkMode}
                            onSwitchChange={toggleDarkMode}
                        />
                    </MenuSection>

                    <MenuSection title="Account">
                        <MenuItem
                            icon={User}
                            label="Personal Information"
                            onPress={() => setShowPersonalInfo(true)}
                        />
                        <MenuItem
                            icon={Shield}
                            label="Security"
                            onPress={() => setShowSecurityModal(true)}
                        />
                        <MenuItem
                            icon={Settings}
                            label="App Settings"
                            onPress={() => Alert.alert('App Settings', 'General application settings will be available soon.')}
                        />
                    </MenuSection>

                    <MenuSection title="Support">
                        <MenuItem
                            icon={CircleHelp}
                            label="Help & Support"
                            onPress={() => Alert.alert('Support', 'Please contact support@smartcuruza.com or call +250 788 123 456 for assistance.')}
                        />
                    </MenuSection>

                    {isCashier && currentShiftId && (
                        <MenuSection title="Shift Management">
                            <MenuItem
                                icon={LogOut}
                                label="Close Current Shift"
                                onPress={() => {
                                    setIsLogoutTriggered(false);
                                    setShowCloseShift(true);
                                }}
                            />
                        </MenuSection>
                    )}

                    <TouchableOpacity 
                        style={[styles.logoutButton, { backgroundColor: isDarkMode ? 'rgba(220,38,38,0.1)' : '#FEF2F2', borderColor: isDarkMode ? 'rgba(220,38,38,0.3)' : '#FECACA' }]} 
                        onPress={() => {
                            if (isCashier && currentShiftId) {
                                setIsLogoutTriggered(true);
                                setShowCloseShift(true);
                            } else {
                                logout();
                            }
                        }}
                    >
                        <LogOut size={20} color={colors.danger} />
                        <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
                    </TouchableOpacity>

                    <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0 (Build 100)</Text>
                </View>
            </ScrollView>

            <ShopSettingsModal
                visible={showShopSettings}
                onClose={() => setShowShopSettings(false)}
            />
            
            <PersonalInfoModal
                visible={showPersonalInfo}
                onClose={() => setShowPersonalInfo(false)}
            />

            <SecurityModal
                visible={showSecurityModal}
                onClose={() => setShowSecurityModal(false)}
            />
            
            {currentShiftId && (
                <CloseShiftModal
                    visible={showCloseShift}
                    shiftId={currentShiftId}
                    fromLogout={isLogoutTriggered}
                    onClose={() => setShowCloseShift(false)}
                    onSuccess={() => {
                        setShowCloseShift(false);
                        setCurrentShiftId(null);
                        logout(); // Force logout after shift close
                    }}
                />
            )}

            <EbmConfigModal
                visible={showEbmConfig}
                onClose={() => setShowEbmConfig(false)}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 32,
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fbe134', // gold
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
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
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        marginBottom: 16,
    },
    editProfileButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    editProfileText: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
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
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    sectionContent: {
        borderRadius: 16,
        overflow: 'hidden',
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemLabel: {
        fontSize: 15,
        fontFamily: 'Montserrat_500Medium',
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuItemValue: {
        fontSize: 14,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 8,
        fontFamily: 'Montserrat_500Medium',
    },
});
