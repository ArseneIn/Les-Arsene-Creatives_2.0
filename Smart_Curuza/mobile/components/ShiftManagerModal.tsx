import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../lib/auth/AuthContext';
import { ApiClient } from '../lib/api_client';
import { useTheme } from '../lib/theme/ThemeContext';
import { Banknote, DoorOpen } from 'lucide-react-native';

interface ShiftManagerModalProps {
    visible: boolean;
    onShiftOpened: () => void;
}

export default function ShiftManagerModal({ visible, onShiftOpened }: ShiftManagerModalProps) {
    const { colors, isDarkMode } = useTheme();
    const { user, logout } = useAuth();
    const [startingCash, setStartingCash] = useState('');
    const [loading, setLoading] = useState(false);

    const isCashier = user?.role === 'CASHIER';

    const handleOpenShift = async () => {
        const amount = Number(startingCash.replace(/[^0-9]/g, ''));
        if (isNaN(amount) || amount < 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid starting cash amount.');
            return;
        }

        setLoading(true);
        try {
            await ApiClient.openShift(amount);
            onShiftOpened();
        } catch (error: any) {
            console.error('Failed to open shift:', error);
            Alert.alert('Error', error?.message || 'Could not open shift.');
        } finally {
            setLoading(false);
        }
    };

    if (!isCashier) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.content, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.iconContainer}>
                        <DoorOpen size={48} color={colors.brandGold} />
                    </View>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Open Your Shift</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Welcome back, {user?.name || 'Cashier'}. Please enter the amount of physical cash currently in your drawer to start selling.
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Starting Cash (RWF)</Text>
                        <View style={[styles.inputGroup, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                            <Banknote size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="e.g., 15000"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="number-pad"
                                value={startingCash}
                                onChangeText={setStartingCash}
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: colors.brandGold }]}
                        onPress={handleOpenShift}
                        disabled={loading || startingCash.trim() === ''}
                    >
                        {loading ? (
                            <ActivityIndicator color="#0b0c0c" />
                        ) : (
                            <Text style={styles.buttonText}>Open Shift</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.logoutButton}
                        onPress={logout}
                        disabled={loading}
                    >
                        <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        width: '100%',
        padding: 32,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(251, 225, 52, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 32,
    },
    inputLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    input: {
        flex: 1,
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#0b0c0c',
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
    },
    logoutButton: {
        padding: 12,
    },
    logoutText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
    }
});
